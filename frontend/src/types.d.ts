export interface IBoards {
  pk: number;
  disclosure_status: boolean;
  posting_category: string;
  writer: string;
  title: string;
  comment_count: string;
  hits: number;
  created_at: string;
}

export interface IBoardsDetail extends IBoards {
  content: string;
  attachment: File | null;
  updated_at: string;
}

export interface IComments {
  pk: number;
  posting: string;
  writer: string;
  comment: string;
  thumb_up: number;
  created_at: string;
}
