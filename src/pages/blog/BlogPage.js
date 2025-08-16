"use client"

import { Box, Typography } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import BlogCard from "./components/BlogCard"
import { getAllBlogPosts } from "./components/blogRegistry"

export default function BlogPage() {
    // 自动提取所有blog元数据
    const blogPosts = getAllBlogPosts()

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
                {/* 动态渲染blog卡片 */}
                {blogPosts.map((post) => (
                    <BlogCard key={post.id} title={post.title} summary={post.summary} slug={post.slug} date={post.date} />
                ))}
            </Box>
            <Footer />
        </Box>
    )
}
