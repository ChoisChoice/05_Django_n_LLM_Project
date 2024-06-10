from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .utils.helper_functions import extract_article
from .services import create_retriever, create_model, create_question, create_prompt, create_chain, create_translated_news

class OriginalNews(APIView):

    """ 기사 본문을 추출하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        # url
        url = request.data.get("url")
        if type(url) != str:
            return Response(
                headers={"error": "URL type must be string."}, 
                status=status.HTTP_400_BAD_REQUEST,
            )
        # 기사 추출
        news = extract_article(url)
        return Response(
            data=news,
            headers={"successed": "Original News articles."}, 
            status=status.HTTP_200_OK,
        )

class SummarizedNewsGPT(APIView):

    """ 기사 요약 gpt를 정의하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        # url
        url = request.data.get("url")
        if type(url) != str:
            return Response(
                headers={"error": "URL type must be string."}, 
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # retriever 생성(url -> 본문 추출, cache 저장, split, embedding)
        retriever = create_retriever(url)

        # question 생성
        question = create_question()

        # 모델 및 프롬프트 생성
        llm = create_model()
        prompt = create_prompt()
        
        # chain 생성 및 실행
        chain = create_chain(retriever, prompt, llm)

        try:
            summary_result = chain.invoke(question)
        except Exception as e:
            return Response(
                headers={"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            data=summary_result.content,
            headers={"successed": "News articles has been summarized."}, 
            status=status.HTTP_200_OK,
        )
    
class TranslatedNewsGPT(APIView):

    """ 요약된 기사 번역 gpt를 정의하는 클래스 """
    
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        # 요약된 기사
        summarized_news = request.data.get("summarized_news")
        if type(summarized_news) != str:
            return Response(
                headers={"error": "summarized_news type must be string."}, 
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 기사 번역
        translated_news = create_translated_news(summarized_news)

        return Response(
            data=translated_news,
            headers={"successed": "News articles has been translated."}, 
            status=status.HTTP_200_OK,
        )