# app/core/llm_chain.py
import os

from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from backend.app.core.vectorstore import create_vectorstore

def create_qa_chain():
    retriever = create_vectorstore().as_retriever()

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        # api_key="...",  # if you prefer to pass api key in directly instaed of using env vars
        # base_url="...",
        # organization="...",
        # other params...
    )

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",  # retrieved documents stuff 방식
    )
    return qa
