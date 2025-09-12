import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";
import {
    getPopularMovie,
    getPopularTv,
    getTopRatedMovie,
    getTopRatedTv,
    getTrending,
    getUpcomingMovies,
    searchMovie,
    searchTv,
    GENRES,
    discoverMovieByGenre,
    discoverTvByGenre,
} from "../services/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "../styles/fade-up.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularTvs, setPopularTvs] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [topRatedTvs, setTopRatedTvs] = useState([]);
    const [trending, setTrending] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [searchResults, setSearchResults] = useState({ movies: [], tvs: [] });
    const [showAllSections, setShowAllSections] = useState(true);

    const movieRef = useRef(null);
    const tvRef = useRef(null);
    const topMovieRef = useRef(null);
    const topTvRef = useRef(null);
    const trendingRef = useRef(null);
    const upcomingRef = useRef(null);

    const preloadImages = async (items) => {
        const urls = items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`);
        await Promise.all(urls.map(src => new Promise(res => {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = res;
        })));
    };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [
                    popularMoviesData,
                    popularTvsData,
                    topMoviesData,
                    topTvsData,
                    trendingData,
                    upcomingData
                ] = await Promise.all([
                    getPopularMovie(),
                    getPopularTv(),
                    getTopRatedMovie(),
                    getTopRatedTv(),
                    getTrending(),
                    getUpcomingMovies()
                ]);

                await Promise.all([
                    preloadImages(popularMoviesData),
                    preloadImages(popularTvsData),
                    preloadImages(topMoviesData),
                    preloadImages(topTvsData),
                    preloadImages(trendingData),
                    preloadImages(upcomingData)
                ]);

                setPopularMovies(popularMoviesData || []);
                setPopularTvs(popularTvsData || []);
                setTopRatedMovies(topMoviesData || []);
                setTopRatedTvs(topTvsData || []);
                setTrending(trendingData || []);
                setUpcomingMovies(upcomingData || []);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchAll();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        setLoading(true);
        try {
            const [movieResults, tvResults] = await Promise.all([
                searchMovie(searchQuery),
                searchTv(searchQuery)
            ]);
            await Promise.all([preloadImages(movieResults), preloadImages(tvResults)]);
            setSearchResults({
                movies: movieResults || [],
                tvs: tvResults || []
            });
            setShowAllSections(false);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleGenreClick = async (genreId) => {
        setSearchQuery("");
        setSearchResults({ movies: [], tvs: [] });
        setLoading(true);
        setShowAllSections(false);
        try {
            const [moviesByGenre, tvsByGenre] = await Promise.all([
                discoverMovieByGenre(genreId),
                discoverTvByGenre(genreId)
            ]);
            await Promise.all([preloadImages(moviesByGenre), preloadImages(tvsByGenre)]);
            setPopularMovies(moviesByGenre || []);
            setPopularTvs(tvsByGenre || []);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="home fade-up px-4 md:px-8 py-10 bg-gray-900 min-h-screen text-white">
            <form className="flex justify-center mb-6" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search movies or TV shows..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-2xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 caret-red-500"
                />
            </form>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Object.entries(GENRES).map(([id, name]) => (
                    <button key={id} onClick={() => handleGenreClick(Number(id))} className="px-4 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 transition transform duration-200 cursor-pointer" >
                        {name}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-center text-lg mt-10">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-red-500" />
                </p>
            ) : searchResults.movies.length > 0 || searchResults.tvs.length > 0 ? (
                <div className="search-results grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    {searchResults.tvs.map(tv => <MovieCard key={tv.id} movie={tv} />)}
                </div>
            ) : (
                <>
                    {showAllSections && <Carousel title="Trending" items={trending} ref={trendingRef} />}
                    <Carousel title="Popular Movies" items={popularMovies} ref={movieRef} />
                    <Carousel title="Popular TV Shows" items={popularTvs} ref={tvRef} />
                    {showAllSections && (
                        <>
                            <Carousel title="Top Rated Movies" items={topRatedMovies} ref={topMovieRef} />
                            <Carousel title="Top Rated TV Shows" items={topRatedTvs} ref={topTvRef} />
                            <Carousel title="Upcoming Movies" items={upcomingMovies} ref={upcomingRef} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
