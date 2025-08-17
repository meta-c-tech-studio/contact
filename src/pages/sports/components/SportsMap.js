import { useState, useEffect } from "react"
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Chip } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { MapPin, Navigation, Phone, Globe } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

export default function SportsMap({ userLocation, category }) {
    const theme = useTheme()
    const [facilities, setFacilities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedFacility, setSelectedFacility] = useState(null)

    // Load Leaflet CSS dynamically
    useEffect(() => {
        // Create link element for Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        link.crossOrigin = ""
        document.head.appendChild(link)

        return () => {
            // Cleanup
            const existingLink = document.querySelector('link[href*="leaflet.css"]')
            if (existingLink) {
                document.head.removeChild(existingLink)
            }
        }
    }, [])

    // Fix for default markers in react-leaflet - use CDN instead
    useEffect(() => {
        // Load Leaflet from CDN and fix markers
        if (typeof window !== "undefined") {
            const script = document.createElement("script")
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            script.onload = () => {
                // Fix marker icons
                delete window.L.Icon.Default.prototype._getIconUrl
                window.L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                })
            }
            document.head.appendChild(script)
        }
    }, [])

    useEffect(() => {
        if (!category || !userLocation) {
            setError(!category ? "Loading category..." : "Loading location...")
            return
        }

        // Start searching for facilities immediately
        searchNearbyFacilities()
    }, [userLocation, category])

    // Early return if category is not defined
    if (!category) {
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
                        Loading category...
                    </Typography>
                </Box>
            </Box>
        )
    }

    const searchNearbyFacilities = async () => {
        setIsLoading(true)
        setError("")
        setFacilities([])

        try {
            // Use OpenStreetMap Overpass API - supports CORS, free, real data, works globally
            const overpassQuery = buildOverpassQuery(userLocation, category)

            console.log("🔍 Searching globally with Overpass API:", overpassQuery)

            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `data=${encodeURIComponent(overpassQuery)}`,
            })

            if (!response.ok) {
                throw new Error(`Overpass API error: ${response.status}`)
            }

            const data = await response.json()
            console.log("📍 Overpass API response:", data)

            if (data.elements && data.elements.length > 0) {
                const processedFacilities = data.elements
                    .filter((element) => element.lat && element.lon && element.tags && element.tags.name)
                    .map((element) => ({
                        id: element.id.toString(),
                        name: element.tags.name,
                        lat: element.lat,
                        lng: element.lon,
                        type: category.id,
                        address: buildAddress(element.tags),
                        phone: element.tags.phone || element.tags["contact:phone"] || null,
                        website: element.tags.website || element.tags["contact:website"] || null,
                        openingHours: parseOpeningHours(element.tags.opening_hours),
                        rating: null, // OSM doesn't have ratings
                        userRatingsTotal: 0,
                        priceLevel: null,
                        photos: [],
                        isOpen: null,
                        amenities: extractAmenitiesFromOSM(element.tags),
                        distance: calculateDistance(userLocation, { lat: element.lat, lng: element.lon }),
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 15) // Limit results

                setFacilities(processedFacilities)

                if (processedFacilities.length === 0) {
                    setError("No facilities found. Try searching in a different area or sport type.")
                }
            } else {
                // If no results found, try broader search
                await searchWithBroaderTerms()
            }
        } catch (err) {
            console.error("Error fetching facilities:", err)
            setError(`Failed to fetch facilities data: ${err.message}`)

            // Try alternative APIs
            await tryAlternativeAPIs()
        } finally {
            setIsLoading(false)
        }
    }

    // Build Overpass query for global search
    const buildOverpassQuery = (location, category) => {
        const radius = 5000 // 5km radius
        const { lat, lng } = location

        // Build queries based on sport type - works globally
        const queries = {
            volleyball: `
        [out:json][timeout:25];
        (
          node["sport"="volleyball"](around:${radius},${lat},${lng});
          node["leisure"="sports_centre"]["sport"~"volleyball"](around:${radius},${lat},${lng});
          node["amenity"="community_centre"]["sport"~"volleyball"](around:${radius},${lat},${lng});
          way["sport"="volleyball"](around:${radius},${lat},${lng});
          way["leisure"="sports_centre"]["sport"~"volleyball"](around:${radius},${lat},${lng});
        );
        out center meta;
      `,
            running: `
        [out:json][timeout:25];
        (
          node["leisure"="park"](around:${radius},${lat},${lng});
          node["leisure"="track"]["sport"="running"](around:${radius},${lat},${lng});
          node["highway"="footway"]["foot"="designated"](around:${radius},${lat},${lng});
          way["leisure"="park"](around:${radius},${lat},${lng});
          way["leisure"="track"]["sport"="running"](around:${radius},${lat},${lng});
          relation["leisure"="park"](around:${radius},${lat},${lng});
        );
        out center meta;
      `,
            skiing: `
        [out:json][timeout:25];
        (
          node["sport"="skiing"](around:${radius},${lat},${lng});
          node["leisure"="ski_resort"](around:${radius},${lat},${lng});
          node["piste:type"](around:${radius},${lat},${lng});
          way["sport"="skiing"](around:${radius},${lat},${lng});
          way["leisure"="ski_resort"](around:${radius},${lat},${lng});
          way["piste:type"](around:${radius},${lat},${lng});
        );
        out center meta;
      `,
        }

        return queries[category.id] || queries.running
    }

    // Broader search for global locations
    const searchWithBroaderTerms = async () => {
        const radius = 10000 // Expand to 10km
        const { lat, lng } = userLocation

        const broadQuery = `
      [out:json][timeout:25];
      (
        node["leisure"="sports_centre"](around:${radius},${lat},${lng});
        node["leisure"="fitness_centre"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        way["leisure"="sports_centre"](around:${radius},${lat},${lng});
        way["leisure"="fitness_centre"](around:${radius},${lat},${lng});
        way["leisure"="park"](around:${radius},${lat},${lng});
      );
      out center meta;
    `

        try {
            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `data=${encodeURIComponent(broadQuery)}`,
            })

            const data = await response.json()

            if (data.elements && data.elements.length > 0) {
                const processedFacilities = data.elements
                    .filter((element) => element.lat && element.lon && element.tags && element.tags.name)
                    .map((element) => ({
                        id: element.id.toString(),
                        name: element.tags.name,
                        lat: element.lat,
                        lng: element.lon,
                        type: "general",
                        address: buildAddress(element.tags),
                        phone: element.tags.phone || element.tags["contact:phone"] || null,
                        website: element.tags.website || element.tags["contact:website"] || null,
                        openingHours: parseOpeningHours(element.tags.opening_hours),
                        rating: null,
                        userRatingsTotal: 0,
                        priceLevel: null,
                        photos: [],
                        isOpen: null,
                        amenities: extractAmenitiesFromOSM(element.tags),
                        distance: calculateDistance(userLocation, { lat: element.lat, lng: element.lon }),
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 10)

                setFacilities(processedFacilities)
            }
        } catch (error) {
            console.error("Broad search failed:", error)
        }
    }

    // Try alternative APIs for global search
    const tryAlternativeAPIs = async () => {
        try {
            // Use Nominatim API for global search
            const query = `${category.searchQuery} near ${userLocation.lat},${userLocation.lng}`
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&bounded=1&viewbox=${userLocation.lng - 0.1},${userLocation.lat + 0.1},${userLocation.lng + 0.1},${userLocation.lat - 0.1}`

            const response = await fetch(nominatimUrl, {
                headers: {
                    "User-Agent": "SportsFinderApp/1.0",
                },
            })

            if (response.ok) {
                const data = await response.json()

                const nominatimFacilities = data
                    .filter((place) => place.display_name && place.lat && place.lon)
                    .map((place) => ({
                        id: place.place_id.toString(),
                        name: place.display_name.split(",")[0],
                        lat: Number.parseFloat(place.lat),
                        lng: Number.parseFloat(place.lon),
                        type: category.id,
                        address: place.display_name,
                        phone: null,
                        website: null,
                        openingHours: null,
                        rating: null,
                        userRatingsTotal: 0,
                        priceLevel: null,
                        photos: [],
                        isOpen: null,
                        distance: calculateDistance(userLocation, {
                            lat: Number.parseFloat(place.lat),
                            lng: Number.parseFloat(place.lon),
                        }),
                        source: "Nominatim",
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 8)

                if (nominatimFacilities.length > 0) {
                    setFacilities(nominatimFacilities)
                    setError("Using Nominatim API for data. Results may be less detailed than specialized map services.")
                }
            }
        } catch (error) {
            console.error("Nominatim API also failed:", error)
        }
    }

    // Build address - works globally
    const buildAddress = (tags) => {
        const addressParts = []

        if (tags["addr:housenumber"]) addressParts.push(tags["addr:housenumber"])
        if (tags["addr:street"]) addressParts.push(tags["addr:street"])
        if (tags["addr:city"]) addressParts.push(tags["addr:city"])
        if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"])
        if (tags["addr:country"]) addressParts.push(tags["addr:country"])

        if (addressParts.length > 0) {
            return addressParts.join(", ")
        }

        // Fallback address info
        if (tags.name) return `Near ${tags.name}`
        return "Address not available"
    }

    // Parse opening hours - works globally
    const parseOpeningHours = (openingHours) => {
        if (!openingHours) return null

        // Simple parsing of OSM opening hours format
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const parsed = []

        if (openingHours.includes("24/7")) {
            return days.map((day) => `${day}: Open 24 hours`)
        }

        if (openingHours.includes("Mo-Fr")) {
            const hours = openingHours.replace("Mo-Fr ", "")
            for (let i = 0; i < 5; i++) {
                parsed.push(`${days[i]}: ${hours}`)
            }
        }

        return parsed.length > 0 ? parsed : [openingHours]
    }

    // Extract amenities from OSM tags - works globally
    const extractAmenitiesFromOSM = (tags) => {
        const amenities = []

        if (tags.wheelchair === "yes") amenities.push("Wheelchair Accessible")
        if (tags.parking) amenities.push("Parking")
        if (tags.fee === "no") amenities.push("Free")
        if (tags.fee === "yes") amenities.push("Paid")
        if (tags.toilets === "yes") amenities.push("Toilets")
        if (tags.changing_table === "yes") amenities.push("Changing Rooms")
        if (tags.shower === "yes") amenities.push("Showers")
        if (tags.lighting === "yes") amenities.push("Lighting")
        if (tags.surface) amenities.push(`Surface: ${tags.surface}`)
        if (tags.access === "public") amenities.push("Public Access")
        if (tags.access === "private") amenities.push("Private")

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
                        Searching  for {category?.name?.toLowerCase() || "facilities"}...
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginTop: 1 }}>
                        🌍 Searching globally using open-source map data
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
                    <Box sx={{ marginTop: 1 }}>
                        <Typography variant="body2">
                            <strong>Data source:</strong> OpenStreetMap - global map data
                            <br />
                            <strong>Note:</strong> Data completeness varies by region and local contributors
                        </Typography>
                    </Box>
                </Alert>
            )}

            {/* Interactive Map */}
            <Box
                sx={{
                    height: 400,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    marginBottom: 3,
                    overflow: "hidden",
                }}
            >
                <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* User location marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                            <Typography variant="body2">
                                <strong>Your Location</strong>
                            </Typography>
                        </Popup>
                    </Marker>

                    {/* Facility markers */}
                    {facilities.map((facility) => (
                        <Marker key={facility.id} position={[facility.lat, facility.lng]}>
                            <Popup>
                                <Box sx={{ minWidth: 200 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                                        {facility.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                        {facility.address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                        Distance: {facility.distance.toFixed(1)} km
                                    </Typography>
                                    {facility.phone && (
                                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                            📞 {facility.phone}
                                        </Typography>
                                    )}
                                    <button
                                        onClick={() => openInMaps(facility)}
                                        style={{
                                            padding: "4px 8px",
                                            backgroundColor: theme.palette.primary.main,
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        Get Directions
                                    </button>
                                </Box>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>

            {/* Facilities List */}
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600 }}>
                Found {facilities.length} {category?.name || "Facilities"}
                <Chip label="Global Coverage" size="small" color="success" sx={{ marginLeft: 1 }} />
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
                            {/* Header with basic info */}
                            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box
                                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                            {facility.name}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                        <MapPin size={16} color={theme.palette.text.secondary} />
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            {facility.address} • {facility.distance.toFixed(1)} km away
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Contact Information */}
                            {facility.phone && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                    <Phone size={16} color={theme.palette.text.secondary} />
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {facility.phone}
                                    </Typography>
                                </Box>
                            )}

                            {facility.website && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                                    <Globe size={16} color={theme.palette.text.secondary} />
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {facility.website}
                                    </Typography>
                                </Box>
                            )}

                            {/* Opening Hours */}
                            {facility.openingHours && (
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                                        Opening Hours:
                                    </Typography>
                                    <Box sx={{ paddingLeft: 2 }}>
                                        {facility.openingHours.slice(0, 3).map((hours, index) => (
                                            <Typography
                                                key={index}
                                                variant="body2"
                                                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
                                            >
                                                {hours}
                                            </Typography>
                                        ))}
                                        {facility.openingHours.length > 3 && (
                                            <Typography
                                                variant="body2"
                                                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem", fontStyle: "italic" }}
                                            >
                                                ... and {facility.openingHours.length - 3} more days
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}

                     

                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        openInMaps(facility)
                                    }}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: theme.palette.primary.main,
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontWeight: 600,
                                    }}
                                >
                                    <Navigation size={16} />
                                    Get Directions
                                </button>
                                {facility.website && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(facility.website, "_blank")
                                        }}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "transparent",
                                            color: theme.palette.primary.main,
                                            border: `1px solid ${theme.palette.primary.main}`,
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        <Globe size={16} />
                                        Visit Website
                                    </button>
                                )}
                                {facility.phone && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(`tel:${facility.phone}`, "_self")
                                        }}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "transparent",
                                            color: theme.palette.success?.main || "#4caf50",
                                            border: `1px solid ${theme.palette.success?.main || "#4caf50"}`,
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        <Phone size={16} />
                                        Call
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
                        No {category?.name || "Facilities"} Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
                        Map data may be incomplete in this area.
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Try selecting a different sport type or searching in a more populated area.
                    </Typography>
                </Box>
            )}
        </Box>
    )
}
