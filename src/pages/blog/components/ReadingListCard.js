"use client"
import { Box, Typography, Button, Card, CardContent } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { booksData } from "../data/booksData"

const ReadingListCard = () => {
    const navigate = useNavigate()

    const handleViewReadingList = () => {
        navigate("/blog/reading-list")
    }

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "900px" },
                margin: { xs: "0 auto 2rem auto", sm: "0 auto 3rem auto" },
                backgroundColor: "background.paper",
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent
                sx={{
                    padding: { xs: 2, sm: 3, md: 4 },
                    "&:last-child": {
                        paddingBottom: { xs: 2, sm: 3, md: 4 },
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "flex-start" },
                        gap: { xs: 2, sm: 3 },
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                marginBottom: { xs: 1, sm: 2 },
                                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                                lineHeight: { xs: 1.3, sm: 1.4 },
                                wordBreak: "break-word",
                            }}
                        >
                            Reading List
                        </Typography>
           

                      

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                                gap: { xs: 2, sm: 0 },
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleViewReadingList}
                                sx={{
                                    borderColor: "#007aff",
                                    color: "#007aff",
                                    fontWeight: 600,
                                    borderRadius: { xs: 2, sm: 3 },
                                    padding: { xs: "8px 16px", sm: "10px 20px" },
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    textTransform: "none",
                                    minWidth: { xs: "120px", sm: "auto" },
                                    "&:hover": {
                                        borderColor: "#005bb5",
                                        backgroundColor: "rgba(0, 122, 255, 0.04)",
                                    },
                                }}
                            >
                                View Reading List
                            </Button>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    fontWeight: 500,
                                    order: { xs: -1, sm: 0 },
                                }}
                            >
                                {booksData.length} books • Updated regularly
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default ReadingListCard
