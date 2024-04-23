import requests
from bs4 import BeautifulSoup

def extract_article(url):

    """ BBC NEWS url에서 html 추출 -> 기사 본문 내용 추출하는 함수 """

    try:
        # URL에 GET 요청
        response = requests.get(url)
        response.raise_for_status()  # 요청이 성공적으로 이루어졌는지 확인
        
        # HTML 파싱
        soup = BeautifulSoup(response.content, "html.parser")
        # print(soup)
        
        # 본문을 저장할 리스트
        article_content = []

        selector = "#__next > main > section > p"
        sections = soup.select(selector)
        print(sections)

        # 각 섹션에서 <p> 태그 안의 텍스트 추출
        for section in sections:
            # 해당 섹션 내의 모든 <p> 태그 찾기
            paragraphs = section.find_all('p')
            
            # 각 <p> 태그 안의 문장 추출하여 리스트에 추가
            for paragraph in paragraphs:
                # <p> 태그의 텍스트 추출 (문장 단위로 분리)
                sentences = paragraph.get_text().strip().split('. ')
                
                # 추출된 문장들을 결과 리스트에 추가
                article_content.extend(sentences)
        
        return article_content
    
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    
    return None