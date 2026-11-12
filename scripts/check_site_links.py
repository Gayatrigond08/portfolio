import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import Request, urlopen


SITE_URL = "https://gayatrigond08.github.io/portfolio/"


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
        self.anchors = []

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if "id" in attributes:
            self.ids.add(attributes["id"])
        for attribute in ("href", "src"):
            if attribute in attributes:
                self.references.append((tag, attribute, attributes[attribute]))
        if tag == "a" and "href" in attributes:
            self.anchors.append(attributes)


def main():
    argument_parser = argparse.ArgumentParser(
        description="List and validate href/src references in a built portfolio site."
    )
    argument_parser.add_argument(
        "--site-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Directory containing the built index.html and assets.",
    )
    site_dir = argument_parser.parse_args().site_dir.resolve()
    html_file = site_dir / "index.html"
    if not html_file.is_file():
        argument_parser.error(f"index.html not found in {site_dir}")

    page = SiteParser()
    page.feed(html_file.read_text(encoding="utf-8"))
    failures = []
    external_urls = set()

    print("href/src references:")
    for tag, attribute, value in page.references:
        print(f"  {tag} {attribute}={value}")
        if value.startswith("#"):
            if value[1:] not in page.ids:
                failures.append(f"Missing anchor target: {value}")
            continue

        parsed = urlsplit(value)
        if parsed.scheme in ("http", "https") or value.startswith("//"):
            external_urls.add(urljoin(SITE_URL, value))
        elif parsed.scheme:
            continue
        else:
            local_path = (site_dir / unquote(parsed.path)).resolve()
            if not local_path.is_relative_to(site_dir):
                failures.append(f"Local reference escapes site directory: {value}")
            elif not local_path.is_file():
                failures.append(f"Missing local file: {value}")

    resumes = [anchor for anchor in page.anchors if "download" in anchor]
    if (
        len(resumes) != 1
        or resumes[0].get("href") != "Gayatri_Gond.pdf"
        or resumes[0].get("target") != "_blank"
    ):
        failures.append(
            "Expected one relative Gayatri_Gond.pdf download link that opens in a new tab."
        )
    if not (site_dir / "Gayatri_Gond.pdf").is_file():
        failures.append("Gayatri_Gond.pdf is missing.")
    if len(list(site_dir.glob("*.pdf"))) != 1:
        failures.append("The site must contain exactly one PDF resume.")

    for anchor in page.anchors:
        href = anchor["href"]
        if href.startswith(("http://", "https://", "mailto:")):
            rel = set((anchor.get("rel") or "").split())
            if (
                anchor.get("target") != "_blank"
                or not {"noopener", "noreferrer"}.issubset(rel)
                or not anchor.get("aria-label")
            ):
                failures.append(f"External anchor is missing target, rel, or aria-label: {href}")

    print("\nExternal URL checks:")
    manual_checks = []
    for url in sorted(external_urls):
        try:
            request = Request(url, headers={"User-Agent": "Mozilla/5.0 portfolio-link-check"})
            with urlopen(request, timeout=20) as response:
                status = response.status
        except HTTPError as error:
            status = error.code
        except (URLError, TimeoutError) as error:
            failures.append(f"Could not reach {url}: {error}")
            print(f"  unavailable: {url}")
            continue

        if "linkedin.com/in/gayatri-gond-165a7b264" in url and status in (403, 999):
            manual_checks.append(url)
            print(f"  {status}: {url} (cannot verify automatically; click manually)")
        else:
            print(f"  {status}: {url}")
            if status != 200:
                failures.append(f"Expected HTTP 200, got {status}: {url}")

    if manual_checks:
        print("\nManual verification required:")
        for url in manual_checks:
            print(f"  {url}")
    if failures:
        print("\nFailures:")
        for failure in failures:
            print(f"  {failure}")
        raise SystemExit(1)
    print("\nAll local references, anchors, and automatically checkable external URLs passed.")


if __name__ == "__main__":
    main()
