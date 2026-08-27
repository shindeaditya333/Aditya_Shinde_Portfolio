import streamlit as st 
from langchain.embeddings import init_embeddings
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_community.document_loaders import PyPDFLoader 
import chromadb 
import tempfile
from datetime import datetime
import os
import runtime

@tool
# Shortlist based on description
def Shortlist_based_on_description(desc_input: str, top_k: int = 5) -> str:
    """
    Shortlists the most relevant resumes based on a given job description.

    The job description is converted into an embedding and matched against
    stored resume embeddings in the vector database. The original similarity
    ranking is preserved, with small adjustments allowed only when clearly
    justified.

    The language model explains the ranking, highlights the best resume at
    Rank 1, and keeps the explanation concise and relevant.

    Inputs:
    - desc_input : as a job description .
    - top_k : Number of resumes.

    Output:
    - Displays shortlisted resume IDs and a brief ranking explanation and highhlight best resume.
    """

    collection=create_or_access_collection()

    if desc_input:
        res_list=collection.get()

        if not res_list["ids"]:
            return "No resumes available, resume list is empty,please upload resumes first to search..!"
        else:
            desc_input_embedding=runtime.embed_model.embed_query(desc_input)

            search_res=collection.query(
                query_embeddings=[desc_input_embedding],
                n_results=top_k
            )
            
            # st.write("Shortlisted resumes :")
            ids = search_res["ids"][0]
            shortlist_ids="Shortlisted resumes:\n" + "\n".join(
                f"{i+1}. {rid}" for i, rid in enumerate(ids)
            )

            llm_prompt=f"""
            You are an expert HR with a large experience of hiring 

            resume info : {search_res["documents"]}
            job description : {desc_input}

            Task:
                1. Keep the original ranking as default.
                2. You may swap neighboring ranks ONLY if there is a strong,feasible and clear reason.                
                3. Clearly highlight the BEST resume at Rank 1 with tag: [BEST RESUME].
                4. Explain briefly why each resume is placed at its rank.
                5. Total response must be within 100 words and number of resumes must be same as original rankings resumes.

            Rules:
            - Use only the provided resume content.
            - No assumptions.
            - Focus on skills, experience, and relevance.
            - Keep explanations concise.
            - Give each ranking on new line and well formatted 
            """

            justification=runtime.llm.invoke(llm_prompt)

            return f"{shortlist_ids}\n\n{justification.content}"




# Create or get Collecton
def create_or_access_collection():
    db=chromadb.PersistentClient(path="./Resumes_chromadb")
    collection=db.get_or_create_collection("Resumes")
    return collection

# File loader
def file_loader(pdf_path):
    loader=PyPDFLoader(pdf_path)
    docs=loader.load()

    resume_content=""
    
    for page in docs:
        resume_content+=page.page_content

    metadata={
        "source" : pdf_path,
        "lenght" :len(docs)
    }
    return resume_content,metadata

# Upload files
def upload_files(file,embed_model):
    # file=st.file_uploader("Upload resume PDF here",type=["pdf"])
    
    if file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file.read())
            pdf_path=tmp.name
        
        resume_data,metadata=file_loader(pdf_path)
        
        resume_embeddings=embed_model.embed_documents([resume_data])
        embedding=resume_embeddings[0]
        
        collection=create_or_access_collection()
        collection.add(ids=[file.name],embeddings=[embedding],metadatas=[metadata],documents=[resume_data])
        st.write("Pdf Uploaded Successfully..!")
        st.write(resume_data)

#Update Files 
def update_files(file,embed_model):
    if not file:
        st.warning("Upload file first..!")
        return 
    
    collection=create_or_access_collection()
    old_file_name = file.name
    existing_id=collection.get(ids=[old_file_name])

    if not existing_id["ids"]:
        st.warning("File is not present updata it....first upload it")
        return

    with tempfile.NamedTemporaryFile(delete=False,suffix=".pdf") as tmp:
        tmp.write(file.read())
        # tmp.name=tmp.name +f"updated {datetime.now()}"
        pdf_path=tmp.name
        
        # existing_id=collection.get(ids=[file.name])

        # if not existing_id["ids"]:
        #     st.warning("File is not present updata it....first upload it")
        #     return
    
        # tmp.name+=f"updated {datetime.now()}"
        # pdf_path=tmp.name

        updated_resume_data,updated_resume_metadata=file_loader(pdf_path)

        base, ext = os.path.splitext(old_file_name)
        new_file_name = f"{base}_updated_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"



        updated_resume_embeddings=embed_model.embed_documents([updated_resume_data])
        updated_embedding=updated_resume_embeddings[0]

        collection.delete(ids=[old_file_name])


        collection.add(ids=[new_file_name],embeddings=[updated_embedding],metadatas=[updated_resume_metadata],
                    documents=[updated_resume_data])
        st.write("Pdf updated (reuploaded) Successfully..!")
        st.write(updated_resume_data)
        st.write("Old file name:", old_file_name)
        st.write("New file name:", new_file_name)


# Delete files
def delete_files():
        collection=create_or_access_collection()
        res_list=collection.get()

        if not res_list["ids"]:
            st.write("No resumes available to delete...!")

        del_res=st.selectbox(
            "Select a Resume to delete",
            res_list["ids"]
        )
        if st.button("Delete Resume"):
            collection.delete(ids=[del_res])
            st.session_state.del_list.append(del_res)
            st.write(del_res,"Deleted Successfully..!")

# List all resumes
def list_resumes():
        collection=create_or_access_collection()
        resume_list=collection.get()

        if not resume_list["ids"]:
            st.write("No resumes available, resume list is empty, please upload resumes first..!")

        for rid in resume_list["ids"]:
            st.write(rid)



