import openai
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from . import config
import environ
import sqlite3

env = environ.Env()
openai.api_key = env("SECRET_KEY")

def initialize_database():

    """ DB에 연결하는 함수 """

    conn = sqlite3.connect("questions.db")
    cursor = conn.cursor()
    # 테이블이 존재하지 않을 경우 테이블 생성
    cursor.execute('''CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, key TEXT UNIQUE, value Text)''')
    conn.commit()
    conn.close()

def generate_question(text):
    initialize_database()
    # DB에 연결
    conn = sqlite3.connect("questions.db")
    cursor = conn.cursor()
    # 모델 생성
    chat = ChatOpenAI(
        max_token = 3500,
        stop = None,
        temperature = 0.1,
    )
    # 프롬프트 정의
    prompt = PromptTemplate.from_messages(
        f"Create a pratice test with multiple choice questions on the following text:\n{text}\n\n" \
        f"Each question should be on a different line. Each question should have 4 possible ansers." \
        f"Under the possible answers we should have the correct answer."
    )
    # 예측
    response = chat.predict(prompt)

def key_exits():
    pass

def print_all_questions():
    pass