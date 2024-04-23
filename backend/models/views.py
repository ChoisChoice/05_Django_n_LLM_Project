from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from .services import create_retriever, create_model_n_prompt, format_text

class SummaryDocumentGPT(APIView):

    """ 문서 요약 gpt를 정의하는 클래스(url과 question을 post하면 answer를 리턴)"""

    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        # url
        url = request.data.get("url")
        if type(url) != str:
            return Response(
                headers={"error": "Url type must be string."}, 
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            # text -> cache 저장, split, embedding 후 vectorstore 생성
            retriever = create_retriever(url)
        except Exception as e:
            return Response(
                headers={"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        # question
        question = request.data.get("question")
        # print(question)
        if type(question) != str:
            return Response({"error": "Question type must be string."}, status=status.HTTP_400_BAD_REQUEST)
        # 모델 및 프롬프트 생성
        llm, prompt = create_model_n_prompt()
        # LangChain 및 LLM 실행
        chain = {
                    "context": retriever | RunnableLambda(format_text),
                    "question": RunnablePassthrough()
                } | prompt | llm
        try:
            response = chain.invoke(question)
        except Exception as e:
            return Response(
                headers={"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            headers={"response": response}, 
            status=status.HTTP_200_OK,
        )
