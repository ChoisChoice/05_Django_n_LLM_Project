from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, NotAuthenticated
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Posting, Comment
from .serializers import BoardListSerializer, BoardDetailSerializer

class Board(APIView):

    """ 게시판을 보여주는 화면 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    # 게시판 가져오기
    def get(self, request):
        # 데이터 가져오기
        all_postings = Posting.objects.all()
        # 가져온 데이터 직렬화
        serializer = BoardListSerializer(
            all_postings,
            many=True,  # 여러개의 데이터 직렬화
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Board imported successfully."}
        )

    # 게시물 생성하기
    def post(self, request):
        # 로그인 여부
        if request.user.is_authenticated:  # 로그인 True일 경우
            # print(request.user.is_authenticated)
            # 직렬화
            serializer = BoardDetailSerializer(
                data=request.data,
            )  
            # 직렬화 데이터 유효성 검증
            if serializer.is_valid():  
                board = serializer.save(writer=request.user)  # 유효하다면, 데이터 저장
                serializer = BoardDetailSerializer(
                    data=board,
                )
                return Response(
                    data=serializer.data,
                    status=status.HTTP_200_OK, 
                    headers={"successed":"Board creation successed."},
                )
            else:
                return Response(
                    data=serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST, 
                    headers={"failed":"Board creation failed."},
                )
        else:  # 로그인 False일 경우
            raise NotAuthenticated


class BoardDetail(APIView):

    """ 게시판의 특정 게시물을 보여주는 화면 """

    def get_object(self, pk):
        try:
            return Posting.objects.get(pk=pk)
        except Posting.DoesNotExist:
            raise NotFound

    # 게시판 가져오기
    def get(self, request, pk):
        # 데이터 가져오기
        board = self.get_object(pk)
        # 가져온 데이터 직렬화
        serializer = BoardDetailSerializer(
            data=board,
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Board detail imported successfully."}
        )

    # 게시물 수정하기
    def put(self, request):
        pass
    
    # 게시물 삭제하기
    def delete(self, request):
        pass