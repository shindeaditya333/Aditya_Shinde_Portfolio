import streamlit as st 
from langchain.embeddings import init_embeddings
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
# from langchain.agents import AgentExecutor
from langchain.tools import tool
from langchain_community.document_loaders import PyPDFLoader 
# import chromadb 
# import tempfile
import Agentic_tools
import runtime

st.title("AI Driven Resume Management App")


if "operation" not in st.session_state:
    st.session_state.operation="Upload Resumes"

if "del_list" not in st.session_state:
    st.session_state.del_list=[]

with st.sidebar:
    st.header("Options")
    choices=["Upload Resumes","Update Resumes","List resumes","Delete Resumes","Shortlist based on description"]
    st.session_state.operation=st.selectbox("Select Option",choices)

embed_model=init_embeddings(
    model="text-embedding-all-minilm-l6-v2-embedding",
    provider="openai",
    base_url="http://127.0.0.1:1234/v1",
    api_key="dummy",
    check_embedding_ctx_length=False
) 

llm=init_chat_model(
    model="google/gemma-3-12b",
    model_provider="openai",
    base_url="http://127.0.0.1:1234/v1",
    api_key="dummy"
)

runtime.embed_model = embed_model
runtime.llm = llm

agent=create_agent(
    model=llm,
    tools=[Agentic_tools.Shortlist_based_on_description],
    system_prompt="You are a tool calling agent, " \
    "you dont have to think and do anything just have to call accurate tool" \
    "strictly You dont have to answer directly just call the tool"
)

# Upload Resumes
if st.session_state.operation=="Upload Resumes":
    st.header("Upload Resume")
    
    file=st.file_uploader("Upload resume PDF here",type=["pdf"])

    Agentic_tools.upload_files(file,embed_model)


# Update Resumes
if st.session_state.operation=="Update Resumes":
    st.header("Update Files")

    file=st.file_uploader("Upload updated resume PDF here",type=["pdf"])
    if file:
        Agentic_tools.update_files(file,embed_model)
    else:
        st.warning("File not uploaded, Upload file first..!")
    

# Delete Resumes
if st.session_state.operation=="Delete Resumes":
    # del_res=st.chat_input("Enter id of the resume to delete")
    st.header("Delete Resume")

    Agentic_tools.delete_files()


# List resumes
if st.session_state.operation=="List resumes":
    st.header("Uploaded Resumes")

    Agentic_tools.list_resumes()


# Shortlist based in description 
if st.session_state.operation=="Shortlist based on description":
    st.header("Search Resumes")

    desc_input=st.chat_input("Search resumes based on job description")
    top_k=st.slider("Select number of resumes to be shortlisted for a description",1,10,5,1)
    if desc_input and top_k:

        # agent_executor = AgentExecutor(
        #     agent=agent,
        #     tools=[Agentic_tools.Shortlist_based_on_description],
        #     max_iterations=1,
        #     early_stopping_method="force",
        #     verbose=True
        # )

        response = agent.invoke(
            {
        "messages": [
            {
                "role": "user",
                "content": (
                    f"Use the Shortlist_based_on_description tool.\n"
                    f"Job description:\n{desc_input}\n"
                    f"Number of resumes: {top_k}"
                )
            }
            ]},
            config={
        "max_iterations": 1
        })


        llm_output=response["messages"][-1]
        st.write(llm_output.content)