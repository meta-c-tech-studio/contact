import { Routes, Route } from "react-router-dom"
import ContactPage from "../pages/contact/ContactPage";
import BlogPage from "../pages/blog/BlogPage";
import BlogDetail from "../pages/blog/BlogDetail";
import ProgrammingExercisePage from "../pages/programming-exercise/ProgrammingExercisePage";
import AICodingPage from "../pages/ai-coding/AICodingPage";
import RepositoryPage from "../pages/giit/repository/[id]";
import GiitPage from "../pages/giit/GiitPage";
import SportsPage from "../pages/sports/SportsPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} /> {/*  Blog Route */}
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/programming-exercise" element={<ProgrammingExercisePage />} />
            <Route path="/ai-coding" element={<AICodingPage />} />
            <Route path="/giit" element={<GiitPage />} /> {/* Giit main page */}
            <Route path="/giit/repository/:id" element={<RepositoryPage />} />
            <Route path="/sports" element={<SportsPage />} />

        </Routes>
    )
}
