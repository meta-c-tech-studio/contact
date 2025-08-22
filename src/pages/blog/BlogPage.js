import { Box, Typography } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import BlogCard from "./components/BlogCard"
import BlogFrequencyChart from "./components/BlogFrequencyChart"
import { getBlogStats } from "../../services/blogAnalyticsService.js"
import {getAllBlogPosts} from "./components/blogRegistry";
import ReadingListCard from "./components/ReadingListCard";
import ToolsShowcase from "./components/ToolsShowcase";

export default function BlogPage() {
    // Get all blog posts using your existing function
    const blogPosts = getAllBlogPosts()

    // Generate blog statistics
    const blogStats = getBlogStats()

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
                    paddingX: { xs: 2, sm: 3 },
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

                {/* Blog Frequency Chart */}
                <BlogFrequencyChart
                    data={blogStats.frequencyData}
                    title="Publishing Activity"
                    subtitle={`${blogStats.totalPosts} total posts • Most active in ${blogStats.mostProductiveMonth} with ${blogStats.maxPostsInMonth} posts`}
                />
                {/* Reading List Card */}
                <Box sx={{ width: "100%", maxWidth: "900px", marginBottom: { xs: 2, sm: 3 } }}>
                    <ReadingListCard />
                </Box>
                {/* Reading List Card */}
                <Box sx={{ width: "100%", maxWidth: "900px", marginBottom: { xs: 2, sm: 3 } }}>
              <ToolsShowcase/>
                </Box>
                {/* Blog Posts */}
                <Box sx={{ width: "100%", maxWidth: "800px" }}>
                    {blogPosts.map((post) => (
                        <BlogCard key={post.id} title={post.title} summary={post.summary} slug={post.slug} date={post.date} />
                    ))}
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}
