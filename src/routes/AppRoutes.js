import { Routes, Route } from "react-router-dom"
import ContactPage from "../pages/contact/ContactPage";
import BlogPage from "../pages/blog/BlogPage";
import BlogDetail from "../pages/blog/BlogDetail";
import ProgrammingExercisePage from "../pages/programming-exercise/ProgrammingExercisePage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} /> {/*  Blog Route */}
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/programming-exercise" element={<ProgrammingExercisePage />} />
        </Routes>
    )
}
