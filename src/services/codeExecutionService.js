// Judge0 API 配置
const JUDGE0_API_BASE = "https://judge0-ce.p.rapidapi.com"
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY

// 语言 ID 映射 (Judge0 API 的语言标识)
const LANGUAGE_IDS = {
    javascript: 63, // Node.js 12.14.0
    python: 71, // Python 3.8.1
    java: 62, // Java OpenJDK 13.0.1
}

// 状态码映射
const STATUS_DESCRIPTIONS = {
    1: "In Queue",
    2: "Processing",
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error",
}

class CodeExecutionService {
    constructor() {
        if (!RAPIDAPI_KEY) {
            console.error("REACT_APP_RAPIDAPI_KEY is not set in environment variables")
        }
    }

    async executeCode(code, language, input = "") {
        try {
            if (!RAPIDAPI_KEY) {
                throw new Error("RapidAPI key is not configured. Please set REACT_APP_RAPIDAPI_KEY in your .env file.")
            }

            const languageId = LANGUAGE_IDS[language]
            if (!languageId) {
                throw new Error(`Unsupported language: ${language}`)
            }

            // 第一步：提交代码执行请求
            const token = await this.submitCode(code, languageId, input)

            // 第二步：轮询获取执行结果
            const result = await this.getExecutionResult(token)

            return this.formatResult(result)
        } catch (error) {
            console.error("Code execution error:", error)
            return {
                success: false,
                error: error.message,
                output: "",
                executionTime: null,
                memory: null,
            }
        }
    }

    async submitCode(code, languageId, input) {
        const response = await fetch(`${JUDGE0_API_BASE}/submissions?base64_encoded=false&wait=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify({
                source_code: code,
                language_id: languageId,
                stdin: input,
                expected_output: null,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to submit code: ${response.status} ${response.statusText}. ${errorText}`)
        }

        const result = await response.json()
        if (!result.token) {
            throw new Error("No token received from Judge0 API")
        }

        return result.token
    }

    async getExecutionResult(token, maxAttempts = 10) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const response = await fetch(`${JUDGE0_API_BASE}/submissions/${token}?base64_encoded=false`, {
                headers: {
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to get result: ${response.status} ${response.statusText}. ${errorText}`)
            }

            const result = await response.json()

            // 如果还在处理中，等待后重试
            if (result.status.id <= 2) {
                await this.sleep(1000) // 等待 1 秒
                continue
            }

            return result
        }

        throw new Error("Execution timeout - result not ready after maximum attempts")
    }

    formatResult(result) {
        const status = result.status
        const isSuccess = status.id === 3 // Accepted

        return {
            success: isSuccess,
            output: result.stdout || "",
            error: result.stderr || (isSuccess ? "" : STATUS_DESCRIPTIONS[status.id] || "Unknown error"),
            executionTime: result.time ? `${result.time}s` : null,
            memory: result.memory ? `${result.memory} KB` : null,
            statusId: status.id,
            statusDescription: status.description,
        }
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

export default new CodeExecutionService()
