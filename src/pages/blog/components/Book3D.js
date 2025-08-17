"use client"
import { Box, Typography, Button } from "@mui/material"
import { useState } from "react"

const Book3D = ({ book, index }) => {
    const [isHovered, setIsHovered] = useState(false)

    const handleViewOnLiteral = () => {
        window.open(book.literalUrl, "_blank")
    }

    return (
        <Box
            sx={{
                perspective: "1200px",
                width: "100%",
                height: { xs: "350px", sm: "400px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box
                sx={{
                    width: { xs: "160px", sm: "200px" },
                    height: { xs: "240px", sm: "300px" },
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: isHovered
                        ? "rotateY(-35deg) rotateX(15deg) translateZ(40px) scale(1.15)"
                        : "rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)",
                    cursor: "pointer",
                }}
            >
                {/* Book Cover */}
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${book.cover})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "12px",
                        boxShadow: isHovered
                            ? "0 35px 80px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                            : "0 15px 35px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)",
                        transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: isHovered
                                ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.1) 100%)"
                                : "transparent",
                            borderRadius: "12px",
                            transition: "all 0.8s ease",
                        },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            border: isHovered ? "1px solid rgba(255,255,255,0.2)" : "none",
                            borderRadius: "12px",
                            transition: "all 0.8s ease",
                        },
                    }}
                />

                {/* Enhanced Book Spine */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "-16px",
                        top: "0",
                        width: "16px",
                        height: "100%",
                        background: "linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.2), rgba(0,0,0,0.1))",
                        transformOrigin: "right center",
                        transform: "rotateY(-90deg)",
                        borderRadius: "0 0 0 12px",
                        opacity: isHovered ? 1 : 0.7,
                        transition: "all 0.8s ease",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "5%",
                            left: "20%",
                            right: "20%",
                            bottom: "5%",
                            background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05))",
                            borderRadius: "2px",
                        },
                    }}
                />

                {/* Enhanced Book Pages */}
                <Box
                    sx={{
                        position: "absolute",
                        right: "-12px",
                        top: "6px",
                        width: "12px",
                        height: "calc(100% - 12px)",
                        background: "linear-gradient(to bottom, #ffffff, #f5f5f5, #f0f0f0, #f8f8f8)",
                        transformOrigin: "left center",
                        transform: "rotateY(90deg)",
                        borderRadius: "0 12px 12px 0",
                        opacity: isHovered ? 1 : 0.8,
                        transition: "all 0.8s ease",
                        boxShadow: "inset -2px 0 4px rgba(0,0,0,0.1)",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "8%",
                            left: "15%",
                            right: "15%",
                            bottom: "8%",
                            background:
                                "repeating-linear-gradient(to bottom, transparent, transparent 1.5px, rgba(0,0,0,0.08) 1.5px, rgba(0,0,0,0.08) 2.5px)",
                        },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: "10%",
                            left: "25%",
                            right: "25%",
                            bottom: "10%",
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.02), transparent, rgba(0,0,0,0.02))",
                        },
                    }}
                />

                {/* Enhanced Hover Overlay with Book Info */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: isHovered ? "-100px" : "-80px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "220px",
                        padding: "16px",
                        background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95))",
                        borderRadius: "12px",
                        opacity: isHovered ? 1 : 0,
                        transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        backdropFilter: "blur(20px)",
                        zIndex: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            marginBottom: "6px",
                            fontSize: "0.9rem",
                            textAlign: "center",
                            lineHeight: 1.3,
                        }}
                    >
                        {book.title}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "0.8rem",
                            textAlign: "center",
                            display: "block",
                            marginBottom: "12px",
                            fontWeight: 500,
                        }}
                    >
                        {book.author}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleViewOnLiteral}
                        sx={{
                            width: "100%",
                            borderColor: "rgba(255,255,255,0.3)",
                            color: "white",
                            fontSize: "0.8rem",
                            padding: "6px 12px",
                            fontWeight: 600,
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                borderColor: "#007aff",
                                backgroundColor: "rgba(0, 122, 255, 0.1)",
                                color: "#007aff",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 20px rgba(0, 122, 255, 0.3)",
                            },
                        }}
                    >
                        View on Literal →
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Book3D
