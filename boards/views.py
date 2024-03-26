from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, NotAuthenticated, PermissionDenied
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
            headers={"successed": "Board is imported successfully."}
        )

    # 게시물 생성하기
    def post(self, request):
        # 로그인 여부
        if request.user.is_authenticated:  # 로그인 True일 경우
            # 직렬화
            serializer = BoardDetailSerializer(data=request.data)  
            # 직렬화 데이터 유효성 검증
            if serializer.is_valid():  
                board = serializer.save(writer=request.user)  # 유효하다면, 데이터 저장
                serializer = BoardDetailSerializer(board)
                return Response(
                    data=serializer.data,
                    status=status.HTTP_200_OK, 
                    headers={"successed":"Board creation is successed."},
                )
            else:
                return Response(
                    data=serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST, 
                    headers={"failed":"Board creation is failed."},
                )
        else:  # 로그인 False일 경우
            raise NotAuthenticated

    
    """
    [Question] 각 Serializer내에 'data='라는 키워드 유뮤에 따라 아래와 같이 에러가 발생함.. 이유가 무엇일까?
    When a serializer is passed a `data` keyword argument you must call `.is_valid()` before attempting to access the serialized `.data` representation.
    You should either call `.is_valid()` first, or access `.initial_data` instead.
    """


class BoardDetail(APIView):

    """ 게시판의 특정 게시물을 보여주는 화면 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Posting.objects.get(pk=pk)
        except Posting.DoesNotExist:
            raise NotFound

    # 게시판 가져오기
    def get(self, request, pk):
        # 데이터 가져오기
        board = self.get_object(pk=pk)
        # 가져온 데이터 직렬화
        serializer = BoardDetailSerializer(board)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Board detail is imported successfully."},
        )

    # 게시물 수정하기
    def put(self, request, pk):
        # 데이터 가져오기
        board=self.get_object(pk=pk)
        # 가져온 데이터에 유저가 로그인하지 않았다면..
        if not request.user.is_authenticated:
            raise NotAuthenticated
        # 게시글의 저자와 가져온 데이터의 유저가 다르다면..
        if board.writer != request.user:
            raise PermissionDenied
        # 가져온 데이터 직렬화
        serializer = BoardDetailSerializer(
            board,
            data=request.data,
            partial=True,  # 부분 업데이터 허용
        )
        # 직렬화 데이터 유효성 검증
        if serializer.is_valid():
            board=serializer.save(writer=request.user)  # 업데이트 저장
            serializer = BoardDetailSerializer(board)
            return Response(
                data=serializer.data,
                status=status.HTTP_200_OK,
                headers={"successed": "Board is updated successfully."},
            )
        else:
            return Response(
                data=serializer.data,
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Board update is failed."},
            )
    
    # 게시물 삭제하기
    def delete(self, request, pk):
        # 데이터 가져오기
        board = self.get_object(pk=pk)
        # 가져온 데이터에서 유저가 로그인한 경우가 아니라면..
        if not request.user.is_authenticated:  
            raise NotAuthenticated
        # 게시글의 저자와 가져온 데이터의 유저가 다르다면..
        if board.writer != request.user:  
            raise PermissionDenied
        # 삭제
        board.delete()  
        return Response(
            status=status.HTTP_204_NO_CONTENT,
            headers={"successed": "Board is deleted successfully."}
        )