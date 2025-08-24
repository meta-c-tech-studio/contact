import { Box, Typography, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Lock } from "lucide-react"

export default function A2AProtocolInAI() {
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
                    maxHeight: "20.33vh",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    A2A Protocol 
                </Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, marginBottom: 4 }}>
                    Updated on August 24, 2025 - Personal Research Notes
                </Typography>

                {/* A2A protocol diagram */}
                {/*<Box sx={{ width: "100%", marginBottom: 4, textAlign: "center" }}>*/}
                {/*    <img*/}
                {/*        src="/blogs/a2a_in_ai.png"*/}
                {/*        alt="A2A Protocol in AI Agents"*/}
                {/*        style={{*/}
                {/*            maxWidth: "100%",*/}
                {/*            height: "auto",*/}
                {/*            borderRadius: "8px",*/}
                {/*            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Box>*/}

         

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    What is the A2A Protocol?
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The A2A protocol is an open standard designed to solve communication and coordination challenges
                    between AI agents. It allows agents to discover each other's capabilities, negotiate interaction
                    patterns, and collaborate to complete tasks. The protocol aims to enable seamless cooperation
                    between agents built by different teams or using different technology stacks.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Key Features of A2A Protocol
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Agent Discovery:</strong> Agents can discover the capabilities and services of others.
                    <br />• <strong>Task Collaboration:</strong> Agents can work together to complete complex tasks.
                    <br />• <strong>Secure Communication:</strong> Ensures that communication between agents is safe and trusted.
                    <br />• <strong>Cross-Platform Compatibility:</strong> Supports interoperability between agents on different platforms and stacks.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Application Scenarios of A2A Protocol
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Multi-Agent Collaboration:</strong> Multiple agents coordinate to accomplish complex tasks.
                    <br />• <strong>Cross-System Integration:</strong> Agents from different systems interact and collaborate.
                    <br />• <strong>Enterprise Automation:</strong> Internal enterprise agents use A2A to automate workflows.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Technical Implementation
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Based on JSON-RPC 2.0 and HTTP(S):</strong> Provides standardized communication format and protocol.
                    <br />• <strong>Supports Streaming and Push Notifications:</strong> Suitable for real-time collaboration and long-running tasks.
                    <br />• <strong>Multi-Language SDKs:</strong> Provides SDKs for Python, JavaScript, Java, and more.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Relation to MCP
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The A2A protocol complements MCP (Model Context Protocol). While A2A focuses on agent-to-agent collaboration, MCP focuses on agent-to-tool integration. Together, they enable a complete ecosystem of AI agents.
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

            {/* Locked content button */}
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
