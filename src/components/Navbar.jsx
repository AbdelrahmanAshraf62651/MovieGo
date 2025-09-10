import "../styles/navbar.css"

function Navbar() {
    return <nav className="flex flex-row justify-between text-center z-10 bg-white items-center sticky top-0 shadow-sm px-5 sm:px-10 py-3">
        <div className="nav-brand text-xl font-semibold cursor-pointer text-red-600 transition duration-500"><a href="/">Movie Go</a> </div>
        <div className="nav-links flex gap-10">
            <a href="/" className="nav-item hover:text-red-600 transition duration-150">Home</a>
            <a href="/favorite" className="nav-item hover:text-red-600 transition duration-150">Favorites</a>
        </div>
    </nav>
}

export default Navbar