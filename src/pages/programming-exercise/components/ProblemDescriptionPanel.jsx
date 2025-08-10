"use client"

import { Typography, Paper } from "@mui/material"
import { marked } from "marked" // Import marked for Markdown parsing

export default function ProblemDescriptionPanel({ currentProblem, theme }) {
    // Parse Markdown description
    const parsedDescription = marked.parse(currentProblem.description)

    return (
        <Paper
            sx={{
                height: "100%",
                overflowY: "auto",
                padding: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                // Styles for Markdown elements
                "& p": {
                    marginBottom: "1em",
                },
                "& strong": {
                    fontWeight: 700,
                    color: theme.palette.primary.main, // Highlight bold text with primary color for better visibility
                },
                "& code": {
                    fontFamily: "monospace",
                    fontSize: "0.9em",
                    backgroundColor: theme.palette.background.default, // Subtle background for inline code
                    padding: "0.2em 0.4em",
                    borderRadius: "3px",
                    color: theme.palette.primary.main, // Highlight inline code with primary color
                },
                "& pre": {
                    backgroundColor: theme.palette.background.default, // Darker background for code blocks
                    padding: "1em",
                    borderRadius: "8px",
                    overflowX: "auto",
                    marginBottom: "1em",
                    whiteSpace: "pre-wrap", // Ensure long lines wrap
                    wordBreak: "break-word", // Break long words if necessary
                },
                "& pre code": {
                    backgroundColor: "transparent", // Override inline code background for code blocks
                    padding: 0, // Override inline code padding for code blocks
                    borderRadius: 0, // Override inline code border-radius for code blocks
                    color: theme.palette.text.primary, // Ensure text color is correct
                },
                "& ul": {
                    listStyleType: "disc",
                    paddingLeft: "20px",
                    marginBottom: "1em",
                },
                "& li": {
                    marginBottom: "0.5em",
                },
            }}
        >
            <Typography variant="h4" component="h1" sx={{ marginBottom: 1, fontWeight: 700 }}>
                {currentProblem.title}
            </Typography>
            <Typography
                variant="subtitle2"
                sx={{
                    marginBottom: 2,
                    color:
                        currentProblem.difficulty === "Easy"
                            ? theme.palette.googleGreen.main
                            : currentProblem.difficulty === "Medium"
                                ? theme.palette.googleYellow.main
                                : theme.palette.googleRed.main,
                }}
            >
                {currentProblem.difficulty}
            </Typography>
            <Typography
                variant="body1"
                component="div"
                sx={{ lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: parsedDescription }}
            />
        </Paper>
    )
}
