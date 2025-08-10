import { Box, Button, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material"

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
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <textarea
            value={code}
            onChange={handleCodeChange}
            style={{
                flexGrow: 1,
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: theme.palette.background.default, // Darker background for editor
                color: theme.palette.text.primary,
                fontFamily: "monospace",
                fontSize: "0.9rem",
                padding: "16px",
                resize: "none", // Disable textarea resize
                boxSizing: "border-box",
            }}
            spellCheck="false"
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
