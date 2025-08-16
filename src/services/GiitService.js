// 前端 Giit 服务 - 使用模拟数据，方便后续与Java后端集成
class GiitService {
    constructor() {
        this.baseURL = process.env.REACT_APP_GIIT_API_URL || "http://localhost:8080/api"
        this.useMockData = true // 开发阶段使用模拟数据
        console.log("GiitService initialized with mock data:", this.useMockData)
    }

    // 模拟数据
    mockRepositories = [
        {
            id: "1",
            name: "awesome-react-components",
            fullName: "john-doe/awesome-react-components",
            description: "A collection of awesome React components for modern web development",
            language: "JavaScript",
            stars: 1234,
            forks: 89,
            watchers: 156,
            isPrivate: false,
            defaultBranch: "main",
            owner: {
                name: "john-doe",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            lastCommit: {
                message: "Add new Button component with animations",
                author: "john-doe",
                time: "2 hours ago",
                hash: "a1b2c3d",
            },
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T14:30:00Z",
        },
        {
            id: "2",
            name: "spring-boot-microservices",
            fullName: "jane-smith/spring-boot-microservices",
            description: "Microservices architecture with Spring Boot and Docker",
            language: "Java",
            stars: 2567,
            forks: 234,
            watchers: 345,
            isPrivate: false,
            defaultBranch: "main",
            owner: {
                name: "jane-smith",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            lastCommit: {
                message: "Add service discovery with Eureka",
                author: "jane-smith",
                time: "1 day ago",
                hash: "e4f5g6h",
            },
            createdAt: "2024-01-10T09:15:00Z",
            updatedAt: "2024-01-14T16:45:00Z",
        },
        {
            id: "3",
            name: "python-data-pipeline",
            fullName: "dev-team/python-data-pipeline",
            description: "ETL pipeline for big data processing with Apache Spark",
            language: "Python",
            stars: 890,
            forks: 123,
            watchers: 234,
            isPrivate: true,
            defaultBranch: "develop",
            owner: {
                name: "dev-team",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            lastCommit: {
                message: "Optimize Spark job performance",
                author: "alice-dev",
                time: "3 days ago",
                hash: "i7j8k9l",
            },
            createdAt: "2024-01-05T14:20:00Z",
            updatedAt: "2024-01-12T11:30:00Z",
        },
        {
            id: "4",
            name: "vue-admin-dashboard",
            fullName: "frontend-team/vue-admin-dashboard",
            description: "Modern admin dashboard built with Vue 3 and TypeScript",
            language: "TypeScript",
            stars: 1567,
            forks: 178,
            watchers: 289,
            isPrivate: false,
            defaultBranch: "main",
            owner: {
                name: "frontend-team",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            lastCommit: {
                message: "Add dark mode support",
                author: "bob-frontend",
                time: "5 hours ago",
                hash: "m8n9o0p",
            },
            createdAt: "2024-01-08T08:45:00Z",
            updatedAt: "2024-01-15T09:15:00Z",
        },
    ]

    mockFiles = [
        {
            name: "src",
            type: "folder",
            lastCommit: "Add new Button component",
            lastModified: "2024-01-15T12:30:00Z",
            author: "john-doe",
            size: null,
        },
        {
            name: "public",
            type: "folder",
            lastCommit: "Update assets and favicon",
            lastModified: "2024-01-14T16:45:00Z",
            author: "jane-smith",
            size: null,
        },
        {
            name: "package.json",
            type: "file",
            lastCommit: "Update dependencies to latest versions",
            lastModified: "2024-01-12T10:15:00Z",
            author: "john-doe",
            size: 2048,
        },
        {
            name: "README.md",
            type: "file",
            lastCommit: "Update documentation with new examples",
            lastModified: "2024-01-08T14:30:00Z",
            author: "john-doe",
            size: 4096,
        },
        {
            name: ".gitignore",
            type: "file",
            lastCommit: "Initial commit",
            lastModified: "2024-01-01T10:00:00Z",
            author: "john-doe",
            size: 512,
        },
        {
            name: "docker-compose.yml",
            type: "file",
            lastCommit: "Add Docker configuration",
            lastModified: "2024-01-10T09:20:00Z",
            author: "devops-team",
            size: 1024,
        },
    ]

    mockCommits = [
        {
            hash: "a1b2c3d",
            message: "Add new Button component with animations",
            author: "john-doe",
            email: "john@example.com",
            timestamp: "2024-01-15T12:30:00Z",
            time: "2 hours ago",
            avatar: "/placeholder.svg?height=32&width=32",
            branch: "main",
            filesChanged: 3,
            additions: 45,
            deletions: 12,
        },
        {
            hash: "e4f5g6h",
            message: "Fix responsive design issues in mobile view",
            author: "jane-smith",
            email: "jane@example.com",
            timestamp: "2024-01-14T16:45:00Z",
            time: "1 day ago",
            avatar: "/placeholder.svg?height=32&width=32",
            branch: "main",
            filesChanged: 5,
            additions: 23,
            deletions: 8,
        },
        {
            hash: "i7j8k9l",
            message: "Update documentation and add code examples",
            author: "john-doe",
            email: "john@example.com",
            timestamp: "2024-01-12T10:15:00Z",
            time: "3 days ago",
            avatar: "/placeholder.svg?height=32&width=32",
            branch: "main",
            filesChanged: 2,
            additions: 67,
            deletions: 5,
        },
        {
            hash: "m8n9o0p",
            message: "Refactor component structure for better maintainability",
            author: "alice-dev",
            email: "alice@example.com",
            timestamp: "2024-01-10T14:20:00Z",
            time: "5 days ago",
            avatar: "/placeholder.svg?height=32&width=32",
            branch: "develop",
            filesChanged: 8,
            additions: 134,
            deletions: 89,
        },
        {
            hash: "q1r2s3t",
            message: "Initial project setup with webpack and babel",
            author: "john-doe",
            email: "john@example.com",
            timestamp: "2024-01-01T10:00:00Z",
            time: "2 weeks ago",
            avatar: "/placeholder.svg?height=32&width=32",
            branch: "main",
            filesChanged: 12,
            additions: 256,
            deletions: 0,
        },
    ]

    mockBranches = [
        {
            name: "main",
            isDefault: true,
            lastCommit: {
                hash: "a1b2c3d",
                message: "Add new Button component with animations",
                author: "john-doe",
                time: "2 hours ago",
            },
            ahead: 0,
            behind: 0,
        },
        {
            name: "develop",
            isDefault: false,
            lastCommit: {
                hash: "m8n9o0p",
                message: "Refactor component structure",
                author: "alice-dev",
                time: "5 days ago",
            },
            ahead: 3,
            behind: 1,
        },
        {
            name: "feature/dark-mode",
            isDefault: false,
            lastCommit: {
                hash: "u4v5w6x",
                message: "Implement dark mode toggle",
                author: "bob-frontend",
                time: "1 week ago",
            },
            ahead: 5,
            behind: 2,
        },
    ]

    mockActivity = [
        {
            id: 1,
            type: "commit",
            repo: "awesome-react-components",
            repoId: "1",
            message: "Add new Button component with animations",
            author: "john-doe",
            avatar: "/placeholder.svg?height=32&width=32",
            time: "2 hours ago",
            branch: "main",
            timestamp: "2024-01-15T12:30:00Z",
        },
        {
            id: 2,
            type: "fork",
            repo: "spring-boot-microservices",
            repoId: "2",
            message: "Forked repository",
            author: "alice-dev",
            avatar: "/placeholder.svg?height=32&width=32",
            time: "5 hours ago",
            branch: null,
            timestamp: "2024-01-15T09:30:00Z",
        },
        {
            id: 3,
            type: "star",
            repo: "vue-admin-dashboard",
            repoId: "4",
            message: "Starred repository",
            author: "bob-coder",
            avatar: "/placeholder.svg?height=32&width=32",
            time: "1 day ago",
            branch: null,
            timestamp: "2024-01-14T14:30:00Z",
        },
        {
            id: 4,
            type: "commit",
            repo: "python-data-pipeline",
            repoId: "3",
            message: "Optimize Spark job performance",
            author: "alice-dev",
            avatar: "/placeholder.svg?height=32&width=32",
            time: "3 days ago",
            branch: "develop",
            timestamp: "2024-01-12T11:30:00Z",
        },
        {
            id: 5,
            type: "pull_request",
            repo: "vue-admin-dashboard",
            repoId: "4",
            message: "Add user authentication module",
            author: "charlie-backend",
            avatar: "/placeholder.svg?height=32&width=32",
            time: "1 week ago",
            branch: "feature/auth",
            timestamp: "2024-01-08T16:45:00Z",
        },
    ]

    // 模拟网络延迟
    async delay(ms = 500) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    // API方法 - 使用模拟数据
    async getAllRepositories() {
        console.log("getAllRepositories called")
        if (this.useMockData) {
            await this.delay(300)
            console.log("Returning mock repositories:", this.mockRepositories.length)
            return [...this.mockRepositories]
        }

        // 真实API调用（当连接Java后端时）
        const response = await fetch(`${this.baseURL}/repositories`)
        if (!response.ok) throw new Error("Failed to fetch repositories")
        return await response.json()
    }

    async getRepository(id) {
        if (this.useMockData) {
            await this.delay(200)
            const repo = this.mockRepositories.find((r) => r.id === id)
            if (!repo) throw new Error("Repository not found")
            return { ...repo }
        }

        const response = await fetch(`${this.baseURL}/repositories/${id}`)
        if (!response.ok) throw new Error("Repository not found")
        return await response.json()
    }

    async createRepository(repositoryData) {
        if (this.useMockData) {
            await this.delay(800)
            const newRepo = {
                id: Date.now().toString(),
                ...repositoryData,
                fullName: `${repositoryData.owner}/${repositoryData.name}`,
                stars: 0,
                forks: 0,
                watchers: 0,
                defaultBranch: "main",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastCommit: null,
                owner: {
                    name: repositoryData.owner,
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            }
            this.mockRepositories.unshift(newRepo)
            return { ...newRepo }
        }

        const response = await fetch(`${this.baseURL}/repositories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(repositoryData),
        })
        if (!response.ok) throw new Error("Failed to create repository")
        return await response.json()
    }

    async getRepositoryFiles(id, branch = "main", path = "") {
        if (this.useMockData) {
            await this.delay(250)
            // 根据路径返回不同的文件列表
            if (path === "src") {
                return [
                    {
                        name: "components",
                        type: "folder",
                        lastCommit: "Add Button component",
                        lastModified: "2024-01-15T12:30:00Z",
                        author: "john-doe",
                        size: null,
                    },
                    {
                        name: "utils",
                        type: "folder",
                        lastCommit: "Add utility functions",
                        lastModified: "2024-01-14T10:15:00Z",
                        author: "jane-smith",
                        size: null,
                    },
                    {
                        name: "App.js",
                        type: "file",
                        lastCommit: "Update main app component",
                        lastModified: "2024-01-13T14:20:00Z",
                        author: "john-doe",
                        size: 3072,
                    },
                    {
                        name: "index.js",
                        type: "file",
                        lastCommit: "Initial setup",
                        lastModified: "2024-01-01T10:00:00Z",
                        author: "john-doe",
                        size: 512,
                    },
                ]
            }
            return [...this.mockFiles]
        }

        const params = new URLSearchParams({ branch, path })
        const response = await fetch(`${this.baseURL}/repositories/${id}/files?${params}`)
        if (!response.ok) throw new Error("Failed to fetch files")
        return await response.json()
    }

    async getRepositoryCommits(id, branch = "main") {
        if (this.useMockData) {
            await this.delay(300)
            return [...this.mockCommits]
        }

        const params = new URLSearchParams({ branch })
        const response = await fetch(`${this.baseURL}/repositories/${id}/commits?${params}`)
        if (!response.ok) throw new Error("Failed to fetch commits")
        return await response.json()
    }

    async getRepositoryBranches(id) {
        if (this.useMockData) {
            await this.delay(200)
            return [...this.mockBranches]
        }

        const response = await fetch(`${this.baseURL}/repositories/${id}/branches`)
        if (!response.ok) throw new Error("Failed to fetch branches")
        return await response.json()
    }

    async getRecentActivity() {
        console.log("getRecentActivity called")
        if (this.useMockData) {
            await this.delay(400)
            console.log("Returning mock activity:", this.mockActivity.length)
            return [...this.mockActivity]
        }

        const response = await fetch(`${this.baseURL}/activity/recent`)
        if (!response.ok) throw new Error("Failed to fetch activity")
        return await response.json()
    }

    async createCommit(id, commitData, files = []) {
        if (this.useMockData) {
            await this.delay(1000)
            const newCommit = {
                hash: Math.random().toString(36).substring(2, 9),
                message: commitData.message,
                author: commitData.author,
                email: `${commitData.author}@example.com`,
                timestamp: new Date().toISOString(),
                time: "just now",
                avatar: "/placeholder.svg?height=32&width=32",
                branch: commitData.branch || "main",
                filesChanged: files.length,
                additions: Math.floor(Math.random() * 100) + 10,
                deletions: Math.floor(Math.random() * 20),
            }
            this.mockCommits.unshift(newCommit)
            return { ...newCommit }
        }

        const formData = new FormData()
        Object.keys(commitData).forEach((key) => {
            formData.append(key, commitData[key])
        })
        files.forEach((file) => {
            formData.append("files", file)
        })

        const response = await fetch(`${this.baseURL}/repositories/${id}/commits`, {
            method: "POST",
            body: formData,
        })
        if (!response.ok) throw new Error("Failed to create commit")
        return await response.json()
    }

    // 工具方法
    async healthCheck() {
        if (this.useMockData) {
            await this.delay(100)
            return {
                status: "OK",
                timestamp: new Date().toISOString(),
                service: "Giit Mock Service",
                backend: "Java Spring Boot (Not Connected)",
            }
        }

        try {
            const response = await fetch(`${this.baseURL.replace("/api", "")}/health`)
            return await response.json()
        } catch (error) {
            return {
                status: "ERROR",
                error: error.message,
                service: "Giit Service",
            }
        }
    }

    // 切换到真实API（当Java后端准备好时）
    enableRealAPI() {
        this.useMockData = false
        console.log("🔄 Switched to real Java backend API")
    }

    // 切换回模拟数据
    enableMockData() {
        this.useMockData = true
        console.log("🎭 Switched to mock data")
    }
}

export default new GiitService()
