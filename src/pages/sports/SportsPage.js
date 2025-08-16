import { useState, useEffect } from "react"
import { Box, Typography, Alert, CircularProgress, Tabs, Tab } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import SportsMap from "./components/SportsMap"
import { MapPin, Activity, Mountain, TreePine } from "lucide-react"

export default function SportsPage() {
    const theme = useTheme()
    const [currentTab, setCurrentTab] = useState(0)
    const [userLocation, setUserLocation] = useState(null)
    const [locationError, setLocationError] = useState("")
    const [isLoadingLocation, setIsLoadingLocation] = useState(true)

    useEffect(() => {
        getCurrentLocation()
    }, [])

    const getCurrentLocation = () => {
        setIsLoadingLocation(true)
        setLocationError("")

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.")
            setIsLoadingLocation(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
                setIsLoadingLocation(false)
            },
            (error) => {
                let errorMessage = "Unable to retrieve your location."
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage =
                            "Location access denied by user. Please enable location access to find nearby sports facilities."
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable."
                        break
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out."
                        break
                }
                setLocationError(errorMessage)
                setIsLoadingLocation(false)

                // 设置默认位置（例如：纽约市中心）
                setUserLocation({
                    lat: 40.7128,
                    lng: -74.006,
                })
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            },
        )
    }

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue)
    }

    const sportsCategories = [
        {
            id: "volleyball",
            name: "Volleyball Clubs",
            icon: <Activity size={20} />,
            description: "Find volleyball clubs and courts ",
            searchQuery: "volleyball",
            amenity: "sport=volleyball",
        },
        {
            id: "running",
            name: "Running Parks",
            icon: <TreePine size={20} />,
            description: "Discover parks and trails perfect for running",
            searchQuery: "park running",
            amenity: "leisure=park",
        },
        {
            id: "skiing",
            name: "Skiing Areas",
            icon: <Mountain size={20} />,
            description: "Find ski resorts and winter sports facilities",
            searchQuery: "ski resort",
            amenity: "sport=skiing",
        },
    ]

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
                        Sports
                    </Box>{" "}
                    Finder
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
                    Discover sports facilities and outdoor activities 
                </Typography>

                {/* Location Status */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, marginBottom: 2 }}>
                    <MapPin size={16} color={theme.palette.primary.main} />
                    {isLoadingLocation ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CircularProgress size={16} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Getting your location...
                            </Typography>
                        </Box>
                    ) : userLocation ? (
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </Typography>
                    ) : (
                        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                            Location unavailable
                        </Typography>
                    )}
                </Box>

                {locationError && (
                    <Alert severity="warning" sx={{ maxWidth: 600, margin: "0 auto", marginBottom: 2 }}>
                        {locationError}
                        {userLocation && (
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                Using default location for demonstration.
                            </Typography>
                        )}
                    </Alert>
                )}
            </Box>

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
                    <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                        {sportsCategories.map((category, index) => (
                            <Tab
                                key={category.id}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {category.icon}
                                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                                            {category.name}
                                        </Box>
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Map Content */}
                {userLocation && (
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                marginBottom: 2,
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            {sportsCategories[currentTab].icon}
                            {sportsCategories[currentTab].name}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                marginBottom: 3,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {sportsCategories[currentTab].description}
                        </Typography>

                        <SportsMap
                            userLocation={userLocation}
                            category={sportsCategories[currentTab]}
                            key={`${currentTab}-${userLocation.lat}-${userLocation.lng}`}
                        />
                    </Box>
                )}

                {!userLocation && !isLoadingLocation && (
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: 4,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 2, color: theme.palette.text.primary }}>
                            Location Required
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                            Please enable location access to find sports facilities near you.
                        </Typography>
                        <button
                            onClick={getCurrentLocation}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Try Again
                        </button>
                    </Box>
                )}
            </Box>

            <Footer />
        </Box>
    )
}
