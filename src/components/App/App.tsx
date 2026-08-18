import css from "./App.module.css"
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";


export default function App() {
  const [page, setPage] = useState(1)
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState(``)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const perPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getNotes", search, page],
    queryFn: () => fetchNotes({ search, page, perPage }),
    placeholderData: keepPreviousData,
  });

  const updateSearchQuery = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    500,
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0; 
  const queryClient = useQueryClient();

  const deleteNotes = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNotes'] })
      toast.success('Нотатку видалено');
    }, onError: () => {
    toast.error(`Нотатку не знайдено`);
  },
  })

  const addNotes = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotes"] });
      setIsModalOpen(false);
      toast.success(`Нотатку додано`);
    }
  })

  useEffect(() => {
    if (search && !isLoading && data?.notes.length === 0) {
      toast.error(`Нотатку не знайдено`);
    }
  }, [data, search, isLoading]);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox query={inputValue} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          ></Pagination>
        )}
        {
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={(id) => deleteNotes.mutate(id)} />
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => addNotes.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}


