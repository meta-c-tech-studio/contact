import { Box, Typography, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Lock } from "lucide-react"

export default function RaftAlgorithmBlog() {
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
                    maxHeight: "1.33vh",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    Raft Consensus
                </Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, marginBottom: 4 }}>
                    Updated on August 24, 2025 - Personal Research Notes
                </Typography>

                {/* Insert Raft diagram */}
                {/*<Box sx={{ width: "100%", marginBottom: 4, textAlign: "center" }}>*/}
                {/*    <img*/}
                {/*        src="/blogs/raft.png"*/}
                {/*        alt="Raft Consensus Algorithm"*/}
                {/*        style={{*/}
                {/*            maxWidth: "100%",*/}
                {/*            height: "auto",*/}
                {/*            borderRadius: "8px",*/}
                {/*            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Box>*/}

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Raft is a consensus algorithm designed to be more understandable than Paxos while ensuring distributed
                    system consistency. It is widely used in modern distributed databases and systems like Etcd, Consul, and
                    Kubernetes.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Roles in Raft
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Raft divides nodes into three roles:
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Leader:</strong> Handles client requests, log replication, and cluster coordination
                    <br />• <strong>Followers:</strong> Passive nodes that accept log entries from the leader
                    <br />• <strong>Candidates:</strong> Nodes that can start leader elections when no leader is detected
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Key Mechanisms
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    • <strong>Leader Election:</strong> When a follower times out, it becomes a candidate and requests votes.
                    Majority voting ensures one leader.
                    <br />• <strong>Log Replication:</strong> Leader appends client commands to its log and replicates them
                    to followers. Once a majority acknowledges, the entry is committed.
                    <br />• <strong>Safety:</strong> Only logs consistent with the leader’s term are committed, preventing
                    split-brain scenarios.
                </Typography>

                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    Raft vs. Paxos
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Raft simplifies understanding compared to Paxos by decomposing consensus into leader election, log
                    replication, and safety guarantees. While Paxos is more theoretically general, Raft is more practical
                    and widely adopted.
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
            <Box sx={{ textAlign: "center", marginTop: 1 }}>
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
