import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    Box,
    Typography,
    Button,
    Breadcrumbs,
    Link,
    Chip,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Header from "../../../components/Header.jsx"
import Footer from "../../../components/Footer.jsx"
import {
    GitBranch,
    Star,
    GitFork,
    Eye,
    Code,
    FileText,
    Folder,
    Download,
    Copy,
    ChevronRight,
    Plus,
    Minus,
} from "lucide-react"
import giitService from "../../../services/GiitService";

export default function RepositoryPage() {
    const theme = useTheme()
    const { id } = useParams()
    const [currentTab, setCurrentTab] = useState(0)
    const [repository, setRepository] = useState(null)
    const [files, setFiles] = useState([])
    const [commits, setCommits] = useState([])
    const [branches, setBranches] = useState([])
    const [currentBranch, setCurrentBranch] = useState("main")
    const [currentPath, setCurrentPath] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (id) {
            loadRepositoryData()
        }
    }, [id])

    const loadRepositoryData = async () => {
        setLoading(true)
        setError("")
        try {
            const [repoData, filesData, commitsData, branchesData] = await Promise.all([
                giitService.getRepository(id),
                giitService.getRepositoryFiles(id, currentBranch, currentPath),
                giitService.getRepositoryCommits(id, currentBranch),
                giitService.getRepositoryBranches(id),
            ])

            setRepository(repoData)
            setFiles(filesData)
            setCommits(commitsData)
            setBranches(branchesData)
        } catch (err) {
            setError(err.message)
            console.error("Failed to load repository data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue)
    }

    const handleFileClick = async (file) => {
        if (file.type === "folder") {
            const newPath = currentPath ? `${currentPath}/${file.name}` : file.name
            setCurrentPath(newPath)
            try {
                const filesData = await giitService.getRepositoryFiles(id, currentBranch, newPath)
                setFiles(filesData)
            } catch (err) {
                setError(err.message)
            }
        }
    }

    const getFileIcon = (type) => {
        return type === "folder" ? <Folder size={16} color={theme.palette.primary.main} /> : <FileText size={16} />
    }

    const copyCloneUrl = () => {
        if (repository) {
            const url = `https://giit.example.com/${repository.fullName}.git`
            navigator.clipboard.writeText(url)
            // 在真实应用中，这里会显示一个toast通知
            console.log("Clone URL copied:", url)
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return "-"
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
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
                            Loading repository...
                        </Typography>
                    </Box>
                </Box>
                <Footer />
            </Box>
        )
    }

    if (error || !repository) {
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
                        padding: 4,
                    }}
                >
                    <Alert severity="error" sx={{ maxWidth: 500 }}>
                        <Typography variant="h6">Repository not found</Typography>
                        <Typography variant="body2">{error || "The repository you're looking for doesn't exist."}</Typography>
                    </Alert>
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

            <Box
                sx={{
                    flexGrow: 1,
                    padding: { xs: 2, sm: 3, md: 4 },
                    maxWidth: 1200,
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                {/* Repository Header */}
                <Box sx={{ marginBottom: 3 }}>
                    <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ marginBottom: 2 }}>
                        <Link href="/giit" underline="hover" color="inherit">
                            Repositories
                        </Link>
                        <Typography color="text.primary">{repository.name}</Typography>
                    </Breadcrumbs>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
                        <Avatar src={repository.owner.avatar} sx={{ width: 32, height: 32 }} />
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                            {repository.fullName}
                        </Typography>
                        {repository.isPrivate && <Chip label="Private" size="small" variant="outlined" color="warning" />}
                    </Box>

                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, marginBottom: 3 }}>
                        {repository.description}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Button variant="outlined" startIcon={<Star size={16} />} size="small">
                            Star {repository.stars.toLocaleString()}
                        </Button>
                        <Button variant="outlined" startIcon={<GitFork size={16} />} size="small">
                            Fork {repository.forks.toLocaleString()}
                        </Button>
                        <Button variant="outlined" startIcon={<Eye size={16} />} size="small">
                            Watch {repository.watchers.toLocaleString()}
                        </Button>
                        <Button variant="contained" startIcon={<Code size={16} />} size="small">
                            Code
                        </Button>
                        <Button variant="outlined" startIcon={<Download size={16} />} size="small">
                            Download ZIP
                        </Button>
                    </Box>
                </Box>

                {/* Clone URL */}
                <Paper
                    sx={{
                        padding: 2,
                        marginBottom: 3,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: "monospace" }}>
                            https://giit.example.com/{repository.fullName}.git
                        </Typography>
                        <IconButton size="small" onClick={copyCloneUrl} title="Copy clone URL">
                            <Copy size={16} />
                        </IconButton>
                    </Box>
                </Paper>

                {/* Branch and Last Commit Info */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        marginBottom: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button variant="outlined" startIcon={<GitBranch size={16} />} size="small">
                            {currentBranch}
                        </Button>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {commits.length} commits
                        </Typography>
                    </Box>
                    {repository.lastCommit && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar src={repository.owner.avatar} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body2">
                                <strong>{repository.lastCommit.author}</strong> {repository.lastCommit.message}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {repository.lastCommit.time}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label={`Code`} />
                        <Tab label={`Commits (${commits.length})`} />
                        <Tab label={`Branches (${branches.length})`} />
                        <Tab label="Releases" />
                    </Tabs>
                </Box>

                {/* Code Tab - File Browser */}
                {currentTab === 0 && (
                    <TableContainer
                        component={Paper}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Last commit message</TableCell>
                                    <TableCell>Last commit date</TableCell>
                                    <TableCell align="right">Size</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Back navigation */}
                                {currentPath && (
                                    <TableRow
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() => {
                                            const parentPath = currentPath.split("/").slice(0, -1).join("/")
                                            setCurrentPath(parentPath)
                                            giitService.getRepositoryFiles(id, currentBranch, parentPath).then(setFiles)
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Folder size={16} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    ..
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell align="right">-</TableCell>
                                    </TableRow>
                                )}
                                {files.map((file, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                {getFileIcon(file.type)}
                                                <Typography variant="body2" sx={{ fontWeight: file.type === "folder" ? 600 : 400 }}>
                                                    {file.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {file.lastCommit}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {formatTimeAgo(file.lastModified)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {formatFileSize(file.size)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Commits Tab */}
                {currentTab === 1 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {commits.map((commit, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    padding: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    "&:hover": {
                                        borderColor: theme.palette.primary.main,
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar src={commit.avatar} sx={{ width: 32, height: 32 }} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, marginBottom: 0.5 }}>
                                            {commit.message}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                <strong>{commit.author}</strong> committed {formatTimeAgo(commit.timestamp)}
                                            </Typography>
                                            <Chip
                                                label={commit.hash}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                                            />
                                            {commit.filesChanged && (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                        {commit.filesChanged} files
                                                    </Typography>
                                                    {commit.additions && (
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <Plus size={12} color="#28a745" />
                                                            <Typography variant="body2" sx={{ color: "#28a745", fontSize: "0.75rem" }}>
                                                                {commit.additions}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    {commit.deletions && (
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <Minus size={12} color="#d73a49" />
                                                            <Typography variant="body2" sx={{ color: "#d73a49", fontSize: "0.75rem" }}>
                                                                {commit.deletions}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    <IconButton size="small" title="Copy commit hash">
                                        <Copy size={16} />
                                    </IconButton>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* Branches Tab */}
                {currentTab === 2 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {branches.map((branch, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    padding: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    "&:hover": {
                                        borderColor: theme.palette.primary.main,
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <GitBranch size={20} color={theme.palette.primary.main} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 0.5 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {branch.name}
                                            </Typography>
                                            {branch.isDefault && <Chip label="default" size="small" color="primary" />}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            Last commit: {branch.lastCommit.message} by {branch.lastCommit.author} {branch.lastCommit.time}
                                        </Typography>
                                        {(branch.ahead > 0 || branch.behind > 0) && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 1 }}>
                                                {branch.ahead > 0 && (
                                                    <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                                                        {branch.ahead} ahead
                                                    </Typography>
                                                )}
                                                {branch.behind > 0 && (
                                                    <Typography variant="body2" sx={{ color: theme.palette.warning.main }}>
                                                        {branch.behind} behind
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setCurrentBranch(branch.name)
                                            // 重新加载文件和提交
                                            Promise.all([
                                                giitService.getRepositoryFiles(id, branch.name, currentPath),
                                                giitService.getRepositoryCommits(id, branch.name),
                                            ]).then(([filesData, commitsData]) => {
                                                setFiles(filesData)
                                                setCommits(commitsData)
                                                setCurrentTab(0) // 切换到代码标签
                                            })
                                        }}
                                    >
                                        Switch
                                    </Button>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* Releases tab placeholder */}
                {currentTab === 3 && (
                    <Box sx={{ textAlign: "center", padding: 4 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                            Releases feature coming soon...
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            This will be implemented when connected to the Java backend.
                        </Typography>
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    )
}
