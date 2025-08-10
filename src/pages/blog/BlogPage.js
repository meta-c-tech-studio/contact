import { Box, Typography } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import BlogCard from "./components/BlogCard";

// Define your blog post data here
const blogPosts = [
    {
        id: "1",
        title: "Understanding Data Pipelines",
        summary:
            "Explore the fundamentals of data pipelines, their stages, and why they are crucial for modern data processing and analysis.",
        slug: "understanding-data-pipelines",
    },
    // Add more blog posts here as you create them
    // {
    //   id: "2",
    //   title: "The Future of AI in Coding",
    //   summary: "Discover how artificial intelligence is transforming software development and what to expect next.",
    //   slug: "future-of-ai-in-coding",
    // },
]

export default function BlogPage() {
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
                    flexDirection: "column", // Allow content to stack vertically
                    alignItems: "center", // Center content horizontally
                    paddingY: { xs: 3, sm: 5, md: 8 }, // Responsive vertical padding
                    boxSizing: "border-box",
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        marginBottom: { xs: 4, sm: 6 },
                        fontWeight: 700,
                        color: "text.primary",
                        textAlign: "center",
                        fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                    }}
                >
                    Blog
                </Typography>
                {/* Render blog cards */}
                {blogPosts.map((post) => (
                    <BlogCard key={post.id} title={post.title} summary={post.summary} slug={post.slug} />
                ))}
            </Box>
            <Footer />
        </Box>
    )
}
