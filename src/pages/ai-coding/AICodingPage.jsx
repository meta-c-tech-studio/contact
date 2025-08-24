"use client"

import { useState, useCallback } from "react"
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import AICodeOutput from "./components/AICodeOutput.jsx"
import VisualCanvas from "./components/VisualCanvas.jsx"

export default function AICodingPage() {
    const theme = useTheme()
    const [prompt, setPrompt] = useState("")
    const [generatedCode, setGeneratedCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [language, setLanguage] = useState("python") // Default language for AI output

    const handlePromptChange = useCallback((e) => {
        setPrompt(e.target.value)
    }, [])

    // 简化画布变化处理，避免重复文本
    const handleCanvasChange = useCallback((canvasPrompt) => {
        // 暂时禁用自动更新，避免重复文本问题
        console.log("Canvas changed:", canvasPrompt)
    }, [])

    const handleGenerateCode = useCallback(async () => {
        setIsLoading(true)
        setError("")
        setGeneratedCode("")

        try {
            const response = await fetch("https://api.contact.reene4444.com/api/generate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()
            setLanguage(data.language || "python")
            setGeneratedCode(data.code || "")
        } catch (err) {
            setError(err.message || "Failed to generate code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [prompt])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Header />
            <Box
                sx={{
                    flexGrow: 1,
                    padding: { xs: 2, sm: 3, md: 4 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 3, md: 4 },
                }}
            >
                {/* Left Panel: Prompt Input */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        minWidth: { md: "40%" },
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                        Visual AI Code Generator
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                        Describe the code you want to generate, and see the automatic mind map visualization with enhanced canvas
                        features.
                    </Typography>

                    <TextField
                        label="Code Description"
                        multiline
                        rows={10}
                        fullWidth
                        variant="outlined"
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="e.g., 'A Python function to reverse a string' or 'JavaScript script to read a CSV file' or 'Java class for a simple calculator'"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: theme.palette.background.paper,
                                "& fieldset": { borderColor: theme.palette.divider },
                                "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                            },
                            "& .MuiInputBase-input": { color: theme.palette.text.primary },
                            "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
                            "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
                        }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateCode}
                        disabled={isLoading || !prompt.trim()}
                        sx={{ padding: "12px 24px", fontSize: "1rem", fontWeight: 600 }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Generate Code & Mind Map"}
                    </Button>

                    {error && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            <Typography variant="body2">
                                <strong>Error:</strong> {error}
                            </Typography>
                        </Alert>
                    )}

                    {/* Enhanced Usage Info */}
                    <Box
                        sx={{
                            padding: 2,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, marginBottom: 1 }}>
                            🚀 Powered by Groq
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}>
                            • Model: Llama 3.1 8B Instant
                            <br />• Frequency: 30 requests/minute
                        </Typography>

                    </Box>
                </Box>

                {/* Right Panel: Visual Canvas + Generated Code Output */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        minHeight: { xs: "600px", md: "auto" },
                    }}
                >
                    {/* Enhanced Visual Canvas - Upper Half */}
                    <Box sx={{ height: { xs: "350px", md: "45%" }, minHeight: "350px" }}>
                        <VisualCanvas onCanvasChange={handleCanvasChange} generatedCode={generatedCode} language={language} />
                    </Box>

                    {/* Generated Code Output - Lower Half */}
                    <Box sx={{ height: { xs: "400px", md: "55%" }, minHeight: "400px" }}>
                        <AICodeOutput code={generatedCode} language={language} />
                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}
