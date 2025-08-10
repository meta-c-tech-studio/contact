import { Box, Button, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/themes/prism-dark.css" // Import a dark theme for Prism.js

export default function CodeEditorPanel({
                                            code,
                                            handleCodeChange,
                                            language,
                                            handleLanguageChange,
                                            handleRunCode,
                                            handleSubmitCode,
                                            loadRandomProblem,
                                            theme,
                                        }) {
    const highlightCode = (codeToHighlight, lang) => {
        // Ensure the language is loaded, default to javascript if not found
        const languageGrammar = languages[lang] || languages.javascript
        return highlight(codeToHighlight, languageGrammar, lang)
    }

    return (
        <Paper
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
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
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        label="Language"
                        onChange={handleLanguageChange}
                        sx={{
                            color: theme.palette.text.primary,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
                        }}
                    >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={loadRandomProblem}
                    sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.primary,
                        },
                    }}
                >
                    New Problem
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                <Editor
                    value={code}
                    onValueChange={handleCodeChange}
                    highlight={(codeToHighlight) => highlightCode(codeToHighlight, language)}
                    padding={16}
                    style={{
                        flexGrow: 1,
                        width: "100%",
                        minHeight: "100%", // Ensure editor takes full height
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        backgroundColor: theme.palette.background.default, // Darker background for editor
                        color: theme.palette.text.primary,
                        lineHeight: "1.5em",
                        outline: "none",
                        border: "none",
                        boxSizing: "border-box",
                        // Override Prism.js default background if necessary
                        "& .token.comment": { color: "#6a9955" }, // Example: custom comment color
                        "& .token.keyword": { color: "#569cd6" }, // Example: custom keyword color
                        // Add more custom styles for Prism tokens if needed
                    }}
                />
            </Box>
            <Box
                sx={{
                    padding: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >
                <Button variant="outlined" onClick={handleRunCode}>
                    Run Code
                </Button>
                <Button variant="contained" onClick={handleSubmitCode}>
                    Submit
                </Button>
            </Box>
        </Paper>
    )
}
