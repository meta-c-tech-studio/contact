import { useState } from "react"
import { Box, Typography, Tabs, Tab } from "@mui/material"
import {getBooksByCategory, getBookStats} from "../data/booksData";
import Book3D from "../components/Book3D";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const ReadingListBlog = () => {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const bookStats = getBookStats()
    const filteredBooks = getBooksByCategory(selectedCategory)

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue)
    }

    const getCategoryLabel = (category) => {
        switch (category) {
            case "all":
                return `All (${bookStats.total})`
            case "technical":
                return `Technical (${bookStats.technical})`
            case "non-tech":
                return `Non-tech Learning (${bookStats.nonTech})`
            default:
                return category
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#000000",
                color: "#f5f5f7",
                padding: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Header/>
            {/* Header Section */}
            <Box
                sx={{
                    background: "linear-gradient(180deg, rgba(72,187,255,0.6) 0%, rgba(26,32,44,0.9) 100%)",
                    borderRadius: "16px",
                    padding: { xs: 3, sm: 4, md: 5 },
                    marginBottom: { xs: 3, sm: 4 },
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: {xs: "2.2rem", md: "3.5rem"},
                        fontWeight: 700,
                        background: "linear-gradient(90deg,#ffffff 0%, #ef5501 40%, #09b19c 60%,#09d2b9 80% ,#09d2b9 88% ,#04f2d5 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 3,
                        top: "calc(100% - 3rem)",
                        filter: "brightness(1.3)",
                        "&::before": {
                            content: '"Ready to start it effortlessly?Ready to start it effortlessly?"',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg,#ffffff 0%, #ef5501 40%, #09b19c 60%,#09d2b9 80% ,#09d2b9 88% ,#04f2d5 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "blur(30px) brightness(1.4)",
                            opacity: 0.8,
                            zIndex: -1,
                        },
                        "&::after": {
                            content: '"Ready to start it effortlessly?"',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg,#ffffff 0%, #ef5501 40%, #09b19c 60%,#09d2b9 80% ,#09d2b9 88% ,#04f2d5 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "blur(70px) brightness(1.5)",
                            opacity: 0.6,
                            zIndex: -2,
                        },
                        "& > span::before": {
                            content: '"Ready to start it effortlessly?"',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg,#ffffff1 0%, #ef5501 40%, #09b19c 60%,#09d2b9 80% ,#09d2b9 88% ,#04f2d5 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "blur(100px) brightness(1.6)",
                            opacity: 0.4,
                            zIndex: -3,
                        }
                    }}
                >
<span style={{position: 'relative'}}>
        Ready to start it effortlessly?
    </span>
                </Typography>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        color: "#fff",
                        textShadow: "0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff",
                    }}
                >
                     Reading List
                </Typography>
                {/* 倒影 */}
                <Typography
                    variant="h2"
                    component="h1"
                    aria-hidden="true" // 隐藏无障碍访问
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        color: "#fff",
                        textShadow: "0 0 10px #ffffff33, 0 0 20px #ffffff22, 0 0 30px #ffffff11",
                        perspective: "1000px",
                        transform: "rotateX(120deg) scale(1, 2)",
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                        opacity: 0.3,
                        mt: "-10px",
                        pointerEvents: "none",
                        filter: "blur(1px)",
                        
                    }}
                >
                    Reading List
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        opacity: 0.9,
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                        lineHeight: 1.6,
                    }}
                >
                    I have read 10+ books recently.
                    <br />
                    Here are books I highly recommend!
                </Typography>
            </Box>

            {/* Category Tabs */}
            <Box sx={{ marginBottom: { xs: 3, sm: 4 } }}>
                <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            minWidth: { xs: "auto", sm: "120px" },
                            padding: { xs: "8px 12px", sm: "12px 16px" },
                            color: "#a0a0a0",
                        },
                        "& .MuiTab-root.Mui-selected": {
                            color: "#007aff",
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#007aff",
                            height: "3px",
                            borderRadius: "2px",
                        },
                    }}
                >
                    <Tab label={getCategoryLabel("all")} value="all" />
                    <Tab label={getCategoryLabel("technical")} value="technical" />
                    {bookStats.novel > 0 && <Tab label={getCategoryLabel("novel")} value="novel" />}
                    {bookStats.nonTech > 0 && <Tab label={getCategoryLabel("non-tech")} value="non-tech" />}
                </Tabs>
            </Box>

            {/* Books Grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                    },
                    gap: { xs: 2, sm: 3, md: 4 },
                    marginBottom: { xs: 4, sm: 6 },
                }}
            >
                {filteredBooks.map((book, index) => (
                    <Box
                        key={book.id}
                        sx={{
                            backgroundColor: "#2c2c2e",
                            borderRadius: "12px",
                            padding: { xs: 2, sm: 3 },
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                                transform: "translateY(-4px)",
                            },
                        }}
                    >
                        <Book3D book={book} index={index} />
                    </Box>
                ))}
            </Box>

            {/* Stats Section */}
            <Box
                sx={{
                    backgroundColor: "#2c2c2e",
                    borderRadius: "12px",
                    padding: { xs: 3, sm: 4 },
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        marginBottom: 2,
                        color: "#f5f5f7",
                    }}
                >
                    Statistics
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: { xs: 2, sm: 4 },
                        flexWrap: "wrap",
                    }}
                >
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "#007aff" }}>
                            {bookStats.total}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                            Total Books
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "#28a745" }}>
                            {bookStats.technical}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                            Technical
                        </Typography>
                    </Box>
                    {bookStats.novel > 0 && (
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffc107" }}>
                                {bookStats.novel}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                                Novels
                            </Typography>
                        </Box>
                    )}
                    {bookStats.nonTech > 0 && (
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#17a2b8" }}>
                                {bookStats.nonTech}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                                Non-tech Learning
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer/>
        </Box>
    )
}

export default ReadingListBlog
