import { Box, Typography, Paper, Chip, Accordion, AccordionSummary, AccordionDetails, Alert } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import {
    CheckCircle,
    XCircle,
    Clock,
    MemoryStickIcon as Memory,
    ChevronDown,
    Trophy,
    AlertTriangle,
} from "lucide-react"

export default function ExecutionResultPanel({ result, testResult, isVisible, submissionInfo }) {
    const theme = useTheme()

    if (!isVisible || !result) {
        return null
    }

    const getStatusColor = () => {
        if (submissionInfo?.type === "submit") {
            switch (submissionInfo.status) {
                case "success":
                    return theme.palette.success?.main || "#4caf50"
                case "failed":
                    return theme.palette.warning?.main || "#ff9800"
                case "error":
                    return theme.palette.error?.main || "#f44336"
                default:
                    return theme.palette.error?.main || "#f44336"
            }
        }
        if (testResult?.accepted) return theme.palette.success?.main || "#4caf50"
        return theme.palette.error?.main || "#f44336"
    }

    const getStatusIcon = () => {
        if (submissionInfo?.type === "submit") {
            switch (submissionInfo.status) {
                case "success":
                    return <Trophy size={20} />
                case "failed":
                    return <AlertTriangle size={20} />
                case "error":
                    return <XCircle size={20} />
                default:
                    return <XCircle size={20} />
            }
        }
        return testResult?.accepted ? <CheckCircle size={20} /> : <XCircle size={20} />
    }

    const getStatusText = () => {
        if (submissionInfo?.type === "submit") {
            switch (submissionInfo.status) {
                case "success":
                    return "Submission Accepted"
                case "failed":
                    return "Submission Failed"
                case "error":
                    return "Submission Error"
                default:
                    return "Submission Failed"
            }
        }
        if (!result.success) return "Execution Failed"
        if (!testResult) return "Executed Successfully"
        return testResult.accepted ? "Accepted" : "Wrong Answer"
    }

    const getStatusDescription = () => {
        if (submissionInfo?.type === "submit") {
            return submissionInfo.message
        }
        return result.statusDescription
    }

    return (
        <Paper
            sx={{
                marginTop: 2,
                padding: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                border: `2px solid ${getStatusColor()}`,
            }}
        >
            {/* Status Header */}
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2, gap: 1 }}>
                {getStatusIcon()}
                <Typography
                    variant="h6"
                    sx={{
                        color: getStatusColor(),
                        fontWeight: 600,
                    }}
                >
                    {getStatusText()}
                </Typography>
                {submissionInfo?.type === "submit" && (
                    <Chip
                        label="SUBMITTED"
                        size="small"
                        sx={{
                            backgroundColor: getStatusColor(),
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                        }}
                    />
                )}
            </Box>

            {/* Submission Message */}
            {submissionInfo?.type === "submit" && submissionInfo.message && (
                <Alert
                    severity={
                        submissionInfo.status === "success" ? "success" : submissionInfo.status === "failed" ? "warning" : "error"
                    }
                    sx={{ marginBottom: 2 }}
                >
                    <Typography variant="body2">{submissionInfo.message}</Typography>
                    {submissionInfo.submittedAt && (
                        <Typography variant="caption" sx={{ display: "block", marginTop: 1, opacity: 0.8 }}>
                            Submitted at: {submissionInfo.submittedAt}
                        </Typography>
                    )}
                </Alert>
            )}

            {/* Test Cases Results */}
            {testResult && (
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, marginBottom: 2 }}>
                        Test Cases: {testResult.passedTests}/{testResult.totalTests} Passed
                    </Typography>

                    {testResult.results.map((test, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: 2,
                                padding: 2,
                                backgroundColor: test.passed ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                                borderRadius: 1,
                                border: `1px solid ${test.passed ? "#4caf50" : "#f44336"}`,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                {test.passed ? <CheckCircle size={16} color="#4caf50" /> : <XCircle size={16} color="#f44336" />}
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Test Case {test.testCase}: {test.passed ? "PASSED" : "FAILED"}
                                </Typography>
                            </Box>

                            <Typography variant="body2" sx={{ marginBottom: 1, color: theme.palette.text.secondary }}>
                                {test.description}
                            </Typography>

                            <Box
                                sx={{
                                    fontFamily: "monospace",
                                    fontSize: "0.85rem",
                                    backgroundColor: theme.palette.background.default,
                                    padding: 1,
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="body2" sx={{ marginBottom: 0.5 }}>
                                    <strong>Input:</strong> {test.input}
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 0.5 }}>
                                    <strong>Expected:</strong> <span style={{ color: "#4caf50" }}>{test.expected}</span>
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Actual:</strong>{" "}
                                    <span style={{ color: test.passed ? "#4caf50" : "#f44336" }}>{test.actual}</span>
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Execution Info */}
            {(result.executionTime || result.memory) && (
                <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    {result.executionTime && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Clock size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {result.executionTime}
                            </Typography>
                        </Box>
                    )}
                    {result.memory && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Memory size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {result.memory}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* Raw Output */}
            {result.output && (
                <Accordion sx={{ marginBottom: 2 }}>
                    <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                        <Typography variant="subtitle2">Raw Output</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Paper
                            sx={{
                                padding: 2,
                                backgroundColor: theme.palette.background.default,
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                whiteSpace: "pre-wrap",
                                maxHeight: "200px",
                                overflowY: "auto",
                            }}
                        >
                            <Typography variant="body2" component="pre" sx={{ color: theme.palette.text.primary, margin: 0 }}>
                                {result.output}
                            </Typography>
                        </Paper>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* Error Messages */}
            {(result.error || testResult?.error) && (
                <Box>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.error.main, marginBottom: 1 }}>
                        Error Message:
                    </Typography>
                    <Paper
                        sx={{
                            padding: 2,
                            backgroundColor: theme.palette.background.default,
                            fontFamily: "monospace",
                            fontSize: "0.9rem",
                            whiteSpace: "pre-wrap",
                            maxHeight: "200px",
                            overflowY: "auto",
                            border: `1px solid ${theme.palette.error.main}`,
                        }}
                    >
                        <Typography variant="body2" component="pre" sx={{ color: theme.palette.error.main, margin: 0 }}>
                            {/*{result.error || testResult?.error}*/}
                            Limited credit, try again later.
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Paper>
    )
}
