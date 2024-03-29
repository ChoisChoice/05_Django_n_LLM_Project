from django.db import transaction
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, NotAuthenticated, PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Posting, Comment
from .serializers import BoardsSerializer, BoardsDetailSerializer, CommentsSerializer, CommentsThumbUpSerializer
from common.views import pagination


class Boards(APIView):

    """ 게시판을 보여주고 게시글을 생성하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    # 게시판 가져오기
    def get(self, request):
        # 페이지네이션 구현
        start, end = pagination(request)
        # 데이터 가져오기
        all_postings = Posting.objects.all()
        # 가져온 데이터 직렬화
        serializer = BoardsSerializer(
            all_postings[start:end],  # 페이지네이션 적용
            many=True,  # 여러개의 데이터 직렬화
            context={"request": request},
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Board has been imported successfully."}
        )

    # 게시물 생성하기
    def post(self, request):
        # 로그인 여부
        if request.user.is_authenticated:  # 로그인 True일 경우
            # 직렬화
            serializer = BoardsDetailSerializer(data=request.data)  
            # 직렬화 데이터 유효성 검증
            if serializer.is_valid():  
                board = serializer.save(writer=request.user)  # 유효하다면, 데이터 저장
                serializer = BoardsDetailSerializer(board)
                return Response(
                    data=serializer.data,
                    status=status.HTTP_201_CREATED, 
                    headers={"successed":"Board creation has been successed."},
                )
            else:
                return Response(
                    data=serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST, 
                    headers={"failed":"Board creation has been failed."},
                )
        else:  # 로그인 False일 경우
            raise NotAuthenticated

    
    """
    [Question] 각 Serializer내에 'data='라는 키워드 유뮤에 따라 아래와 같이 에러가 발생함.. 이유가 무엇일까?
    When a serializer is passed a `data` keyword argument you must call `.is_valid()` before attempting to access the serialized `.data` representation.
    You should either call `.is_valid()` first, or access `.initial_data` instead.
    """


class BoardsDetail(APIView):

    """ 게시판의 특정 게시물을 수정 및 삭제하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, board_pk):
        try:
            return Posting.objects.get(pk=board_pk) 
        except Posting.DoesNotExist:
            raise NotFound

    # 게시판 가져오기
    def get(self, request, board_pk):
        # 데이터 가져오기
        board = self.get_object(board_pk)
        # 비로그인 상태일 경우 확인
        if not request.user.is_authenticated:
            raise NotAuthenticated
        # 비공개 상태 + 요청한 사용자가 게시글의 저자가 아닌 경우 확인
        if (board.disclosure_status) & (request.user != board.writer):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                headers={"failed": "This Posting has been set to private!"}
            )
        else:
            # 가져온 데이터 직렬화
            serializer = BoardsDetailSerializer(board)
            return Response(
                data=serializer.data,
                status=status.HTTP_200_OK,
                headers={"successed": "Board detail is imported successfully."},
            )

    # 게시물 수정하기
    def put(self, request, board_pk):
        # 데이터 가져오기
        board=self.get_object(board_pk)
        # 가져온 데이터에 유저가 로그인하지 않았다면..
        if not request.user.is_authenticated:
            raise NotAuthenticated
        # 게시글의 저자와 가져온 데이터의 유저가 다르다면..
        if board.writer != request.user:
            raise PermissionDenied
        # 가져온 데이터 직렬화
        serializer = BoardsDetailSerializer(
            board,
            data=request.data,
            partial=True,  # 부분 업데이터 허용
        )
        # 직렬화 데이터 유효성 검증
        if serializer.is_valid():
            board=serializer.save(writer=request.user)  # 업데이트 저장
            serializer = BoardsDetailSerializer(board)
            return Response(
                data=serializer.data,
                status=status.HTTP_200_OK,
                headers={"successed": "Board has been updated successfully."},
            )
        else:
            return Response(
                data=serializer.data,
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Board update has been failed."},
            )
    
    # 게시물 삭제하기
    def delete(self, request, board_pk):
        # 데이터 가져오기
        board = self.get_object(board_pk)
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
    

