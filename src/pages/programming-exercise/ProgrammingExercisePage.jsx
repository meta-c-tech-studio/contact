import { useState, useEffect, useRef, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import { useTheme } from "@mui/material/styles"
import { marked } from "marked" // Import marked for Markdown parsing

// Import the new decoupled components
import ProblemDescriptionPanel from "./components/ProblemDescriptionPanel.jsx"
import CodeEditorPanel from "./components/CodeEditorPanel.jsx"
import {programmingProblems} from "./data/programmingProblems";

// Configure marked once when the module loads
marked.setOptions({
    gfm: true, // Enable GitHub Flavored Markdown
    breaks: true, // Enable GFM line breaks (renders newlines as <br>)
    pedantic: false, // Don't be pedantic
    sanitize: true, // Sanitize HTML output (important for security when using dangerouslySetInnerHTML)
    smartLists: true, // Use smarter list behavior
    smartypants: false, // Don't use "smart" typographic punctuation for quotes and dashes
})

export default function ProgrammingExercisePage() {
    const theme = useTheme()
    const [currentProblem, setCurrentProblem] = useState(null)
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState("javascript") // Default language

    // State for resizable panes
    const [leftPaneWidth, setLeftPaneWidth] = useState(50) // Initial width in percentage
    const isDragging = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(0)
    const containerRef = useRef(null)

    useEffect(() => {
        loadRandomProblem()
    }, [])

    const loadRandomProblem = () => {
        const randomIndex = Math.floor(Math.random() * programmingProblems.length)
        const problem = programmingProblems[randomIndex]
        setCurrentProblem(problem)
        // Set starter code for the problem based on the current language
        setCode(problem.starterCode[language] || problem.starterCode.javascript) // Fallback to JS if language not found
    }

    const handleCodeChange = useCallback((value) => {
        setCode(value)
    }, [])

    const handleLanguageChange = useCallback(
        (e) => {
            const newLanguage = e.target.value
            setLanguage(newLanguage)
            // Update code with starter code for the new language
            if (currentProblem) {
                setCode(currentProblem.starterCode[newLanguage] || currentProblem.starterCode.javascript) // Fallback to JS
            }
        },
        [currentProblem],
    ) // Add currentProblem to dependencies

    const handleRunCode = useCallback(() => {
        alert("Running code... (This is a mock function)")
    }, [])

    const handleSubmitCode = useCallback(() => {
        alert("Submitting code... (This is a mock function)")
    }, [])

    // Resizable pane logic
    const handleMouseDown = useCallback(
        (e) => {
            isDragging.current = true
            startX.current = e.clientX
            startWidth.current = leftPaneWidth
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        },
        [leftPaneWidth],
    )

    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current) return

        const containerWidth = containerRef.current.offsetWidth
        if (!containerWidth) return

        const deltaX = e.clientX - startX.current
        const newWidth = (((startWidth.current * containerWidth) / 100 + deltaX) / containerWidth) * 100

        // Clamp width between 20% and 80%
        setLeftPaneWidth(Math.max(20, Math.min(80, newWidth)))
    }, [])

    const handleMouseUp = useCallback(() => {
        isDragging.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }, [handleMouseMove])

    if (!currentProblem) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                }}
            >
                <Typography variant="h4">Loading problem...</Typography>
            </Box>
        )
    }

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
                ref={containerRef}
                sx={{
                    flexGrow: 1,
                    padding: { xs: 2, sm: 3, md: 4 },
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" }, // Stack vertically on small, side-by-side on medium+
                    gap: { xs: 2, md: 0 }, // Gap between panes
                }}
            >
                {/* Left Panel: Problem Description */}
                <Box
                    sx={{
                        width: { xs: "100%", md: `${leftPaneWidth}%` },
                        flexShrink: 0,
                        overflow: "hidden",
                        height: { xs: "50vh", md: "auto" }, // Fixed height on small screens
                    }}
                >
                    <ProblemDescriptionPanel currentProblem={currentProblem} theme={theme} />
                </Box>

                {/* Divider */}
                <Box
                    onMouseDown={handleMouseDown}
                    sx={{
                        width: { xs: "100%", md: "8px" }, // Full width on small, 8px on medium+
                        height: { xs: "8px", md: "auto" }, // 8px height on small, auto on medium+
                        cursor: { xs: "ns-resize", md: "ew-resize" }, // Vertical resize on small, horizontal on medium+
                        backgroundColor: theme.palette.divider,
                        flexShrink: 0,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.main, // Highlight on hover
                        },
                    }}
                />

                {/* Right Panel: Code Editor and Controls */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        height: { xs: "50vh", md: "auto" }, // Fixed height on small screens
                    }}
                >
                    <CodeEditorPanel
                        code={code}
                        handleCodeChange={handleCodeChange}
                        language={language}
                        handleLanguageChange={handleLanguageChange}
                        handleRunCode={handleRunCode}
                        handleSubmitCode={handleSubmitCode}
                        loadRandomProblem={loadRandomProblem}
                        theme={theme}
                    />
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}
