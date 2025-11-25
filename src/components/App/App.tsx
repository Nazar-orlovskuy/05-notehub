import { useState } from "react";
import css from "./App.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import { useDebounce } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import type { FetchNotesResponse } from "../../types/note";

export default function App() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // --- Запит нотаток ---
  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>(
    ["notes", page, debouncedSearch],
    () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    { keepPreviousData: true }
  );

  // --- Видалення нотатки ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchText} onChange={setSearchText} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes.</p>}
        {data?.results.length === 0 && <p>No notes found.</p>}
        {data?.results.length > 0 && (
          <NoteList notes={data.results} onDelete={handleDelete} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm
            onClose={handleCloseModal}
            onSuccess={() => console.log("Note added successfully!")}
          />
        </Modal>
      )}
    </div>
  );
}
