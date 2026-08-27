import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import urljoin
import json


class Courses_scraper:

    def __init__(self):
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Edge(options=options)
        self.wait = WebDriverWait(self.driver, 20)
        self.visited = set()

    def scrape(self, url):

        if url in self.visited:
            return None


        self.visited.add(url)
        # file_data = []
        sections = []


        self.driver.get(url)
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # ---------- ADD ABOUT US PARAGRAPHS (ADD ONLY) ----------
        if "about-us" in url.lower():

            about_section = {
                "section_title": "ABOUT SUNBEAM",
                "content": []
            }

            about_paragraphs = self.driver.find_elements(
                By.XPATH,
                "//div[@id='about_us_page']//div[contains(@class,'main_info')]//p"
            )

            for p in about_paragraphs:
                text = p.text.strip()
                if len(text) > 30:
                    about_section["content"].append(text)

            if about_section["content"]:
                sections.append(about_section)


        # ---------- CONTACT US : ADDRESS / PHONE / EMAIL ----------
        if "contact-us" in url.lower():

            contact_section = {
                "section_title": "CONTACT DETAILS",
                "content": []
            }

            seen = set()

            centre_blocks = self.driver.find_elements(
                By.XPATH,
                "//div[contains(@class,'contact_page_info')]//div[contains(@class,'wow')]"
            )

            for block in centre_blocks:
                texts = block.find_elements(By.XPATH, ".//p | .//a")

                for el in texts:
                    text = el.text.strip()
                    if not text or text in seen:
                        continue

                    seen.add(text)

                    clean = text.replace(" ", "").replace("+", "").replace("-", "")

                    # PHONE
                    if clean.isdigit() and len(clean) >= 8:
                        contact_section["content"].append(f"Phone: {text}")

                    # EMAIL
                    elif "@" in text:
                        contact_section["content"].append(f"Email: {text}")

                    # ADDRESS
                    else:
                        contact_section["content"].append(f"Address: {text}")


            if contact_section["content"]:
                    sections.append(contact_section)




        if "modular-courses-home" in url:
            hrefs = [
                a.get_attribute("href")
                for a in self.driver.find_elements(
                    By.XPATH,
                    "//div[contains(@class,'c_cat_box')]//a[contains(@class,'c_cat_more_btn')]"
                )
                if a.get_attribute("href")
                and "modular-courses.php?mdid=" not in a.get_attribute("href")
            ]

            nested_data = []

            for href in hrefs:
                result = self.scrape(urljoin(url, href))

                if not result:
                    continue

                if isinstance(result, list):
                    nested_data.extend(result)
                else:
                    nested_data.append(result)

            return nested_data


        title = self.driver.title.strip()

        # Try h1
        try:
            h1 = self.driver.find_element(By.TAG_NAME, "h1").text.strip()
        except:
            h1 = ""

        # Try h4 (modular course pages)
        try:
            h4 = self.driver.find_element(
                By.XPATH, "//div[contains(@class,'course-title')]//h4"
            ).text.strip()
        except:
            h4 = ""

        # Decide best title
        if not title or title.upper() in ("COURSES", "SUNBEAM", "TRAINING"):
            if h1:
                title = h1
            elif h4:
                title = h4
            else:
                title = "(No title found)"

        page_title = title


        # --- STATIC SECTION INIT (MUST COME FIRST)
        static_section = {
            "section_title": "OVERVIEW",
            "content": []
        }

        # --- COURSE PAGE MAIN HEADER (priority-based)
        page_header = ""

        try:
            page_header = self.driver.find_element(
                By.XPATH, "//h3[contains(@class,'inner_page_head')]"
            ).text.strip()
        except:
            pass

        if not page_header:
            try:
                page_header = self.driver.find_element(By.TAG_NAME, "h1").text.strip()
            except:
                pass

        if not page_header:
            try:
                page_header = self.driver.find_element(
                    By.XPATH, "//div[contains(@class,'course-title')]//h4"
                ).text.strip()
            except:
                pass

        # NOW this is safe
        if page_header:
            static_section["content"].append(page_header)



        static_blocks = self.driver.find_elements(
            By.XPATH,
            """
            //div[contains(@class,'course_info')]//h3
            | //div[contains(@class,'course_info')]//p
            """
        )

        for el in static_blocks:
            text = el.text.strip()
            if text:
                static_section["content"].append(text)

        if static_section["content"]:
            sections.append(static_section)



        # --- FIND ALL ACCORDION BUTTONS
        accordion_buttons = self.driver.find_elements(
            By.XPATH, '//a[@data-toggle="collapse" or @data-bs-toggle="collapse"]'
        )


        for btn in accordion_buttons:
            title = btn.text.strip()
            href = btn.get_attribute("href")

            if not href or "#" not in href:
                continue

            target = href.split("#", 1)[-1]

            if not title or not target:
                continue

            # Section title
            # file_data.append(f"{title.upper()}\n")
            current_section = {
                "section_title": title.upper(),
                "content": []
            }


            # Force open accordion (Bootstrap-safe)
            self.driver.execute_script(f"""
                var el = document.getElementById("{target}");
                el.classList.add("in");
                el.style.display = "block";
            """)

            time.sleep(0.5)

            collapse_div = self.driver.find_element(By.ID, target)

            # --- TABLE 
            tables = collapse_div.find_elements(By.TAG_NAME, "table")
            if tables:
                rows = collapse_div.find_elements(By.XPATH, ".//tbody//tr")
                for row in rows:
                    cols = [td.text.strip() for td in row.find_elements(By.TAG_NAME, "td")]
                    if cols:
                        # file_data.append(" | ".join(cols) + "\n")
                        current_section["content"].append(" | ".join(cols))


            # --- LIST ITEMS 
            lis = collapse_div.find_elements(By.TAG_NAME, "li")
            if lis:
                for li in lis:
                    text = li.text.strip()
                    if text:
                        # file_data.append(f"- {text}\n")
                        current_section["content"].append(text)


            # --- PARAGRAPHS 
            ps = collapse_div.find_elements(By.TAG_NAME, "p")
            if ps:
                for p in ps:
                    text = p.text.strip()
                    if text:
                        # file_data.append(text + "\n")
                        current_section["content"].append(text)


            # file_data.append("\n")
            if current_section["content"]:
                sections.append(current_section)

        # --- WRITE FILE 
        return {
            "url": url,
            "title": page_title,
            "sections": sections
        }


    # DYNAMICALLY GET FIRST 3 COURSE LINKS
    def scrape_from_about_page(self, about_url):
        all_data = []

        self.driver.get(about_url)
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # ---- STEP 1: STATIC NAV LINKS (About, Contact, Internship) ----
        static_links = []

        nav_links = self.driver.find_elements(
            By.XPATH,
            """
            //ul[contains(@class,'nav')]//a[@href]
            """
        )

        for a in nav_links:
            href = a.get_attribute("href")
            if not href:
                continue

            href_lower = href.lower()

            if any(key in href_lower for key in [
                "about-us",
                "contact-us"
            ]):
                static_links.append(urljoin(about_url, href))

        # remove duplicates
        static_links = list(dict.fromkeys(static_links))


        buttons = self.driver.find_elements(
            By.XPATH,
            """
            //a[contains(@class,'course_view_more_btn')]
            |
            //div[contains(@class,'c_cat_box')]//a[contains(@class,'c_cat_more_btn')]
            """
        )


        course_links = []
        course_links.extend(static_links)

        for btn in buttons:
            href = btn.get_attribute("href")

            if not href:
                continue

            # if "internship" in href.lower():   # skip only internship 
            #     continue

            if href:
                course_links.append(urljoin(about_url, href))
            
        course_links = list(dict.fromkeys(course_links))


        print(f"[INFO] Found {len(course_links)} total links (static + courses)")

        for link in course_links:
            print(f"[SCRAPING] {link}")
            data = self.scrape(link)

            if not data:
                continue

            if isinstance(data, list):
                all_data.extend(data)
            elif isinstance(data, dict):
                all_data.append(data)


        with open("output.json", "w", encoding="utf-8") as f:
            json.dump(all_data, f, indent=2, ensure_ascii=False)


        self.driver.quit()
        print("----- Successfully scraped first 3 courses dynamically -----")
        return all_data  


# # RUN 
# if __name__=="__main__":
#     scraper = Courses_scraper()
#     pages_data = scraper.scrape_from_about_page("https://www.sunbeaminfo.in/")
#     # print(pages_data)

#     for i, page in enumerate(pages_data, 1):
#         print(f"\n{'='*80}")
#         print(f"PAGE {i}")
#         print("URL:", page["url"])
#         print("TITLE:", page["title"])
#         print("SECTIONS:", len(page["sections"]))

#         for section in page["sections"]:
#             print("\nSECTION:", section["section_title"])
#             for item in section["content"]:
#                 print(" -", item)


 