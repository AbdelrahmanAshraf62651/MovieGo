import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularMovie, getPopularTv, searchMovie, searchTv, GENRES, discoverMovieByGenre, discoverTvByGenre } from "../services/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "../styles/fade-up.css"

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [tvs, setTvs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPopular() {
            setLoading(true);
            try {
                const [movieData, tvData] = await Promise.all([getPopularMovie(), getPopularTv()]);
                setMovies(movieData || []);
                setTvs(tvData || []);
            } catch (error) {
                console.error("Error fetching popular content:", error);
            }
            setLoading(false);
        }
        fetchPopular();
    }, []);

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchQuery) return;
        setLoading(true);
        try {
            const [movieResults, tvResults] = await Promise.all([
                searchMovie(searchQuery),
                searchTv(searchQuery),
            ]);
            setMovies(movieResults.filter(item => item.media_type === "movie") || []);
            setTvs(tvResults.filter(item => item.media_type === "tv") || []);
        } catch (error) {
            console.error("Error searching content:", error);
        }
        setLoading(false);
    }

    async function handleGenreClick(genreId) {
        setSearchQuery("");
        setLoading(true);
        const [movieResults, tvResults] = await Promise.all([
            discoverMovieByGenre(genreId),
            discoverTvByGenre(genreId),
        ]);
        setMovies(movieResults || []);
        setTvs(tvResults || []);
        setLoading(false);
    }

    return (
        <div className="home fade-up">
            <form className="search-form flex justify-center gap-2 my-5" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for movies or TV shows..."
                    className="search-input w-100 text-center border-1 border-red-600 rounded-2xl py-1 focus:outline-0 caret-red-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            <div className="genre-buttons flex flex-wrap justify-center gap-2 mb-5">
                {Object.entries(GENRES).map(([id, name]) => (
                    <button key={id} onClick={() => handleGenreClick(Number(id))} className="px-3 py-1 rounded-full bg-red-500 text-white hover:shadow-[0_0_6px_red] hover:scale-105 transition duration-300 cursor-pointer"> {name} </button>
                ))}
            </div>
            {loading ? (
                <p className="text-center text-lg font-semibold mt-10">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                </p>
            ) : (
                <>
                    <h1 className="text-3xl my-5 font-bold">Popular Movies</h1>
                    <div className="movie-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {movies.length > 0 ? (
                            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                        ) : (
                            <p className="text-center col-span-full mt-10 text-gray-500">No movies found</p>
                        )}
                    </div>
                    <h1 className="text-3xl my-5 font-bold">Popular TV Shows</h1>
                    <div className="movie-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {tvs.length > 0 ? (
                            tvs.map((tv) => <MovieCard key={tv.id} movie={tv} />)
                        ) : (
                            <p className="text-center col-span-full mt-10 text-gray-500">No TV shows found</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
