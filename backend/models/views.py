from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from .services import create_retriever, create_model, create_question, create_prompt

class SummaryNewsGPT(APIView):

    """ 기사 요약 gpt를 정의하는 클래스(url과 question을 post하면 answer를 리턴)"""

    # permission_classes = [AllowAny,]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        # url
        url = request.data.get("url")
        if type(url) != str:
            return Response(
                headers={"error": "Url type must be string."}, 
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # retriever 생성(url -> 본문 추출, cache 저장, split, embedding)
        retriever = create_retriever(url)

        # question
        question = create_question()

        # 모델 및 프롬프트 생성
        llm = create_model()
        prompt = create_prompt()
        
        # LangChain 및 LLM 실행
        chain = {
                    "context": retriever,
                    "question": RunnablePassthrough()
                } | prompt | llm
        try:
            summary_result = chain.invoke(question)
        except Exception as e:
            return Response(
                headers={"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            data=summary_result.content,
            headers={"successed": "Summary of newspaper articles."}, 
            status=status.HTTP_200_OK,
        )
