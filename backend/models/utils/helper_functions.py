import requests
from bs4 import BeautifulSoup
import re

"""
[※ Warning! ※] [※ Warning! ※] [※ Warning! ※]
::: 아래 함수는 ABC NEWS 기사에만 해당함 :::
[※ Warning! ※] [※ Warning! ※] [※ Warning! ※]
"""

def extract_article(url):

    """ ABC NEWS url에서 html 추출 -> 기사 본문 내용 추출하는 함수 """

    try:
        # URL에 GET 요청
        response = requests.get(url)
        response.raise_for_status()
        
        # HTML 파싱 및 태그 추출
        soup = BeautifulSoup(response.content, "html.parser")
        selector = "#FITTArticle > div > div > div > div > div > p"
        tags = soup.select(selector)

        # 기사 본문을 저장할 변수
        article = ""

        # 기사 문장 추출 및 저장
        for tag in tags:
            article += tag.get_text() + " "

        return article.strip()
    
    except Exception as e:
        print(f"An error occurred: {e}")

def save_article(url, article):

    """ ABC NEWS article을 저장하는 함수 """

    # 기사 url의 id값을 파일명으로 하여 저장
    if 'id=' in url:
        file_name = str(url.split("id=")[-1])
    else:
        # 'id='가 포함되어 있지 않은 경우 정수 9개 이상이 붙어 있는 숫자 추출
        numbers = re.findall(r'\d{9,}', url)
        if numbers:
            file_name = ''.join(numbers)
        else:
            file_name = "temporary number"

    file_path = f"./.cache/files/{file_name}.txt"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(article)
    
    return (file_name, file_path)