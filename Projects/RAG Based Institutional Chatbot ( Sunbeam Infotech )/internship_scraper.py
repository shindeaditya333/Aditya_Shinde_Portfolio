from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.action_chains import ActionChains
from scraping.base_scraper import BaseScraper

class InternshipScraper(BaseScraper):
    page_name = "Internships"

    def __init__(self):
        edge_options = Options()
        edge_options.add_argument("--headless=new")
        # # edge_options.add_argument("--disable-gpu")
        edge_options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Edge(options=edge_options)
        self.wait = WebDriverWait(self.driver, 30)
        self.driver.implicitly_wait(10)

    def scrape(self):
        self.driver.get("https://sunbeaminfo.in/internship")

        data = {
            "page_title": self.driver.title,
            "page_paragraphs": [],
            "accordion_data": [],
            "page_tables": []
        }

        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # ---------- Scroll ----------
        for _ in range(4):
            self.driver.execute_script("window.scrollBy(0, 700)")
            time.sleep(0.5)

        # ---------- Page paragraphs ----------
        paragraphs = self.driver.find_elements(By.XPATH, "//p")
        data["page_paragraphs"] = [
            p.text.strip()
            for p in paragraphs
            if len(p.text.strip()) > 30
        ]

        # ---------- Accordions ----------
        accordions = self.driver.find_elements(By.CLASS_NAME, "panel-heading")

        for acc in accordions:
            title = acc.text.strip()

            content_div = acc.find_element(
                By.XPATH,
                "following-sibling::div[contains(@class,'panel-collapse')]"
            )

            # FORCE OPEN (IMPORTANT)
            self.driver.execute_script(
                "arguments[0].style.display='block';", content_div
            )

            # ---- TEXT ----
            text_blocks = []
            elements = content_div.find_elements(By.XPATH, ".//p | .//li")
            for el in elements:
                txt = el.text.strip()
                if txt:
                    text_blocks.append(txt)

            paragraphs = "\n".join(text_blocks)

            # ---- TABLES ----
            tables_data = []
            tables = content_div.find_elements(By.XPATH, ".//table")

            for table in tables:
                rows_data = []
                rows = table.find_elements(By.TAG_NAME, "tr")

                for row in rows:
                    cols = row.find_elements(By.XPATH, ".//th | .//td")
                    row_data = [c.text.strip() for c in cols if c.text.strip()]
                    if row_data:
                        rows_data.append(row_data)

                if rows_data:
                    tables_data.append(rows_data)

            data["accordion_data"].append({
                "title": title,
                "paragraphs": paragraphs,
                "tables": tables_data
            })

        # ---- Page tables ----
        tables_data = []
        tables = content_div.find_elements(By.XPATH, ".//table")

        for table in tables:
            rows_data = []
            rows = table.find_elements(By.TAG_NAME, "tr")

            for row in rows:
                cols = row.find_elements(By.XPATH, ".//th | .//td")
                row_data = [c.text.strip() for c in cols if c.text.strip()]
                if row_data:
                    rows_data.append(row_data)

            if rows_data:
                tables_data.append(rows_data)

        data["page_tables"].append(tables_data)

        return self.dict_to_text(data)
    
    def dict_to_text(self, data):
        text = ""
        text += str(data["page_title"])
        text += "\n"

        for item in data["page_paragraphs"]:
            text += str(item)
        text += "\n\n"

        for item in data["accordion_data"]:
            text += str(item)
            text += "\n"
        text += "\n"

        for item in data["page_tables"]:
            text += str(item)

        return text

    def close(self):
        self.driver.quit()
