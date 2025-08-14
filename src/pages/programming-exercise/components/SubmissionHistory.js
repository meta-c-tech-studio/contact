"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    Chip,
    Divider,
    IconButton,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { History, CheckCircle, RefreshCw } from "lucide-react"

const SubmissionHistory = forwardRef((props, ref) => {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [submissions, setSubmissions] = useState([])

    // Function to load submissions from localStorage
    const loadSubmissions = () => {
        const savedSubmissions = JSON.parse(localStorage.getItem("codeSubmissions") || "[]")
        setSubmissions(savedSubmissions.reverse()) // Show newest first
    }

    // Expose refresh function to parent components
    useImperativeHandle(ref, () => ({
        refresh: loadSubmissions,
    }))

    // Load submissions when dialog opens
    useEffect(() => {
        if (open) {
            loadSubmissions()
        }
    }, [open])

    // Load submissions on component mount
    useEffect(() => {
        loadSubmissions()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleRefresh = () => {
        loadSubmissions()
    }

    const clearHistory = () => {
        localStorage.removeItem("codeSubmissions")
        setSubmissions([])
    }

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<History size={16} />}
                onClick={handleOpen}
                sx={{
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    padding: { xs: "6px 12px", sm: "8px 16px" },
                    minWidth: { xs: "auto", sm: "64px" },
                    "&:hover": {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                    },
                }}
            >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    History
                </Box>
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                    ({submissions.length})
                </Box>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {submissions.length > 0 && ` (${submissions.length})`}
                </Box>
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <History size={20} />
                        Submission History ({submissions.length})
                    </Box>
                    <IconButton onClick={handleRefresh} size="small" title="Refresh">
                        <RefreshCw size={16} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {submissions.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                No submissions yet. Solve some problems to see your history!
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {submissions.map((submission, index) => (
                                <Box key={`${submission.submittedAt}-${index}`}>
                                    <ListItem sx={{ flexDirection: "column", alignItems: "flex-start", py: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, width: "100%" }}>
                                            <CheckCircle size={16} color="#4caf50" />
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {submission.problemTitle}
                                            </Typography>
                                            <Chip
                                                label={submission.language}
                                                size="small"
                                                sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Submitted: {submission.submittedAt}
                                        </Typography>

                                        <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
                                            <Typography variant="body2">
                                                ✅ {submission.testResults.passedTests}/{submission.testResults.totalTests} test cases passed
                                            </Typography>
                                            {submission.executionTime && (
                                                <Typography variant="body2">⏱️ {submission.executionTime}</Typography>
                                            )}
                                            {submission.memory && <Typography variant="body2">💾 {submission.memory}</Typography>}
                                        </Box>

                                        <Paper
                                            sx={{
                                                p: 1,
                                                backgroundColor: theme.palette.background.default,
                                                width: "100%",
                                                maxHeight: "150px",
                                                overflow: "auto",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                component="pre"
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontSize: "0.8rem",
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {submission.code}
                                            </Typography>
                                        </Paper>
                                    </ListItem>
                                    {index < submissions.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    {submissions.length > 0 && (
                        <Button onClick={clearHistory} color="error">
                            Clear History
                        </Button>
                    )}
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
})

SubmissionHistory.displayName = "SubmissionHistory"

export default SubmissionHistory
