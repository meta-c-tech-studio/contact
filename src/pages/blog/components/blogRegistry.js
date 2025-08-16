// 组件注册表
import GEOOptimizationBlog from "../lists/geo-optimization-blog";
import DataPipelineBlog from "../lists/data-pipline-blog";
import ScalableArchitectureBlog from "../lists/scalable-architecture-blog";

const blogRegistry = [
    {
        slug: "understanding-data-pipelines",
        component: DataPipelineBlog,
    },
    {
        slug: "scalable-architecture-three-dimensions",
        component: ScalableArchitectureBlog,
    },
    {
        slug: "geo-optimization-ai-era",
        component: GEOOptimizationBlog,
    },
]

const extractMetadataFromComponent = (component, slug, index) => {

    const metadata = {
        id: (index + 1).toString(),
        slug: slug,
        title: "",
        summary: "",
        date: "",
        dateSort: "",
    }

    try {
        const componentSource = component.toString()

        const titleMatch =
            componentSource.match(/variant="h[13]"[^}]*children:\s*"([^"]+)"/i) ||
            componentSource.match(/variant="h[13]"[^>]*>([^<]+)</i) ||
            componentSource.match(/"([^"]*(?:Understanding|Mastering|GEO)[^"]*)"/)

        if (titleMatch) {
            metadata.title = titleMatch[1].replace(/\\"/g, '"').trim()
        }

        const summaryMatch =
            componentSource.match(/variant="body1"[^}]*paragraph[^}]*children:\s*"([^"]+)"/i) ||
            componentSource.match(/lineHeight:\s*1\.8[^}]*"([^"]{50,200}[^"]*)"/)

        if (summaryMatch) {
            const summary = summaryMatch[1].replace(/\\"/g, '"').trim()
            metadata.summary = summary.length > 200 ? summary.substring(0, 200) + "..." : summary
        }

        // 提取日期
        const dateMatch =
            componentSource.match(/(?:Updated|Published) on ([^"]+)/i) || componentSource.match(/(\w+ \d{1,2}, \d{4})/)

        if (dateMatch) {
            metadata.date = dateMatch[1].trim()
            metadata.dateSort = convertDateToSortable(metadata.date)
        }

        if (!metadata.title || !metadata.summary || !metadata.date) {
            const fallbackData = getFallbackData(slug)
            metadata.title = metadata.title || fallbackData.title
            metadata.summary = metadata.summary || fallbackData.summary
            metadata.date = metadata.date || fallbackData.date
            metadata.dateSort = metadata.dateSort || fallbackData.dateSort
        }
    } catch (error) {
        console.error(`Error extracting metadata for ${slug}:`, error)
        const fallbackData = getFallbackData(slug)
        Object.assign(metadata, fallbackData)
    }

    return metadata
}
const getFallbackData = (slug) => {
    const fallbackMap = {
        "understanding-data-pipelines": {
            title: "Understanding Data Pipelines",
            summary:
                "Collect, process, and analyze vast amounts of information for businesses and organizations.",
        },
        "scalable-architecture-three-dimensions": {
            title: "Scalable Architecture: The Three Dimensions of Scale",
            summary:
                "The Three Dimensions of Scale",
        },
        "geo-optimization-ai-era": {
            title: "Understanding AI Recommendation Mechanisms: The Essence of GEO",
            summary:
                "Understanding AI Recommendation Mechanisms",
        },
    }

    return (
        fallbackMap[slug] || {
            title: "Blog Post",
            summary: "Blog post summary",
            dateSort: "1970-01-01",
        }
    )
}

const convertDateToSortable = (dateString) => {
    try {
        const date = new Date(dateString)
        return date.toISOString().split("T")[0]
    } catch {
        return "1970-01-01"
    }
}

// 获取所有blog文章（自动提取元数据）
export const getAllBlogPosts = () => {
    const blogPosts = blogRegistry.map((blog, index) => {
        return extractMetadataFromComponent(blog.component, blog.slug, index)
    })

    // 按日期排序（最新在前）
    return blogPosts.sort((a, b) => new Date(b.dateSort) - new Date(a.dateSort))
}

export const getBlogPostBySlug = (slug) => {
    const blogIndex = blogRegistry.findIndex((blog) => blog.slug === slug)
    if (blogIndex === -1) return null

    const blog = blogRegistry[blogIndex]
    return extractMetadataFromComponent(blog.component, blog.slug, blogIndex)
}

// 获取组件映射（用于blog-detail页面）
export const getBlogComponents = () => {
    const components = {}
    blogRegistry.forEach((blog) => {
        components[blog.slug] = blog.component
    })
    return components
}
