import { useState, useEffect } from "react"
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import { GitCommit, Star, GitFork, Download, Plus, Search, RefreshCw } from "lucide-react"
import giitService from "../../services/GiitService";

export default function GiitPage() {
    const theme = useTheme()
    const [currentTab, setCurrentTab] = useState(0)
    const [repositories, setRepositories] = useState([])
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // 添加调试日志
    console.log("GiitPage component mounted")

    useEffect(() => {
        console.log("GiitPage useEffect triggered")
        loadData()
    }, [])

    const loadData = async () => {
        console.log("Loading data...")
        setLoading(true)
        setError("")
        try {
            console.log("Calling giitService...")
            const [reposData, activityData] = await Promise.all([
                giitService.getAllRepositories(),
                giitService.getRecentActivity(),
            ])
            console.log("Data loaded:", { reposData, activityData })
            setRepositories(reposData)
            setRecentActivity(activityData)
        } catch (err) {
            console.error("Error loading data:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue)
    }

    const getLanguageColor = (language) => {
        const colors = {
            JavaScript: "#f1e05a",
            Python: "#3572A5",
            Java: "#b07219",
            TypeScript: "#2b7489",
            Go: "#00ADD8",
            Rust: "#dea584",
            Vue: "#4FC08D",
            React: "#61DAFB",
        }
        return colors[language] || "#8b949e"
    }

    const getActivityIcon = (type) => {
        switch (type) {
            case "commit":
                return <GitCommit size={16} />
            case "fork":
                return <GitFork size={16} />
            case "star":
                return <Star size={16} />
            case "pull_request":
                return <GitCommit size={16} />
            default:
                return <GitCommit size={16} />
        }
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const time = new Date(timestamp)
        const diffInSeconds = Math.floor((now - time) / 1000)

        if (diffInSeconds < 60) return "just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        return `${Math.floor(diffInSeconds / 86400)} days ago`
    }

    if (loading) {
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
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress size={48} sx={{ marginBottom: 2 }} />
                        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                            Loading Giit repositories...
                        </Typography>
                    </Box>
                </Box>
                <Footer />
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

            {/* Hero Section */}
            <Box
                sx={{
                    padding: { xs: 3, sm: 4, md: 6 },
                    textAlign: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        marginBottom: 2,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                    }}
                >
                    <Box component="span" sx={{ color: theme.palette.primary.main }}>
                        Giit
                    </Box>
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: 4,
                        color: theme.palette.text.secondary,
                        maxWidth: 600,
                        margin: "0 auto 2rem auto",
                    }}
                >
                     Git-like vcs,manage repositories.
                </Typography>

                {/* Status Badge */}
                <Box sx={{ marginBottom: 3 }}>
                    <Chip
                        label="Demo Mode"
                        color="info"
                        variant="outlined"
                        sx={{ fontSize: "0.9rem", padding: "4px 8px" }}
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        sx={{
                            padding: "12px 24px",
                            fontSize: "1rem",
                            fontWeight: 600,
                        }}
                    >
                        New Repository
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Search size={20} />}
                        sx={{
                            padding: "12px 24px",
                            fontSize: "1rem",
                            fontWeight: 600,
                        }}
                    >
                        Explore Repositories
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={20} />}
                        onClick={loadData}
                        sx={{
                            padding: "12px 24px",
                            fontSize: "1rem",
                            fontWeight: 600,
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Error Alert */}
            {error && (
                <Box sx={{ padding: 2 }}>
                    <Alert severity="error" onClose={() => setError("")}>
                        {error}
                    </Alert>
                </Box>
            )}

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    padding: { xs: 2, sm: 3, md: 4 },
                    maxWidth: 1200,
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label={`Repositories (${repositories.length})`} />
                        <Tab label={`Recent Activity (${recentActivity.length})`} />
                        <Tab label="Organizations" />
                    </Tabs>
                </Box>

                {/* Repositories Tab */}
                {currentTab === 0 && (
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 3,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Repositories ({repositories.length})
                            </Typography>
                            <Button variant="contained" startIcon={<Plus size={16} />} size="small">
                                New
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {repositories.map((repo) => (
                                <Card
                                    key={repo.id}
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        "&:hover": {
                                            borderColor: theme.palette.primary.main,
                                            cursor: "pointer",
                                        },
                                    }}
                                    onClick={() => (window.location.href = `/giit/repository/${repo.id}`)}
                                >
                                    <CardContent sx={{ padding: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                            <Avatar src={repo.owner.avatar} sx={{ width: 40, height: 40 }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                                    <Typography
                                                        variant="h6"
                                                        component="h3"
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            fontWeight: 600,
                                                            "&:hover": { textDecoration: "underline" },
                                                        }}
                                                    >
                                                        {repo.fullName}
                                                    </Typography>
                                                    {repo.isPrivate && <Chip label="Private" size="small" variant="outlined" color="warning" />}
                                                </Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                                                    {repo.description}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <Box
                                                            sx={{
                                                                width: 12,
                                                                height: 12,
                                                                borderRadius: "50%",
                                                                backgroundColor: getLanguageColor(repo.language),
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                                            {repo.language}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <Star size={14} />
                                                        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                                            {repo.stars.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <GitFork size={14} />
                                                        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                                            {repo.forks.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                                                        Updated {repo.lastCommit ? repo.lastCommit.time : formatTimeAgo(repo.updatedAt)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                                <IconButton size="small" title="Star" onClick={(e) => e.stopPropagation()}>
                                                    <Star size={16} />
                                                </IconButton>
                                                <IconButton size="small" title="Fork" onClick={(e) => e.stopPropagation()}>
                                                    <GitFork size={16} />
                                                </IconButton>
                                                <IconButton size="small" title="Download" onClick={(e) => e.stopPropagation()}>
                                                    <Download size={16} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Recent Activity Tab */}
                {currentTab === 1 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>
                            Recent Activity
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {recentActivity.map((activity) => (
                                <Card
                                    key={activity.id}
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        "&:hover": {
                                            borderColor: theme.palette.primary.main,
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ padding: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar src={activity.avatar} sx={{ width: 32, height: 32 }} />
                                            <Box sx={{ color: theme.palette.text.secondary }}>{getActivityIcon(activity.type)}</Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                                                    <strong>{activity.author}</strong>{" "}
                                                    {activity.type === "commit" ? "committed to" : `${activity.type}d`}{" "}
                                                    <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                                        {activity.repo}
                                                    </Box>
                                                    {activity.branch && (
                                                        <>
                                                            {" "}
                                                            on <Chip label={activity.branch} size="small" variant="outlined" />
                                                        </>
                                                    )}
                                                </Typography>
                                                {activity.message && activity.type === "commit" && (
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                        "{activity.message}"
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {activity.time}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Organizations Tab */}
                {currentTab === 2 && (
                    <Box sx={{ textAlign: "center", padding: 4 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                            Features coming soon...
                        </Typography>
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    )
}
