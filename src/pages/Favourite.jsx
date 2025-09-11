import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import "../styles/fade-up.css"
function Favourite() {
    const [favs, setFavs] = useState(() => {
        return JSON.parse(localStorage.getItem("favs")) || [];
    });

    function loadFavs() {
        setFavs(JSON.parse(localStorage.getItem("favs")) || []);
    }

    useEffect(() => {
        loadFavs();
        window.addEventListener("favsUpdated", loadFavs);
        return () => {
            window.removeEventListener("favsUpdated", loadFavs);
        };
    }, []);

    return (
        <div className="fav">
            {favs.length !== 0 ?
                (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-5">
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
