from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# class QuizApp(APIView):
#     def get(self, request):
#         return Response(headers={"successed": "[QuizApp] Just testing now."})
    
# class About(APIView):
#     def get(self, request):
#         return Response(headers={"successed": "[About] Just testing now."})
    
# class Servies(APIView):
#     def get(self, request):
#         return Response(headers={"successed": "[Servies] Just testing now."})
    
class Home(APIView):
    def get(self, request):
        return Response(headers={"successed": "[Home] Just testing now."})