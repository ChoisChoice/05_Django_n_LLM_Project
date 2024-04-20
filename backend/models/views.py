from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from .services import embed_text, create_model_n_prompt, format_text

class DocumentGPT(APIView):

    """ 문서 gpt를 정의하는 클래스 """

    def post(self, request, format=None):
        # 텍스트 업로드 처리
        text = request.data.get("text", "")
        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            retriever = embed_text(text)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # LangChain 및 LLM 사용
        context = self.format_docs(retriever)
        question = request.data.get('question', '')
        if not question:
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 모델 및 프롬프트 임포트
        llm, prompt = create_model_n_prompt()
        
        # LangChain 및 LLM 실행
        chain = {
                "context": retriever | RunnableLambda(format_text),
                "question": RunnablePassthrough()
                } | prompt | llm
        try:
            response = chain.invoke(question)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"response": response}, status=status.HTTP_200_OK)
