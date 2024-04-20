from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.document_loaders import UnstructuredFileLoader
from langchain.embeddings import CacheBackedEmbeddings, OpenAIEmbeddings
from langchain.storage import LocalFileStore
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.callbacks.base import BaseCallbackHandler


def embed_text(text):
    
    """ 사용자가 text을 입력하면 cache 저장, split, embedding 후 vectorstore를 생성하여 retreiver를 만들어 반환해 주는 함수 """
    
    # text 읽고 해당 경로에 저장
    text_path = f"./.cache/files/{text.name}"
    with open(text_path, "wb") as f:
        f.write(text)
    # 캐시 저장
    cache_dir = LocalFileStore(f"./.cache/embeddings/{text.name}")  
    # 하나의 text split => 여러 text
    splitter = CharacterTextSplitter.from_tiktoken_encoder(
        separator="\n",
        chunk_size=600,
        chunk_overlap=100,
    )
    # 데이터 로더 정의
    loader = UnstructuredFileLoader(text_path)
    # 데이터 로드 & 분할
    docs = loader.load_and_split(text_splitter=splitter)
    # 임베딩 정의
    embeddings = OpenAIEmbeddings()
    # cache embedding 객체 생성 => 임베딩의 결과를 저장
    cached_embeddings = CacheBackedEmbeddings.from_bytes_store(embeddings, cache_dir)
    # 임베딩된 문서 기반으로 vector store 정의
    vectorstore = FAISS.from_documents(docs, cached_embeddings)
    # retriever 정의
    retriever = vectorstore.as_retriever()
    return retriever

def create_model_n_prompt():

    """ 챗모델과 프롬프트를 생성하는 함수 """
    
    # 챗모델 생성
    llm = ChatOpenAI(
        temperature=0.1,
        streaming=True,
        callbacks=[
            BaseCallbackHandler(),
        ]
    )
    # 프롬프트 생성
    prompt = ChatPromptTemplate.from_messages([
            ("system", """Answer the question using ONLY the following context. If you don't know the answer just say you don't know. DON'T make anything up. Context: {context}"""),
            ("human", "{question}"),
    ])
    return (llm, prompt)

def format_text(text):

    """ text에서 필요한 내용만 합친 함수 """

    return "\n\n".join(t.page_content for t in text)