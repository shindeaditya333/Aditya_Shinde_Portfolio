import chromadb
import Scraper as CS
import llms_agents_embedmodels as models

def create_or_access_collection():
    db=chromadb.PersistentClient(path="./Sunbeam_Courses_chromadb")
    collection=db.get_or_create_collection("Courses")
    return collection

import hashlib


def create_page_chunks(pages_data: list) -> list:
    """
    Create page-level chunks (1 page = 1 chunk)
    while keeping the SAME structure as scraped data,
    and adding a unique chunk_id.

    Output chunk format:
    {
        "chunk_id": "...",
        "url": "...",
        "title": "...",
        "sections": [...]
    }
    """

    if not isinstance(pages_data, list):
        raise ValueError("pages_data must be a list")

    chunks = []

    for idx, page in enumerate(pages_data):
        if not isinstance(page, dict):
            continue

        if "url" not in page or "title" not in page or "sections" not in page:
            continue

        # ---- UNIQUE & STABLE CHUNK ID ----
        # hash(url) + index → avoids collision
        hash_input = f"{page['url']}_{idx}"
        chunk_id = hashlib.sha256(hash_input.encode()).hexdigest()

        chunks.append({
            "chunk_id": chunk_id,
            "url": page["url"],
            "title": page["title"],
            "sections": page["sections"]
        })

    return chunks


def build_embedding_text(chunk: dict) -> str:
    """
    Convert a course chunk into text for embedding
    """

    lines = []

    if "internship" in chunk["url"].lower():
        lines.append("THIS PAGE DESCRIBES SUNBEAM INTERNSHIP PROGRAMS")

    lines.append(f"TITLE: {chunk['title']}")
    lines.append(f"URL: {chunk['url']}")
    lines.append("")

    for section in chunk["sections"]:
        lines.append(section["section_title"])

        for item in section["content"]:
            lines.append(f"- {item}")

        lines.append("")

    return "\n".join(lines).strip()


def store_chunks(chunks: list):
    embed_model=models.get_embed_model()
    collection = create_or_access_collection()

    for chunk in chunks:
        # Build text
        chunk_text = build_embedding_text(chunk)

        # Generate embedding (EXPLICIT)
        embedding = embed_model.embed_documents([chunk_text])[0]

        # Store in ChromaDB
        collection.upsert(
            ids=[chunk["chunk_id"]],
            embeddings=[embedding],
            documents=[chunk_text],
            metadatas=[{
                "url": chunk["url"],
                "title": chunk["title"]
            }]
        )

def rescrape():
    # SCRAPE
    scraper = CS.Courses_scraper()
    pages_data = scraper.scrape_from_about_page("https://www.sunbeaminfo.in/")
    print("Pages:", len(pages_data))

    # CHUNK
    chunks = create_page_chunks(pages_data)
    print("Chunks:", len(chunks))

    # EMBED & STORE
    store_chunks(chunks)

    print("Course chunks embedded & stored successfully")
