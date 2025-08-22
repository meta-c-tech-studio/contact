import { Box, Typography, Link, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export default function Header() {
    const theme = useTheme()
    const navLinks = [
        { name: "Programming Exercise", href: "/programming-exercise" },
        { name: "AI Automation", href: "/ai-coding" }, // New AI Coding link
        // { name: "Giit", href: "/giit" }, // Add Giit to navigation
        { name: "Blog", href: "/blog" },
        { name: "Sports", href: "/sports" },
    ]

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: theme.palette.background.default, // Pure black background
                borderBottom: `1px solid ${theme.palette.divider}`, // Subtle divider
                boxSizing: "border-box",
                paddingX: { xs: 2, sm: 4, md: 8 }, // Responsive horizontal padding
                paddingY: { xs: 2, sm: 3 }, // Vertical padding
                display: "flex",
                justifyContent: "space-between", // Logo left, nav right
                alignItems: "center",
            }}
        >
            {/* Logo */}
            <Typography
                variant="h5"
                component="div"
                sx={{
                    color: theme.palette.turquoise.main, // Use the new turquoise color for the logo
                    fontWeight: 700,
                    letterSpacing: "-0.05em", // Tighter letter spacing for "rife."
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                }}
            >
            </Typography>

            {/* Navigation Links and Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 4 } }}>
                {" "}
                {/* Modified gap */}
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        color="inherit"
                        underline="none"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            fontWeight: 500,
                            "&:hover": {
                                color: theme.palette.primary.main, // Apple blue on hover
                            },
                            display: "block", // Modified to be visible on mobile
                        }}
                    >
                        {link.name}
                    </Link>
                ))}

            </Box>
        </Box>
    )
}
