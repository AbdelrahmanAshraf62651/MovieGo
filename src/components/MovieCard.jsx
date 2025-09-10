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
        <Link
            to={`/${mediaType}/${movie.id}`}
            className="movie-card flex flex-col hover:brightness-80 transition duration-200 text-white rounded-sm bg-gray-950 h-[100%]">
            
            <div className="movie-poster relative">
                <img loading="lazy" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title || movie.name}className="w-[100%] rounded-t-sm"/>
                <div className="movie-overlay absolute top-5 right-5 bg-[#fff0] hover:scale-120 active:scale-120 transition duration-150 p-2 rounded-full hover:brightness-150">
                    <button className="fav-btn cursor-pointer" onClick={handleFavClick}>
                        <FontAwesomeIcon icon={isFav ? solidHeart : regularHeart} className={`w-5 h-5 transition-transform duration-200 ${isFav ? "text-red-500 scale-110" : "text-white"}`}/>
                    </button>
                </div>
            </div>

            <div className="movie-info pt-5 px-4 pb-2 my-auto flex flex-col gap-1">
                <h3 className="font-bold text-2xl">{movie.title || movie.name || movie.original_name}</h3>
                <p className="font-semibold opacity-60">
                    {(movie.release_date ? new Date(movie.release_date).getFullYear() :
                      movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : "")}
                </p>
            </div>
        </Link>
    );
}

export default MovieCard;
