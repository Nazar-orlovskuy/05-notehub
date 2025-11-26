import type { Note } from "./note";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  results: Note[];
}
