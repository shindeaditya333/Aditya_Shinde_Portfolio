import streamlit as st
import os 
import llms_agents_embedmodels as models
from langchain.agents import create_agent
from langchain.embeddings import init_embeddings
from langchain.chat_models import init_chat_model
import RAG_Agent 

mode="offline"

def run_chatbot():

    st.title("Sunbeam ChatBOt")

    # ---------- SESSION STATE FOR CHAT HISTORY ----------
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    with st.sidebar:
        choices=["offline","online"]
        mode = st.selectbox("Select mode",choices)
        st.session_state.chat_mode = mode


        # MOVED TOP_K SLIDER TO SIDEBAR (same variable)
        top_k = st.slider(
            "Select number of relevant pages",
            min_value=1,
            max_value=17,
            value=5,
            step=1
        )
         # ---------- ADMIN ONLY ----------
        if st.session_state.get("is_admin"):

            st.markdown("---")
            st.markdown("### 🛠 Admin Controls")

            if st.button("Update Sunbeam Data"):
                with st.spinner("Re-scraping Sunbeam website..."):
                    from Chromadb_operations import rescrape
                    rescrape()
                    # scraper.run()   # use your actual method
                st.success("Sunbeam data updated successfully!")

    user_input=st.chat_input("Ask anything about sunbeam")
    
    # if st.session_state.chat_mode=="offline":
    #     llm=models.get_llm("offline")
    # elif st.session_state.chat_mode=="online":
    #     llm=models.get_llm("online") 

    mode = st.session_state.get("chat_mode", "offline")

    if mode == "offline":
        llm = models.get_llm(mode)
    elif mode == "online":
        llm = models.get_llm(mode)

    agent=create_agent(
        model=llm,
        tools=[RAG_Agent.Answer_User_Question],
        system_prompt="You are a tool calling agent, " \
        "you dont have to think and do anything just have to call accurate tool" \
        "strictly You dont have to answer directly just call the tool"
    )

    if user_input and top_k:

        # ---------- BUILD CONTEXT FROM PREVIOUS Q/A ----------
        previous_context = ""
        for q, a in st.session_state.chat_history:
            previous_context += f"User: {q}\nAI: {a}\n\n"

        response = agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": (
                            f"{previous_context}"
                            f"Question: {user_input}\n"
                            f"top_k: {top_k}"
                        )
                    }
                ]
            },
            config={
                "max_iterations": 1
            }
        )

        ai_answer = response["messages"][-1].content

        # ---------- STORE IN HISTORY ----------
        st.session_state.chat_history.append((user_input, ai_answer))

    # ---------- PRINT CHAT HISTORY ----------
    if st.session_state.chat_history:
        st.markdown("### 🗂 Conversation History")

        for q, a in st.session_state.chat_history:
            st.markdown(f"**You:** {q}")
            st.markdown(f"**AI:** {a}")
            st.markdown("---")
