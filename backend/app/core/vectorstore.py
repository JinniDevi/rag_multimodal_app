# app/core/vectorstore.py
import os
from langchain_community.vectorstores import ElasticsearchStore
from langchain_community.embeddings import OpenAIEmbeddings
from backend.app.core.config import ELASTICSEARCH_URL, OPENAI_API_KEY
from elasticsearch import Elasticsearch

def create_vectorstore():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")

    client = Elasticsearch(ELASTICSEARCH_URL)

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    store = ElasticsearchStore(
        es_connection=client,
        index_name="rag-index",
        embedding=embeddings,
        # vector_query_field="vector",
    )
    return store