class Comments(APIView):

    """ 댓글 보여주고 생성하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # 댓글 가져오기
    def get(self, request):
        # 데이터 가져오기
        all_comment = Comment.objects.all()
        # 가져온 데이터 직렬화
        serializer = CommentsSerializer(
            all_comment,
            many=True,  # 여러개의 데이터 직렬화
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Comment has been imported successfully."}
        )


class CommentsDetail(APIView):

    """ 특정 게시글의 댓글들을 수정하고 삭제하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, comment_pk):
        try:
            return Comment.objects.get(pk=comment_pk)
        except Comment.DoesNotExist:
            raise NotFound

    # 댓글 가져오기
    def get(self, request, board_pk, comment_pk):
        # 데이터 가져오기
        comment = self.get_object(comment_pk)
        # 가져온 데이터 직렬화
        serializer = CommentsSerializer(comment)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Comment detail has been imported successfully."}
        )

    # 댓글 수정하기
    def put(self, request, board_pk, comment_pk):
        # 데이터 가져오기
        comment = self.get_object(comment_pk)
        # 사용자 로그인 여부 확인
        if not request.user.is_authenticated:
            raise NotAuthenticated
        # 댓글의 저자와 받은 데이터의 사용자가 같은지 확인
        if comment.writer != request.user:
            raise PermissionDenied
        # 데이터 직렬화
        serializer = CommentsSerializer(
            comment,
            data=request.data,
            partial=True,  # 부분 업데이터 허용
        )
        # 직렬화 데이터 타당성 검증
        if serializer.is_valid():
            comment = serializer.save(writer=request.user)  # 받은 데이터의 유저를 writer로 하여 댓글 수정
            serializer = CommentsSerializer(comment)
            return Response(
                data=serializer.data,
                status=status.HTTP_200_OK,
                headers={"successed": "Comment has been updated successfully."},
            )
        else:
            return Response(
                data=serializer.data,
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "Comment update has been failed."}
            )

    # 댓글 삭제하기
    def delete(self, request, board_pk, comment_pk):
        # 데이터 가져오기
        comment = self.get_object(comment_pk)
        # 로그인 여부 확인
        if not request.user.is_authenticated:  
            raise NotAuthenticated
        # 댓글의 저자와 받은 데이터의 유저가 같은지 확인
        if comment.writer != request.user:  
            raise PermissionDenied
        # 삭제
        comment.delete()  
        return Response(
            status=status.HTTP_204_NO_CONTENT,
            headers={"successed": "Comment has been deleted successfully."}
        )


class CommentsCreation(APIView):

    """ 게시글에 댓글을 작성하는 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, board_pk):
        try:
            return Posting.objects.get(pk=board_pk)
        except Posting.DoesNotExist:
            raise NotFound

    # 게시판 가져오기
    def get(self, request, board_pk):
        # 페이지네이션 구현
        start, end = pagination(request)
        # 데이터 가져오기
        posting = self.get_object(board_pk)
        # print(posting)
        # 게시글에 존재하는 모든 댓글 가져오기
        all_comment = Comment.objects.filter(posting=posting)
        # print(all_comment)
        # 가져온 댓글 직렬화
        serializer = CommentsSerializer(
            all_comment[start:end],  # 페이지네이션 적용
            many=True,
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Posting-Comment has been imported successfully."},
            )

    # 댓글 작성하기
    def post(self, request, board_pk):
        # 사용자 로그인 여부 확인
        if not request.user.is_authenticated:
            raise NotAuthenticated
        # 게시글 존재 여부 확인
        posting = self.get_object(board_pk)
        # 가져온 데이터 직렬화
        serializer = CommentsSerializer(data=request.data)
        # 데이터 유효성 검증
        if serializer.is_valid():
            comment = serializer.save(posting=posting, writer=request.user)  # 댓글을 저장 + 게시글 연결 + 댓글 작성자 연결
            # print(comment)
            serializer = CommentsSerializer(comment)
            return Response(
                data=serializer.data, 
                status=status.HTTP_201_CREATED,
                headers={"successed": "Comment creation has been successfully."},
            )
        return Response(
            data=serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST,
            headers={"failed": "Comment creation has been failed."}
        )


class ThumbUp(APIView):

    """ 댓글 추천 기능 클래스 """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, comment_pk):
        try:
            return Comment.objects.get(pk=comment_pk)
        except Comment.DoesNotExist:
            raise NotFound
        
    # 댓글 가져오기
    def get(self, request, board_pk, comment_pk):
        comment = self.get_object(comment_pk)
        serializer = CommentsThumbUpSerializer(comment)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            headers={"successed": "Comment has been imported successfully."},
        )
    
    # 추천하기
    def post(self, request, board_pk, comment_pk):
        # 해당 댓글 가져오기
        comment = self.get_object(comment_pk)
        # 사용자가 이미 추천한 댓글인지 확인 - 중복 방지
        user = request.user
        if user in comment.thumb_up.all():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                headers={"failed": "You have already thumbed up this comment."}
            )
        # 댓글 추천 - 사용자를 추가함
        comment.thumb_up.add(user)
        # 댓글 저장
        comment.save()
        # Serializer를 사용하여 응답 생성
        serializer = CommentsThumbUpSerializer(comment)
        return Response(
            data=serializer.data, 
            status=status.HTTP_200_OK,
            headers={"successed": "Thumb-up has been applied successfully."},
        )