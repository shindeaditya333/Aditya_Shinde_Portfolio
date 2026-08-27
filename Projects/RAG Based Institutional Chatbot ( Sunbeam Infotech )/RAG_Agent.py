from langchain.tools import tool
import llms_agents_embedmodels as models
import Chromadb_operations as chroma_db
import Sunbeam_ChatBot as Sunbeam_ChatBot
@tool
# Shortlist based on description
def Answer_User_Question(user_input: str, top_k: int = 5) -> str:
    """
    Required arguments:
        - user_input: string (the user's question)
        - top_k: integer (number of relevant pages to retrieve)

    Answers user questions using Retrieval-Augmented Generation (RAG)
    over embedded Sunbeam pages.

    Full pages are retrieved from the vector database using
    semantic similarity. The language model is provided with the
    complete page content but is strictly instructed to return
    ONLY the information relevant to the user question.

    The tool:
    - Retrieves top-k most relevant pages
    - Provides full page content to the LLM for reasoning
    - Enforces precise, minimal, and grounded answers
    - Ignores unrelated sections (fees, schedules, etc.) unless asked

    Output Rules:
    - Answer ONLY what the user asks
    - Use ONLY retrieved content
    - Do NOT summarize the full page
    - Do NOT include irrelevant details
    - If information is missing, explicitly state so
    """

    collection=chroma_db.create_or_access_collection()

    if user_input:
        # page_list=collection.get()

        # if not page_list["ids"]:
        #     return "No pages available..!"
        # else:
            embed_model=models.get_embed_model()
            llm=models.get_llm(Sunbeam_ChatBot.mode)

            user_input_embedding=embed_model.embed_query(user_input)

            search_res=collection.query(
                query_embeddings=[user_input_embedding],
                n_results=top_k
            )
            
            # st.write("Shortlisted resumes :")
            # ids = search_res["ids"][0]
            # shortlist_ids="Shortlisted Pages:\n" + "\n".join(
            #     f"{i+1}. {rid}" for i, rid in enumerate(ids)
            # )
            metadatas = search_res["metadatas"][0]

            shortlist_titles = "Shortlisted Pages:\n" + "\n".join(
                f"{i+1}. {meta['title']}"
                for i, meta in enumerate(metadatas)
            )

            # llm_prompt = f"""
            # You are an expert advisor.

            # You are given FULL page content retrieved from a database.
            # The content may include extra information such as schedules, fees,
            # eligibility, and other sections.

            # Your task:
            # - Answer ONLY what the user has asked.
            # - Use ONLY the provided page content.
            # - Ignore unrelated sections completely.
            # - Do NOT summarize the full page.
            # - Do NOT mention irrelevant details.
            # - Be concise, precise, and factual.

            # Rules:
            # - If the answer is found in one section, use only that section.
            # - If the answer is not found in one page, check the remaining pages
            #   before concluding it is unavailable.
            # - Do not add assumptions or external knowledge.
            # - Do not reference sections unless required.

            # PAGE CONTENT:
            # {search_res["documents"]}

            # USER QUESTION:
            # {user_input}

            # FINAL ANSWER:
            # """

            llm_prompt = f"""
            You are an expert advisor.

            You are given FULL page content retrieved from a database.
            The retrieved pages may include BOTH course pages and internship pages.

            Your task:
            - Answer ONLY what the user has asked.
            - Search ACROSS ALL provided pages before answering.
            - Use ONLY the provided page content.
            - Ignore unrelated sections completely.
            - Do NOT summarize full pages.
            - Do NOT mention irrelevant details.

            Rules:
            - Do NOT stop at the first page.
            - If the answer is found in ANY page, extract it.
            - Only if the answer is NOT found in ALL pages, say:
            "Information not available in the provided content."
            - Do not add assumptions or external knowledge.

            PAGE CONTENT:
            {search_res["documents"]}

            USER QUESTION:
            {user_input}

            FINAL ANSWER:
            """



            llm_res=llm.invoke(llm_prompt)

            return f"{shortlist_titles}\n\n{llm_res.content}"
        
