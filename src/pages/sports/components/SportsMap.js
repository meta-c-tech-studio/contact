import { useState, useEffect } from "react"
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Chip } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { MapPin, Navigation, Phone, Globe, Clock, Star } from "lucide-react"

export default function SportsMap({ userLocation, category }) {
    const theme = useTheme()
    const [facilities, setFacilities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedFacility, setSelectedFacility] = useState(null)

    useEffect(() => {
        if (userLocation) {
            searchNearbyFacilities()
        }
    }, [userLocation, category])

    const searchNearbyFacilities = async () => {
        setIsLoading(true)
        setError("")
        setFacilities([])

        try {
            // 使用 Overpass API 搜索附近的设施
            const overpassQuery = buildOverpassQuery(userLocation, category)
            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: overpassQuery,
            })

            if (!response.ok) {
                throw new Error("Failed to fetch facilities data")
            }

            const data = await response.json()
            const processedFacilities = processFacilitiesData(data.elements, category)

            // 如果没有找到真实数据，添加一些模拟数据用于演示
            if (processedFacilities.length === 0) {
                const mockFacilities = generateMockFacilities(userLocation, category)
                setFacilities(mockFacilities)
            } else {
                setFacilities(processedFacilities)
            }
        } catch (err) {
            console.error("Error fetching facilities:", err)
            setError("Unable to load facilities data. Showing sample data instead.")

            // 显示模拟数据作为备用
            const mockFacilities = generateMockFacilities(userLocation, category)
            setFacilities(mockFacilities)
        } finally {
            setIsLoading(false)
        }
    }

    const buildOverpassQuery = (location, category) => {
        const radius = 5000 // 5km radius
        let query = ""

        switch (category.id) {
            case "volleyball":
                query = `
          [out:json][timeout:25];
          (
            node["sport"="volleyball"](around:${radius},${location.lat},${location.lng});
            way["sport"="volleyball"](around:${radius},${location.lat},${location.lng});
            node["leisure"="sports_centre"]["sport"~"volleyball"](around:${radius},${location.lat},${location.lng});
          );
          out geom;
        `
                break
            case "running":
                query = `
          [out:json][timeout:25];
          (
            node["leisure"="park"](around:${radius},${location.lat},${location.lng});
            way["leisure"="park"](around:${radius},${location.lat},${location.lng});
            node["highway"="track"]["sport"="running"](around:${radius},${location.lat},${location.lng});
            way["highway"="track"]["sport"="running"](around:${radius},${location.lat},${location.lng});
          );
          out geom;
        `
                break
            case "skiing":
                query = `
          [out:json][timeout:25];
          (
            node["sport"="skiing"](around:${radius},${location.lat},${location.lng});
            way["sport"="skiing"](around:${radius},${location.lat},${location.lng});
            node["leisure"="ski_resort"](around:${radius},${location.lat},${location.lng});
            way["leisure"="ski_resort"](around:${radius},${location.lat},${location.lng});
          );
          out geom;
        `
                break
        }

        return query
    }

    const processFacilitiesData = (elements, category) => {
        return elements
            .filter((element) => element.lat && element.lon)
            .map((element, index) => ({
                id: element.id || index,
                name: element.tags?.name || `${category.name.slice(0, -1)} ${index + 1}`,
                lat: element.lat,
                lng: element.lon,
                type: category.id,
                address: element.tags?.["addr:full"] || element.tags?.["addr:street"] || "Address not available",
                phone: element.tags?.phone || null,
                website: element.tags?.website || null,
                openingHours: element.tags?.opening_hours || null,
                rating: Math.random() * 2 + 3, // Mock rating between 3-5
                distance: calculateDistance(userLocation, { lat: element.lat, lng: element.lon }),
                amenities: extractAmenities(element.tags),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10) // Limit to 10 results
    }

    const generateMockFacilities = (location, category) => {
        const mockData = {
            volleyball: [
                { name: "City Volleyball Club", address: "123 Sports Ave", phone: "(555) 123-4567" },
                { name: "Beach Volleyball Center", address: "456 Ocean Blvd", phone: "(555) 234-5678" },
                { name: "Community Sports Complex", address: "789 Park St", phone: "(555) 345-6789" },
                { name: "Elite Volleyball Academy", address: "321 Athletic Way", phone: "(555) 456-7890" },
                { name: "Sunset Volleyball Courts", address: "654 Beach Rd", phone: "(555) 567-8901" },
            ],
            running: [
                { name: "Central Park", address: "100 Park Ave", phone: null },
                { name: "Riverside Trail", address: "200 River Rd", phone: "(555) 111-2222" },
                { name: "Mountain View Park", address: "300 Hill St", phone: null },
                { name: "Lakeside Running Path", address: "400 Lake Dr", phone: "(555) 333-4444" },
                { name: "Forest Trail Network", address: "500 Forest Ave", phone: "(555) 555-6666" },
            ],
            skiing: [
                { name: "Alpine Ski Resort", address: "1000 Mountain Rd", phone: "(555) 777-8888" },
                { name: "Snow Peak Lodge", address: "2000 Summit Dr", phone: "(555) 888-9999" },
                { name: "Winter Sports Center", address: "3000 Slope St", phone: "(555) 999-0000" },
                { name: "Crystal Mountain Resort", address: "4000 Crystal Ave", phone: "(555) 000-1111" },
                { name: "Powder Valley Ski Area", address: "5000 Powder Ln", phone: "(555) 111-3333" },
            ],
        }

        return mockData[category.id].map((facility, index) => ({
            id: `mock-${index}`,
            name: facility.name,
            lat: location.lat + (Math.random() - 0.5) * 0.1,
            lng: location.lng + (Math.random() - 0.5) * 0.1,
            type: category.id,
            address: facility.address,
            phone: facility.phone,
            website: Math.random() > 0.5 ? `https://${facility.name.toLowerCase().replace(/\s+/g, "")}.com` : null,
            openingHours: "6:00 AM - 10:00 PM",
            rating: Math.random() * 2 + 3,
            distance: Math.random() * 5 + 0.5,
            amenities: generateMockAmenities(category.id),
        }))
    }

    const generateMockAmenities = (categoryId) => {
        const amenitiesMap = {
            volleyball: ["Indoor Courts", "Outdoor Courts", "Equipment Rental", "Coaching", "Tournaments"],
            running: ["Paved Trails", "Restrooms", "Water Fountains", "Parking", "Lighting"],
            skiing: ["Ski Lifts", "Equipment Rental", "Lessons", "Restaurant", "Parking"],
        }

        const available = amenitiesMap[categoryId] || []
        return available.filter(() => Math.random() > 0.3).slice(0, 3)
    }

    const extractAmenities = (tags) => {
        const amenities = []
        if (tags?.toilets === "yes") amenities.push("Restrooms")
        if (tags?.parking === "yes") amenities.push("Parking")
        if (tags?.drinking_water === "yes") amenities.push("Water Fountains")
        if (tags?.lit === "yes") amenities.push("Lighting")
        if (tags?.fee === "no") amenities.push("Free")
        return amenities
    }

    const calculateDistance = (point1, point2) => {
        const R = 6371 // Earth's radius in kilometers
        const dLat = (point2.lat - point1.lat) * (Math.PI / 180)
        const dLng = (point2.lng - point1.lng) * (Math.PI / 180)
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.lat * (Math.PI / 180)) *
            Math.cos(point2.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const openInMaps = (facility) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}&travelmode=driving`
        window.open(url, "_blank")
    }

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={48} sx={{ marginBottom: 2 }} />
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                        Searching for {category.name.toLowerCase()}...
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            {error && (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Simple Map Placeholder */}
            <Box
                sx={{
                    height: 300,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    marginBottom: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    backgroundImage: `linear-gradient(45deg, ${theme.palette.background.default} 25%, transparent 25%), 
                           linear-gradient(-45deg, ${theme.palette.background.default} 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, ${theme.palette.background.default} 75%), 
                           linear-gradient(-45deg, transparent 75%, ${theme.palette.background.default} 75%)`,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
            >
                <Box sx={{ textAlign: "center", zIndex: 1 }}>
                    <MapPin size={48} color={theme.palette.primary.main} />
                    <Typography variant="h6" sx={{ marginTop: 1, color: theme.palette.text.primary }}>
                        Interactive Map
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Showing {facilities.length} {category.name.toLowerCase()} near you
                    </Typography>
                </Box>
            </Box>

            {/* Facilities List */}
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600 }}>
                Found {facilities.length} {category.name}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {facilities.map((facility) => (
                    <Card
                        key={facility.id}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                                cursor: "pointer",
                            },
                        }}
                        onClick={() => setSelectedFacility(facility)}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    {facility.name}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Star size={16} color="#ffc107" fill="#ffc107" />
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {facility.rating.toFixed(1)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                <MapPin size={16} color={theme.palette.text.secondary} />
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    {facility.address} • {facility.distance.toFixed(1)} km away
                                </Typography>
                            </Box>

                            {facility.phone && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                    <Phone size={16} color={theme.palette.text.secondary} />
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {facility.phone}
                                    </Typography>
                                </Box>
                            )}

                            {facility.openingHours && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                    <Clock size={16} color={theme.palette.text.secondary} />
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {facility.openingHours}
                                    </Typography>
                                </Box>
                            )}

                            {facility.amenities.length > 0 && (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 2 }}>
                                    {facility.amenities.map((amenity, index) => (
                                        <Chip key={index} label={amenity} size="small" variant="outlined" sx={{ fontSize: "0.75rem" }} />
                                    ))}
                                </Box>
                            )}

                            <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        openInMaps(facility)
                                    }}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: theme.palette.primary.main,
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <Navigation size={14} />
                                    Directions
                                </button>
                                {facility.website && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(facility.website, "_blank")
                                        }}
                                        style={{
                                            padding: "6px 12px",
                                            backgroundColor: "transparent",
                                            color: theme.palette.primary.main,
                                            border: `1px solid ${theme.palette.primary.main}`,
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        <Globe size={14} />
                                        Website
                                    </button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {facilities.length === 0 && !isLoading && (
                <Box
                    sx={{
                        textAlign: "center",
                        padding: 4,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: 1, color: theme.palette.text.primary }}>
                        No {category.name} Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Try expanding your search radius or check a different area.
                    </Typography>
                </Box>
            )}
        </Box>
    )
}
