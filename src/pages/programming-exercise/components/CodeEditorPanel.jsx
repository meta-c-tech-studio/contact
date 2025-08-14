import { Box, Button, Paper, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material"
import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/themes/prism-dark.css"
import { useCallback, useState, useRef } from "react"
import codeExecutionService from "../../../services/codeExecutionService.js"
import testCaseValidator from "../../../services/testCaseValidator.js"
import SubmissionHistory from "./SubmissionHistory";

export default function CodeEditorPanel({
                                            code,
                                            handleCodeChange,
                                            language,
                                            handleLanguageChange,
                                            handleSubmitCode,
                                            loadRandomProblem,
                                            theme,
                                            onExecutionResult,
                                            currentProblem,
                                        }) {
    const [isExecuting, setIsExecuting] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const submissionHistoryRef = useRef()

    const highlightCode = (codeToHighlight, lang) => {
        const languageGrammar = languages[lang] || languages.javascript
        return highlight(codeToHighlight, languageGrammar, lang)
    }

    const handleRunCode = useCallback(async () => {
        console.log("=== RUN CODE DEBUG ===")
        console.log("Starting code execution...")
        console.log("Current problem:", currentProblem)
        console.log("Code to execute:", code)
        console.log("Language:", language)

        setIsExecuting(true)

        try {
            console.log("Calling codeExecutionService.executeCode...")
            const result = await codeExecutionService.executeCode(code, language)

            console.log("Execution result:", result)
            console.log("Execution successful:", result.success)
            console.log("Execution output:", result.output)

            // Always try to validate test cases if we have them
            let testResult = null
            if (currentProblem?.testCases && currentProblem.testCases.length > 0) {
                console.log("Found test cases, starting validation...")
                console.log("Test cases:", currentProblem.testCases)

                try {
                    testResult = testCaseValidator.validateTestCases(result.output || "", currentProblem.testCases)
                    console.log("Test validation result:", testResult)
                } catch (validationError) {
                    console.error("Validation error:", validationError)
                    testResult = {
                        accepted: false,
                        passedTests: 0,
                        totalTests: currentProblem.testCases.length,
                        results: [],
                        error: `Validation failed: ${validationError.message}`,
                    }
                }
            } else {
                console.log("No test cases found for current problem")
            }

            console.log("Calling onExecutionResult with:", { result, testResult })

            if (onExecutionResult) {
                onExecutionResult(result, testResult, { type: "run" })
            }
        } catch (error) {
            console.error("Execution error:", error)
            if (onExecutionResult) {
                onExecutionResult(
                    {
                        success: false,
                        error: error.message,
                        output: "",
                        executionTime: null,
                        memory: null,
                    },
                    {
                        accepted: false,
                        passedTests: 0,
                        totalTests: currentProblem?.testCases?.length || 0,
                        results: [],
                        error: `Execution failed: ${error.message}`,
                    },
                    { type: "run" },
                )
            }
        } finally {
            setIsExecuting(false)
            console.log("=== END RUN CODE DEBUG ===")
        }
    }, [code, language, onExecutionResult, currentProblem])

    const handleSubmit = useCallback(async () => {
        console.log("=== SUBMIT CODE ===")
        setIsSubmitting(true)

        try {
            // First, run the code to get results
            const result = await codeExecutionService.executeCode(code, language)

            // Validate test cases
            let testResult = null
            if (currentProblem?.testCases && currentProblem.testCases.length > 0) {
                testResult = testCaseValidator.validateTestCases(result.output || "", currentProblem.testCases)
            }

            // Prepare submission metadata
            const submissionTime = new Date().toLocaleString()
            let submissionStatus = "failed"
            let submissionMessage = ""

            // Check submission validity and prepare messages
            if (!result.success) {
                submissionStatus = "error"
                submissionMessage = "Your code has compilation or runtime errors. Please fix them before submitting."
            } else if (!testResult || !testResult.accepted) {
                const passedCount = testResult?.passedTests || 0
                const totalCount = testResult?.totalTests || 0
                submissionStatus = "failed"
                submissionMessage = `Your solution failed ${totalCount - passedCount} out of ${totalCount} test cases. Please review your code and try again.`
            } else {
                // Success case
                submissionStatus = "success"
                submissionMessage = `Congratulations! All ${testResult.totalTests} test cases passed. Your solution has been saved successfully.`

                const submissionData = {
                    problemId: currentProblem.id,
                    problemTitle: currentProblem.title,
                    language: language,
                    code: code,
                    submittedAt: submissionTime,
                    testResults: testResult,
                    executionTime: result.executionTime,
                    memory: result.memory,
                }

                // Store submission in localStorage (in a real app, this would go to a backend)
                const existingSubmissions = JSON.parse(localStorage.getItem("codeSubmissions") || "[]")
                existingSubmissions.push(submissionData)
                localStorage.setItem("codeSubmissions", JSON.stringify(existingSubmissions))

                console.log("Submission successful:", submissionData)

                // Refresh the submission history component
                if (submissionHistoryRef.current) {
                    submissionHistoryRef.current.refresh()
                }
            }

            // Update the execution result panel with submission info
            if (onExecutionResult) {
                onExecutionResult(result, testResult, {
                    type: "submit",
                    status: submissionStatus,
                    message: submissionMessage,
                    submittedAt: submissionTime,
                })
            }
        } catch (error) {
            console.error("Submission error:", error)
            if (onExecutionResult) {
                onExecutionResult(
                    {
                        success: false,
                        error: error.message,
                        output: "",
                        executionTime: null,
                        memory: null,
                    },
                    {
                        accepted: false,
                        passedTests: 0,
                        totalTests: currentProblem?.testCases?.length || 0,
                        results: [],
                        error: `Submission failed: ${error.message}`,
                    },
                    {
                        type: "submit",
                        status: "error",
                        message: `There was an error processing your submission: ${error.message}. Please try again.`,
                        submittedAt: new Date().toLocaleString(),
                    },
                )
            }
        } finally {
            setIsSubmitting(false)
            console.log("=== END SUBMIT CODE ===")
        }
    }, [code, language, currentProblem, onExecutionResult])

    // Calculate dynamic height based on code content for mobile
    const calculateMobileEditorHeight = () => {
        const lines = code.split("\n").length
        const minLines = 8 // Minimum visible lines
        const maxLines = 20 // Maximum lines before scrolling
        const actualLines = Math.max(minLines, Math.min(maxLines, lines + 2)) // +2 for some padding
        return `${actualLines * 1.5}rem` // 1.5rem per line
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
                // Mobile: Enable internal scrolling for entire panel
                overflow: { xs: "auto", md: "hidden" },
                WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
            }}
        >
            {/* Mobile: Scrollable content container */}
            <Box
                sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "column",
                    minHeight: "100%", // Allow content to expand
                }}
            >
                {/* Header Section - Mobile */}
                <Box
                    sx={{
                        padding: 1.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        flexShrink: 0, // Prevent header from shrinking
                    }}
                >
                    {/* Language Selector */}
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="language-select-label-mobile">Language</InputLabel>
                        <Select
                            labelId="language-select-label-mobile"
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

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
                        <SubmissionHistory ref={submissionHistoryRef} />
                        <Button
                            variant="outlined"
                            onClick={loadRandomProblem}
                            sx={{
                                color: theme.palette.primary.main,
                                borderColor: theme.palette.primary.main,
                                fontSize: "0.8rem",
                                padding: "6px 12px",
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.text.primary,
                                },
                            }}
                        >
                            New
                        </Button>
                    </Box>
                </Box>

                {/* Code Editor - Mobile with dynamic height */}
                <Box
                    sx={{
                        flexShrink: 0, // Don't shrink the editor
                        height: calculateMobileEditorHeight(), // Dynamic height based on content
                        maxHeight: "50vh", // Maximum height to prevent taking too much space
                        overflow: "hidden", // Let the editor handle its own scrolling
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Editor
                        value={code}
                        onValueChange={handleCodeChange}
                        highlight={(codeToHighlight) => highlightCode(codeToHighlight, language)}
                        padding={16}
                        style={{
                            width: "100%",
                            height: "100%",
                            fontFamily: "monospace",
                            fontSize: "0.9rem",
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            lineHeight: "1.5em",
                            outline: "none",
                            border: "none",
                            boxSizing: "border-box",
                            overflow: "auto", // Enable scrolling within editor if needed
                        }}
                    />
                </Box>

                {/* Bottom Action Buttons - Mobile (always visible) */}
                <Box
                    sx={{
                        padding: 1.5,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        flexShrink: 0, // Prevent buttons from shrinking
                        marginTop: "auto", // Push buttons to bottom
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleRunCode}
                        disabled={isExecuting || isSubmitting}
                        startIcon={isExecuting ? <CircularProgress size={16} /> : null}
                        fullWidth
                        sx={{
                            fontSize: "0.9rem",
                            padding: "12px",
                        }}
                    >
                        {isExecuting ? "Running..." : "Run Code"}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isExecuting || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
                        fullWidth
                        sx={{
                            fontSize: "0.9rem",
                            padding: "12px",
                        }}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </Box>
            </Box>

            {/* Desktop Layout - Keep original structure */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* Header Section - Desktop */}
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
                        <InputLabel id="language-select-label-desktop">Language</InputLabel>
                        <Select
                            labelId="language-select-label-desktop"
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

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <SubmissionHistory ref={submissionHistoryRef} />
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
                </Box>

                {/* Code Editor - Desktop */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Editor
                            value={code}
                            onValueChange={handleCodeChange}
                            highlight={(codeToHighlight) => highlightCode(codeToHighlight, language)}
                            padding={16}
                            style={{
                                width: "100%",
                                minHeight: "100%",
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                backgroundColor: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                lineHeight: "1.5em",
                                outline: "none",
                                border: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </Box>
                </Box>

                {/* Bottom Action Buttons - Desktop */}
                <Box
                    sx={{
                        padding: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleRunCode}
                        disabled={isExecuting || isSubmitting}
                        startIcon={isExecuting ? <CircularProgress size={16} /> : null}
                    >
                        {isExecuting ? "Running..." : "Run Code"}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isExecuting || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}
