import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        mode: "dark", // Apple-inspired dark mode
        primary: {
            main: "#007aff", // Apple blue for primary actions
        },
        background: {
            default: "#000000", // Pure black background like Apple
            paper: "#1a1a1a", // Slightly lighter black for card/paper
        },
        text: {
            primary: "#f5f5f7", // Light text
            secondary: "#a0a0a0", // Secondary text
        },
        // Google-inspired colors
        googleBlue: {
            main: "#4285F4",
        },
        googleRed: {
            main: "#EA4335",
        },
        googleYellow: {
            main: "#FBBC05",
        },
        googleGreen: {
            main: "#34A853",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        h4: {
            fontWeight: 700,
            letterSpacing: "-0.02em",
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#2a2a2a", // Darker input background
                        "& fieldset": {
                            borderColor: "#3a3a3a", // Darker border
                        },
                        "&:hover fieldset": {
                            borderColor: "#007aff", // Apple blue on hover
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#007aff", // Apple blue on focus
                            boxShadow: "0 0 0 3px rgba(0, 122, 255, 0.3)",
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "#f5f5f7",
                    },
                    "& .MuiInputLabel-root": {
                        color: "#a0a0a0",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#007aff",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "15px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none", // Prevent uppercase
                    transition: "background-color 0.2s ease, opacity 0.2s ease",
                },
                containedPrimary: {
                    backgroundColor: "#007aff", // Apple blue
                    "&:hover": {
                        backgroundColor: "#005bb5", // Darker blue on hover
                    },
                },
            },
        },
    },
})

export default theme
