"use client"

import { Box, Typography, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Lock } from "lucide-react"

export default function TwoCommittedBlog() {
    const theme = useTheme()

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: "0 auto",
                padding: { xs: 3, sm: 5, md: 8 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                color: theme.palette.text.primary,
                position: "relative",
            }}
        >
            <Box
                sx={{
                    maxHeight: "33.33vh",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    2-Phase Commit (2PC)
                </Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, marginBottom: 4 }}>
                    Updated on August 24, 2025 - Personal Research Notes
                </Typography>

                {/* Insert the 2PC diagram */}
                {/*<Box sx={{ width: "100%", marginBottom: 4, textAlign: "center" }}>*/}
                {/*    <img*/}
                {/*        src="/blogs/2pc.png"*/}
                {/*        alt="2-Phase Commit Protocol"*/}
                {/*        style={{*/}
                {/*            maxWidth: "100%",*/}
                {/*            height: "auto",*/}
                {/*            borderRadius: "8px",*/}
                {/*            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Box>*/}

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The Two-Phase Commit (2PC) protocol is a classic consensus mechanism in distributed databases. It ensures that
                    a transaction is either committed by all participants or rolled back entirely, maintaining atomicity across
                    distributed systems.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Phase 1: Prepare / Voting
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The coordinator asks all participants if they can commit the transaction. Each participant responds with
                    either <strong>"Yes"</strong> (ready to commit) or <strong>"No"</strong> (abort).
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Phase 2: Commit / Abort
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    If all participants vote <strong>Yes</strong>, the coordinator broadcasts a commit request. If any vote
                    <strong>No</strong>, the coordinator sends an abort request to all participants.
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    <strong>Key Challenges:</strong>
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Blocking:</strong> If the coordinator fails, participants may be left in uncertain state
                    <br />• <strong>Single Point of Failure:</strong> Coordinator crash can halt progress
                    <br />• <strong>Network Partitions:</strong> Communication loss may lead to inconsistencies
                </Typography>

                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    2PC in Practice
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Despite its limitations, 2PC is still widely used in distributed databases and transaction systems.
                    Many modern systems extend 2PC with optimizations like 3PC (Three-Phase Commit) or use alternative
                    consensus protocols such as Paxos or Raft to overcome blocking issues.
                </Typography>

                {/* Gradient overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100px",
                        background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
                        pointerEvents: "none",
                    }}
                />
            </Box>

            {/* Locked Content Button */}
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
                <Button
                    variant="contained"
                    disabled
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <Lock size={20} />
                </Button>
            </Box>
        </Box>
    )
}
