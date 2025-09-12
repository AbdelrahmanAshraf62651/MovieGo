import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleReload = (path) => {
        navigate(path);
        window.location.reload();
    };

    return (
        <nav className="flex flex-row justify-between items-center sticky top-0 z-15 bg-gray-900 border-gray-700 text-white border-b-2 px-5 sm:px-10 py-3">
            <div className="nav-brand text-xl font-semibold cursor-pointer text-red-500 transition duration-500" onClick={() => handleReload("//")}>
                Movie Go
            </div>

            <div className="nav-links flex gap-10">
                <div className="nav-item hover:text-red-500 transition duration-150 cursor-pointer" onClick={() => handleReload("//")}>
                    Home
                </div>
                <div className="nav-item hover:text-red-500 transition duration-150 cursor-pointer" onClick={() => handleReload("/favorite")}>
                    Favorites
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
