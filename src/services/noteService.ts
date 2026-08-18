import axios from "axios";
import type { Note, NewNote } from "../types/note";


export interface FetchNotesParams {
    search?: string;
    page: number;
    perPage: number;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


const BASE_URL = "https://notehub-public.goit.study/api";
const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
      params,
      headers
    });
    return response.data
}; 

export const createNote = async (params: NewNote): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, 
    params, {
    headers
  });
  return response.data;
}; 

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers
  });
  return response.data;
}; 