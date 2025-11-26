import { useState } from "react";
import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { useDebounce } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import type { FetchNotesResponse } from "../../types/noteApi";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [	searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPage(1);
  };


  const notesQuery = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });

  const data = notesQuery.data as FetchNotesResponse | undefined;
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchText} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {notesQuery.isLoading && <p>Loading notes...</p>}
        {notesQuery.isError && <p>Error loading notes.</p>}

        {!notesQuery.isLoading && notes.length === 0 && (
          <p>No notes found.</p>
        )}

        {notes.length > 0 && <NoteList notes={notes} />}
      </main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
