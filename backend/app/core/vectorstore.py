# app/core/vectorstore.py
import os
from langchain_elasticsearch import ElasticsearchStore
from langchain_openai import OpenAIEmbeddings
from backend.app.core.config import ELASTICSEARCH_URL, ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD, OPENAI_API_KEY
from elasticsearch import Elasticsearch

def create_vectorstore():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    store = ElasticsearchStore(
        es_url=ELASTICSEARCH_URL,
        index_name="rag-index",
        embedding=embeddings,
        es_user=ELASTICSEARCH_USERNAME,
        es_password=ELASTICSEARCH_PASSWORD,
        vector_query_field="embedding",
    )
    return store
