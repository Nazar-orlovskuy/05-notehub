import axios, { type AxiosResponse } from "axios";
import type { Note, FetchNotesParams, FetchNotesResponse } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { Authorization: `Bearer ${token}` },
});

// Fetch notes
export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: { page, perPage, search },
  });
  return response.data;
};

// Create note
export const createNote = async (
  data: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", data);
  return response.data;
};

// Delete note
export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
};
