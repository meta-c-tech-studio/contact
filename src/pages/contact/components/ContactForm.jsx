"use client"

import { useState } from "react"
import { TextField, Button, Typography, Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import emailjs from "@emailjs/browser" // Import EmailJS library

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [submissionStatus, setSubmissionStatus] = useState(null) // 'success' or 'error'
    const [isSubmitting, setIsSubmitting] = useState(false)
    const currentTheme = useTheme() // Access the custom theme

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmissionStatus(null)

        // 替换为您的实际 EmailJS Service ID 和 Public Key
        const serviceId = "service_tev1iff" // 您的 Service ID
        const publicKey = "qOU7GzjuQxELKHNv0" // 您的 Public Key

        // 替换为您的两个模板的 ID
        const autoReplyTemplateId = "template_4clo1yh" // 自动回复模板 ID
        const notificationTemplateId = "template_l69hp5f" // 通知模板 ID (发送到您的邮箱)

        try {
            // 1. 发送自动回复给用户
            await emailjs.send(serviceId, autoReplyTemplateId, formData, publicKey)
            console.log("Auto-reply sent to user:", formData.email)

            // 2. 发送通知邮件到您的邮箱
            await emailjs.send(serviceId, notificationTemplateId, formData, publicKey)
            console.log("Notification email sent to your Gmail.")

            setSubmissionStatus("success")
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            })
        } catch (error) {
            console.error("EmailJS submission error:", error)
            setSubmissionStatus("error")
        } finally {
            setIsSubmitting(false)
            setTimeout(() => setSubmissionStatus(null), 3000) // Clear status after 3 seconds
        }
    }

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600, // Increased max-width for a more "page-like" feel
                // Removed padding here as it will be handled by the parent ContactPage layout
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column", // Allow content to stack vertically
                alignItems: "center", // Center content horizontally
                justifyContent: "center", // Center content vertically if space allows
                // Removed minHeight here as it will be handled by the parent ContactPage layout
            }}
        >
            <Box sx={{ textAlign: "center", marginBottom: { xs: 4, sm: 6 } }}>
                <Typography variant="h4" component="h1" sx={{ marginBottom: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}>
                    <Box component="span" sx={{ color: currentTheme.palette.googleBlue.main }}>
                        C
                    </Box>
                    <Box component="span" sx={{ color: currentTheme.palette.googleRed.main }}>
                        o
                    </Box>
                    <Box component="span" sx={{ color: currentTheme.palette.googleYellow.main }}>
                        n
                    </Box>
                    <Box component="span" sx={{ color: currentTheme.palette.googleGreen.main }}>
                        t
                    </Box>
                    <Box component="span" sx={{ color: currentTheme.palette.text.primary }}>
                        a
                    </Box>
                    <Box component="span" sx={{ color: currentTheme.palette.text.primary }}>
                        c
                    </Box>
                    <Box component="span" sx={{ color: currentTheme.palette.text.primary }}>
                        t
                    </Box>
                </Typography>
             
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", "& > :not(style)": { marginBottom: 3 } }}>
                <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    id="subject"
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    value={formData.subject}
                    onChange={handleChange}
                    required
                />
                <TextField
                    id="message"
                    label="Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ marginTop: 2 }}
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                {submissionStatus === "success" && (
                    <Typography sx={{ textAlign: "center", color: "#34c759", marginTop: 2 }}>
                        Your message has been sent successfully!
                    </Typography>
                )}
                {submissionStatus === "error" && (
                    <Typography sx={{ textAlign: "center", color: "#ff3b30", marginTop: 2 }}>
                        There was an error sending your message. Please try again.
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
