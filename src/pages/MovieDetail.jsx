import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieId, fetchTvId } from "../services/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fullStar, faStarHalfAlt as halfStar, faHeart as solidHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar, faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "../styles/fade-up.css";

function StarRating({ rating }) {
    let stars = [];
    let full = Math.floor(rating);
    let half = rating % 1 >= 0.5 ? 1 : 0;
    let empty = 5 - (full + half);
    let i = 0;
    while (full--) stars.push(<FontAwesomeIcon key={i++} icon={fullStar} className="text-red-500" />);
    if (half) stars.push(<FontAwesomeIcon key={i++} icon={halfStar} className="text-red-500" />);
    while (empty--) stars.push(<FontAwesomeIcon key={i++} icon={emptyStar} className="text-red-500" />);
    return <div className="flex gap-1">{stars}</div>;
}

function MovieDetail() {
    const { id } = useParams();
    const location = useLocation();
    const [item, setItem] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const isTv = location.pathname.startsWith("/tv");

    useEffect(() => {
        async function loadItem() {
            try {
                const data = isTv ? await fetchTvId(id) : await fetchMovieId(id);
                setItem(data);
                const favs = JSON.parse(localStorage.getItem("favs")) || [];
                setIsFav(favs.some(fav => fav.id === data.id));
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        }
        loadItem();
    }, [id, isTv]);

    function handleFavClick() {
        let favs = JSON.parse(localStorage.getItem("favs")) || [];
        if (isFav) {
            favs = favs.filter(fav => fav.id !== item.id);
        } else {
            favs.push(item);
        }
        localStorage.setItem("favs", JSON.stringify(favs));
        setIsFav(!isFav);
    }

    if (!item) return <p className="text-center mt-10"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></p>;

    return (
        <div className="movie-detail flex flex-col mt-5 justify-center relative min-h-[calc(100vh-150px)] text-white p-6 md:p-12">
            <img
                src={item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : "/fallback.jpg"}
                alt={item.title || item.name}
                className="absolute inset-0 w-full h-full object-cover -z-10" />
            <div className="absolute inset-0 bg-black/70 -z-10"></div>

            <div className="absolute top-5 right-5 bg-[#fff0] p-3 rounded-full hover:brightness-150 transition duration-100 z-10">
                <button onClick={handleFavClick}>
                    <FontAwesomeIcon
                        icon={isFav ? solidHeart : regularHeart}
                        className={`w-6 h-6 hover:scale-120 transition duration-150 cursor-pointer ${isFav ? "text-red-500" : "text-white"}`} />
                </button>
            </div>

            <div className="relative h-[100%] max-w-2xl flex flex-col flex-grow gap-3 justify-center">
                <h1 className="text-4xl font-bold">{item.title || item.name}</h1>
                <p className="opacity-70">{item.release_date || item.first_air_date}</p>
                <p>{item.overview}</p>
                <p>Rate: {item.vote_average}</p>
                <StarRating rating={item.vote_average / 2} />
                <div className="flex gap-2 mt-auto flex-wrap">
                    {item.genres?.map((genre) => (
                        <span key={genre.id} className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full">{genre.name}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;
