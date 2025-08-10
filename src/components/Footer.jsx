import { Box, Typography, Link, Grid } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export default function Footer() {
    const theme = useTheme()
    const currentYear = new Date().getFullYear()

    const footerLinks = [
        {
            title: "Playground",
            links: [
                { name: "Programming Exercise", href: "/programming-exercise" },
                { name: "AI coding", href: "#" },
                { name: "Blog", href: "/blog" },
                { name: "Integrations", href: "#" },
            ],
        },
        {
            title: "Intro",
            links: [
                { name: "About", href: "#" },
                { name: "Press", href: "#" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Help Center & FAQs", href: "#" },
                { name: "Privacy & Terms", href: "#" },
                { name: "Contact", href: "#" },
            ],
        },
    ]

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: theme.palette.background.paper, // Dark gray background for footer
                borderTop: `1px solid ${theme.palette.divider}`, // Subtle divider
                boxSizing: "border-box",
                color: theme.palette.text.secondary,
                paddingY: { xs: 4, sm: 6, md: 8 }, // Vertical padding
            }}
        >
            {/* Inner Box to center the entire content block */}
            <Box
                sx={{
                    maxWidth: { xs: "100%", md: "1200px" }, // Limit max width on larger screens
                    margin: "0 auto", // Center the content horizontally
                    paddingX: { xs: 4, sm: 6, md: 8 }, // Responsive horizontal padding for content
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 4, md: 16 }} // Increased spacing for wider gaps
                    justifyContent="space-between" // Pushes first item left, last item right
                    alignItems="flex-start" // Align items to the top of their cells
                >
                    {/* Left section with Logo */}
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
                        {" "}
                        {/* Center on small, left on medium+ */}
                        <Box sx={{ marginBottom: 2 }}>
                            <img
                                src="/googleusercropped_circle_image.png" // Corrected path
                                alt="Company Logo"
                                style={{
                                    width: 60, // Adjust size as needed
                                    height: 60, // Adjust size as needed
                                    borderRadius: "50%", // Make it circular
                                    display: "block", // Ensure it takes up its own line
                                    margin: { xs: "0 auto", md: "0" }, // Center on small, left on medium+
                                    marginBottom: theme.spacing(1), // Space between logo and text
                                }}
                            />
                        </Box>
                       
                        <Typography variant="body2" sx={{ margin: { xs: "0 auto 16px", md: "0" } }}>
                            Making things simple.
                        </Typography>
                    </Grid>
                    {/* Link columns */}
                    {footerLinks.map((column, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index} sx={{ textAlign: { xs: "center", md: "right" } }}>
                            {" "}
                            {/* Center on small, right on medium+ */}
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    marginBottom: { xs: 2, sm: 3 },
                                }}
                            >
                                {column.title}
                            </Typography>
                            <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex} style={{ marginBottom: theme.spacing(1) }}>
                                        <Link
                                            href={link.href}
                                            color="inherit"
                                            underline="none"
                                            sx={{
                                                "&:hover": {
                                                    color: theme.palette.primary.main, // Apple blue on hover
                                                },
                                            }}
                                        >
                                            <Typography variant="body2">{link.name}</Typography>
                                        </Link>
                                    </li>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Copyright section */}
            <Box
                sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    marginTop: { xs: 4, sm: 6 },
                    paddingTop: { xs: 3, sm: 4 },
                    textAlign: "center",
                }}
            >
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {`© ${currentYear} L.C. All rights reserved.`}
                </Typography>
            </Box>
        </Box>
    )
}
