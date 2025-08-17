export const booksData = [
    {
        id: 1,
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        cover: "/blogs/readinglist/design-data-intensive-application.jpg",
        category: "Technical",
        rating: 5,
        literalUrl: "https://literal.club/book/designing-data-intensive-applications-cknjz",
        description: "The big ideas behind reliable, scalable, and maintainable systems",
    },
    {
        id: 2,
        title: "Clean Architecture",
        author: "Robert C. Martin",
        cover: "/blogs/readinglist/clean-architecture.jpg",
        category: "Technical",
        rating: 4.5,
        literalUrl:
            "https://literal.club/book/clean-architecture-a-craftsmans-guide-to-software-structure-and-design-cknjz",
        description: "A Craftsman's Guide to Software Structure and Design",
    },
    {
        id: 3,
        title: "Software Architecture: The Hard Parts",
        author: "Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani",
        cover: "/blogs/readinglist/software-architecture-hard-parts.jpg",
        category: "Technical",
        rating: 4.8,
        literalUrl: "https://literal.club/book/software-architecture-the-hard-parts-cknjz",
        description: "Modern Trade-Off Analyses for Distributed Architectures",
    },
    {
        id: 4,
        title: "Site Reliability Engineering",
        author: "Google SRE Team",
        cover: "/blogs/readinglist/site-relability-engineering.png",
        category: "Technical",
        rating: 4.7,
        literalUrl: "https://literal.club/book/site-reliability-engineering-cknjz",
        description: "How Google Runs Production Systems",
    },
    {
        id: 5,
        title: "Cloud Native Patterns",
        author: "Cornelia Davis",
        cover: "/blogs/readinglist/cloud-native-pattern.jpg",
        category: "Technical",
        rating: 4.4,
        literalUrl: "https://literal.club/book/cloud-native-patterns-cknjz",
        description: "Designing change-tolerant software",
    },
    {
        id: 6,
        title: "Building Secure & Reliable Systems",
        author: "Heather Adkins, Betsy Beyer, Paul Blankinship, Piotr Lewandowski, Ana Oprea, Adam Stubblefield",
        cover: "/blogs/readinglist/building-secure-reliable-systems.png",
        category: "Technical",
        rating: 4.6,
        literalUrl: "https://literal.club/book/building-secure-reliable-systems-cknjz",
        description: "Best Practices for Designing, Implementing and Maintaining Systems",
    },
]

export const getBooksByCategory = (category) => {
    if (category === "all" || category === "Technical") {
        return booksData
    }
    return booksData.filter((book) => book.category.toLowerCase() === category.toLowerCase())
}

export const getBookCategories = () => {
    return ["Technical"]
}

export const getBookStats = () => {
    return {
        total: booksData.length,
        technical: booksData.filter((book) => book.category === "Technical").length,
        novel: 0,
        nonTech: 0,
    }
}
