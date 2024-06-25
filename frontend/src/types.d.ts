// 게시물 & 댓글 작성자
export interface IWriter {
  username: string;
  name: string;
}

// 게시판
export interface IBoards extends IWriter {
  pk: number;
  disclosure_status: boolean;
  posting_category: string;
  writer: IWriter;
  title: string;
  comment_count: string;
  hits: number;
  created_at: string;
}

// 상세 게시판
export interface IBoardsDetail extends IBoards {
  content: string;
  attachment: File | null;
  updated_at: string;
}

// 페이지네이션
interface IPagination {
  currentPage: number;
  pageCount: number;
  handlePageClick: (page: number) => void;
  handlePreviousClick: () => void;
  handleNextClick: () => void;
}

// 게시물 생성
interface IBoardsCreateModal {
  isOpen: boolean;
  onClose: () => void;
}

// 게시물 수정
interface IBoardsUpdateModal {
  isOpen: boolean;
  onClose: () => void;
  boardData: IBoardsDetail | undefined; // BoardsDetailRoute에서 특정 게시물 데이터 fetching
}

// 게시물 삭제
interface IBoardsDeleteModal {
  isOpen: boolean;
  onClose: () => void;
  boardPk: string | undefined;
}

// 댓글
export interface IComments extends IWriter {
  id: number;
  posting: string;
  writer: IWriter;
  comment: string;
  thumb_up: string[];
  created_at: string;
}

// 댓글 생성
interface ICommentsCreateModal {
  isOpen: boolean;
  onClose: () => void;
}

// 댓글 수정
interface ICommentsUpdateModal {
  isOpen: boolean;
  onClose: () => void;
  boardPk: string | undefined;
  commentId: string | undefined;
  commentData: IComments | undefined;
}

// 댓글 삭제
interface ICommentsDeleteModal {
  isOpen: boolean;
  onClose: () => void;
  boardPk: string | undefined;
  commentId: string | undefined;
}

// 유저
export interface IUser {
  pk: number;
  last_login: string;
  username: string;
  email: string;
  date_joined: string;
  avatar: string;
  name: string;
  is_host: boolean;
  gender: string;
  language: string;
  currency: string;
}

// 로그인
interface ISignInModal {
  isOpen: boolean;
  onClose: () => void;
}

export interface ISignInVariables {
  username: string;
  password: string;
}

// 회원가입
interface ISignUpModal {
  isOpen: boolean;
  onClose: () => void;
}

export interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
}

// Original News & Summarized News
export interface IURL {
  url: string;
}

// translated News
export interface ITranslatedNewsLLM {
  summarized_news: string;
}
