import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import "../styles/fade-up.css"
import "../styles/fav-list.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Favourite() {
    const [favs, setFavs] = useState(() => {
        return JSON.parse(localStorage.getItem("favs")) || [];
    });
    const [loading, setLoading] = useState(true);

    function loadFavs() {
        setFavs(JSON.parse(localStorage.getItem("favs")) || []);
    }

    async function preloadImages(items) {
        const images = items.map(item => `https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`);
        await Promise.all(images.map(src => new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = resolve;
        })));
    }

    useEffect(() => {
        async function initFavs() {
            loadFavs();
            const currentFavs = JSON.parse(localStorage.getItem("favs")) || [];
            await preloadImages(currentFavs);
            setLoading(false);
        }

        initFavs();

        window.addEventListener("favsUpdated", initFavs);
        return () => {
            window.removeEventListener("favsUpdated", initFavs);
        };
    }, []);

    if (loading) {
        return (
            <p className="text-center text-lg font-semibold mt-10">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-red-500" />
            </p>
        );
    }

    return (
        <div className="fav fade-up px-2 md:px-5 my-10">
            {favs.length !== 0 ? (
                <div className="movie-grid grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-5">
                    {favs.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="empty-message flex flex-col items-center justify-center py-20 opacity-80">
                    <h2 className="text-2xl text-center font-bold mb-2">No favorite movies yet</h2>
                    <p className="text-lg text-center max-w-md">
                        Start adding movies to your favorites by clicking the ❤️ icon on any movie.
                        Your saved movies will appear here!
                    </p>
                </div>
            )}
        </div>
    );
}

export default Favourite;
