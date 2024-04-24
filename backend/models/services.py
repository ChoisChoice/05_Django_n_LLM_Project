from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_community.document_loaders.unstructured import UnstructuredFileLoader
from langchain_openai import OpenAIEmbeddings
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.callbacks.base import BaseCallbackHandler
from models.utils.helper_functions import extract_article, save_article

def create_retriever(url):
    
    """ 사용자가 url을 입력하면 기사 추출, cache 저장, split, embedding 후 vectorstore를 생성하여 retreiver를 만들어 반환해 주는 함수 """
    
    # 기사 추출
    article = extract_article(url)

    # 기사 url의 id값을 파일명으로 하여 저장
    file_name, file_path = save_article(url, article)

    # 캐시 저장 폴더 설정
    folder_name = file_name  # 기사 url id값으로 폴더명 지정
    cache_dir = LocalFileStore(f"./.cache/embeddings/{folder_name}")  

    # 텍스트 분할기 정의
    splitter = CharacterTextSplitter.from_tiktoken_encoder(
        separator=". ",
        chunk_size=100,
        chunk_overlap=20,
    )

    # 데이터 로더 정의
    loader = UnstructuredFileLoader(file_path)

    # 데이터 로드 & 분할
    docs = loader.load_and_split(text_splitter=splitter)

    # 임베딩 정의
    embeddings = OpenAIEmbeddings()

    # cache embedding 객체 생성 => 임베딩의 결과를 캐시에 저장
    cached_embeddings = CacheBackedEmbeddings.from_bytes_store(embeddings, cache_dir)

    # 임베딩된 문서 기반으로 vector store 정의
    vectorstore = FAISS.from_documents(docs, cached_embeddings)
    
    # retriever 정의(vector store를 검색기로 변환)
    retriever = vectorstore.as_retriever()

    return retriever

def create_model():

    """ 챗모델을 생성하는 함수 """
    
    # 챗모델 생성
    llm = ChatOpenAI(
        temperature=0.1,
        streaming=True,
        callbacks=[
            BaseCallbackHandler(),
        ]
    )

    return llm

def create_question():

    """ 질문을 생성하는 함수 """

    question = """
        Summarize the context by referring to the five conditions below.
            - Be sure to identify key vocabulary and include the essence of your argument.
            - Find and use the main sentence.
            - Summarize the content in a balanced way according to the context.
            - Do not distort the author's intentions.
            - Be concise but comprehensive in your content.
    """

    return question

def create_prompt():

    """ 프롬프트를 생성하는 함수 """

    # 프롬프트 생성
    prompt = ChatPromptTemplate.from_messages([
            ("system", """Answer the question using ONLY the following context. If you don't know the answer just say you don't know. DON'T make anything up. Context: {context}"""),
            ("human", "{question}"),
    ])

    return prompt