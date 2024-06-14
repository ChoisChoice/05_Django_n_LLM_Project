export interface IWriter {
  username: string;
  name: string;
}

// 게시판
export interface IBoards {
  pk: number;
  disclosure_status: boolean;
  posting_category: string;
  writer: IWriter;
  title: string;
  comment_count: string;
  hits: number;
  created_at: string;
}

// 게시판 생성
export interface ICreateBoards {
  disclosure_status: boolean;
  posting_category: string;
  title: string;
  writer: IWriter;
  content: string;
  attachment: File | null;
}

// 상세 게시판
export interface IBoardsDetail extends IBoards {
  content: string;
  attachment: File | null;
  updated_at: string;
}

// 댓글
export interface IComments {
  pk: number;
  posting: string;
  writer: string;
  comment: string;
  thumb_up: number;
  created_at: string;
}

// 유저
export interface IUser {
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
export interface ISignInVariables {
  username: string;
  password: string;
}
export interface ISignInSuccess {
  successed: string;
}
export interface ISignInFail {
  failed: string;
}

// 회원가입
export interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
}

// // chatEnv(채팅환경)
// export interface IChatEnv {
//   test: string;
// }

// Original News & Summarized News
export interface IURL {
  url: string;
}

// translated News
export interface ITranslatedNewsLLM {
  summarized_news: string;
}
