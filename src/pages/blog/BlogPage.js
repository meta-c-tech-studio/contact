import { Box, Typography } from "@mui/material"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import BlogCard from "./components/BlogCard";

// Update the blog post data
const blogPosts = [
    {
        id: "1",
        title: "Understanding Data Pipelines",
        summary:
            "Explore the fundamentals of data pipelines, their stages, and why they are crucial for modern data processing and analysis.",
        slug: "understanding-data-pipelines",
    },
    {
        id: "2",
        title: "Scalable Architecture",
        summary:
            "Deep dive into the Scale Cube framework covering X-axis horizontal scaling, Y-axis services decomposition, and Z-axis data sharding for building robust, scalable systems.",
        slug: "scalable-architecture-three-dimensions",
    },
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
                    Our Blog
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
