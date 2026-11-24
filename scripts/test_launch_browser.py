"""Run the synthetic-case browser smoke tests against a built frontend."""

import argparse
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright


ORIGIN = "http://legal-luminaire.test"
CASE_URL = f"{ORIGIN}/case/case-01"
PENDING_CITATION = "State of Gujarat v. Mohanbhai (2003) 4 GLR 3121"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser-path", type=Path, help="Use an installed Chromium browser")
    args = parser.parse_args()
    site = Path(__file__).resolve().parents[1] / "artifacts/legal-luminaire/dist/public"
    if not (site / "index.html").is_file():
        parser.error("Build the frontend before running the browser smoke tests.")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=str(args.browser_path) if args.browser_path else None
        )
        page = browser.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.add_init_script("window.printCalls = 0; window.print = () => window.printCalls++;")

        def serve_build(route) -> None:
            request = urlsplit(route.request.url)
            if request.netloc != "legal-luminaire.test":
                route.abort()
                return

            asset = (site / request.path.lstrip("/")).resolve()
            if asset.is_relative_to(site) and asset.is_file():
                route.fulfill(path=asset)
            elif route.request.is_navigation_request():
                route.fulfill(path=site / "index.html")
            else:
                route.fulfill(status=404)

        page.route("**/*", serve_build)
        page.goto(f"{ORIGIN}/demo-browser", wait_until="commit")
        expect(page.get_by_test_id("load-demo-TC-01")).to_be_visible()
        page.get_by_test_id("load-demo-TC-01").click()
        expect(page).to_have_url(f"{CASE_URL}/dashboard")

        page.goto(f"{CASE_URL}/verification", wait_until="commit")
        expect(page.get_by_role("heading", name="Citation Accuracy & Verification Panel")).to_be_visible()
        page.goto(f"{CASE_URL}/deadlines", wait_until="commit")
        expect(page.get_by_role("heading", name="Deadline Board")).to_be_visible()

        page.goto(f"{CASE_URL}/safe-draft", wait_until="commit")
        draft_body = page.get_by_placeholder("Draft the letter body here.", exact=False)
        print_button = page.get_by_role("button", name="Print A4")
        mark_final = page.get_by_role("button", name="Mark Final")
        draft_body.fill(f"Synthetic draft citing {PENDING_CITATION}.")
        expect(print_button).to_be_disabled(timeout=500)
        expect(mark_final).to_be_disabled(timeout=500)
        page.emulate_media(media="print")
        expect(draft_body).to_be_hidden()
        expect(page.get_by_text("Printing blocked by the Citation Gate.")).to_be_visible()
        expect(page.get_by_role("article")).to_have_count(0)

        page.emulate_media(media="screen")
        cleared_draft = "Synthetic draft with the unverified citation removed."
        draft_body.fill(cleared_draft)
        expect(print_button).to_be_enabled(timeout=500)
        expect(mark_final).to_be_enabled(timeout=500)
        page.emulate_media(media="print")
        expect(page.get_by_role("article").get_by_text(cleared_draft)).to_be_visible()
        page.emulate_media(media="screen")
        print_button.click()
        assert page.evaluate("window.printCalls") == 1

        for status, body, expected in (
            (404, "Unavailable", "Pleading variants are unavailable"),
            (200, "[]", "Pleading variants are unavailable"),
            (200, '[{"id":"sample","label":{"en":"Sample","hi":"नमूना"}}]', "Select subject"),
        ):
            def respond_subjects(route, _request, *, response_status=status, response_body=body) -> None:
                route.fulfill(status=response_status, body=response_body, content_type="application/json")

            page.route("**/variants/subjects", respond_subjects)
            page.goto(f"{CASE_URL}/draft-variants", wait_until="commit")
            expect(page.get_by_text(expected, exact=False)).to_be_visible()
            page.unroute("**/variants/subjects", respond_subjects)

        assert not errors, errors
        browser.close()
    print("Offline TC-01, Safe Draft print controls, and Draft Variants smoke tests passed.")


if __name__ == "__main__":
    main()
