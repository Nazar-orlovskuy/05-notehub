import type { Note } from "./note";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
   totalPages: 0;
  notes: Note[];
}
