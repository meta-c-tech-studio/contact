import './App.css';
import { Routes, Route, useLocation, BrowserRouter} from "react-router-dom";
import "./App.css" // Keep your existing CSS if needed, or remove if not used
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline" // For consistent baseline styles
import theme from "./theme.js" // Import your custom theme
import ContactPage from "./pages/contact/ContactPage";
import AppRoutes from "./routes/AppRoutes";
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Provides a consistent baseline to build upon. */}
            <BrowserRouter>

                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
