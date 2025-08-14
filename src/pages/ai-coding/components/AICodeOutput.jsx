import { Box, Paper, Typography, IconButton } from "@mui/material"
import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"
import "prismjs/themes/prism-dark.css"
import { useTheme } from "@mui/material/styles"
import { Copy, Download } from "lucide-react"
import { useState } from "react"

export default function AICodeOutput({ code, language = "javascript" }) {
    const theme = useTheme()
    const [copySuccess, setCopySuccess] = useState(false)

    const highlightCode = (codeToHighlight, lang) => {
        try {
            // Clean the code first - remove markdown code blocks if present
            let cleanCode = codeToHighlight
            if (cleanCode.startsWith("```")) {
                cleanCode = cleanCode.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "")
            }

            const languageGrammar = languages[lang] || languages.javascript
            return highlight(cleanCode, languageGrammar, lang)
        } catch (error) {
            console.error("Syntax highlighting error:", error)
            return codeToHighlight
        }
    }

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        } catch (err) {
            console.error("Failed to copy code:", err)
        }
    }

    const handleDownloadCode = () => {
        const fileExtensions = {
            javascript: "js",
            python: "py",
            java: "java",
            css: "css",
            html: "html",
        }

        const extension = fileExtensions[language] || "txt"
        const blob = new Blob([code], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `generated-code.${extension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Clean the code to remove any markdown formatting
    const cleanCode = code
        ? code
            .replace(/^```[\w]*\n?/, "")
            .replace(/\n?```$/, "")
            .trim()
        : ""

    return (
        <Paper
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                overflow: "hidden", // Ensure content doesn't overflow rounded corners
            }}
        >
            <Box
                sx={{
                    padding: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                    Generated Code ({language})
                </Typography>

                {cleanCode && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                            onClick={handleCopyCode}
                            size="small"
                            sx={{
                                color: copySuccess ? theme.palette.success?.main || "#4caf50" : theme.palette.text.secondary,
                                "&:hover": {
                                    backgroundColor: theme.palette.action?.hover || "rgba(255, 255, 255, 0.08)",
                                },
                            }}
                            title={copySuccess ? "Copied!" : "Copy code"}
                        >
                            <Copy size={18} />
                        </IconButton>
                        <IconButton
                            onClick={handleDownloadCode}
                            size="small"
                            sx={{
                                color: theme.palette.text.secondary,
                                "&:hover": {
                                    backgroundColor: theme.palette.action?.hover || "rgba(255, 255, 255, 0.08)",
                                },
                            }}
                            title="Download code"
                        >
                            <Download size={18} />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                {cleanCode ? (
                    <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Editor
                            value={cleanCode}
                            highlight={(codeToHighlight) => highlightCode(codeToHighlight, language)}
                            padding={16}
                            readOnly // Make the editor read-only
                            style={{
                                width: "100%",
                                minHeight: "100%",
                                fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
                                fontSize: "0.9rem",
                                backgroundColor: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                lineHeight: "1.6em",
                                outline: "none",
                                border: "none",
                                boxSizing: "border-box",
                                tabSize: 2,
                            }}
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.secondary,
                            padding: 4,
                            textAlign: "center",
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ marginBottom: 1, opacity: 0.7 }}>
                                No Code Generated Yet
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.6 }}>
                                Enter a description and click "Generate Code" to see your AI-generated code here.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    )
}
