"use client"

import { Box, Typography, Button, Link } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export default function BlogCard({ title, summary, slug }) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                padding: { xs: 3, sm: 4 },
                marginBottom: 4,
                width: "100%",
                maxWidth: 800,
                boxSizing: "border-box",
            }}
        >
            <Typography
                variant="h4"
                component="h2"
                sx={{
                    marginBottom: 1,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
                }}
            >
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                {summary}
            </Typography>
            <Link href={`/blog/${slug}`} underline="none">
                <Button
                    variant="outlined"
                    sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.primary,
                        },
                    }}
                >
                    Read More
                </Button>
            </Link>
        </Box>
    )
}
