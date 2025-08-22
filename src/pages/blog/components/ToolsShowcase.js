import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {getPinnedToolBlogs} from "./blogRegistry";

const ToolsShowcase = () => {
    const navigate = useNavigate()
    const pinnedTools = getPinnedToolBlogs()

    // 确保有数据，如果没有就创建一些示例数据
    const sampleTools = [
        {
            id: "currency-exchange",
            slug: "currency-exchange",
            title: "Currency Exchange",
            description: "Real-time currency exchange rates and conversion tool",
            summary: "Real-time currency exchange rates and conversion tool",
        },
        {
            id: "data-pipeline",
            slug: "understanding-data-pipelines",
            title: "Data Pipeline",
            description: "Understanding modern data pipeline architectures",
            summary: "Understanding modern data pipeline architectures",
        },
        {
            id: "scalable-architecture",
            slug: "scalable-architecture-three-dimensions",
            title: "Scalable Architecture",
            description: "Three dimensions of scalable system design",
            summary: "Three dimensions of scalable system design",
        },
        {
            id: "geo-optimization",
            slug: "geo-optimization-ai-era",
            title: "GEO Optimization",
            description: "SEO optimization strategies in the AI era",
            summary: "SEO optimization strategies in the AI era",
        },
    ]

    const toolsToUse = pinnedTools.length > 0 ? pinnedTools : sampleTools

    // 将工具分成两行
    const firstRow = toolsToUse.slice(0, Math.ceil(toolsToUse.length / 2))
    const secondRow = toolsToUse.slice(Math.ceil(toolsToUse.length / 2))

    // 创建足够多的重复以确保无缝循环
    const duplicatedFirstRow = [...firstRow, ...firstRow, ...firstRow, ...firstRow]
    const duplicatedSecondRow = [...secondRow, ...secondRow, ...secondRow, ...secondRow]

    const gradients = [
        "linear-gradient(135deg, #00f5ff 0%, #00d4ff 20%, #0099cc 40%, #006699 60%, #003d5c 80%, #001a2e 100%)", // 强烈青色渐变
        "linear-gradient(135deg, #00ff88 0%, #00cc66 20%, #009944 40%, #006622 60%, #003311 80%, #001a0d 100%)", // 强烈绿色渐变
        "linear-gradient(135deg, #44ffdd 0%, #22ccaa 20%, #119977 40%, #006644 60%, #003322 80%, #001a11 100%)", // 强烈青绿色渐变
        "linear-gradient(135deg, #66aaff 0%, #4488cc 20%, #226699 40%, #114466 60%, #082233 80%, #041119 100%)", // 强烈蓝色渐变
        "linear-gradient(135deg, #88ffaa 0%, #66cc88 20%, #449966 40%, #226644 60%, #113322 80%, #081a11 100%)", // 强烈浅绿色渐变
        "linear-gradient(135deg, #aaffcc 0%, #88cc99 20%, #669966 40%, #446633 60%, #223311 80%, #111a08 100%)", // 强烈薄荷绿渐变
        "linear-gradient(135deg, #77ddff 0%, #55aacc 20%, #337799 40%, #224466 60%, #112233 80%, #081119 100%)", // 强烈天蓝色渐变
        "linear-gradient(135deg, #99ff77 0%, #77cc55 20%, #559933 40%, #336622 60%, #1a3311 80%, #0d1a08 100%)", // 强烈翠绿色渐变
    ]

    const getToolStats = (slug, index) => {
        const statsOptions = [
            { followers: "15.5K", views: "2.1M", likes: "45K", platform: "Twitter" },
            { followers: "252K", views: "8.7M", likes: "156K", platform: "TikTok" },
            { followers: "89K", views: "3.2M", likes: "78K", platform: "YouTube" },
            { followers: "34K", views: "1.8M", likes: "23K", platform: "LinkedIn" },
        ]
        return statsOptions[index % statsOptions.length]
    }

    const getPlatformIcon = (platform) => {
        const icons = {
         
        }
        return icons[platform] || "🌐"
    }

    const handleToolClick = (slug) => {
        navigate(`/blog/${slug}`)
    }

    const ToolCard = ({ tool, index, gradientIndex }) => {
        const stats = getToolStats(tool.id || tool.slug, index)

        return (
            <motion.div
                style={{
                    width: "280px",
                    height: "160px",
                    margin: "0 12px",
                    borderRadius: "20px",
                    background: gradients[gradientIndex % gradients.length],
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    position: "relative",
                    flexShrink: 0,
                }}
                onClick={() => handleToolClick(tool.id || tool.slug)}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                }}
                transition={{ duration: 0.2 }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                />

                {/* 内容区域 */}
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        padding: "20px",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    {/* 顶部区域 - 去掉图标，只保留标题和平台图标 */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                            <h3
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    lineHeight: "1.2",
                                    margin: 0,
                                    maxWidth: "180px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {tool.title}
                            </h3>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <div style={{ fontSize: "16px", marginBottom: "2px" }}>{getPlatformIcon(stats.platform)}</div>
                        </div>
                    </div>

                    {/* 中间描述 */}
                    <div style={{ margin: "16px 0" }}>
                        <p
                            style={{
                                fontSize: "13px",
                                lineHeight: "1.5",
                                color: "rgba(255, 255, 255, 0.9)",
                                margin: 0,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                height: "58px",
                            }}
                        >
                            {tool.description ||
                                tool.summary ||
                                "Interactive tool for enhanced productivity and workflow optimization."}
                        </p>
                    </div>

                    {/* 底部统计 */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "rgba(255, 255, 255, 0.8)",
                                fontSize: "11px",
                            }}
                        >
                            <ExternalLink size={11} />
                            <span style={{ fontWeight: "500" }}>View Tool</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <section style={{ padding: "6px 6px", backgroundColor: "transparent" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                {/* 滑动卡片区域 */}
                <div style={{ position: "relative" }}>
                    {/* 渐变遮罩 */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100px",
                            height: "100%",
                            background: "linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 80%, transparent 100%)",
                            zIndex: 10,
                            pointerEvents: "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            width: "100px",
                            height: "100%",
                            background: "linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 80%, transparent 100%)",
                            zIndex: 10,
                            pointerEvents: "none",
                        }}
                    />

                    {/* 第一行 - 从左到右滑动，真正的无缝循环 */}
                    <div style={{ overflow: "hidden", marginBottom: "10px" }}>
                        <motion.div
                            style={{
                                display: "flex",
                                width: `${duplicatedFirstRow.length * 304}px`,
                            }}
                            animate={{
                                x: [0, -(firstRow.length * 304)],
                            }}
                            transition={{
                                x: {
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop",
                                    duration: firstRow.length * 4, // 每张卡片4秒
                                    ease: "linear",
                                },
                            }}
                        >
                            {duplicatedFirstRow.map((tool, index) => (
                                <ToolCard
                                    key={`first-${tool.id || tool.slug}-${index}`}
                                    tool={tool}
                                    index={index}
                                    gradientIndex={index % firstRow.length}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* 第二行 - 从右到左滑动，真正的无缝循环 */}
                    <div style={{ overflow: "hidden" }}>
                        <motion.div
                            style={{
                                display: "flex",
                                width: `${duplicatedSecondRow.length * 304}px`,
                            }}
                            animate={{
                                x: [-(secondRow.length * 304), 0],
                            }}
                            transition={{
                                x: {
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop",
                                    duration: secondRow.length * 5, // 每张卡片5秒，稍微慢一点
                                    ease: "linear",
                                },
                            }}
                        >
                            {duplicatedSecondRow.map((tool, index) => (
                                <ToolCard
                                    key={`second-${tool.id || tool.slug}-${index}`}
                                    tool={tool}
                                    index={index}
                                    gradientIndex={(index % secondRow.length) + firstRow.length}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ToolsShowcase
