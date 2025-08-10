import './App.css';
import { Routes, Route, useLocation, BrowserRouter} from "react-router-dom";
import "./App.css" // Keep your existing CSS if needed, or remove if not used
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline" // For consistent baseline styles
import theme from "./theme.js" // Import your custom theme
import ContactPage from "./pages/contact/contactPage";
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Provides a consistent baseline to build upon. */}
            <BrowserRouter>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.palette.background.default, // Use theme background color
                    }}
                >
                    <Routes>
                        <Route path="/" element={<ContactPage/>}/>
                        {/* You can add more routes here if needed */}
                    </Routes>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
