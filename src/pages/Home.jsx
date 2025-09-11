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

    // Utility to preload images
    async function preloadImages(items) {
        const images = items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`);
        await Promise.all(images.map(src => new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = resolve;
        })));
    }

    useEffect(() => {
        async function fetchPopular() {
            setLoading(true);
            try {
                const [movieData, tvData] = await Promise.all([getPopularMovie(), getPopularTv()]);
                const filteredMovies = movieData || [];
                const filteredTvs = tvData || [];

                // Preload all poster/backdrop images
                await Promise.all([preloadImages(filteredMovies), preloadImages(filteredTvs)]);

                setMovies(filteredMovies);
                setTvs(filteredTvs);
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
            const moviesFiltered = movieResults.filter(item => item.media_type === "movie") || [];
            const tvsFiltered = tvResults.filter(item => item.media_type === "tv") || [];

            // Preload images
            await Promise.all([preloadImages(moviesFiltered), preloadImages(tvsFiltered)]);

            setMovies(moviesFiltered);
            setTvs(tvsFiltered);
        } catch (error) {
            console.error("Error searching content:", error);
        }
        setLoading(false);
    }

    async function handleGenreClick(genreId) {
        setSearchQuery("");
        setLoading(true);
        try {
            const [movieResults, tvResults] = await Promise.all([
                discoverMovieByGenre(genreId),
                discoverTvByGenre(genreId),
            ]);

            const moviesFiltered = movieResults || [];
            const tvsFiltered = tvResults || [];

            // Preload images
            await Promise.all([preloadImages(moviesFiltered), preloadImages(tvsFiltered)]);

            setMovies(moviesFiltered);
            setTvs(tvsFiltered);
        } catch (error) {
            console.error("Error discovering by genre:", error);
        }
        setLoading(false);
    }

    return (
        <div className="home fade-up px-2 md:px-5 my-10">
            <form className="search-form flex justify-center gap-2 my-5" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for movies or TV shows..."
                    className="search-input w-100 text-center border-1  rounded-2xl py-1 focus:outline-0 caret-red-600 bg-gray-800 text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            <div className="genre-buttons flex flex-wrap justify-center gap-2 mb-5">
                {Object.entries(GENRES).map(([id, name]) => (
                    <button key={id} onClick={() => handleGenreClick(Number(id))} className="px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_10px_red] hover:scale-105 transition duration-300 cursor-pointer"> {name} </button>
                ))}
            </div>
            {loading ? (
                <p className="text-center text-lg font-semibold mt-10">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                </p>
            ) : (
                <>
                    <h1 className="text-3xl my-5 font-bold">Popular Movies</h1>
                    <div className="movie-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
                        {movies.length > 0 ? (
                            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                        ) : (
                            <p className="text-center col-span-full mt-10 text-gray-500">No movies found</p>
                        )}
                    </div>
                    <h1 className="text-3xl my-5 font-bold">Popular TV Shows</h1>
                    <div className="movie-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
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
