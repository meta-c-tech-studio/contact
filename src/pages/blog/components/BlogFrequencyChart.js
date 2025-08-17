import { Box, Typography, useTheme } from "@mui/material"

const BlogFrequencyChart = ({ data, title = "Blog Publishing Frequency", subtitle = "Posts published over time" }) => {
    const theme = useTheme()

    // Generate SVG path for smooth curve
    const generateSmoothPath = (points) => {
        if (points.length < 2) return ""

        let path = `M ${points[0].x} ${points[0].y}`

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1]
            const curr = points[i]
            const next = points[i + 1]

            if (i === 1) {
                // First curve
                const cp1x = prev.x + (curr.x - prev.x) * 0.3
                const cp1y = prev.y
                const cp2x = curr.x - (curr.x - prev.x) * 0.3
                const cp2y = curr.y
                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
            } else if (i === points.length - 1) {
                // Last curve
                const cp1x = prev.x + (curr.x - prev.x) * 0.3
                const cp1y = prev.y
                const cp2x = curr.x - (curr.x - prev.x) * 0.3
                const cp2y = curr.y
                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
            } else {
                // Middle curves
                const cp1x = prev.x + (curr.x - prev.x) * 0.3
                const cp1y = prev.y + (curr.y - prev.y) * 0.3
                const cp2x = curr.x - (next.x - prev.x) * 0.1
                const cp2y = curr.y - (next.y - prev.y) * 0.1
                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
            }
        }

        return path
    }

    // Responsive chart dimensions
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    const width = isMobile ? 350 : 800
    const height = isMobile ? 200 : 300
    const padding = isMobile ? 40 : 60

    // Handle edge cases
    if (!data || data.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "900px" },
                    margin: "0 auto",
                    padding: { xs: 2, sm: 3 },
                    backgroundColor: "background.paper",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    mb: 4,
                    textAlign: "center",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No blog data available
                </Typography>
            </Box>
        )
    }

    // Process data and create points
    const maxValue = Math.max(...data.map((d) => d.value))
    const minValue = 0 // Always start from 0 for blog posts
    const valueRange = maxValue - minValue || 1

    const points = data.map((d, i) => ({
        x: padding + (i / (data.length - 1)) * (width - 2 * padding),
        y: height - padding - ((d.value - minValue) / valueRange) * (height - 2 * padding),
        label: d.label,
        value: d.value,
    }))

    const smoothPath = generateSmoothPath(points)
    const areaPath =
        smoothPath + ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "900px" },
                margin: "0 auto",
                padding: { xs: 2, sm: 3 },
                backgroundColor: "background.paper",
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                mb: { xs: 1, sm: 4 },
                overflow: "hidden",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    textAlign: { xs: "center", sm: "left" },
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: "text.secondary",
                    mb: { xs: 1, sm: 3 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    textAlign: { xs: "center", sm: "left" },
                }}
            >
                {subtitle}
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <svg
                    width="100%"
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    style={{
                        display: "block",
                        maxWidth: "100%",
                        height: "auto",
                    }}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Gradient definitions - Blue to Green */}
                    <defs>
                        <linearGradient id="blogGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#0891b2" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="30%" stopColor="#06b6d4" />
                            <stop offset="70%" stopColor="#0891b2" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <g key={i}>
                            <line
                                x1={padding}
                                y1={padding + ratio * (height - 2 * padding)}
                                x2={width - padding}
                                y2={padding + ratio * (height - 2 * padding)}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                                opacity="0.6"
                            />
                            <text
                                x={padding - 10}
                                y={padding + ratio * (height - 2 * padding) + 5}
                                textAnchor="end"
                                fontSize={isMobile ? "10" : "12"}
                                fill="#64748b"
                            >
                                {Math.round(maxValue - ratio * valueRange)}
                            </text>
                        </g>
                    ))}

                    {/* Area fill */}
                    <path d={areaPath} fill="url(#blogGradient)" opacity="0.7" />

                    {/* Main line */}
                    <path
                        d={smoothPath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth={isMobile ? "2" : "3"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                    />

                    {/* Data points */}
                    {points.map((point, i) => (
                        <g key={i}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r={isMobile ? "4" : "6"}
                                fill="white"
                                stroke={point.label === "Aug 25" ? "#10b981" : "#06b6d4"} // Highlight August
                                strokeWidth={isMobile ? "2" : "3"}
                                style={{ cursor: "pointer" }}
                                filter="url(#glow)"
                            />
                            <text
                                x={point.x}
                                y={height - padding + (isMobile ? 15 : 20)}
                                textAnchor="middle"
                                fontSize={isMobile ? "9" : "12"}
                                fill="#475569"
                            >
                                {point.label}
                            </text>
                            {/* Show value above point */}
                            <text
                                x={point.x}
                                y={point.y - (isMobile ? 10 : 15)}
                                textAnchor="middle"
                                fontSize={isMobile ? "10" : "12"}
                                fill={point.label === "Aug 25" ? "#10b981" : "#06b6d4"}
                                fontWeight="bold"
                            >
                                {point.value}
                            </text>
                        </g>
                    ))}
                </svg>
            </Box>
        </Box>
    )
}

export default BlogFrequencyChart
