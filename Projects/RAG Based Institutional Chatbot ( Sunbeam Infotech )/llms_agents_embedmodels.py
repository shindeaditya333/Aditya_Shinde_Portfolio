from langchain.embeddings import init_embeddings
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
import os
from dotenv import load_dotenv

load_dotenv()

def get_embed_model():
    embed_model=init_embeddings(
        model="text-embedding-all-minilm-l6-v2-embedding",
        provider="openai",
        base_url="http://127.0.0.1:1234/v1",
        api_key="dummy",
        check_embedding_ctx_length=False
    )
    return embed_model

def get_llm(mode):
    if mode=="offline":
        llm=init_chat_model(
        model="openai/gpt-oss-20b",
        model_provider="openai",
        base_url="http://127.0.0.1:1234/v1",
        api_key="dummy"
        )
        return llm
    elif mode=="online":
        llm=init_chat_model(
        model="gemini-2.0-flash",
        model_provider="google_genai",
        api_key=os.getenv("Gemini_API_Key_2")
        )
        return llm
    
# def get_agent():
#     llm=get_llm()

#     agent=create_agent(
#     model=llm,
#     tools=[Answer_User_Question],
#     system_prompt="You are a tool calling agent, " \
#     "you dont have to think and do anything just have to call accurate tool" \
#     "strictly You dont have to answer directly just call the tool"
#     )

#     return agent

