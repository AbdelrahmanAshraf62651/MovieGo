import Home from "./pages/home"
import Favourite from "./pages/favourite"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import MovieDetail from "./pages/MovieDetail";
import { Route, Routes } from "react-router-dom"
function App() {
    return <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="main-content px-5 md:px-10 flex-grow">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorite" element={<Favourite />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<MovieDetail />} />
            </Routes>
        </main>
        <Footer />
    </div>

}

export default App