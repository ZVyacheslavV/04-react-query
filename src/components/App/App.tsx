import { useState /* , useEffect */ } from 'react';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import { Toaster } from 'react-hot-toast';
import { notifyEmpty } from '../../services/notifications';
import MovieModal from '../MovieModal/MovieModal';
import LoadMore from '../LoadMore/LoadMore';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isMorePages, setIsMorePages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');

  /* const [isModalOpen, setIsModalOpen] = useState(false); */
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => {
    /* setIsModalOpen(true); */
    setSelectedMovie(movie);
  };
  const closeModal = () => {
    /* setIsModalOpen(false); */
    setSelectedMovie(null);
  };

  const handleSearch = async (topic: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);
      setCurrentPage(1);

      const {
        results,
        total_pages,
        /* total_results,
        page: pageData, */
      } = await fetchMovies(topic, currentPage);
      setQuery(topic);

      setIsMorePages(currentPage < total_pages);

      if (results.length === 0) {
        notifyEmpty();
        setMovies([]);
      } else setMovies(results);
    } catch {
      setIsError(true);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreClick = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const {
        results,
        total_pages,
        /* total_results,
        page: pageData, */
      } = await fetchMovies(query, currentPage + 1);

      setIsMorePages(currentPage + 1 < total_pages);
      if (isMorePages) setCurrentPage(currentPage + 1);

      setMovies(prev => [...prev, ...results]);

      /* setTimeout(() => {
        const card = document.querySelector(`.${css.card}`); // твій клас картки
        if (card) {
          window.scrollBy({
            top: card.clientHeight * 2, // висота 2 карток вниз
            behavior: 'smooth',
          });
        }
      }, 100); */
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {isLoading && <Loader />}
      {isMorePages && !isLoading && (
        <LoadMore handleClick={handleLoadMoreClick} />
      )}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
}
