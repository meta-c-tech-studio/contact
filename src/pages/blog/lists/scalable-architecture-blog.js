"use client"

import { Box, Typography, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Lock } from "lucide-react"

export default function ScalableArchitectureBlog() {
    const theme = useTheme()

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: "0 auto",
                padding: { xs: 3, sm: 5, md: 8 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                color: theme.palette.text.primary,
                position: "relative",
            }}
        >
            <Box
                sx={{
                    maxHeight: "33.33vh",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        marginBottom: 2,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                >
                  Scalable Architecture
                </Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, marginBottom: 4 }}>
                    Updated on August 14, 2025
                </Typography>

                {/* Insert the scale cube image */}
                <Box sx={{ width: "100%", marginBottom: 4, textAlign: "center" }}>
                    <img
                        src="/blogs/cube.png"
                        alt="Scale Cube - Three Dimensions of Scaling Architecture"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                        }}
                    />
                </Box>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Building scalable systems is one of the most critical challenges in modern software architecture. The Scale
                    Cube, introduced by Martin Abbott and Michael Fisher, provides a comprehensive framework for understanding how
                    to scale applications across three fundamental dimensions. This architectural model has become essential
                    knowledge for system designers and engineers working on high-traffic applications.
                </Typography>

                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    Understanding the Three Dimensions of Scale
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    The Scale Cube represents three distinct approaches to scaling: X-axis (horizontal duplication), Y-axis
                    (functional decomposition), and Z-axis (data partitioning). Each dimension addresses different scalability
                    challenges and can be combined to create robust, highly scalable architectures.
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    X-Axis Scaling: Horizontal Duplication
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    X-axis scaling, also known as horizontal scaling, involves creating multiple identical copies of your
                    application and distributing incoming requests across these instances. This is the most straightforward
                    scaling approach and forms the foundation of most scalable systems.
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    <strong>Key Implementation Strategies:</strong>
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Load Balancing:</strong> Distribute requests across multiple server instances using algorithms like
                    round-robin, least connections, or weighted distribution
                    <br />• <strong>Database Read Replicas:</strong> Implement master-slave database patterns where writes go to
                    the master and reads are distributed across read replicas
                    <br />• <strong>Stateless Design:</strong> Ensure application instances don't store session state locally,
                    enabling any instance to handle any request
                    <br />• <strong>Auto-scaling:</strong> Automatically add or remove instances based on traffic patterns and
                    resource utilization
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Y-Axis Scaling: Functional Decomposition
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Y-axis scaling involves breaking down a monolithic application into smaller, specialized services based on
                    functionality. This approach, commonly known as microservices architecture, allows different parts of your
                    system to scale independently based on their specific demands.
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    <strong>Microservices Communication Patterns:</strong>
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Synchronous Communication:</strong> REST APIs, gRPC for direct service-to-service calls
                    <br />• <strong>Asynchronous Communication:</strong> Message queues (RabbitMQ, Apache Kafka), event buses for
                    decoupled interactions
                    <br />• <strong>Service Discovery:</strong> Tools like Eureka, Consul, or Kubernetes DNS for dynamic service
                    location
                    <br />• <strong>API Gateway:</strong> Centralized entry point for routing, authentication, and cross-cutting
                    concerns
                </Typography>

                <Typography variant="h5" component="h3" sx={{ marginTop: 3, marginBottom: 2, fontWeight: 600 }}>
                    Z-Axis Scaling: Data Partitioning and Sharding
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    Z-axis scaling focuses on splitting data across multiple databases or storage systems. This dimension is
                    crucial when your dataset becomes too large for a single database instance to handle efficiently.
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    <strong>Database Sharding Strategies:</strong>
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Hash-based Sharding:</strong> Use hash functions (SHA-256, MD5) on shard keys to determine data
                    placement. For n shards, use hash(shard_key) % n to distribute data evenly
                    <br />• <strong>Range-based Sharding:</strong> Partition data based on value ranges (e.g., user IDs 1-1000 in
                    shard 1, 1001-2000 in shard 2)
                    <br />• <strong>Geographic Sharding:</strong> Distribute data based on geographical regions to reduce latency
                    and comply with data residency requirements
                    <br />• <strong>Directory-based Sharding:</strong> Maintain a lookup service that maps data to specific shards
                </Typography>

                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    Database Architecture for Large Organizations
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    For large organizations with thousands of employees and complex business logic, a hybrid database approach
                    often works best. This involves strategically combining SQL and NoSQL databases based on specific use cases
                    and data characteristics.
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    <strong>Database Selection Criteria:</strong>
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>SQL Databases:</strong> Use for structured data with complex relationships, ACID compliance
                    requirements, and well-defined schemas (PostgreSQL, MySQL)
                    <br />• <strong>NoSQL Databases:</strong> Choose for flexible schemas, horizontal scaling needs, and rapid
                    development cycles (MongoDB, Cassandra, DynamoDB)
                    <br />• <strong>Specialized Databases:</strong> Redis for caching, Elasticsearch for search, InfluxDB for
                    time-series data
                </Typography>

                <Typography variant="h4" component="h2" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 600 }}>
                    Service Discovery and Communication
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    In a microservices architecture, services need to discover and communicate with each other dynamically. This
                    requires robust service discovery mechanisms and well-designed communication patterns.
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    <strong>Service Discovery Tools Comparison:</strong>
                </Typography>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, paddingLeft: 2 }}>
                    • <strong>Spring Cloud Eureka:</strong> Excellent integration with Spring ecosystem, easy configuration, but
                    limited to Java-based services
                    <br />• <strong>Consul:</strong> Language-agnostic, provides health checking and key-value store, but requires
                    additional operational complexity
                    <br />• <strong>Kubernetes DNS:</strong> Native service discovery for containerized environments, automatic
                    service registration, but tied to Kubernetes platform
                    <br />• <strong>AWS Cloud Map:</strong> Managed service discovery for cloud-native applications, integrates
                    well with AWS services, but vendor lock-in concerns
                </Typography>

                {/* Gradient overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100px",
                        background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
                        pointerEvents: "none",
                    }}
                />
            </Box>

            {/* Locked Content Button */}
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
                <Button
                    variant="contained"
                    disabled
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <Lock size={20} />
                </Button>
            </Box>
        </Box>
    )
}
