export type NoteTag =  "Work" | "Personal" | "Meeting" | "Shopping" |  "Todo";


export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tag: NoteTag;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}