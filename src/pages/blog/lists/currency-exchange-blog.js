"use client"

import { useState, useEffect } from "react"
import { Box, Typography, TextField, MenuItem, Button, Card, CardContent, Grid, Chip } from "@mui/material"
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, BarChart3, LineChart } from "lucide-react"
import { useTheme } from "@mui/material/styles"

const CurrencyExchangeBlog = () => {
    const theme = useTheme()
    const [exchangeRates, setExchangeRates] = useState({})
    const [loading, setLoading] = useState(true)
    const [fromCurrency, setFromCurrency] = useState("USD")
    const [toCurrency, setToCurrency] = useState("CNY")
    const [amount, setAmount] = useState("100")
    const [convertedAmount, setConvertedAmount] = useState("")
    const [lastUpdated, setLastUpdated] = useState("")
    const [historicalData, setHistoricalData] = useState({})

    // Major currencies list
    const currencies = [
        { code: "USD", name: "US Dollar", flag: "🇺🇸" },
        { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
        { code: "EUR", name: "Euro", flag: "🇪🇺" },
        { code: "GBP", name: "British Pound", flag: "🇬🇧" },
        { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
        { code: "KRW", name: "Korean Won", flag: "🇰🇷" },
        { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
        { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
        { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
        { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
    ]

    // Generate mock historical data for charts
    const generateHistoricalData = (baseRate) => {
        const data = []
        const now = new Date()
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
            const rate = baseRate * (1 + variation)
            data.push({
                date: date.toISOString().split("T")[0],
                rate: rate,
                change: i === 29 ? 0 : rate - data[data.length - 1]?.rate || 0,
            })
        }
        return data
    }

    // Mini chart component
    const MiniChart = ({ data, currency }) => {
        const maxRate = Math.max(...data.map((d) => d.rate))
        const minRate = Math.min(...data.map((d) => d.rate))
        const range = maxRate - minRate
        const isPositive = data[data.length - 1]?.rate > data[0]?.rate

        return (
            <Box sx={{ width: "100%", height: "60px", position: "relative", mt: 1 }}>
                <svg width="100%" height="60" style={{ overflow: "visible" }}>
                    <defs>
                        <linearGradient id={`gradient-${currency}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={`M 0 60 ${data
                            .map((point, index) => {
                                const x = (index / (data.length - 1)) * 100
                                const y = 60 - ((point.rate - minRate) / range) * 50
                                return `${index === 0 ? "M" : "L"} ${x} ${y}`
                            })
                            .join(" ")} L 100 60 Z`}
                        fill={`url(#gradient-${currency})`}
                    />

                    {/* Line */}
                    <path
                        d={data
                            .map((point, index) => {
                                const x = (index / (data.length - 1)) * 100
                                const y = 60 - ((point.rate - minRate) / range) * 50
                                return `${index === 0 ? "M" : "L"} ${x} ${y}`
                            })
                            .join(" ")}
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth="2"
                        fill="none"
                    />

                    {/* Data points */}
                    {data.map((point, index) => {
                        const x = (index / (data.length - 1)) * 100
                        const y = 60 - ((point.rate - minRate) / range) * 50
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="1.5"
                                fill={isPositive ? "#10b981" : "#ef4444"}
                                opacity={index === data.length - 1 ? 1 : 0.6}
                            />
                        )
                    })}
                </svg>
            </Box>
        )
    }

    // Fetch exchange rates data
    const fetchExchangeRates = async () => {
        setLoading(true)
        try {
            // Using free ExchangeRate-API
            const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
            const data = await response.json()

            setExchangeRates(data.rates)
            setLastUpdated(new Date().toLocaleString("en-US"))

            // Generate historical data for each currency
            const historical = {}
            currencies.slice(1).forEach((currency) => {
                if (data.rates[currency.code]) {
                    historical[currency.code] = generateHistoricalData(data.rates[currency.code])
                }
            })
            setHistoricalData(historical)

            // Auto calculate conversion amount
            if (amount && data.rates[toCurrency]) {
                const rate = fromCurrency === "USD" ? data.rates[toCurrency] : data.rates[toCurrency] / data.rates[fromCurrency]
                setConvertedAmount((Number.parseFloat(amount) * rate).toFixed(2))
            }
        } catch (error) {
            console.error("Failed to fetch exchange rates:", error)
        }
        setLoading(false)
    }

    // Calculate currency conversion
    const convertCurrency = () => {
        if (!amount || !exchangeRates[toCurrency] || !exchangeRates[fromCurrency]) return

        let rate
        if (fromCurrency === "USD") {
            rate = exchangeRates[toCurrency]
        } else if (toCurrency === "USD") {
            rate = 1 / exchangeRates[fromCurrency]
        } else {
            rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
        }

        const result = (Number.parseFloat(amount) * rate).toFixed(2)
        setConvertedAmount(result)
    }

    // Get exchange rate trend
    const getTrend = (currency) => {
        const historical = historicalData[currency]
        if (!historical || historical.length < 2) return "stable"

        const current = historical[historical.length - 1].rate
        const previous = historical[historical.length - 2].rate
        const change = ((current - previous) / previous) * 100

        if (change > 0.1) return "up"
        if (change < -0.1) return "down"
        return "stable"
    }

    // Get percentage change
    const getPercentageChange = (currency) => {
        const historical = historicalData[currency]
        if (!historical || historical.length < 2) return 0

        const current = historical[historical.length - 1].rate
        const previous = historical[0].rate
        return (((current - previous) / previous) * 100).toFixed(2)
    }

    useEffect(() => {
        fetchExchangeRates()
        // Update rates every 5 minutes
        const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        convertCurrency()
    }, [amount, fromCurrency, toCurrency, exchangeRates])

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#000000",
                
                color: "white",
            }}
        >
            {/* Header Section with Green Gradient */}
            <Box
                sx={{
                    background: `
            linear-gradient(135deg, 
              #10b981 0%, 
              #059669 25%, 
              #047857 50%, 
              #065f46 75%, 
              #064e3b 100%
            )
          `,
                    backgroundSize: "400% 400%",
                    animation: "gradientShift 15s ease infinite",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: { xs: 0, sm: "32px 32px 32px 32px" },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
              radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)
            `,
                        backdropFilter: "blur(1px)",
                    },
                    "@keyframes gradientShift": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        textAlign: "center",
                        padding: { xs: 4, sm: 6, md: 8 },
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            marginBottom: 2,
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                            background: "linear-gradient(45deg, #ffffff 20%, #f0fdfa 40%, #ccfbf1 60%, #ffffff 80%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                         Real-Time Currency Converter
                    </Typography>
                 
                    <Typography variant="body2" sx={{ opacity: 0.8, marginTop: 1, textShadow: "0 1px 5px rgba(0,0,0,0.2)" }}>
                        Last updated: {lastUpdated}
                    </Typography>
                </Box>
            </Box>

            {/* Main Content with Revolut-style Diagonal Gradient */}
            <Box
                sx={{
                    background: `
            linear-gradient(135deg, 
              #000000 0%, 
              #0a0a0a 20%, 
              #111111 40%, 
              #1a1a1a 60%, 
              #1e3a32 80%, 
              #064e3b 100%
            )
          `,
                    borderRadius: { xs: 0, sm: "32px 32px 32px 32px" },
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
              radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
            `,
                        pointerEvents: "none",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: { xs: 3, sm: 4, md: 6 },
                    }}
                >
                    {/* Currency Converter */}
                    <Card
                        sx={{
                            marginBottom: 4,
                            background: "rgba(255, 255, 255, 0.08)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            borderRadius: "24px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                            },
                        }}
                    >
                        <CardContent sx={{ padding: 4 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: 3,
                                    fontWeight: 700,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <DollarSign size={28} />
                                Currency Converter
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                                        <TextField
                                            label="Amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            type="number"
                                            sx={{
                                                flex: 1,
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    backdropFilter: "blur(10px)",
                                                    borderRadius: "16px",
                                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)", borderRadius: "16px" },
                                                    "&:hover fieldset": { borderColor: "rgba(16, 185, 129, 0.5)" },
                                                    "&.Mui-focused fieldset": { borderColor: "#10b981" },
                                                },
                                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                                                "& .MuiInputBase-input": { color: "white", fontWeight: 600 },
                                            }}
                                        />
                                        <TextField
                                            select
                                            label="From"
                                            value={fromCurrency}
                                            onChange={(e) => setFromCurrency(e.target.value)}
                                            sx={{
                                                minWidth: 140,
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    backdropFilter: "blur(10px)",
                                                    borderRadius: "16px",
                                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)", borderRadius: "16px" },
                                                    "&:hover fieldset": { borderColor: "rgba(16, 185, 129, 0.5)" },
                                                    "&.Mui-focused fieldset": { borderColor: "#10b981" },
                                                },
                                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                                                "& .MuiSelect-select": { color: "white", fontWeight: 600 },
                                            }}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency.code} value={currency.code}>
                                                    {currency.flag} {currency.code}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                                        <TextField
                                            label="Converted Amount"
                                            value={convertedAmount}
                                            disabled
                                            sx={{
                                                flex: 1,
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    backdropFilter: "blur(10px)",
                                                    borderRadius: "16px",
                                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)", borderRadius: "16px" },
                                                },
                                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                                                "& .MuiInputBase-input": { color: "#10b981", fontWeight: 700, fontSize: "1.1rem" },
                                            }}
                                        />
                                        <TextField
                                            select
                                            label="To"
                                            value={toCurrency}
                                            onChange={(e) => setToCurrency(e.target.value)}
                                            sx={{
                                                minWidth: 140,
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    backdropFilter: "blur(10px)",
                                                    borderRadius: "16px",
                                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)", borderRadius: "16px" },
                                                    "&:hover fieldset": { borderColor: "rgba(16, 185, 129, 0.5)" },
                                                    "&.Mui-focused fieldset": { borderColor: "#10b981" },
                                                },
                                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                                                "& .MuiSelect-select": { color: "white", fontWeight: 600 },
                                            }}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency.code} value={currency.code}>
                                                    {currency.flag} {currency.code}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                onClick={fetchExchangeRates}
                                disabled={loading}
                                startIcon={<RefreshCw size={18} />}
                                sx={{
                                    marginTop: 2,
                                    backgroundColor: "#10b981",
                                    backdropFilter: "blur(10px)",
                                    fontWeight: 600,
                                    borderRadius: "16px",
                                    padding: "12px 24px",
                                    "&:hover": {
                                        backgroundColor: "#059669",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
                                    },
                                    "&:disabled": { opacity: 0.6, backgroundColor: "rgba(255, 255, 255, 0.1)" },
                                }}
                            >
                                {loading ? "Updating..." : "Refresh Rates"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Real-time Exchange Rates with Charts */}
                    <Card
                        sx={{
                            marginBottom: 4,
                            background: "rgba(255, 255, 255, 0.08)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            borderRadius: "24px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                            },
                        }}
                    >
                        <CardContent sx={{ padding: 4 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: 3,
                                    fontWeight: 700,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <BarChart3 size={28} />
                                Live Exchange Rates with Charts (USD Base)
                            </Typography>

                            <Grid container spacing={3}>
                                {currencies.slice(1).map((currency) => {
                                    const rate = exchangeRates[currency.code]
                                    const trend = getTrend(currency.code)
                                    const percentChange = getPercentageChange(currency.code)
                                    const historical = historicalData[currency.code] || []
                                    const isPositive = Number.parseFloat(percentChange) >= 0

                                    return (
                                        <Grid item xs={12} sm={6} lg={4} key={currency.code}>
                                            <Box
                                                sx={{
                                                    padding: 3,
                                                    background: "rgba(255, 255, 255, 0.1)",
                                                    backdropFilter: "blur(15px)",
                                                    borderRadius: "20px",
                                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    "&:hover": {
                                                        background: "rgba(255, 255, 255, 0.15)",
                                                        transform: "translateY(-4px)",
                                                        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                                                        border: "1px solid rgba(16, 185, 129, 0.3)",
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
                                                            {currency.flag} {currency.code}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                                                            {currency.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: "right" }}>
                                                        <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                                                            {rate ? rate.toFixed(4) : "Loading..."}
                                                        </Typography>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: isPositive ? "#10b981" : "#ef4444",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {isPositive ? "+" : ""}
                                                                {percentChange}%
                                                            </Typography>
                                                            <Chip
                                                                icon={
                                                                    trend === "up" ? (
                                                                        <TrendingUp size={14} />
                                                                    ) : trend === "down" ? (
                                                                        <TrendingDown size={14} />
                                                                    ) : (
                                                                        <div
                                                                            style={{ width: 14, height: 14, backgroundColor: "#fbbf24", borderRadius: "50%" }}
                                                                        />
                                                                    )
                                                                }
                                                                label={trend === "up" ? "Up" : trend === "down" ? "Down" : "Stable"}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor:
                                                                        trend === "up"
                                                                            ? "rgba(16, 185, 129, 0.2)"
                                                                            : trend === "down"
                                                                                ? "rgba(239, 68, 68, 0.2)"
                                                                                : "rgba(251, 191, 36, 0.2)",
                                                                    color: trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#fbbf24",
                                                                    border: `1px solid ${
                                                                        trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#fbbf24"
                                                                    }`,
                                                                    fontWeight: 600,
                                                                    borderRadius: "12px",
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* Mini Chart */}
                                                {historical.length > 0 && <MiniChart data={historical} currency={currency.code} />}
                                            </Box>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </CardContent>
                    </Card>

                </Box>
            </Box>
        </Box>
    )
}

export default CurrencyExchangeBlog
