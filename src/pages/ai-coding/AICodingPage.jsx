import { useState, useCallback } from "react"
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import AICodeOutput from "./components/AICodeOutput.jsx"
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

    const handleGenerateCode = useCallback(async () => {
        setIsLoading(true)
        setError("")
        setGeneratedCode("") // Clear previous code

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful coding assistant. Generate clean, well-commented code based on the user's request. 
              Default to Python unless another language is specifically requested. 
              Only return the code, no explanations or markdown formatting.`,
                        },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    max_tokens: 2048,
                    temperature: 0.3,
                    stream: false,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status} - ${response.statusText}`)
            }

            const data = await response.json()

            if (data.choices && data.choices.length > 0) {
                const generatedText = data.choices[0].message.content.trim()

                // Try to detect language from the generated code
                let detectedLanguage = language
                if (generatedText.includes("def ") || generatedText.includes("import ") || generatedText.includes("print(")) {
                    detectedLanguage = "python"
                } else if (
                    generatedText.includes("function ") ||
                    generatedText.includes("const ") ||
                    generatedText.includes("console.log")
                ) {
                    detectedLanguage = "javascript"
                } else if (
                    generatedText.includes("public class") ||
                    generatedText.includes("System.out.println") ||
                    generatedText.includes("public static void main")
                ) {
                    detectedLanguage = "java"
                }

                setLanguage(detectedLanguage)
                setGeneratedCode(generatedText)
            } else {
                throw new Error("No code generated. Please try again with a different prompt.")
            }
        } catch (err) {
            console.error("Error generating code:", err)
            setError(err.message || "Failed to generate code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [prompt, language])

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
                        AI Code Generator
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                        Describe the code you need, and our AI will generate it for you using Groq's model.
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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Generate Code"}
                    </Button>

                    {error && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            <Typography variant="body2">
                                <strong>Error:</strong> {error}
                            </Typography>
                        </Alert>
                    )}

                    {/* Usage Info */}
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

                {/* Right Panel: Generated Code Output */}
                <Box sx={{ flex: 1, minHeight: { xs: "400px", md: "auto" } }}>
                    <AICodeOutput code={generatedCode} language={language} />
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}
