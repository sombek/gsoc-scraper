import csv
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from tqdm.asyncio import tqdm

# GSoC Organizations URL
url = "https://summerofcode.withgoogle.com/programs/2025/organizations"


async def fetch_all_orgs():
    """Scrape all organizations from the GSoC 2025 page asynchronously."""
    organizations = set()  # Using a set to prevent duplicates

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("networkidle")  # Ensure full page load

        while True:
            # Parse the page with BeautifulSoup
            soup = BeautifulSoup(await page.content(), "html.parser")

            # Extract organization links
            org_links = soup.find_all("a", class_="content")
            for link in org_links:
                name = link.find("div", class_="name").text.strip()
                href = link["href"]
                full_url = f"https://summerofcode.withgoogle.com{href}"
                logo = link.find("img")["src"]
                short_desc = link.find("div", class_="short-description").text.strip()
                organizations.add((name, full_url, logo, short_desc))

            # Find and handle pagination
            next_buttons = await page.locator("button[aria-label='Next page']").all()

            if not next_buttons:
                break  # No next button found → end of pages

            for index, btn in enumerate(next_buttons):
                if index == 0:  # Skip first button as it's already clicked
                    continue
                if not await btn.is_disabled():
                    try:
                        await btn.scroll_into_view_if_needed()  # Make button visible
                        await btn.wait_for(state="visible", timeout=5000)
                        await btn.click()
                        await page.wait_for_load_state("networkidle")
                        break  # Stop checking once we find a working button
                    except Exception as e:
                        print(f"Skipping button due to error: {e}")

            else:
                break  # If no valid button is found, stop loop

        await browser.close()

    # Sort organizations by name (A-Z)
    return sorted(organizations, key=lambda org: org[0].lower())


async def enrich_org(name, url, logo, short_desc, browser):
    """Scrape technologies, topics, and View Ideas link for a single organization."""
    page = await browser.new_page()
    await page.goto(url, timeout=60000)
    # Ensure full JS content loads
    await page.wait_for_load_state("networkidle")

    soup = BeautifulSoup(await page.content(), "html.parser")

    # Extract Technologies
    technologies_section = soup.find("div", class_="tag tech")
    technologies = []
    if technologies_section:
        tech_content = technologies_section.find("div", class_="tech__content")
        if tech_content:
            technologies = [tech.strip() for tech in tech_content.text.split(",")]

    # Extract Topics
    topics_section = soup.find("div", class_="tag topics")
    topics = []
    if topics_section:
        topics_content = topics_section.find("div", class_="topics__content")
        if topics_content:
            topics = [topic.strip() for topic in topics_content.text.split(",")]

    # Extract "View ideas list" link
    ideas_button = soup.find("a", attrs={"color": "primary"})
    ideas_link = ideas_button["href"] if ideas_button else "Not Found"

    await page.close()

    return (name, url, technologies, topics, ideas_link, logo, short_desc)


async def scrape_gsoc_data():
    """Main function to scrape all organizations and enrich their data asynchronously."""
    orgs = await fetch_all_orgs()

    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Use tqdm for progress tracking
        enriched_orgs = []
        tasks = []
        for org in orgs:
            tasks.append(enrich_org(org[0], org[1], org[2], org[3], browser))

        # Gather all results asynchronously
        batch_size = 5  # Limit the number of concurrent tasks using tqdm
        for i in tqdm(
            range(0, len(tasks), batch_size),
            desc="Scraping Organizations",
            unit=f"orgs ({batch_size} at a time)",
        ):
            batch = tasks[i : i + batch_size]
            results = await asyncio.gather(*batch)
            enriched_orgs.extend(results)

        await browser.close()

    # Save results to CSV norammly without async
    with open("gsoc_2025_organizations.csv", "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(
            [
                "Organization",
                "URL",
                "Technologies",
                "Topics",
                "Ideas Link",
                "Logo",
                "Short Description",
            ]
        )
        writer.writerows(enriched_orgs)

    print("\n✅ Data scraping complete! Results saved to gsoc_2025_organizations.csv")


# Run the async scraper
asyncio.run(scrape_gsoc_data())
