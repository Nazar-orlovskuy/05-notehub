import axios, { type AxiosResponse } from "axios";
import type { Note, FetchNotesParams, FetchNotesResponse } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { Authorization: `Bearer ${token}` },
});

// --- Fetch notes ---
export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
      params: { page, perPage, search },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching notes:", err);
    throw new Error("Failed to fetch notes");
  }
};

// --- Create note ---
export const createNote = async (
  data: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await api.post("/notes", data);
    return response.data;
  } catch (err) {
    console.error("Error creating note:", err);
    throw new Error("Failed to create note");
  }
};

// --- Delete note ---
export const deleteNote = async (id: string): Promise<void> => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (err) {
    console.error(`Error deleting note with id ${id}:`, err);
    throw new Error("Failed to delete note");
  }
};
