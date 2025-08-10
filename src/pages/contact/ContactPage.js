"use client" // This is a client-side component

import { Box } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Ensure the page takes full viewport height
            }}
        >
            <Header />
            <Box
                sx={{
                    flexGrow: 1, // Allows the content area to expand and push footer down
                    display: "flex",
                    alignItems: "center", // Center form vertically
                    justifyContent: "center", // Center form horizontally
                    padding: { xs: 3, sm: 5, md: 8 }, // Responsive padding around the form
                    boxSizing: "border-box",
                }}
            >
                <ContactForm />
            </Box>
            <Footer />
        </Box>
    )
}
