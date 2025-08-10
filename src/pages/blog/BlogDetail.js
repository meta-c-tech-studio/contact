"use client"

import { useParams } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import DataPipelineBlog from "./lists/data-pipline-blog";

// Map slugs to their respective components
const blogComponents = {
    "understanding-data-pipelines": DataPipelineBlog,
    // Add other blog components here as you create them
    // "another-blog-post": AnotherBlogPostComponent,
}

export default function BlogDetail() {
    const { slug } = useParams()
    const BlogPostComponent = blogComponents[slug]

    if (!BlogPostComponent) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 4,
                }}
            >
                <Header />
                <Typography variant="h4" sx={{ color: "text.primary", mt: 8 }}>
                    Blog Post Not Found
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
                    The blog post you are looking for does not exist.
                </Typography>
                <Footer />
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Header />
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingY: { xs: 3, sm: 5, md: 8 },
                    boxSizing: "border-box",
                }}
            >
                <BlogPostComponent />
            </Box>
            <Footer />
        </Box>
    )
}
