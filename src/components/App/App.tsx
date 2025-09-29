import { useState, useEffect } from 'react';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import { Toaster } from 'react-hot-toast';
import { notifyEmpty } from '../../services/notifications';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });
  const results = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (isSuccess && (data?.results?.length ?? 0) === 0) {
      notifyEmpty();
    }
  }, [isSuccess, data?.results]);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (topic: string) => {
    setQuery(topic);
    setCurrentPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {results.length > 0 && (
        <MovieGrid movies={results} onSelect={openModal} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
}
