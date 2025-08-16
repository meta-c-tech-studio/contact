import { Box, Typography, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Lock } from "lucide-react" // Import the Lock icon

export default function DataPipelineBlog() {
    const theme = useTheme()

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: "0 auto",
                padding: { xs: 3, sm: 5, md: 8 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                color: theme.palette.text.primary,
                position: "relative", // Needed for absolute positioning of overlay
            }}
        >
            <Box
                sx={{
                    maxHeight: "33.33vh", // Always limit height to 1/3 of viewport height
                    overflow: "hidden", // Always hide overflow
                    position: "relative", // For the gradient overlay
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        marginBottom: 2,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                >
                    Understanding Data Pipelines
                </Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, marginBottom: 4 }}>
                    Updated on August 10, 2025 - Bytebytego
                </Typography>

                {/* Insert the image here */}
                <Box sx={{ width: "100%", marginBottom: 4, textAlign: "center" }}>
                    <img
                        src="/blogs/img.png" // Reference the image from the public folder
                        alt="Data Pipeline Diagram"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "8px", // Optional: add some border-radius to the image
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)", // Optional: add a subtle shadow
                        }}
                    />
                </Box>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Reference: bytebytego
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The typical stages of a data pipeline include data ingestion, where data is collected from sources like
                    databases, APIs, or streaming platforms; data transformation, where data is cleaned, enriched, and
                    restructured to fit the target schema; and data loading, where the processed data is moved to a data
                    warehouse, data lake, or other storage systems.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Effective data pipelines ensure data quality, consistency, and availability, enabling timely insights and
                    informed decision-making. They can be batch-oriented, processing data at scheduled intervals, or real-time,
                    handling data as it arrives. Tools and technologies for building data pipelines range from traditional ETL
                    (Extract, Transform, Load) tools to modern cloud-based services and open-source frameworks like Apache Kafka,
                    Apache Spark, and Airflow.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Building robust and scalable data pipelines requires careful planning, understanding of data sources, and
                    expertise in various data processing technologies. As data volumes continue to grow, the importance of
                    well-designed data pipelines will only increase.
                </Typography>

                {/* Gradient overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100px", // Height of the fade effect
                        background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
                        pointerEvents: "none", // Allow clicks to pass through to content below
                    }}
                />
            </Box>

            {/* Locked Content Button */}
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
                <Button
                    variant="contained"
                    disabled // Disable the button as content is locked
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1, // Space between icon and text
                    }}
                >
                    <Lock size={20} /> {/* Lock icon */}
                    
                </Button>
            </Box>
        </Box>
    )
}
