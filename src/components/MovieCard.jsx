import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import "../styles/fade-up.css";

function MovieCard({ movie }) {
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem("favs")) || [];
        setIsFav(favs.some(fav => fav.id === movie.id));
    }, [movie.id]);

    function handleFavClick(e) {
        e.preventDefault();
        e.stopPropagation();
        let favs = JSON.parse(localStorage.getItem("favs")) || [];
        if (isFav) {
            favs = favs.filter(fav => fav.id !== movie.id);
        } else {
            favs.push(movie);
        }
        localStorage.setItem("favs", JSON.stringify(favs));
        setIsFav(!isFav);
        window.dispatchEvent(new Event("favsUpdated"));
    }

    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");

    return (
        <Link to={`/${mediaType}/${movie.id}`} className="movie-card flex-shrink-0 flex flex-col hover:shadow-lg hover:brightness-80 transition duration-300 text-white rounded-lg bg-gray-950 h-[100%]" style={{ flex: "0 0 20%", minWidth: "150px" }}>
            <div className="relative w-full aspect-[2/3]">
                <img src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} alt={movie.title || movie.name} className="w-full h-full object-cover rounded-lg" />
                <div className="absolute top-2 right-2 bg-[#fff0] p-2 rounded-full hover:brightness-125 cursor-pointer">
                    <button onClick={handleFavClick}>
                        <FontAwesomeIcon icon={isFav ? solidHeart : regularHeart} className={`w-5 h-5 ${isFav ? "text-red-500" : "text-white"} cursor-pointer hover:scale-120 transition duration-300`} />
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;
