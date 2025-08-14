import { useState, useEffect, useRef, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import { useTheme } from "@mui/material/styles"
import { marked } from "marked"
import ExecutionResultPanel from "./components/ExecutionResultPanel"
import ProblemDescriptionPanel from "./components/ProblemDescriptionPanel"
import CodeEditorPanel from "./components/CodeEditorPanel"
import {programmingProblems} from "./data/programmingProblems";

// Configure marked once when the module loads
marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
})

export default function ProgrammingExercisePage() {
    const theme = useTheme()
    const [currentProblem, setCurrentProblem] = useState(null)
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState("javascript")
    const [executionResult, setExecutionResult] = useState(null)
    const [testResult, setTestResult] = useState(null)
    const [submissionInfo, setSubmissionInfo] = useState(null)
    const [showExecutionResult, setShowExecutionResult] = useState(false)

    // State for resizable panes (both desktop and mobile)
    const [leftPaneWidth, setLeftPaneWidth] = useState(50)
    const [mobileTopHeight, setMobileTopHeight] = useState(40) // Mobile top panel height in vh
    const [mobileBottomHeight, setMobileBottomHeight] = useState(30) // Mobile bottom panel (results) height in vh
    const [isDraggingTop, setIsDraggingTop] = useState(false)
    const [isDraggingBottom, setIsDraggingBottom] = useState(false)
    const isDragging = useRef(false)
    const dragType = useRef(null) // 'desktop', 'mobile-top', 'mobile-bottom'
    const startX = useRef(0)
    const startY = useRef(0)
    const startWidth = useRef(0)
    const startHeight = useRef(0)
    const containerRef = useRef(null)

    useEffect(() => {
        console.log("Component mounted, loading random problem...")
        loadRandomProblem()
    }, [])

    const loadRandomProblem = useCallback(() => {
        console.log("Loading random problem...")
        const randomIndex = Math.floor(Math.random() * programmingProblems.length)
        const problem = programmingProblems[randomIndex]

        console.log("Selected problem:", problem)
        console.log("Problem has test cases:", problem.testCases?.length || 0)

        setCurrentProblem(problem)
        setCode(problem.starterCode[language] || problem.starterCode.javascript)

        // Clear previous results
        setExecutionResult(null)
        setTestResult(null)
        setSubmissionInfo(null)
        setShowExecutionResult(false)
    }, [language])

    const handleCodeChange = useCallback((value) => {
        setCode(value)
    }, [])

    const handleLanguageChange = useCallback(
        (e) => {
            const newLanguage = e.target.value
            console.log("Language changed to:", newLanguage)
            setLanguage(newLanguage)
            if (currentProblem) {
                console.log("Updating code for new language:", newLanguage)
                setCode(currentProblem.starterCode[newLanguage] || currentProblem.starterCode.javascript)
            }
        },
        [currentProblem],
    )

    const handleSubmitCode = useCallback(() => {
        alert("Submitting code... (This is a mock function)")
    }, [])

    const handleExecutionResult = useCallback((result, testResult, submissionInfo = null) => {
        console.log("Received execution result:", result)
        console.log("Received test result:", testResult)
        console.log("Received submission info:", submissionInfo)

        setExecutionResult(result)
        setTestResult(testResult)
        setSubmissionInfo(submissionInfo)
        setShowExecutionResult(true)
    }, [])

    // Desktop resizable pane logic
    const handleDesktopMouseDown = useCallback(
        (e) => {
            e.preventDefault()
            isDragging.current = true
            dragType.current = "desktop"
            startX.current = e.clientX
            startWidth.current = leftPaneWidth
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        },
        [leftPaneWidth],
    )

    // Mobile top divider (problem description vs code editor)
    const handleMobileTopStart = useCallback(
        (e) => {
            e.preventDefault()
            e.stopPropagation()

            // Prevent page refresh and other default behaviors
            if (e.cancelable) {
                e.preventDefault()
            }

            isDragging.current = true
            dragType.current = "mobile-top"
            setIsDraggingTop(true)

            const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY
            startY.current = clientY
            startHeight.current = mobileTopHeight

            // Add event listeners
            document.addEventListener("touchmove", handleTouchMove, { passive: false })
            document.addEventListener("mousemove", handleMouseMove, { passive: false })
            document.addEventListener("touchend", handleMouseUp)
            document.addEventListener("mouseup", handleMouseUp)

            // Prevent scrolling during drag
            document.body.style.overflow = "hidden"
            document.body.style.touchAction = "none"
        },
        [mobileTopHeight],
    )

    // Mobile bottom divider (code editor vs results)
    const handleMobileBottomStart = useCallback(
        (e) => {
            e.preventDefault()
            e.stopPropagation()

            // Prevent page refresh and other default behaviors
            if (e.cancelable) {
                e.preventDefault()
            }

            isDragging.current = true
            dragType.current = "mobile-bottom"
            setIsDraggingBottom(true)

            const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY
            startY.current = clientY
            startHeight.current = mobileBottomHeight

            // Add event listeners
            document.addEventListener("touchmove", handleTouchMove, { passive: false })
            document.addEventListener("mousemove", handleMouseMove, { passive: false })
            document.addEventListener("touchend", handleMouseUp)
            document.addEventListener("mouseup", handleMouseUp)

            // Prevent scrolling during drag
            document.body.style.overflow = "hidden"
            document.body.style.touchAction = "none"
        },
        [mobileBottomHeight],
    )

    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current) return

        e.preventDefault()

        if (dragType.current === "desktop") {
            const containerWidth = containerRef.current?.offsetWidth
            if (!containerWidth) return

            const deltaX = e.clientX - startX.current
            const newWidth = (((startWidth.current * containerWidth) / 100 + deltaX) / containerWidth) * 100
            setLeftPaneWidth(Math.max(20, Math.min(80, newWidth)))
        }
    }, [])

    const handleTouchMove = useCallback((e) => {
        if (!isDragging.current) return

        // Prevent default touch behaviors
        e.preventDefault()
        e.stopPropagation()

        const containerHeight = window.innerHeight - 200 // Account for header/footer
        const currentY = e.touches[0].clientY
        const deltaY = currentY - startY.current

        if (dragType.current === "mobile-top") {
            const newHeight = (((startHeight.current * containerHeight) / 100 + deltaY) / containerHeight) * 100
            setMobileTopHeight(Math.max(20, Math.min(70, newHeight)))
        } else if (dragType.current === "mobile-bottom") {
            const newHeight = (((startHeight.current * containerHeight) / 100 - deltaY) / containerHeight) * 100
            setMobileBottomHeight(Math.max(15, Math.min(55, newHeight)))
        }
    }, [])

    const handleMouseUp = useCallback(() => {
        isDragging.current = false
        dragType.current = null
        setIsDraggingTop(false)
        setIsDraggingBottom(false)

        // Restore scrolling
        document.body.style.overflow = ""
        document.body.style.touchAction = ""

        // Remove all event listeners
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchend", handleMouseUp)
    }, [handleMouseMove, handleTouchMove])

    // Debug current state
    console.log("Current render state:")
    console.log("- currentProblem:", currentProblem?.title || "undefined")
    console.log("- language:", language)
    console.log("- code length:", code.length)

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

            {/* Mobile Layout */}
            <Box
                sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "column",
                    flexGrow: 1,
                    overflow: "hidden",
                    height: "calc(100vh - 120px)", // Account for header and footer
                }}
            >
                {/* Problem Description - Mobile */}
                <Box
                    sx={{
                        height: `${mobileTopHeight}vh`,
                        overflow: "hidden",
                        padding: 2,
                        paddingBottom: 0,
                    }}
                >
                    <ProblemDescriptionPanel currentProblem={currentProblem} theme={theme} />
                </Box>

                {/* Mobile Top Divider - Enhanced for touch */}
                <Box
                    onMouseDown={handleMobileTopStart}
                    onTouchStart={handleMobileTopStart}
                    sx={{
                        height: "20px", // Increased height for easier touch
                        cursor: "ns-resize",
                        backgroundColor: isDraggingTop ? theme.palette.primary.main : theme.palette.divider,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 10,
                        // Enhanced touch area
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "-10px",
                            bottom: "-10px",
                            left: 0,
                            right: 0,
                            backgroundColor: "transparent",
                        },
                        "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                        },
                        "&:active": {
                            backgroundColor: theme.palette.primary.main,
                        },
                        // Prevent text selection during drag
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        // Prevent touch callout
                        WebkitTouchCallout: "none",
                        // Prevent touch highlighting
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    {/* Enhanced drag handle indicator */}
                    <Box
                        sx={{
                            width: "60px", // Wider for easier touch
                            height: "6px", // Thicker for better visibility
                            backgroundColor: isDraggingTop ? "white" : theme.palette.text.secondary,
                            borderRadius: "3px",
                            transition: "all 0.2s ease",
                        }}
                    />
                </Box>

                {/* Code Editor and Results - Mobile */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        padding: 2,
                        paddingTop: 0,
                    }}
                >
                    {/* Code Editor - Mobile */}
                    <Box
                        sx={{
                            height: showExecutionResult ? `${70 - mobileBottomHeight}vh` : "100%",
                            overflow: "hidden",
                            marginBottom: showExecutionResult ? 0 : 2,
                        }}
                    >
                        <CodeEditorPanel
                            code={code}
                            handleCodeChange={handleCodeChange}
                            language={language}
                            handleLanguageChange={handleLanguageChange}
                            handleSubmitCode={handleSubmitCode}
                            loadRandomProblem={loadRandomProblem}
                            theme={theme}
                            onExecutionResult={handleExecutionResult}
                            currentProblem={currentProblem}
                        />
                    </Box>

                    {/* Mobile Results Divider - Enhanced for touch */}
                    {showExecutionResult && (
                        <Box
                            onMouseDown={handleMobileBottomStart}
                            onTouchStart={handleMobileBottomStart}
                            sx={{
                                height: "20px", // Increased height for easier touch
                                cursor: "ns-resize",
                                backgroundColor: isDraggingBottom ? theme.palette.primary.main : theme.palette.divider,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                zIndex: 10,
                                // Enhanced touch area
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: "-10px",
                                    bottom: "-10px",
                                    left: 0,
                                    right: 0,
                                    backgroundColor: "transparent",
                                },
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                                "&:active": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                                // Prevent text selection during drag
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                // Prevent touch callout
                                WebkitTouchCallout: "none",
                                // Prevent touch highlighting
                                WebkitTapHighlightColor: "transparent",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "60px", // Wider for easier touch
                                    height: "6px", // Thicker for better visibility
                                    backgroundColor: isDraggingBottom ? "white" : theme.palette.text.secondary,
                                    borderRadius: "3px",
                                    transition: "all 0.2s ease",
                                }}
                            />
                        </Box>
                    )}

                    {/* Execution Result Panel - Mobile */}
                    {showExecutionResult && (
                        <Box sx={{ height: `${mobileBottomHeight}vh`, overflow: "auto" }}>
                            <ExecutionResultPanel
                                result={executionResult}
                                testResult={testResult}
                                isVisible={showExecutionResult}
                                submissionInfo={submissionInfo}
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Desktop Layout */}
            <Box
                ref={containerRef}
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexGrow: 1,
                    padding: { sm: 3, md: 4 },
                    boxSizing: "border-box",
                    flexDirection: "row",
                    gap: 0,
                }}
            >
                {/* Left Panel: Problem Description */}
                <Box
                    sx={{
                        width: `${leftPaneWidth}%`,
                        flexShrink: 0,
                        overflow: "hidden",
                    }}
                >
                    <ProblemDescriptionPanel currentProblem={currentProblem} theme={theme} />
                </Box>

                {/* Desktop Divider */}
                <Box
                    onMouseDown={handleDesktopMouseDown}
                    sx={{
                        width: "8px",
                        cursor: "ew-resize",
                        backgroundColor: theme.palette.divider,
                        flexShrink: 0,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                />

                {/* Right Panel: Code Editor and Controls */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <CodeEditorPanel
                        code={code}
                        handleCodeChange={handleCodeChange}
                        language={language}
                        handleLanguageChange={handleLanguageChange}
                        handleSubmitCode={handleSubmitCode}
                        loadRandomProblem={loadRandomProblem}
                        theme={theme}
                        onExecutionResult={handleExecutionResult}
                        currentProblem={currentProblem}
                    />

                    {/* Execution Result Panel */}
                    <ExecutionResultPanel
                        result={executionResult}
                        testResult={testResult}
                        isVisible={showExecutionResult}
                        submissionInfo={submissionInfo}
                    />
                </Box>
            </Box>

            <Footer />
        </Box>
    )
}
