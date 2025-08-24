import { useState, useRef, useCallback, useEffect } from "react"
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Toolbar,
    Divider,
    Tooltip,
    ButtonGroup,
    Menu,
    MenuItem,
    TextField,
    Chip,
    Stack,
    Slider,
    ListItemIcon,
    ListItemText,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useMediaQuery,
    useTheme,
    SwipeableDrawer,
    BottomNavigation,
    BottomNavigationAction,
    Button,
} from "@mui/material"
import {
    MousePointer,
    Square,
    Circle,
    ArrowRight,
    Type,
    StickyNote,
    Trash2,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Maximize,
    Grid3X3,
    Copy,
    MoreHorizontal,
    Minus,
    Move,
    Hand,
    Undo,
    Redo,
    Download,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Underline,
    Triangle,
    Diamond,
    Star,
    Heart,
    Hexagon,
    Pentagon,
    ImageIcon,
    Link,
    Palette,
    Edit,
    Hand as Add,
    Clover as Close,
    MenuIcon,
    Touchpad as TouchApp,
    Aperture as Gesture,
    PanelBottom as PinchZoom,
} from "lucide-react"

export default function VisualCanvas({ onCanvasChange, generatedCode, language }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"))

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const fileInputRef = useRef(null)

    // 基础状态
    const [tool, setTool] = useState("select")
    const [elements, setElements] = useState([])
    const [selectedElements, setSelectedElements] = useState([])
    const [history, setHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [clipboard, setClipboard] = useState([])

    // 交互状态
    const [isDragging, setIsDragging] = useState(false)
    const [isPanning, setIsPanning] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [selectionBox, setSelectionBox] = useState(null)
    const [resizeHandle, setResizeHandle] = useState(null)

    // 触摸状态
    const [touchStart, setTouchStart] = useState(null)
    const [lastTouchEnd, setLastTouchEnd] = useState(0)
    const [touchDistance, setTouchDistance] = useState(0)
    const [initialZoom, setInitialZoom] = useState(1)
    const [isMultiTouch, setIsMultiTouch] = useState(false)
    const [longPressTimer, setLongPressTimer] = useState(null)
    const [contextMenuPosition, setContextMenuPosition] = useState(null)

    // 视图状态
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [showGrid, setShowGrid] = useState(true)
    const [snapToGrid, setSnapToGrid] = useState(true)
    const [gridSize, setGridSize] = useState(20)

    // 创建状态
    const [isCreating, setIsCreating] = useState(false)
    const [tempElement, setTempElement] = useState(null)

    // 编辑状态
    const [editingText, setEditingText] = useState(null)
    const [textInput, setTextInput] = useState("")
    const [textStyle, setTextStyle] = useState({
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "left",
        color: "#374151",
    })

    // 样式状态
    const [currentColor, setCurrentColor] = useState("#2563eb")
    const [currentFill, setCurrentFill] = useState("#ffffff")
    const [strokeWidth, setStrokeWidth] = useState(2)
    const [opacity, setOpacity] = useState(1)

    // 移动端UI状态
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
    const [mobileStylesOpen, setMobileStylesOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const [bottomNavValue, setBottomNavValue] = useState(0)
    const [showMobileHints, setShowMobileHints] = useState(true)

    // 菜单状态
    const [colorMenuAnchor, setColorMenuAnchor] = useState(null)
    const [moreMenuAnchor, setMoreMenuAnchor] = useState(null)
    const [styleMenuAnchor, setStyleMenuAnchor] = useState(null)
    const [textMenuAnchor, setTextMenuAnchor] = useState(null)
    const [shapeMenuAnchor, setShapeMenuAnchor] = useState(null)

    // 专业配色方案
    const professionalColors = [
        { name: "Blue", value: "#2563eb", category: "primary" },
        { name: "Indigo", value: "#4f46e5", category: "primary" },
        { name: "Purple", value: "#7c3aed", category: "primary" },
        { name: "Pink", value: "#ec4899", category: "primary" },
        { name: "Red", value: "#dc2626", category: "danger" },
        { name: "Orange", value: "#ea580c", category: "warning" },
        { name: "Amber", value: "#d97706", category: "warning" },
        { name: "Yellow", value: "#eab308", category: "warning" },
        { name: "Lime", value: "#65a30d", category: "success" },
        { name: "Green", value: "#059669", category: "success" },
        { name: "Emerald", value: "#10b981", category: "success" },
        { name: "Teal", value: "#0d9488", category: "success" },
        { name: "Cyan", value: "#0891b2", category: "info" },
        { name: "Sky", value: "#0284c7", category: "info" },
        { name: "Blue", value: "#2563eb", category: "info" },
        { name: "Gray", value: "#6b7280", category: "neutral" },
        { name: "Slate", value: "#475569", category: "neutral" },
        { name: "Black", value: "#111827", category: "neutral" },
    ]

    // 基础工具
    const basicTools = [
        { id: "select", icon: MousePointer, label: "Select", shortcut: "V" },
        { id: "hand", icon: Hand, label: "Pan", shortcut: "H" },
    ]

    // 形状工具
    const shapeTools = [
        { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
        { id: "circle", icon: Circle, label: "Circle", shortcut: "O" },
        { id: "triangle", icon: Triangle, label: "Triangle", shortcut: "T" },
        { id: "diamond", icon: Diamond, label: "Diamond", shortcut: "D" },
        { id: "star", icon: Star, label: "Star", shortcut: "S" },
        { id: "heart", icon: Heart, label: "Heart", shortcut: "" },
        { id: "hexagon", icon: Hexagon, label: "Hexagon", shortcut: "" },
        { id: "pentagon", icon: Pentagon, label: "Pentagon", shortcut: "" },
    ]

    // 内容工具
    const contentTools = [
        { id: "sticky", icon: StickyNote, label: "Sticky Note", shortcut: "N" },
        { id: "text", icon: Type, label: "Text", shortcut: "T" },
        { id: "image", icon: ImageIcon, label: "Image", shortcut: "I" },
    ]

    // 连接工具
    const connectorTools = [
        { id: "line", icon: Minus, label: "Line", shortcut: "L" },
        { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
        { id: "connector", icon: Link, label: "Connector", shortcut: "C" },
    ]

    // 生成唯一ID
    const generateId = () => Math.random().toString(36).substr(2, 9)

    // 保存历史状态
    const saveToHistory = useCallback(() => {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(JSON.parse(JSON.stringify(elements)))
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
    }, [elements, history, historyIndex])

    // 撤销
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
            setElements(history[historyIndex - 1])
            setSelectedElements([])
        }
    }, [history, historyIndex])

    // 重做
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1)
            setElements(history[historyIndex + 1])
            setSelectedElements([])
        }
    }, [history, historyIndex])

    // 网格对齐
    const snapToGridPoint = useCallback(
        (x, y) => {
            if (!snapToGrid) return { x, y }
            return {
                x: Math.round(x / gridSize) * gridSize,
                y: Math.round(y / gridSize) * gridSize,
            }
        },
        [snapToGrid, gridSize],
    )

    // 获取两点间距离
    const getDistance = (touch1, touch2) => {
        return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2))
    }

    // 获取两点中心点
    const getCenter = (touch1, touch2) => {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
        }
    }

    // 长按检测
    const startLongPress = useCallback(
        (e, element) => {
            const timer = setTimeout(() => {
                if (isMobile) {
                    // 移动端长按显示上下文菜单
                    const rect = canvasRef.current.getBoundingClientRect()
                    setContextMenuPosition({
                        x: e.touches[0].clientX - rect.left,
                        y: e.touches[0].clientY - rect.top,
                        element: element,
                    })
                    // 触觉反馈
                    if (navigator.vibrate) {
                        navigator.vibrate(50)
                    }
                }
            }, 500)
            setLongPressTimer(timer)
        },
        [isMobile],
    )

    const cancelLongPress = useCallback(() => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }, [longPressTimer])

    // 分析代码并生成专业思维导图
    const analyzeCodeAndGenerateMindMap = useCallback((code, lang) => {
        if (!code || !code.trim()) return []

        const mindMapElements = []
        let yOffset = 100
        const centerX = 400

        // 主标题
        mindMapElements.push({
            id: generateId(),
            type: "sticky",
            x: centerX - 100,
            y: yOffset,
            width: 200,
            height: 100,
            text: `${lang.toUpperCase()} Code Analysis`,
            color: "#2563eb",
            backgroundColor: "#eff6ff",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            opacity: 1,
            locked: false,
            visible: true,
        })

        yOffset += 150

        if (lang === "python") {
            const lines = code.split("\n").filter((line) => line.trim())

            // 函数分析
            const functions = lines.filter((line) => line.trim().startsWith("def "))
            if (functions.length > 0) {
                mindMapElements.push({
                    id: generateId(),
                    type: "rectangle",
                    x: centerX - 300,
                    y: yOffset,
                    width: 180,
                    height: 80,
                    text: "Functions",
                    color: "#059669",
                    backgroundColor: "#f0fdf4",
                    strokeWidth: 2,
                    opacity: 1,
                    locked: false,
                    visible: true,
                })

                // 连接线
                mindMapElements.push({
                    id: generateId(),
                    type: "connector",
                    x: centerX - 100,
                    y: yOffset - 50,
                    endX: centerX - 210,
                    endY: yOffset + 40,
                    color: "#6b7280",
                    strokeWidth: 2,
                    opacity: 1,
                    locked: false,
                    visible: true,
                })

                // 函数详情
                functions.forEach((func, index) => {
                    const funcName = func.match(/def\s+(\w+)/)?.[1] || "function"
                    mindMapElements.push({
                        id: generateId(),
                        type: "sticky",
                        x: centerX - 500,
                        y: yOffset + index * 90,
                        width: 150,
                        height: 60,
                        text: funcName,
                        color: "#7c3aed",
                        backgroundColor: "#faf5ff",
                        fontSize: 14,
                        opacity: 1,
                        locked: false,
                        visible: true,
                    })

                    // 连接线
                    mindMapElements.push({
                        id: generateId(),
                        type: "line",
                        x: centerX - 300,
                        y: yOffset + 40,
                        endX: centerX - 350,
                        endY: yOffset + index * 90 + 30,
                        color: "#6b7280",
                        strokeWidth: 1,
                        opacity: 0.7,
                        locked: false,
                        visible: true,
                    })
                })
            }

            // 类分析
            const classes = lines.filter((line) => line.trim().startsWith("class "))
            if (classes.length > 0) {
                mindMapElements.push({
                    id: generateId(),
                    type: "diamond",
                    x: centerX + 150,
                    y: yOffset,
                    width: 160,
                    height: 80,
                    text: "Classes",
                    color: "#dc2626",
                    backgroundColor: "#fef2f2",
                    strokeWidth: 2,
                    opacity: 1,
                    locked: false,
                    visible: true,
                })

                mindMapElements.push({
                    id: generateId(),
                    type: "connector",
                    x: centerX + 100,
                    y: yOffset - 50,
                    endX: centerX + 230,
                    endY: yOffset + 40,
                    color: "#6b7280",
                    strokeWidth: 2,
                    opacity: 1,
                    locked: false,
                    visible: true,
                })
            }

            // 导入分析
            const imports = lines.filter((line) => line.trim().startsWith("import ") || line.trim().startsWith("from "))
            if (imports.length > 0) {
                mindMapElements.push({
                    id: generateId(),
                    type: "circle",
                    x: centerX - 50,
                    y: yOffset + 200,
                    radius: 60,
                    text: `${imports.length} Imports`,
                    color: "#ea580c",
                    backgroundColor: "#fff7ed",
                    strokeWidth: 2,
                    opacity: 1,
                    locked: false,
                    visible: true,
                })

                mindMapElements.push({
                    id: generateId(),
                    type: "line",
                    x: centerX,
                    y: yOffset - 50,
                    endX: centerX - 50,
                    endY: yOffset + 140,
                    color: "#6b7280",
                    strokeWidth: 1,
                    opacity: 0.7,
                    locked: false,
                    visible: true,
                })
            }
        }

        return mindMapElements
    }, [])

    // 当代码改变时生成思维导图
    useEffect(() => {
        if (generatedCode && generatedCode.trim()) {
            const mindMapElements = analyzeCodeAndGenerateMindMap(generatedCode, language)
            setElements(mindMapElements)
            saveToHistory()
            setPan({ x: 50, y: 50 })
            setZoom(0.9)
        }
    }, [generatedCode, language, analyzeCodeAndGenerateMindMap])

    // 鼠标滚轮缩放
    const handleWheel = useCallback(
        (e) => {
            e.preventDefault()
            const rect = canvasRef.current.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
            const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5)

            const zoomRatio = newZoom / zoom
            setPan((prev) => ({
                x: mouseX - (mouseX - prev.x) * zoomRatio,
                y: mouseY - (mouseY - prev.y) * zoomRatio,
            }))

            setZoom(newZoom)
        },
        [zoom],
    )

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas && !isMobile) {
            canvas.addEventListener("wheel", handleWheel, { passive: false })
            return () => canvas.removeEventListener("wheel", handleWheel)
        }
    }, [handleWheel, isMobile])

    // 创建新元素
    const createElement = useCallback(
        (type, x, y, endX = null, endY = null) => {
            const snappedPos = snapToGridPoint((x - pan.x) / zoom, (y - pan.y) / zoom)

            const baseElement = {
                id: generateId(),
                type,
                x: snappedPos.x,
                y: snappedPos.y,
                color: currentColor,
                backgroundColor: currentFill,
                strokeWidth: strokeWidth,
                opacity: opacity,
                locked: false,
                visible: true,
                rotation: 0,
                zIndex: elements.length,
            }

            switch (type) {
                case "sticky":
                    return {
                        ...baseElement,
                        width: isMobile ? 160 : 200,
                        height: isMobile ? 120 : 150,
                        text: "New sticky note",
                        fontSize: isMobile ? 12 : 14,
                        fontWeight: "normal",
                        textAlign: "left",
                        backgroundColor: "#fef3c7",
                    }
                case "text":
                    return {
                        ...baseElement,
                        width: isMobile ? 160 : 200,
                        height: isMobile ? 40 : 50,
                        text: "Text",
                        fontSize: textStyle.fontSize,
                        fontWeight: textStyle.fontWeight,
                        fontStyle: textStyle.fontStyle,
                        textDecoration: textStyle.textDecoration,
                        textAlign: textStyle.textAlign,
                        backgroundColor: "transparent",
                    }
                case "rectangle":
                    return { ...baseElement, width: isMobile ? 160 : 200, height: isMobile ? 100 : 120, text: "" }
                case "circle":
                    return { ...baseElement, radius: isMobile ? 60 : 80, text: "" }
                case "triangle":
                    return { ...baseElement, width: isMobile ? 100 : 120, height: isMobile ? 80 : 100, text: "" }
                case "diamond":
                    return { ...baseElement, width: isMobile ? 100 : 120, height: isMobile ? 60 : 80, text: "" }
                case "star":
                    return { ...baseElement, width: isMobile ? 80 : 100, height: isMobile ? 80 : 100, text: "" }
                case "heart":
                    return { ...baseElement, width: isMobile ? 80 : 100, height: isMobile ? 70 : 90, text: "" }
                case "hexagon":
                    return { ...baseElement, width: isMobile ? 100 : 120, height: isMobile ? 84 : 104, text: "" }
                case "pentagon":
                    return { ...baseElement, width: isMobile ? 100 : 120, height: isMobile ? 94 : 114, text: "" }
                case "line":
                case "arrow":
                case "connector":
                    const endSnapped =
                        endX && endY
                            ? snapToGridPoint((endX - pan.x) / zoom, (endY - pan.y) / zoom)
                            : { x: snappedPos.x + (isMobile ? 100 : 150), y: snappedPos.y }
                    return {
                        ...baseElement,
                        endX: endSnapped.x,
                        endY: endSnapped.y,
                        startArrow: false,
                        endArrow: type === "arrow" || type === "connector",
                    }
                default:
                    return baseElement
            }
        },
        [pan, zoom, currentColor, currentFill, strokeWidth, opacity, elements.length, textStyle, isMobile, snapToGridPoint],
    )

    // 获取坐标
    const getEventCoordinates = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        if (e.touches) {
            const touch = e.touches[0] || e.changedTouches[0]
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    // 查找点击的元素
    const findElementAt = (x, y) => {
        const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))

        return sortedElements.find((el) => {
            if (!el.visible) return false

            const screenX = el.x * zoom + pan.x
            const screenY = el.y * zoom + pan.y

            if (
                el.type === "rectangle" ||
                el.type === "sticky" ||
                el.type === "text" ||
                el.type === "triangle" ||
                el.type === "diamond" ||
                el.type === "star" ||
                el.type === "heart" ||
                el.type === "hexagon" ||
                el.type === "pentagon"
            ) {
                return x >= screenX && x <= screenX + el.width * zoom && y >= screenY && y <= screenY + el.height * zoom
            } else if (el.type === "circle") {
                const dx = x - screenX
                const dy = y - screenY
                return Math.sqrt(dx * dx + dy * dy) <= el.radius * zoom
            } else if (el.type === "line" || el.type === "arrow" || el.type === "connector") {
                const x1 = screenX
                const y1 = screenY
                const x2 = el.endX * zoom + pan.x
                const y2 = el.endY * zoom + pan.y

                const distance =
                    Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
                return distance < (isMobile ? 15 : 10)
            }
            return false
        })
    }

    // 获取调整大小的手柄
    const getResizeHandle = (element, x, y) => {
        if (!element || element.type === "line" || element.type === "arrow" || element.type === "connector") return null

        const screenX = element.x * zoom + pan.x
        const screenY = element.y * zoom + pan.y
        const width = (element.width || element.radius * 2) * zoom
        const height = (element.height || element.radius * 2) * zoom
        const handleSize = isMobile ? 12 : 8

        const handles = [
            { name: "nw", x: screenX - handleSize / 2, y: screenY - handleSize / 2 },
            { name: "n", x: screenX + width / 2 - handleSize / 2, y: screenY - handleSize / 2 },
            { name: "ne", x: screenX + width - handleSize / 2, y: screenY - handleSize / 2 },
            { name: "e", x: screenX + width - handleSize / 2, y: screenY + height / 2 - handleSize / 2 },
            { name: "se", x: screenX + width - handleSize / 2, y: screenY + height - handleSize / 2 },
            { name: "s", x: screenX + width / 2 - handleSize / 2, y: screenY + height - handleSize / 2 },
            { name: "sw", x: screenX - handleSize / 2, y: screenY + height - handleSize / 2 },
            { name: "w", x: screenX - handleSize / 2, y: screenY + height / 2 - handleSize / 2 },
        ]

        return handles.find(
            (handle) => x >= handle.x && x <= handle.x + handleSize && y >= handle.y && y <= handle.y + handleSize,
        )
    }

    // 触摸开始处理
    const handleTouchStart = useCallback(
        (e) => {
            e.preventDefault()
            const touches = e.touches

            if (touches.length === 1) {
                // 单点触摸
                const { x, y } = getEventCoordinates(e)
                setTouchStart({ x, y, time: Date.now() })
                setIsMultiTouch(false)

                if (tool === "select") {
                    const clickedElement = findElementAt(x, y)

                    if (clickedElement && !clickedElement.locked) {
                        // 开始长按检测
                        startLongPress(e, clickedElement)

                        // 检查是否点击了调整大小的手柄
                        if (selectedElements.includes(clickedElement.id)) {
                            const handle = getResizeHandle(clickedElement, x, y)
                            if (handle) {
                                setIsResizing(true)
                                setResizeHandle(handle.name)
                                setDragStart({ x, y })
                                return
                            }
                        }

                        // 选择元素
                        if (!selectedElements.includes(clickedElement.id)) {
                            setSelectedElements([clickedElement.id])
                        }
                        setIsDragging(true)
                        setDragStart({ x, y })
                    } else {
                        // 开始框选
                        setSelectedElements([])
                        setIsSelecting(true)
                        setSelectionBox({ x, y, width: 0, height: 0 })
                        setDragStart({ x, y })
                    }
                } else if (tool === "hand") {
                    setIsPanning(true)
                    setDragStart({ x, y })
                } else if (tool === "arrow" || tool === "line" || tool === "connector") {
                    setIsCreating(true)
                    setDragStart({ x, y })
                    const newElement = createElement(tool, x, y, x, y)
                    setTempElement(newElement)
                } else {
                    const newElement = createElement(tool, x, y)
                    setElements((prev) => [...prev, newElement])
                    saveToHistory()
                    setTool("select")
                }
            } else if (touches.length === 2) {
                // 双点触摸 - 缩放和平移
                cancelLongPress()
                setIsMultiTouch(true)
                setIsDragging(false)
                setIsSelecting(false)
                setIsPanning(false)

                const distance = getDistance(touches[0], touches[1])
                const center = getCenter(touches[0], touches[1])

                setTouchDistance(distance)
                setInitialZoom(zoom)
                setDragStart(center)
            }
        },
        [tool, elements, selectedElements, createElement, pan, zoom, startLongPress, cancelLongPress],
    )

    // 触摸移动处理
    const handleTouchMove = useCallback(
        (e) => {
            e.preventDefault()
            const touches = e.touches

            if (touches.length === 1 && !isMultiTouch) {
                // 单点移动
                cancelLongPress()
                const { x, y } = getEventCoordinates(e)

                if (isResizing && selectedElements.length === 1) {
                    const element = elements.find((el) => el.id === selectedElements[0])
                    if (element && resizeHandle) {
                        const dx = (x - dragStart.x) / zoom
                        const dy = (y - dragStart.y) / zoom

                        setElements((prev) =>
                            prev.map((el) => {
                                if (el.id === selectedElements[0]) {
                                    const newElement = { ...el }

                                    switch (resizeHandle) {
                                        case "se":
                                            if (el.type === "circle") {
                                                newElement.radius = Math.max(20, el.radius + Math.max(dx, dy))
                                            } else {
                                                newElement.width = Math.max(40, el.width + dx)
                                                newElement.height = Math.max(40, el.height + dy)
                                            }
                                            break
                                        case "nw":
                                            if (el.type === "circle") {
                                                const newRadius = Math.max(20, el.radius - Math.max(dx, dy))
                                                newElement.radius = newRadius
                                                newElement.x = el.x + (el.radius - newRadius)
                                                newElement.y = el.y + (el.radius - newRadius)
                                            } else {
                                                newElement.width = Math.max(40, el.width - dx)
                                                newElement.height = Math.max(40, el.height - dy)
                                                newElement.x = el.x + dx
                                                newElement.y = el.y + dy
                                            }
                                            break
                                        case "ne":
                                            if (el.type === "circle") {
                                                const newRadius = Math.max(10, el.radius + Math.max(-dx, dy))
                                                newElement.radius = newRadius
                                                newElement.y = el.y - (newRadius - el.radius)
                                            } else {
                                                newElement.width = Math.max(20, el.width + dx)
                                                newElement.height = Math.max(20, el.height - dy)
                                                newElement.y = el.y + dy
                                            }
                                            break
                                        case "sw":
                                            if (el.type === "circle") {
                                                const newRadius = Math.max(10, el.radius + Math.max(dx, -dy))
                                                newElement.radius = newRadius
                                                newElement.x = el.x - (newRadius - el.radius)
                                            } else {
                                                newElement.width = Math.max(20, el.width - dx)
                                                newElement.height = Math.max(20, el.height + dy)
                                                newElement.x = el.x + dx
                                            }
                                            break
                                        case "n":
                                            if (el.type !== "circle") {
                                                newElement.height = Math.max(20, el.height - dy)
                                                newElement.y = el.y + dy
                                            }
                                            break
                                        case "s":
                                            if (el.type !== "circle") {
                                                newElement.height = Math.max(20, el.height + dy)
                                            }
                                            break
                                        case "e":
                                            if (el.type !== "circle") {
                                                newElement.width = Math.max(20, el.width + dx)
                                            }
                                            break
                                        case "w":
                                            if (el.type !== "circle") {
                                                newElement.width = Math.max(20, el.width - dx)
                                                newElement.x = el.x + dx
                                            }
                                            break
                                    }

                                    return newElement
                                }
                                return el
                            }),
                        )

                        setDragStart({ x, y })
                    }
                } else if (isDragging && selectedElements.length > 0) {
                    const dx = (x - dragStart.x) / zoom
                    const dy = (y - dragStart.y) / zoom

                    setElements((prev) =>
                        prev.map((el) => {
                            if (selectedElements.includes(el.id) && !el.locked) {
                                const snappedPos = snapToGridPoint(el.x + dx, el.y + dy)
                                return { ...el, x: snappedPos.x, y: snappedPos.y }
                            }
                            return el
                        }),
                    )
                    setDragStart({ x, y })
                } else if (isPanning) {
                    const dx = x - dragStart.x
                    const dy = y - dragStart.y
                    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
                    setDragStart({ x, y })
                } else if (isSelecting) {
                    setSelectionBox({
                        x: Math.min(dragStart.x, x),
                        y: Math.min(dragStart.y, y),
                        width: Math.abs(x - dragStart.x),
                        height: Math.abs(y - dragStart.y),
                    })
                } else if (isCreating && tempElement) {
                    const snappedEnd = snapToGridPoint((x - pan.x) / zoom, (y - pan.y) / zoom)
                    setTempElement((prev) => ({
                        ...prev,
                        endX: snappedEnd.x,
                        endY: snappedEnd.y,
                    }))
                }
            } else if (touches.length === 2) {
                // 双点缩放和平移
                const distance = getDistance(touches[0], touches[1])
                const center = getCenter(touches[0], touches[1])

                // 缩放
                const scale = distance / touchDistance
                const newZoom = Math.min(Math.max(initialZoom * scale, 0.1), 5)

                // 平移
                const dx = center.x - dragStart.x
                const dy = center.y - dragStart.y

                setZoom(newZoom)
                setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
                setDragStart(center)
            }
        },
        [
            isDragging,
            isPanning,
            isSelecting,
            isCreating,
            isResizing,
            isMultiTouch,
            selectedElements,
            dragStart,
            zoom,
            pan,
            tempElement,
            elements,
            resizeHandle,
            touchDistance,
            initialZoom,
            cancelLongPress,
            snapToGridPoint,
        ],
    )

    // 触摸结束处理
    const handleTouchEnd = useCallback(
        (e) => {
            e.preventDefault()
            cancelLongPress()

            const now = Date.now()

            if (isCreating && tempElement) {
                setElements((prev) => [...prev, tempElement])
                setTempElement(null)
                setIsCreating(false)
                setTool("select")
                saveToHistory()
            }

            if (isSelecting && selectionBox) {
                const selectedIds = elements
                    .filter((el) => {
                        if (!el.visible) return false
                        const screenX = el.x * zoom + pan.x
                        const screenY = el.y * zoom + pan.y
                        const width = el.width || el.radius * 2 || 0
                        const height = el.height || el.radius * 2 || 0

                        return (
                            screenX + width >= selectionBox.x &&
                            screenX <= selectionBox.x + selectionBox.width &&
                            screenY + height >= selectionBox.y &&
                            screenY <= selectionBox.y + selectionBox.height
                        )
                    })
                    .map((el) => el.id)

                setSelectedElements(selectedIds)
                setSelectionBox(null)
            }

            if (isDragging || isResizing) {
                saveToHistory()
            }

            // 检测双击
            if (touchStart && now - touchStart.time < 300 && now - lastTouchEnd < 300) {
                const { x, y } = getEventCoordinates(e)
                const clickedElement = findElementAt(x, y)

                if (
                    clickedElement &&
                    (clickedElement.type === "sticky" || clickedElement.type === "text") &&
                    !clickedElement.locked
                ) {
                    setEditingText(clickedElement.id)
                    setTextInput(clickedElement.text || "")
                }
            }

            setLastTouchEnd(now)
            setTouchStart(null)
            setIsDragging(false)
            setIsPanning(false)
            setIsSelecting(false)
            setIsResizing(false)
            setIsMultiTouch(false)
            setResizeHandle(null)
        },
        [
            isCreating,
            tempElement,
            isSelecting,
            selectionBox,
            elements,
            zoom,
            pan,
            isDragging,
            isResizing,
            saveToHistory,
            touchStart,
            lastTouchEnd,
            cancelLongPress,
        ],
    )

    // 开始事件处理（桌面端）
    const handleStart = useCallback(
        (e) => {
            if (isMobile) return // 移动端使用触摸事件

            e.preventDefault()
            const { x, y } = getEventCoordinates(e)

            if (tool === "select") {
                const clickedElement = findElementAt(x, y)

                if (clickedElement && !clickedElement.locked) {
                    if (selectedElements.includes(clickedElement.id)) {
                        const handle = getResizeHandle(clickedElement, x, y)
                        if (handle) {
                            setIsResizing(true)
                            setResizeHandle(handle.name)
                            setDragStart({ x, y })
                            return
                        }
                    }

                    if (!selectedElements.includes(clickedElement.id)) {
                        if (e.ctrlKey || e.metaKey) {
                            setSelectedElements([...selectedElements, clickedElement.id])
                        } else {
                            setSelectedElements([clickedElement.id])
                        }
                    }
                    setIsDragging(true)
                    setDragStart({ x, y })
                } else {
                    if (!e.ctrlKey && !e.metaKey) {
                        setSelectedElements([])
                    }
                    setIsSelecting(true)
                    setSelectionBox({ x, y, width: 0, height: 0 })
                    setDragStart({ x, y })
                }
            } else if (tool === "hand") {
                setIsPanning(true)
                setDragStart({ x, y })
            } else if (tool === "arrow" || tool === "line" || tool === "connector") {
                setIsCreating(true)
                setDragStart({ x, y })
                const newElement = createElement(tool, x, y, x, y)
                setTempElement(newElement)
            } else {
                const newElement = createElement(tool, x, y)
                setElements((prev) => [...prev, newElement])
                saveToHistory()
                setTool("select")
            }
        },
        [tool, elements, selectedElements, createElement, pan, zoom, isMobile],
    )

    // 移动事件处理（桌面端）
    const handleMove = useCallback(
        (e) => {
            if (isMobile) return // 移动端使用触摸事件

            e.preventDefault()
            const { x, y } = getEventCoordinates(e)

            if (isResizing && selectedElements.length === 1) {
                const element = elements.find((el) => el.id === selectedElements[0])
                if (element && resizeHandle) {
                    const dx = (x - dragStart.x) / zoom
                    const dy = (y - dragStart.y) / zoom

                    setElements((prev) =>
                        prev.map((el) => {
                            if (el.id === selectedElements[0]) {
                                const newElement = { ...el }

                                switch (resizeHandle) {
                                    case "se":
                                        if (el.type === "circle") {
                                            newElement.radius = Math.max(10, el.radius + Math.max(dx, dy))
                                        } else {
                                            newElement.width = Math.max(20, el.width + dx)
                                            newElement.height = Math.max(20, el.height + dy)
                                        }
                                        break
                                    case "nw":
                                        if (el.type === "circle") {
                                            const newRadius = Math.max(10, el.radius - Math.max(dx, dy))
                                            newElement.radius = newRadius
                                            newElement.x = el.x + (el.radius - newRadius)
                                            newElement.y = el.y + (el.radius - newRadius)
                                        } else {
                                            newElement.width = Math.max(20, el.width - dx)
                                            newElement.height = Math.max(20, el.height - dy)
                                            newElement.x = el.x + dx
                                            newElement.y = el.y + dy
                                        }
                                        break
                                    case "ne":
                                        if (el.type === "circle") {
                                            const newRadius = Math.max(10, el.radius + Math.max(-dx, dy))
                                            newElement.radius = newRadius
                                            newElement.y = el.y - (newRadius - el.radius)
                                        } else {
                                            newElement.width = Math.max(20, el.width + dx)
                                            newElement.height = Math.max(20, el.height - dy)
                                            newElement.y = el.y + dy
                                        }
                                        break
                                    case "sw":
                                        if (el.type === "circle") {
                                            const newRadius = Math.max(10, el.radius + Math.max(dx, -dy))
                                            newElement.radius = newRadius
                                            newElement.x = el.x - (newRadius - el.radius)
                                        } else {
                                            newElement.width = Math.max(20, el.width - dx)
                                            newElement.height = Math.max(20, el.height + dy)
                                            newElement.x = el.x + dx
                                        }
                                        break
                                    case "n":
                                        if (el.type !== "circle") {
                                            newElement.height = Math.max(20, el.height - dy)
                                            newElement.y = el.y + dy
                                        }
                                        break
                                    case "s":
                                        if (el.type !== "circle") {
                                            newElement.height = Math.max(20, el.height + dy)
                                        }
                                        break
                                    case "e":
                                        if (el.type !== "circle") {
                                            newElement.width = Math.max(20, el.width + dx)
                                        }
                                        break
                                    case "w":
                                        if (el.type !== "circle") {
                                            newElement.width = Math.max(20, el.width - dx)
                                            newElement.x = el.x + dx
                                        }
                                        break
                                }

                                return newElement
                            }
                            return el
                        }),
                    )

                    setDragStart({ x, y })
                }
            } else if (isDragging && selectedElements.length > 0) {
                const dx = (x - dragStart.x) / zoom
                const dy = (y - dragStart.y) / zoom

                setElements((prev) =>
                    prev.map((el) => {
                        if (selectedElements.includes(el.id) && !el.locked) {
                            const snappedPos = snapToGridPoint(el.x + dx, el.y + dy)
                            return { ...el, x: snappedPos.x, y: snappedPos.y }
                        }
                        return el
                    }),
                )
                setDragStart({ x, y })
            } else if (isPanning) {
                const dx = x - dragStart.x
                const dy = y - dragStart.y
                setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
                setDragStart({ x, y })
            } else if (isSelecting) {
                setSelectionBox({
                    x: Math.min(dragStart.x, x),
                    y: Math.min(dragStart.y, y),
                    width: Math.abs(x - dragStart.x),
                    height: Math.abs(y - dragStart.y),
                })
            } else if (isCreating && tempElement) {
                const snappedEnd = snapToGridPoint((x - pan.x) / zoom, (y - pan.y) / zoom)
                setTempElement((prev) => ({
                    ...prev,
                    endX: snappedEnd.x,
                    endY: snappedEnd.y,
                }))
            }
        },
        [
            isDragging,
            isPanning,
            isSelecting,
            isCreating,
            isResizing,
            selectedElements,
            dragStart,
            zoom,
            pan,
            tempElement,
            elements,
            resizeHandle,
            isMobile,
            snapToGridPoint,
        ],
    )

    // 结束事件处理（桌面端）
    const handleEnd = useCallback(() => {
        if (isMobile) return // 移动端使用触摸事件

        if (isCreating && tempElement) {
            setElements((prev) => [...prev, tempElement])
            setTempElement(null)
            setIsCreating(false)
            setTool("select")
            saveToHistory()
        }

        if (isSelecting && selectionBox) {
            const selectedIds = elements
                .filter((el) => {
                    if (!el.visible) return false
                    const screenX = el.x * zoom + pan.x
                    const screenY = el.y * zoom + pan.y
                    const width = el.width || el.radius * 2 || 0
                    const height = el.height || el.radius * 2 || 0

                    return (
                        screenX + width >= selectionBox.x &&
                        screenX <= selectionBox.x + selectionBox.width &&
                        screenY + height >= selectionBox.y &&
                        screenY <= selectionBox.y + selectionBox.height
                    )
                })
                .map((el) => el.id)

            setSelectedElements(selectedIds)
            setSelectionBox(null)
        }

        if (isDragging || isResizing) {
            saveToHistory()
        }

        setIsDragging(false)
        setIsPanning(false)
        setIsSelecting(false)
        setIsResizing(false)
        setResizeHandle(null)
    }, [
        isCreating,
        tempElement,
        isSelecting,
        selectionBox,
        elements,
        zoom,
        pan,
        isDragging,
        isResizing,
        saveToHistory,
        isMobile,
    ])

    // 双击编辑文本（桌面端）
    const handleDoubleClick = useCallback(
        (e) => {
            if (isMobile) return // 移动端使用触摸事件

            const { x, y } = getEventCoordinates(e)
            const clickedElement = findElementAt(x, y)

            if (
                clickedElement &&
                (clickedElement.type === "sticky" || clickedElement.type === "text") &&
                !clickedElement.locked
            ) {
                setEditingText(clickedElement.id)
                setTextInput(clickedElement.text || "")
            }
        },
        [elements, zoom, pan, isMobile],
    )

    // 保存文本编辑
    const saveTextEdit = useCallback(() => {
        if (editingText) {
            setElements((prev) => prev.map((el) => (el.id === editingText ? { ...el, text: textInput } : el)))
            setEditingText(null)
            setTextInput("")
            saveToHistory()
        }
    }, [editingText, textInput, saveToHistory])

    // 删除选中元素
    const deleteSelected = useCallback(() => {
        if (selectedElements.length > 0) {
            setElements((prev) => prev.filter((el) => !selectedElements.includes(el.id)))
            setSelectedElements([])
            saveToHistory()
        }
    }, [selectedElements, saveToHistory])

    // 复制选中元素
    const copySelected = useCallback(() => {
        const elementsToCopy = elements.filter((el) => selectedElements.includes(el.id))
        setClipboard(elementsToCopy)
    }, [selectedElements, elements])

    // 粘贴元素
    const pasteElements = useCallback(() => {
        if (clipboard.length > 0) {
            const copiedElements = clipboard.map((el) => ({
                ...el,
                id: generateId(),
                x: el.x + 20,
                y: el.y + 20,
                zIndex: elements.length + clipboard.indexOf(el),
            }))
            setElements((prev) => [...prev, ...copiedElements])
            setSelectedElements(copiedElements.map((el) => el.id))
            saveToHistory()
        }
    }, [clipboard, elements.length, saveToHistory])

    // 全选
    const selectAll = useCallback(() => {
        setSelectedElements(elements.filter((el) => el.visible).map((el) => el.id))
    }, [elements])

    // 锁定/解锁元素
    const toggleLock = useCallback(() => {
        if (selectedElements.length > 0) {
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, locked: !el.locked } : el)))
            saveToHistory()
        }
    }, [selectedElements, saveToHistory])

    // 显示/隐藏元素
    const toggleVisibility = useCallback(() => {
        if (selectedElements.length > 0) {
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, visible: !el.visible } : el)))
            saveToHistory()
        }
    }, [selectedElements, saveToHistory])

    // 层级操作
    const bringToFront = useCallback(() => {
        if (selectedElements.length > 0) {
            const maxZ = Math.max(...elements.map((el) => el.zIndex || 0))
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, zIndex: maxZ + 1 } : el)))
            saveToHistory()
        }
    }, [selectedElements, elements, saveToHistory])

    const sendToBack = useCallback(() => {
        if (selectedElements.length > 0) {
            const minZ = Math.min(...elements.map((el) => el.zIndex || 0))
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, zIndex: minZ - 1 } : el)))
            saveToHistory()
        }
    }, [selectedElements, elements, saveToHistory])

    // 对齐操作
    const alignLeft = useCallback(() => {
        if (selectedElements.length > 1) {
            const selectedEls = elements.filter((el) => selectedElements.includes(el.id))
            const minX = Math.min(...selectedEls.map((el) => el.x))
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, x: minX } : el)))
            saveToHistory()
        }
    }, [selectedElements, elements, saveToHistory])

    const alignCenter = useCallback(() => {
        if (selectedElements.length > 1) {
            const selectedEls = elements.filter((el) => selectedElements.includes(el.id))
            const centerX =
                selectedEls.reduce((sum, el) => sum + el.x + (el.width || el.radius || 0) / 2, 0) / selectedEls.length
            setElements((prev) =>
                prev.map((el) =>
                    selectedElements.includes(el.id) ? { ...el, x: centerX - (el.width || el.radius || 0) / 2 } : el,
                ),
            )
            saveToHistory()
        }
    }, [selectedElements, elements, saveToHistory])

    const alignRight = useCallback(() => {
        if (selectedElements.length > 1) {
            const selectedEls = elements.filter((el) => selectedElements.includes(el.id))
            const maxX = Math.max(...selectedEls.map((el) => el.x + (el.width || el.radius * 2 || 0)))
            setElements((prev) =>
                prev.map((el) =>
                    selectedElements.includes(el.id) ? { ...el, x: maxX - (el.width || el.radius * 2 || 0) } : el,
                ),
            )
            saveToHistory()
        }
    }, [selectedElements, elements, saveToHistory])

    // 清空画布
    const clearCanvas = useCallback(() => {
        setElements([])
        setSelectedElements([])
        saveToHistory()
    }, [saveToHistory])

    // 适应画布
    const fitToCanvas = useCallback(() => {
        if (elements.length === 0) return

        const visibleElements = elements.filter((el) => el.visible)
        if (visibleElements.length === 0) return

        const bounds = visibleElements.reduce(
            (acc, el) => {
                let minX, maxX, minY, maxY

                if (el.type === "circle") {
                    minX = el.x - el.radius
                    maxX = el.x + el.radius
                    minY = el.y - el.radius
                    maxY = el.y + el.radius
                } else if (el.type === "line" || el.type === "arrow" || el.type === "connector") {
                    minX = Math.min(el.x, el.endX)
                    maxX = Math.max(el.x, el.endX)
                    minY = Math.min(el.y, el.endY)
                    maxY = Math.max(el.y, el.endY)
                } else {
                    minX = el.x
                    maxX = el.x + (el.width || 0)
                    minY = el.y
                    maxY = el.y + (el.height || 0)
                }

                return {
                    minX: Math.min(acc.minX, minX),
                    maxX: Math.max(acc.maxX, maxX),
                    minY: Math.min(acc.minY, minY),
                    maxY: Math.max(acc.maxY, maxY),
                }
            },
            {
                minX: Number.POSITIVE_INFINITY,
                maxX: Number.NEGATIVE_INFINITY,
                minY: Number.POSITIVE_INFINITY,
                maxY: Number.NEGATIVE_INFINITY,
            },
        )

        const rect = canvasRef.current.getBoundingClientRect()
        const padding = isMobile ? 50 : 100
        const contentWidth = bounds.maxX - bounds.minX
        const contentHeight = bounds.maxY - bounds.minY

        const scaleX = (rect.width - padding * 2) / contentWidth
        const scaleY = (rect.height - padding * 2) / contentHeight
        const newZoom = Math.min(scaleX, scaleY, 2)

        setZoom(newZoom)
        setPan({
            x: (rect.width - contentWidth * newZoom) / 2 - bounds.minX * newZoom,
            y: (rect.height - contentHeight * newZoom) / 2 - bounds.minY * newZoom,
        })
    }, [elements, isMobile])

    // 缩放控制
    const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev * 1.2, 5)), [])
    const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev / 1.2, 0.1)), [])
    const resetZoom = useCallback(() => {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }, [])

    // 导出画布
    const exportCanvas = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const svgData = new XMLSerializer().serializeToString(canvas)
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const svgUrl = URL.createObjectURL(svgBlob)

        const downloadLink = document.createElement("a")
        downloadLink.href = svgUrl
        downloadLink.download = "whiteboard.svg"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(svgUrl)
    }, [])

    // 导入图片
    const importImage = useCallback(
        (e) => {
            const file = e.target.files[0]
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const img = new Image()
                    img.onload = () => {
                        const maxSize = isMobile ? 200 : 300
                        const newElement = {
                            id: generateId(),
                            type: "image",
                            x: 100,
                            y: 100,
                            width: Math.min(img.width, maxSize),
                            height: Math.min(img.height, maxSize),
                            src: event.target.result,
                            opacity: 1,
                            locked: false,
                            visible: true,
                            zIndex: elements.length,
                        }
                        setElements((prev) => [...prev, newElement])
                        saveToHistory()
                    }
                    img.src = event.target.result
                }
                reader.readAsDataURL(file)
            }
            e.target.value = ""
        },
        [elements.length, saveToHistory, isMobile],
    )

    // 渲染复杂形状的路径
    const getShapePath = (element) => {
        const { x, y, width, height } = element
        const cx = x + width / 2
        const cy = y + height / 2

        switch (element.type) {
            case "triangle":
                return `M ${cx} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`
            case "diamond":
                return `M ${cx} ${y} L ${x + width} ${cy} L ${cx} ${y + height} L ${x} ${cy} Z`
            case "star":
                const outerRadius = Math.min(width, height) / 2
                const innerRadius = outerRadius * 0.4
                let path = ""
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2
                    const radius = i % 2 === 0 ? outerRadius : innerRadius
                    const px = cx + radius * Math.cos(angle)
                    const py = cy + radius * Math.sin(angle)
                    path += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`
                }
                return path + " Z"
            case "heart":
                const w = width / 2
                const h = height
                return `M ${cx} ${y + h * 0.3} 
                C ${cx} ${y + h * 0.1}, ${cx - w * 0.5} ${y}, ${cx - w * 0.5} ${y + h * 0.25}
                C ${cx - w * 0.5} ${y + h * 0.4}, ${cx} ${y + h * 0.6}, ${cx} ${y + h}
                C ${cx} ${y + h * 0.6}, ${cx + w * 0.5} ${y + h * 0.4}, ${cx + w * 0.5} ${y + h * 0.25}
                C ${cx + w * 0.5} ${y}, ${cx} ${y + h * 0.1}, ${cx} ${y + h * 0.3} Z`
            case "hexagon":
                const hexPoints = []
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3
                    const px = cx + (width / 2) * Math.cos(angle)
                    const py = cy + (height / 2) * Math.sin(angle)
                    hexPoints.push(`${px} ${py}`)
                }
                return `M ${hexPoints.join(" L ")} Z`
            case "pentagon":
                const pentPoints = []
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                    const px = cx + (width / 2) * Math.cos(angle)
                    const py = cy + (height / 2) * Math.sin(angle)
                    pentPoints.push(`${px} ${py}`)
                }
                return `M ${pentPoints.join(" L ")} Z`
            default:
                return ""
        }
    }

    // 渲染元素
    const renderElement = (element) => {
        if (!element.visible) return null

        const isSelected = selectedElements.includes(element.id)
        const strokeColor = element.color || "#2563eb"
        const fillColor = element.backgroundColor || "#ffffff"
        const opacity = element.opacity || 1

        const commonProps = {
            opacity,
            style: {
                filter: isSelected
                    ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                    : element.type === "sticky"
                        ? "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))"
                        : "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))",
                cursor: element.locked ? "not-allowed" : "pointer",
            },
        }

        switch (element.type) {
            case "sticky":
                return (
                    <g key={element.id} {...commonProps}>
                        <rect
                            x={element.x * zoom + pan.x}
                            y={element.y * zoom + pan.y}
                            width={element.width * zoom}
                            height={element.height * zoom}
                            fill={fillColor}
                            stroke={isSelected ? "#3b82f6" : "#e5e7eb"}
                            strokeWidth={isSelected ? 2 : 1}
                            rx={6}
                        />
                        <rect
                            x={element.x * zoom + pan.x}
                            y={element.y * zoom + pan.y}
                            width={element.width * zoom}
                            height={24 * zoom}
                            fill={strokeColor}
                            rx={6}
                            style={{ opacity: 0.1 }}
                        />
                        <line
                            x1={element.x * zoom + pan.x + 20 * zoom}
                            y1={element.y * zoom + pan.y + 40 * zoom}
                            x2={element.x * zoom + pan.x + (element.width - 20) * zoom}
                            y2={element.y * zoom + pan.y + 40 * zoom}
                            stroke="#e5e7eb"
                            strokeWidth={1}
                            opacity={0.5}
                        />
                        <foreignObject
                            x={element.x * zoom + pan.x + 12}
                            y={element.y * zoom + pan.y + 30}
                            width={(element.width - 24) * zoom}
                            height={(element.height - 40) * zoom}
                        >
                            <div
                                style={{
                                    fontSize: `${(element.fontSize || 14) * zoom}px`,
                                    color: "#374151",
                                    fontWeight: element.fontWeight || "normal",
                                    textAlign: element.textAlign || "left",
                                    lineHeight: 1.4,
                                    overflow: "hidden",
                                    wordWrap: "break-word",
                                    padding: "4px",
                                }}
                            >
                                {element.text}
                            </div>
                        </foreignObject>
                        {element.locked && (
                            <g
                                transform={`translate(${element.x * zoom + pan.x + element.width * zoom - 20}, ${element.y * zoom + pan.y + 5})`}
                            >
                                <circle cx="8" cy="8" r="8" fill="rgba(239, 68, 68, 0.9)" />
                                <Lock size={10} x="3" y="3" color="white" />
                            </g>
                        )}
                    </g>
                )

            case "text":
                return (
                    <g key={element.id} {...commonProps}>
                        <rect
                            x={element.x * zoom + pan.x}
                            y={element.y * zoom + pan.y}
                            width={element.width * zoom}
                            height={element.height * zoom}
                            fill="transparent"
                            stroke={isSelected ? "#3b82f6" : "transparent"}
                            strokeWidth={isSelected ? 2 : 0}
                            strokeDasharray={isSelected ? "5,5" : "none"}
                            rx={4}
                        />
                        <foreignObject
                            x={element.x * zoom + pan.x + 8}
                            y={element.y * zoom + pan.y + 8}
                            width={(element.width - 16) * zoom}
                            height={(element.height - 16) * zoom}
                        >
                            <div
                                style={{
                                    fontSize: `${(element.fontSize || 16) * zoom}px`,
                                    color: strokeColor,
                                    fontWeight: element.fontWeight || "normal",
                                    fontStyle: element.fontStyle || "normal",
                                    textDecoration: element.textDecoration || "none",
                                    textAlign: element.textAlign || "left",
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    wordWrap: "break-word",
                                }}
                            >
                                {element.text}
                            </div>
                        </foreignObject>
                        {element.locked && (
                            <g
                                transform={`translate(${element.x * zoom + pan.x + element.width * zoom - 20}, ${element.y * zoom + pan.y + 5})`}
                            >
                                <circle cx="8" cy="8" r="8" fill="rgba(239, 68, 68, 0.9)" />
                                <Lock size={10} x="3" y="3" color="white" />
                            </g>
                        )}
                    </g>
                )

            case "rectangle":
                return (
                    <g key={element.id} {...commonProps}>
                        <rect
                            x={element.x * zoom + pan.x}
                            y={element.y * zoom + pan.y}
                            width={element.width * zoom}
                            height={element.height * zoom}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={(element.strokeWidth || 2) * (isSelected ? 1.5 : 1)}
                            rx={6}
                        />
                        {element.text && (
                            <text
                                x={(element.x + element.width / 2) * zoom + pan.x}
                                y={(element.y + element.height / 2) * zoom + pan.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#374151"
                                fontSize={16 * zoom}
                                fontWeight="500"
                            >
                                {element.text}
                            </text>
                        )}
                        {element.locked && (
                            <g
                                transform={`translate(${element.x * zoom + pan.x + element.width * zoom - 20}, ${element.y * zoom + pan.y + 5})`}
                            >
                                <circle cx="8" cy="8" r="8" fill="rgba(239, 68, 68, 0.9)" />
                                <Lock size={10} x="3" y="3" color="white" />
                            </g>
                        )}
                    </g>
                )

            case "circle":
                return (
                    <g key={element.id} {...commonProps}>
                        <circle
                            cx={element.x * zoom + pan.x}
                            cy={element.y * zoom + pan.y}
                            r={element.radius * zoom}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={(element.strokeWidth || 2) * (isSelected ? 1.5 : 1)}
                        />
                        {element.text && (
                            <text
                                x={element.x * zoom + pan.x}
                                y={element.y * zoom + pan.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#374151"
                                fontSize={16 * zoom}
                                fontWeight="500"
                            >
                                {element.text}
                            </text>
                        )}
                        {element.locked && (
                            <g
                                transform={`translate(${element.x * zoom + pan.x + element.radius * zoom - 10}, ${element.y * zoom + pan.y - element.radius * zoom + 5})`}
                            >
                                <circle cx="8" cy="8" r="8" fill="rgba(239, 68, 68, 0.9)" />
                                <Lock size={10} x="3" y="3" color="white" />
                            </g>
                        )}
                    </g>
                )

            case "triangle":
            case "diamond":
            case "star":
            case "heart":
            case "hexagon":
            case "pentagon":
                return (
                    <g key={element.id} {...commonProps}>
                        <path
                            d={getShapePath({
                                ...element,
                                x: element.x * zoom + pan.x,
                                y: element.y * zoom + pan.y,
                                width: element.width * zoom,
                                height: element.height * zoom,
                            })}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={(element.strokeWidth || 2) * (isSelected ? 1.5 : 1)}
                        />
                        {element.text && (
                            <text
                                x={(element.x + element.width / 2) * zoom + pan.x}
                                y={(element.y + element.height / 2) * zoom + pan.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#374151"
                                fontSize={14 * zoom}
                                fontWeight="500"
                            >
                                {element.text}
                            </text>
                        )}
                        {element.locked && (
                            <g
                                transform={`translate(${element.x * zoom + pan.x + element.width * zoom - 20}, ${element.y * zoom + pan.y + 5})`}
                            >
                                <circle cx="8" cy="8" r="8" fill="rgba(239, 68, 68, 0.9)" />
                                <Lock size={10} x="3" y="3" color="white" />
                            </g>
                        )}
                    </g>
                )

            case "line":
                return (
                    <g key={element.id} {...commonProps}>
                        <line
                            x1={element.x * zoom + pan.x}
                            y1={element.y * zoom + pan.y}
                            x2={element.endX * zoom + pan.x}
                            y2={element.endY * zoom + pan.y}
                            stroke={strokeColor}
                            strokeWidth={(element.strokeWidth || 2) * (isSelected ? 1.5 : 1)}
                            strokeLinecap="round"
                        />
                    </g>
                )

            case "arrow":
            case "connector":
                return (
                    <g key={element.id} {...commonProps}>
                        <defs>
                            {element.startArrow && (
                                <marker
                                    id={`startArrow-${element.id}`}
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="1"
                                    refY="3.5"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                >
                                    <polygon points="10 0, 0 3.5, 10 7" fill={strokeColor} />
                                </marker>
                            )}
                            {element.endArrow && (
                                <marker
                                    id={`endArrow-${element.id}`}
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
                                </marker>
                            )}
                        </defs>
                        <line
                            x1={element.x * zoom + pan.x}
                            y1={element.y * zoom + pan.y}
                            x2={element.endX * zoom + pan.x}
                            y2={element.endY * zoom + pan.y}
                            stroke={strokeColor}
                            strokeWidth={(element.strokeWidth || 2) * (isSelected ? 1.5 : 1)}
                            strokeLinecap="round"
                            markerStart={element.startArrow ? `url(#startArrow-${element.id})` : "none"}
                            markerEnd={element.endArrow ? `url(#endArrow-${element.id})` : "none"}
                        />
                    </g>
                )

            case "image":
                return (
                    <g key={element.id} {...commonProps}>
                        <image
                            x={element.x * zoom + pan.x}
                            y={element.y * zoom + pan.y}
                            width={element.width * zoom}
                            height={element.height * zoom}
                            href={element.src}
                            style={{
                                border: isSelected ? "2px solid #3b82f6" : "none",
                            }}
                        />
                        {element.locked && (
                            <g
                                transform={`translate(${element.x * zoom + pan.x + element.width * zoom - 20}, ${element.y * zoom + pan.y + 5})`}
                            >
                                <circle cx="8" cy="8" r="8" fill="rgba(239, 68, 68, 0.9)" />
                                <Lock size={10} x="3" y="3" color="white" />
                            </g>
                        )}
                    </g>
                )

            default:
                return null
        }
    }

    // 渲染调整大小的手柄
    const renderResizeHandles = (element) => {
        if (
            !selectedElements.includes(element.id) ||
            element.locked ||
            element.type === "line" ||
            element.type === "arrow" ||
            element.type === "connector"
        ) {
            return null
        }

        const screenX = element.x * zoom + pan.x
        const screenY = element.y * zoom + pan.y
        const width = (element.width || element.radius * 2) * zoom
        const height = (element.height || element.radius * 2) * zoom
        const handleSize = isMobile ? 12 : 8

        const handles = [
            { name: "nw", x: screenX - handleSize / 2, y: screenY - handleSize / 2, cursor: "nw-resize" },
            { name: "n", x: screenX + width / 2 - handleSize / 2, y: screenY - handleSize / 2, cursor: "n-resize" },
            { name: "ne", x: screenX + width - handleSize / 2, y: screenY - handleSize / 2, cursor: "ne-resize" },
            { name: "e", x: screenX + width - handleSize / 2, y: screenY + height / 2 - handleSize / 2, cursor: "e-resize" },
            { name: "se", x: screenX + width - handleSize / 2, y: screenY + height - handleSize / 2, cursor: "se-resize" },
            { name: "s", x: screenX + width / 2 - handleSize / 2, y: screenY + height - handleSize / 2, cursor: "s-resize" },
            { name: "sw", x: screenX - handleSize / 2, y: screenY + height - handleSize / 2, cursor: "sw-resize" },
            { name: "w", x: screenX - handleSize / 2, y: screenY + height / 2 - handleSize / 2, cursor: "w-resize" },
        ]

        return (
            <g key={`handles-${element.id}`}>
                {handles.map((handle) => (
                    <rect
                        key={handle.name}
                        x={handle.x}
                        y={handle.y}
                        width={handleSize}
                        height={handleSize}
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth={2}
                        rx={2}
                        style={{ cursor: handle.cursor }}
                    />
                ))}
            </g>
        )
    }

    // 复制选中元素
    const duplicateSelected = useCallback(() => {
        if (selectedElements.length > 0) {
            const elementsToDuplicate = elements.filter((el) => selectedElements.includes(el.id))
            const duplicatedElements = elementsToDuplicate.map((el) => ({
                ...el,
                id: generateId(),
                x: el.x + 20,
                y: el.y + 20,
                zIndex: elements.length + elementsToDuplicate.indexOf(el),
            }))
            setElements((prev) => [...prev, ...duplicatedElements])
            setSelectedElements(duplicatedElements.map((el) => el.id))
            saveToHistory()
        }
    }, [selectedElements, elements, saveToHistory])

    // 组合元素
    const groupSelected = useCallback(() => {
        if (selectedElements.length > 1) {
            const groupId = generateId()
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, groupId } : el)))
            saveToHistory()
        }
    }, [selectedElements, saveToHistory])

    // 取消组合
    const ungroupSelected = useCallback(() => {
        if (selectedElements.length > 0) {
            setElements((prev) => prev.map((el) => (selectedElements.includes(el.id) ? { ...el, groupId: undefined } : el)))
            saveToHistory()
        }
    }, [selectedElements, saveToHistory])

    // 移动选中元素
    const moveSelectedElements = useCallback(
        (direction, distance) => {
            if (selectedElements.length > 0) {
                setElements((prev) =>
                    prev.map((el) => {
                        if (selectedElements.includes(el.id) && !el.locked) {
                            let newX = el.x
                            let newY = el.y

                            switch (direction) {
                                case "ArrowUp":
                                    newY -= distance
                                    break
                                case "ArrowDown":
                                    newY += distance
                                    break
                                case "ArrowLeft":
                                    newX -= distance
                                    break
                                case "ArrowRight":
                                    newX += distance
                                    break
                            }

                            const snappedPos = snapToGridPoint(newX, newY)
                            return { ...el, x: snappedPos.x, y: snappedPos.y }
                        }
                        return el
                    }),
                )
                saveToHistory()
            }
        },
        [selectedElements, snapToGridPoint, saveToHistory],
    )

    // 键盘快捷键处理
    useEffect(() => {
        const handleKeyDown = (e) => {
            // 检查是否在输入框中
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

            // 基础快捷键 - Ctrl/Cmd组合键
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case "z":
                        e.preventDefault()
                        if (e.shiftKey) {
                            redo()
                        } else {
                            undo()
                        }
                        break
                    case "c":
                        e.preventDefault()
                        copySelected()
                        break
                    case "v":
                        e.preventDefault()
                        pasteElements()
                        break
                    case "x":
                        e.preventDefault()
                        copySelected()
                        deleteSelected()
                        break
                    case "a":
                        e.preventDefault()
                        selectAll()
                        break
                    case "s":
                        e.preventDefault()
                        exportCanvas()
                        break
                    case "d":
                        e.preventDefault()
                        duplicateSelected()
                        break
                    case "g":
                        e.preventDefault()
                        groupSelected()
                        break
                    case "u":
                        e.preventDefault()
                        ungroupSelected()
                        break
                }
            } else {
                // 工具快捷键 - 单键
                switch (e.key.toLowerCase()) {
                    case "v":
                        setTool("select")
                        break
                    case "h":
                        setTool("hand")
                        break
                    case "r":
                        setTool("rectangle")
                        break
                    case "o":
                        setTool("circle")
                        break
                    case "t":
                        if (e.shiftKey) {
                            setTool("triangle")
                        } else {
                            setTool("text")
                        }
                        break
                    case "n":
                        setTool("sticky")
                        break
                    case "l":
                        setTool("line")
                        break
                    case "a":
                        setTool("arrow")
                        break
                    case "d":
                        if (!e.ctrlKey && !e.metaKey) {
                            setTool("diamond")
                        }
                        break
                    case "s":
                        if (!e.ctrlKey && !e.metaKey) {
                            setTool("star")
                        }
                        break
                    case "i":
                        fileInputRef.current?.click()
                        break
                    case "delete":
                    case "backspace":
                        e.preventDefault()
                        deleteSelected()
                        break
                    case "escape":
                        setSelectedElements([])
                        setTool("select")
                        setEditingText(null)
                        break
                    case "enter":
                        if (selectedElements.length === 1) {
                            const element = elements.find((el) => el.id === selectedElements[0])
                            if (element && (element.type === "sticky" || element.type === "text")) {
                                setEditingText(element.id)
                                setTextInput(element.text || "")
                            }
                        }
                        break
                    case "tab":
                        e.preventDefault()
                        if (e.shiftKey) {
                            sendToBack()
                        } else {
                            bringToFront()
                        }
                        break
                    case "arrowup":
                    case "arrowdown":
                    case "arrowleft":
                    case "arrowright":
                        e.preventDefault()
                        moveSelectedElements(e.key, e.shiftKey ? 10 : 1)
                        break
                    case "=":
                    case "+":
                        e.preventDefault()
                        handleZoomIn()
                        break
                    case "-":
                        e.preventDefault()
                        handleZoomOut()
                        break
                    case "0":
                        e.preventDefault()
                        resetZoom()
                        break
                    case "1":
                        e.preventDefault()
                        fitToCanvas()
                        break
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [
        historyIndex,
        history,
        selectedElements,
        elements,
        undo,
        redo,
        copySelected,
        pasteElements,
        deleteSelected,
        selectAll,
        exportCanvas,
        duplicateSelected,
        groupSelected,
        ungroupSelected,
        moveSelectedElements,
        handleZoomIn,
        handleZoomOut,
        resetZoom,
        fitToCanvas,
        bringToFront,
        sendToBack,
        snapToGridPoint,
    ])

    return (
        <Paper
            ref={containerRef}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
                borderRadius: 0,
                boxShadow: "none",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
            }}
        >
            {/* 桌面端工具栏 */}
            {!isMobile && (
                <Toolbar
                    sx={{
                        minHeight: "64px !important",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e5e7eb",
                        padding: "0 24px",
                        display: "flex",
                        gap: 3,
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    {/* 左侧工具组 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h6" sx={{ color: "#111827", fontWeight: 600, mr: 2 }}>
                            Miro Whiteboard
                        </Typography>

                        {/* 基础工具 */}
                        <ButtonGroup variant="outlined" size="small">
                            {basicTools.map((toolItem) => {
                                const IconComponent = toolItem.icon
                                return (
                                    <Tooltip key={toolItem.id} title={`${toolItem.label} (${toolItem.shortcut})`}>
                                        <IconButton
                                            onClick={() => setTool(toolItem.id)}
                                            sx={{
                                                backgroundColor: tool === toolItem.id ? "#f3f4f6" : "transparent",
                                                color: tool === toolItem.id ? "#111827" : "#6b7280",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: 1,
                                                "&:hover": {
                                                    backgroundColor: "#f9fafb",
                                                    borderColor: "#d1d5db",
                                                },
                                            }}
                                        >
                                            <IconComponent size={18} />
                                        </IconButton>
                                    </Tooltip>
                                )
                            })}
                        </ButtonGroup>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 形状工具 */}
                        <Tooltip title="Shapes">
                            <IconButton
                                onClick={(e) => setShapeMenuAnchor(e.currentTarget)}
                                sx={{
                                    backgroundColor: shapeTools.some((t) => t.id === tool) ? "#f3f4f6" : "transparent",
                                    color: shapeTools.some((t) => t.id === tool) ? "#111827" : "#6b7280",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "#f9fafb",
                                        borderColor: "#d1d5db",
                                    },
                                }}
                            >
                                <Square size={18} />
                            </IconButton>
                        </Tooltip>

                        {/* 内容工具 */}
                        <ButtonGroup variant="outlined" size="small">
                            {contentTools.map((toolItem) => {
                                const IconComponent = toolItem.icon
                                return (
                                    <Tooltip key={toolItem.id} title={`${toolItem.label} (${toolItem.shortcut})`}>
                                        <IconButton
                                            onClick={() => {
                                                if (toolItem.id === "image") {
                                                    fileInputRef.current?.click()
                                                } else {
                                                    setTool(toolItem.id)
                                                }
                                            }}
                                            sx={{
                                                backgroundColor: tool === toolItem.id ? "#f3f4f6" : "transparent",
                                                color: tool === toolItem.id ? "#111827" : "#6b7280",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: 1,
                                                "&:hover": {
                                                    backgroundColor: "#f9fafb",
                                                    borderColor: "#d1d5db",
                                                },
                                            }}
                                        >
                                            <IconComponent size={18} />
                                        </IconButton>
                                    </Tooltip>
                                )
                            })}
                        </ButtonGroup>

                        {/* 连接工具 */}
                        <ButtonGroup variant="outlined" size="small">
                            {connectorTools.map((toolItem) => {
                                const IconComponent = toolItem.icon
                                return (
                                    <Tooltip key={toolItem.id} title={`${toolItem.label} (${toolItem.shortcut})`}>
                                        <IconButton
                                            onClick={() => setTool(toolItem.id)}
                                            sx={{
                                                backgroundColor: tool === toolItem.id ? "#f3f4f6" : "transparent",
                                                color: tool === toolItem.id ? "#111827" : "#6b7280",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: 1,
                                                "&:hover": {
                                                    backgroundColor: "#f9fafb",
                                                    borderColor: "#d1d5db",
                                                },
                                            }}
                                        >
                                            <IconComponent size={18} />
                                        </IconButton>
                                    </Tooltip>
                                )
                            })}
                        </ButtonGroup>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 颜色和样式 */}
                        <Tooltip title="Colors">
                            <IconButton
                                onClick={(e) => setColorMenuAnchor(e.currentTarget)}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    backgroundColor: currentColor,
                                    border: "2px solid #ffffff",
                                    boxShadow: "0 0 0 1px #e5e7eb",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                            />
                        </Tooltip>

                        <Tooltip title="Text Style">
                            <IconButton onClick={(e) => setTextMenuAnchor(e.currentTarget)} disabled={selectedElements.length === 0}>
                                <Type size={18} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* 中间状态显示 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Chip
                            label={`${elements.filter((el) => el.visible).length} objects`}
                            size="small"
                            variant="outlined"
                            sx={{ color: "#6b7280", borderColor: "#e5e7eb" }}
                        />
                        {selectedElements.length > 0 && (
                            <Chip label={`${selectedElements.length} selected`} size="small" color="primary" variant="outlined" />
                        )}
                    </Box>

                    {/* 右侧操作组 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* 历史操作 */}
                        <ButtonGroup variant="outlined" size="small">
                            <Tooltip title="Undo (Ctrl+Z)">
                                <IconButton onClick={undo} disabled={historyIndex <= 0}>
                                    <Undo size={16} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Redo (Ctrl+Shift+Z)">
                                <IconButton onClick={redo} disabled={historyIndex >= history.length - 1}>
                                    <Redo size={16} />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 编辑操作 */}
                        <ButtonGroup variant="outlined" size="small">
                            <Tooltip title="Copy (Ctrl+C)">
                                <IconButton onClick={copySelected} disabled={selectedElements.length === 0}>
                                    <Copy size={16} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete (Del)">
                                <IconButton onClick={deleteSelected} disabled={selectedElements.length === 0}>
                                    <Trash2 size={16} />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 对齐工具 */}
                        <ButtonGroup variant="outlined" size="small">
                            <Tooltip title="Align Left">
                                <IconButton onClick={alignLeft} disabled={selectedElements.length < 2}>
                                    <AlignLeft size={16} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Align Center">
                                <IconButton onClick={alignCenter} disabled={selectedElements.length < 2}>
                                    <AlignCenter size={16} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Align Right">
                                <IconButton onClick={alignRight} disabled={selectedElements.length < 2}>
                                    <AlignRight size={16} />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 层级操作 */}
                        <ButtonGroup variant="outlined" size="small">
                            <Tooltip title="Lock/Unlock">
                                <IconButton onClick={toggleLock} disabled={selectedElements.length === 0}>
                                    {selectedElements.some((id) => elements.find((el) => el.id === id)?.locked) ? (
                                        <Unlock size={16} />
                                    ) : (
                                        <Lock size={16} />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Show/Hide">
                                <IconButton onClick={toggleVisibility} disabled={selectedElements.length === 0}>
                                    {selectedElements.some((id) => !elements.find((el) => el.id === id)?.visible) ? (
                                        <Eye size={16} />
                                    ) : (
                                        <EyeOff size={16} />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 视图控制 */}
                        <ButtonGroup variant="outlined" size="small">
                            <Tooltip title="Zoom Out (-)">
                                <IconButton onClick={handleZoomOut}>
                                    <ZoomOut size={16} />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="body2" sx={{ px: 2, py: 1, color: "#6b7280", minWidth: 60, textAlign: "center" }}>
                                {Math.round(zoom * 100)}%
                            </Typography>
                            <Tooltip title="Zoom In (+)">
                                <IconButton onClick={handleZoomIn}>
                                    <ZoomIn size={16} />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Tooltip title="Fit to Screen (1)">
                            <IconButton onClick={fitToCanvas} disabled={elements.length === 0}>
                                <Maximize size={16} />
                            </IconButton>
                        </Tooltip>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* 更多操作 */}
                        <Tooltip title="Export (Ctrl+S)">
                            <IconButton onClick={exportCanvas}>
                                <Download size={16} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="More">
                            <IconButton onClick={(e) => setMoreMenuAnchor(e.currentTarget)}>
                                <MoreHorizontal size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            )}

            {/* 移动端顶部工具栏 */}
            {isMobile && (
                <Toolbar
                    sx={{
                        minHeight: "56px !important",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e5e7eb",
                        padding: "0 16px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#111827", fontWeight: 600 }}>
                        Whiteboard
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={undo} disabled={historyIndex <= 0} size="small">
                            <Undo size={20} />
                        </IconButton>
                        <IconButton onClick={redo} disabled={historyIndex >= history.length - 1} size="small">
                            <Redo size={20} />
                        </IconButton>
                        <IconButton onClick={(e) => setMobileMenuOpen(true)} size="small">
                            <MenuIcon size={20} />
                        </IconButton>
                    </Box>
                </Toolbar>
            )}

            {/* 隐藏的文件输入 */}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={importImage} />

            {/* 移动端侧边菜单 */}
            <SwipeableDrawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                onOpen={() => setMobileMenuOpen(true)}
                PaperProps={{
                    sx: { width: 280, backgroundColor: "#ffffff" },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Tools & Settings
                        </Typography>
                        <IconButton onClick={() => setMobileMenuOpen(false)} size="small">
                            <Close size={20} />
                        </IconButton>
                    </Box>

                    {/* 状态信息 */}
                    <Box sx={{ mb: 3, p: 2, backgroundColor: "#f9fafb", borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                            Canvas Status
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {elements.filter((el) => el.visible).length} objects
                        </Typography>
                        {selectedElements.length > 0 && (
                            <Typography variant="body2" sx={{ color: "#3b82f6" }}>
                                {selectedElements.length} selected
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Zoom: {Math.round(zoom * 100)}%
                        </Typography>
                    </Box>

                    {/* 快速操作 */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Quick Actions
                        </Typography>
                        <Stack spacing={1}>
                            <Button
                                onClick={() => {
                                    copySelected()
                                    setMobileMenuOpen(false)
                                }}
                                disabled={selectedElements.length === 0}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<Copy size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                Copy Selected
                            </Button>
                            <Button
                                onClick={() => {
                                    pasteElements()
                                    setMobileMenuOpen(false)
                                }}
                                disabled={clipboard.length === 0}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<Copy size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                Paste
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteSelected()
                                    setMobileMenuOpen(false)
                                }}
                                disabled={selectedElements.length === 0}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<Trash2 size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                Delete Selected
                            </Button>
                            <Button
                                onClick={() => {
                                    selectAll()
                                    setMobileMenuOpen(false)
                                }}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<MousePointer size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                Select All
                            </Button>
                        </Stack>
                    </Box>

                    {/* 视图控制 */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            View Controls
                        </Typography>
                        <Stack spacing={1}>
                            <Button
                                onClick={() => {
                                    fitToCanvas()
                                    setMobileMenuOpen(false)
                                }}
                                disabled={elements.length === 0}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<Maximize size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                Fit to Screen
                            </Button>
                            <Button
                                onClick={() => {
                                    resetZoom()
                                    setMobileMenuOpen(false)
                                }}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<RotateCcw size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                Reset Zoom
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowGrid(!showGrid)
                                    setMobileMenuOpen(false)
                                }}
                                sx={{ justifyContent: "flex-start", p: 2 }}
                                startIcon={<Grid3X3 size={20} />}
                                fullWidth
                                variant="outlined"
                            >
                                {showGrid ? "Hide Grid" : "Show Grid"}
                            </Button>
                        </Stack>
                    </Box>

                    {/* 导出 */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Export
                        </Typography>
                        <Button
                            onClick={() => {
                                exportCanvas()
                                setMobileMenuOpen(false)
                            }}
                            sx={{ justifyContent: "flex-start", p: 2 }}
                            startIcon={<Download size={20} />}
                            fullWidth
                            variant="outlined"
                        >
                            Export as SVG
                        </Button>
                    </Box>
                </Box>
            </SwipeableDrawer>

            {/* 形状菜单 */}
            <Menu
                anchorEl={shapeMenuAnchor}
                open={Boolean(shapeMenuAnchor)}
                onClose={() => setShapeMenuAnchor(null)}
                PaperProps={{
                    sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
                }}
            >
                <Box sx={{ p: 2, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, minWidth: 200 }}>
                    {shapeTools.map((toolItem) => {
                        const IconComponent = toolItem.icon
                        return (
                            <Tooltip key={toolItem.id} title={`${toolItem.label} (${toolItem.shortcut})`}>
                                <IconButton
                                    onClick={() => {
                                        setTool(toolItem.id)
                                        setShapeMenuAnchor(null)
                                    }}
                                    sx={{
                                        backgroundColor: tool === toolItem.id ? "#f3f4f6" : "transparent",
                                        color: tool === toolItem.id ? "#111827" : "#6b7280",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: "#f9fafb",
                                            borderColor: "#d1d5db",
                                        },
                                    }}
                                >
                                    <IconComponent size={18} />
                                </IconButton>
                            </Tooltip>
                        )
                    })}
                </Box>
            </Menu>

            {/* 颜色菜单 */}
            <Menu
                anchorEl={colorMenuAnchor}
                open={Boolean(colorMenuAnchor)}
                onClose={() => setColorMenuAnchor(null)}
                PaperProps={{
                    sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
                }}
            >
                <Box sx={{ p: 3, minWidth: isMobile ? 280 : 300 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: "#374151" }}>
                        Colors
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1, mb: 3 }}>
                        {professionalColors.map((color) => (
                            <Tooltip key={color.name} title={color.name}>
                                <IconButton
                                    onClick={() => {
                                        setCurrentColor(color.value)
                                        if (selectedElements.length > 0) {
                                            setElements((prev) =>
                                                prev.map((el) => (selectedElements.includes(el.id) ? { ...el, color: color.value } : el)),
                                            )
                                            saveToHistory()
                                        }
                                        setColorMenuAnchor(null)
                                    }}
                                    sx={{
                                        width: isMobile ? 32 : 36,
                                        height: isMobile ? 32 : 36,
                                        backgroundColor: color.value,
                                        border: currentColor === color.value ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                                        borderRadius: 1,
                                        "&:hover": { transform: "scale(1.1)" },
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Box>

                    <Typography variant="subtitle2" sx={{ mb: 2, color: "#374151" }}>
                        Fill Colors
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1, mb: 3 }}>
                        <Tooltip title="Transparent">
                            <IconButton
                                onClick={() => {
                                    setCurrentFill("transparent")
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) ? { ...el, backgroundColor: "transparent" } : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                    setColorMenuAnchor(null)
                                }}
                                sx={{
                                    width: isMobile ? 32 : 36,
                                    height: isMobile ? 32 : 36,
                                    backgroundColor: "#ffffff",
                                    border: currentFill === "transparent" ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                                    borderRadius: 1,
                                    position: "relative",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%) rotate(45deg)",
                                        width: "2px",
                                        height: "24px",
                                        backgroundColor: "#ef4444",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        {professionalColors.map((color) => (
                            <Tooltip key={`fill-${color.name}`} title={color.name}>
                                <IconButton
                                    onClick={() => {
                                        setCurrentFill(color.value)
                                        if (selectedElements.length > 0) {
                                            setElements((prev) =>
                                                prev.map((el) =>
                                                    selectedElements.includes(el.id) ? { ...el, backgroundColor: color.value } : el,
                                                ),
                                            )
                                            saveToHistory()
                                        }
                                        setColorMenuAnchor(null)
                                    }}
                                    sx={{
                                        width: isMobile ? 32 : 36,
                                        height: isMobile ? 32 : 36,
                                        backgroundColor: color.value,
                                        border: currentFill === color.value ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                                        borderRadius: 1,
                                        "&:hover": { transform: "scale(1.1)" },
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Box>

                    <Typography variant="subtitle2" sx={{ mb: 2, color: "#374151" }}>
                        Stroke Width
                    </Typography>
                    <Slider
                        value={strokeWidth}
                        onChange={(_, value) => {
                            setStrokeWidth(value)
                            if (selectedElements.length > 0) {
                                setElements((prev) =>
                                    prev.map((el) => (selectedElements.includes(el.id) ? { ...el, strokeWidth: value } : el)),
                                )
                                saveToHistory()
                            }
                        }}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                        sx={{ color: currentColor }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: "#374151" }}>
                        Opacity
                    </Typography>
                    <Slider
                        value={opacity}
                        onChange={(_, value) => {
                            setOpacity(value)
                            if (selectedElements.length > 0) {
                                setElements((prev) =>
                                    prev.map((el) => (selectedElements.includes(el.id) ? { ...el, opacity: value } : el)),
                                )
                                saveToHistory()
                            }
                        }}
                        min={0.1}
                        max={1}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                        sx={{ color: currentColor }}
                    />
                </Box>
            </Menu>

            {/* 文本样式菜单 */}
            <Menu
                anchorEl={textMenuAnchor}
                open={Boolean(textMenuAnchor)}
                onClose={() => setTextMenuAnchor(null)}
                PaperProps={{
                    sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
                }}
            >
                <Box sx={{ p: 3, minWidth: isMobile ? 280 : 250 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: "#374151" }}>
                        Text Style
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: "#6b7280" }}>
                            Font Size
                        </Typography>
                        <Slider
                            value={textStyle.fontSize}
                            onChange={(_, value) => {
                                setTextStyle((prev) => ({ ...prev, fontSize: value }))
                                if (selectedElements.length > 0) {
                                    setElements((prev) =>
                                        prev.map((el) =>
                                            selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                ? { ...el, fontSize: value }
                                                : el,
                                        ),
                                    )
                                    saveToHistory()
                                }
                            }}
                            min={8}
                            max={72}
                            step={2}
                            valueLabelDisplay="auto"
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: "#6b7280" }}>
                            Text Formatting
                        </Typography>
                        <ButtonGroup variant="outlined" size="small" sx={{ mb: 1 }}>
                            <IconButton
                                onClick={() => {
                                    const newWeight = textStyle.fontWeight === "bold" ? "normal" : "bold"
                                    setTextStyle((prev) => ({ ...prev, fontWeight: newWeight }))
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                    ? { ...el, fontWeight: newWeight }
                                                    : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                }}
                                sx={{ backgroundColor: textStyle.fontWeight === "bold" ? "#f3f4f6" : "transparent" }}
                            >
                                <Bold size={16} />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    const newStyle = textStyle.fontStyle === "italic" ? "normal" : "italic"
                                    setTextStyle((prev) => ({ ...prev, fontStyle: newStyle }))
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                    ? { ...el, fontStyle: newStyle }
                                                    : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                }}
                                sx={{ backgroundColor: textStyle.fontStyle === "italic" ? "#f3f4f6" : "transparent" }}
                            >
                                <Italic size={16} />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    const newDecoration = textStyle.textDecoration === "underline" ? "none" : "underline"
                                    setTextStyle((prev) => ({ ...prev, textDecoration: newDecoration }))
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                    ? { ...el, textDecoration: newDecoration }
                                                    : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                }}
                                sx={{ backgroundColor: textStyle.textDecoration === "underline" ? "#f3f4f6" : "transparent" }}
                            >
                                <Underline size={16} />
                            </IconButton>
                        </ButtonGroup>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: "#6b7280" }}>
                            Text Alignment
                        </Typography>
                        <ButtonGroup variant="outlined" size="small">
                            <IconButton
                                onClick={() => {
                                    setTextStyle((prev) => ({ ...prev, textAlign: "left" }))
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                    ? { ...el, textAlign: "left" }
                                                    : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                }}
                                sx={{ backgroundColor: textStyle.textAlign === "left" ? "#f3f4f6" : "transparent" }}
                            >
                                <AlignLeft size={16} />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setTextStyle((prev) => ({ ...prev, textAlign: "center" }))
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                    ? { ...el, textAlign: "center" }
                                                    : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                }}
                                sx={{ backgroundColor: textStyle.textAlign === "center" ? "#f3f4f6" : "transparent" }}
                            >
                                <AlignCenter size={16} />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setTextStyle((prev) => ({ ...prev, textAlign: "right" }))
                                    if (selectedElements.length > 0) {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                selectedElements.includes(el.id) && (el.type === "text" || el.type === "sticky")
                                                    ? { ...el, textAlign: "right" }
                                                    : el,
                                            ),
                                        )
                                        saveToHistory()
                                    }
                                }}
                                sx={{ backgroundColor: textStyle.textAlign === "right" ? "#f3f4f6" : "transparent" }}
                            >
                                <AlignRight size={16} />
                            </IconButton>
                        </ButtonGroup>
                    </Box>
                </Box>
            </Menu>

            {/* 更多菜单 */}
            <Menu
                anchorEl={moreMenuAnchor}
                open={Boolean(moreMenuAnchor)}
                onClose={() => setMoreMenuAnchor(null)}
                PaperProps={{
                    sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setShowGrid(!showGrid)
                        setMoreMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <Grid3X3 size={16} />
                    </ListItemIcon>
                    <ListItemText>{showGrid ? "Hide Grid" : "Show Grid"}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setSnapToGrid(!snapToGrid)
                        setMoreMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <Move size={16} />
                    </ListItemIcon>
                    <ListItemText>{snapToGrid ? "Disable Snap to Grid" : "Enable Snap to Grid"}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        resetZoom()
                        setMoreMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <RotateCcw size={16} />
                    </ListItemIcon>
                    <ListItemText>Reset Zoom</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        bringToFront()
                        setMoreMenuAnchor(null)
                    }}
                    disabled={selectedElements.length === 0}
                >
                    <ListItemIcon>
                        <Move size={16} />
                    </ListItemIcon>
                    <ListItemText>Bring to Front</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        sendToBack()
                        setMoreMenuAnchor(null)
                    }}
                    disabled={selectedElements.length === 0}
                >
                    <ListItemIcon>
                        <Move size={16} />
                    </ListItemIcon>
                    <ListItemText>Send to Back</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        clearCanvas()
                        setMoreMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <Trash2 size={16} />
                    </ListItemIcon>
                    <ListItemText>Clear Canvas</ListItemText>
                </MenuItem>
            </Menu>

            {/* 上下文菜单（移动端长按） */}
            {contextMenuPosition && (
                <Menu
                    open={Boolean(contextMenuPosition)}
                    onClose={() => setContextMenuPosition(null)}
                    anchorReference="anchorPosition"
                    anchorPosition={{
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                    }}
                    PaperProps={{
                        sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
                    }}
                >
                    {contextMenuPosition.element && (
                        <>
                            <MenuItem
                                onClick={() => {
                                    if (contextMenuPosition.element.type === "sticky" || contextMenuPosition.element.type === "text") {
                                        setEditingText(contextMenuPosition.element.id)
                                        setTextInput(contextMenuPosition.element.text || "")
                                    }
                                    setContextMenuPosition(null)
                                }}
                            >
                                <ListItemIcon>
                                    <Edit size={16} />
                                </ListItemIcon>
                                <ListItemText>Edit Text</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setSelectedElements([contextMenuPosition.element.id])
                                    copySelected()
                                    setContextMenuPosition(null)
                                }}
                            >
                                <ListItemIcon>
                                    <Copy size={16} />
                                </ListItemIcon>
                                <ListItemText>Copy</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setSelectedElements([contextMenuPosition.element.id])
                                    toggleLock()
                                    setContextMenuPosition(null)
                                }}
                            >
                                <ListItemIcon>
                                    {contextMenuPosition.element.locked ? <Unlock size={16} /> : <Lock size={16} />}
                                </ListItemIcon>
                                <ListItemText>{contextMenuPosition.element.locked ? "Unlock" : "Lock"}</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    setSelectedElements([contextMenuPosition.element.id])
                                    deleteSelected()
                                    setContextMenuPosition(null)
                                }}
                            >
                                <ListItemIcon>
                                    <Trash2 size={16} />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </>
                    )}
                </Menu>
            )}

            {/* 画布区域 */}
            <Box
                sx={{
                    flexGrow: 1,
                    position: "relative",
                    overflow: "hidden",
                    cursor: tool === "hand" ? "grab" : tool === "select" ? "default" : "crosshair",
                    backgroundColor: "#fafafa",
                }}
            >
                <svg
                    ref={canvasRef}
                    width="100%"
                    height="100%"
                    onMouseDown={!isMobile ? handleStart : undefined}
                    onMouseMove={!isMobile ? handleMove : undefined}
                    onMouseUp={!isMobile ? handleEnd : undefined}
                    onDoubleClick={!isMobile ? handleDoubleClick : undefined}
                    onTouchStart={isMobile ? handleTouchStart : undefined}
                    onTouchMove={isMobile ? handleTouchMove : undefined}
                    onTouchEnd={isMobile ? handleTouchEnd : undefined}
                    style={{
                        backgroundColor: "#ffffff",
                        touchAction: "none", // 防止默认的触摸行为
                    }}
                >
                    {/* 网格背景 */}
                    {showGrid && (
                        <defs>
                            <pattern id="grid" width={gridSize * zoom} height={gridSize * zoom} patternUnits="userSpaceOnUse">
                                <path
                                    d={`M ${gridSize * zoom} 0 L 0 0 0 ${gridSize * zoom}`}
                                    fill="none"
                                    stroke="#f3f4f6"
                                    strokeWidth="1"
                                />
                            </pattern>
                            <pattern
                                id="gridMajor"
                                width={gridSize * 5 * zoom}
                                height={gridSize * 5 * zoom}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect width={gridSize * 5 * zoom} height={gridSize * 5 * zoom} fill="url(#grid)" />
                                <path
                                    d={`M ${gridSize * 5 * zoom} 0 L 0 0 0 ${gridSize * 5 * zoom}`}
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                    )}
                    {showGrid && <rect width="100%" height="100%" fill="url(#gridMajor)" />}

                    {/* 渲染所有元素 */}
                    {elements.map(renderElement)}

                    {/* 渲染临时元素 */}
                    {tempElement && renderElement(tempElement)}

                    {/* 渲染调整大小的手柄 */}
                    {selectedElements.map((id) => {
                        const element = elements.find((el) => el.id === id)
                        return element ? renderResizeHandles(element) : null
                    })}

                    {/* 选择框 */}
                    {selectionBox && (
                        <rect
                            x={selectionBox.x}
                            y={selectionBox.y}
                            width={selectionBox.width}
                            height={selectionBox.height}
                            fill="rgba(59, 130, 246, 0.1)"
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                        />
                    )}
                </svg>

                {/* 增强的文本编辑器 */}
                {editingText && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            p: 3,
                            minWidth: isMobile ? 280 : 500,
                            maxWidth: isMobile ? 320 : 700,
                            zIndex: 1000,
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Edit Text
                            </Typography>
                            <IconButton
                                onClick={() => {
                                    setEditingText(null)
                                    setTextInput("")
                                }}
                                size="small"
                            >
                                <Close size={16} />
                            </IconButton>
                        </Box>

                        {/* 文本格式化工具栏 */}
                        <Box sx={{ mb: 2, p: 1, backgroundColor: "#f9fafb", borderRadius: 1 }}>
                            <ButtonGroup variant="outlined" size="small" sx={{ mb: 1 }}>
                                <IconButton
                                    onClick={() => {
                                        const newWeight = textStyle.fontWeight === "bold" ? "normal" : "bold"
                                        setTextStyle((prev) => ({ ...prev, fontWeight: newWeight }))
                                    }}
                                    sx={{ backgroundColor: textStyle.fontWeight === "bold" ? "#e5e7eb" : "transparent" }}
                                >
                                    <Bold size={16} />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        const newStyle = textStyle.fontStyle === "italic" ? "normal" : "italic"
                                        setTextStyle((prev) => ({ ...prev, fontStyle: newStyle }))
                                    }}
                                    sx={{ backgroundColor: textStyle.fontStyle === "italic" ? "#e5e7eb" : "transparent" }}
                                >
                                    <Italic size={16} />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        const newDecoration = textStyle.textDecoration === "underline" ? "none" : "underline"
                                        setTextStyle((prev) => ({ ...prev, textDecoration: newDecoration }))
                                    }}
                                    sx={{ backgroundColor: textStyle.textDecoration === "underline" ? "#e5e7eb" : "transparent" }}
                                >
                                    <Underline size={16} />
                                </IconButton>
                            </ButtonGroup>

                            <ButtonGroup variant="outlined" size="small" sx={{ ml: 1 }}>
                                <IconButton
                                    onClick={() => setTextStyle((prev) => ({ ...prev, textAlign: "left" }))}
                                    sx={{ backgroundColor: textStyle.textAlign === "left" ? "#e5e7eb" : "transparent" }}
                                >
                                    <AlignLeft size={16} />
                                </IconButton>
                                <IconButton
                                    onClick={() => setTextStyle((prev) => ({ ...prev, textAlign: "center" }))}
                                    sx={{ backgroundColor: textStyle.textAlign === "center" ? "#e5e7eb" : "transparent" }}
                                >
                                    <AlignCenter size={16} />
                                </IconButton>
                                <IconButton
                                    onClick={() => setTextStyle((prev) => ({ ...prev, textAlign: "right" }))}
                                    sx={{ backgroundColor: textStyle.textAlign === "right" ? "#e5e7eb" : "transparent" }}
                                >
                                    <AlignRight size={16} />
                                </IconButton>
                            </ButtonGroup>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ minWidth: 80 }}>
                                    Font Size:
                                </Typography>
                                <Slider
                                    value={textStyle.fontSize}
                                    onChange={(_, value) => setTextStyle((prev) => ({ ...prev, fontSize: value }))}
                                    min={8}
                                    max={72}
                                    step={2}
                                    valueLabelDisplay="auto"
                                    sx={{ flexGrow: 1, maxWidth: 200 }}
                                />
                                <Typography variant="body2" sx={{ minWidth: 40 }}>
                                    {textStyle.fontSize}px
                                </Typography>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                    saveTextEdit()
                                } else if (e.key === "Escape") {
                                    setEditingText(null)
                                    setTextInput("")
                                }
                            }}
                            sx={{
                                mb: 3,
                                "& .MuiInputBase-input": {
                                    fontSize: `${textStyle.fontSize}px`,
                                    fontWeight: textStyle.fontWeight,
                                    fontStyle: textStyle.fontStyle,
                                    textDecoration: textStyle.textDecoration,
                                    textAlign: textStyle.textAlign,
                                },
                            }}
                            placeholder="Enter your text here..."
                        />

                        <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Chip label="Ctrl+Enter to save" size="small" variant="outlined" />
                                <Chip label="Esc to cancel" size="small" variant="outlined" />
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    onClick={() => {
                                        setEditingText(null)
                                        setTextInput("")
                                    }}
                                    variant="outlined"
                                    size="small"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={saveTextEdit} variant="contained" size="small" color="primary">
                                    Save
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                )}

                {/* 移动端悬浮操作按钮 */}
                {isMobile && (
                    <SpeedDial
                        ariaLabel="Tools"
                        sx={{ position: "absolute", bottom: 80, right: 16 }}
                        icon={<SpeedDialIcon />}
                        open={speedDialOpen}
                        onClose={() => setSpeedDialOpen(false)}
                        onOpen={() => setSpeedDialOpen(true)}
                    >
                        <SpeedDialAction
                            icon={<StickyNote size={20} />}
                            tooltipTitle="Sticky Note"
                            onClick={() => {
                                setTool("sticky")
                                setSpeedDialOpen(false)
                            }}
                        />
                        <SpeedDialAction
                            icon={<Type size={20} />}
                            tooltipTitle="Text"
                            onClick={() => {
                                setTool("text")
                                setSpeedDialOpen(false)
                            }}
                        />
                        <SpeedDialAction
                            icon={<Square size={20} />}
                            tooltipTitle="Rectangle"
                            onClick={() => {
                                setTool("rectangle")
                                setSpeedDialOpen(false)
                            }}
                        />
                        <SpeedDialAction
                            icon={<Circle size={20} />}
                            tooltipTitle="Circle"
                            onClick={() => {
                                setTool("circle")
                                setSpeedDialOpen(false)
                            }}
                        />
                        <SpeedDialAction
                            icon={<ArrowRight size={20} />}
                            tooltipTitle="Arrow"
                            onClick={() => {
                                setTool("arrow")
                                setSpeedDialOpen(false)
                            }}
                        />
                        <SpeedDialAction
                            icon={<Palette size={20} />}
                            tooltipTitle="Colors"
                            onClick={(e) => {
                                setColorMenuAnchor(e.currentTarget)
                                setSpeedDialOpen(false)
                            }}
                        />
                    </SpeedDial>
                )}

                {/* 移动端底部导航 */}
                {isMobile && (
                    <Paper
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                        }}
                        elevation={3}
                    >
                        <BottomNavigation
                            value={bottomNavValue}
                            onChange={(event, newValue) => {
                                setBottomNavValue(newValue)
                                switch (newValue) {
                                    case 0:
                                        setTool("select")
                                        break
                                    case 1:
                                        setTool("hand")
                                        break
                                    case 2:
                                        setTool("sticky")
                                        break
                                    case 3:
                                        setTool("rectangle")
                                        break
                                    case 4:
                                        // 打开更多工具
                                        setSpeedDialOpen(true)
                                        break
                                }
                            }}
                            sx={{ height: 64 }}
                        >
                            <BottomNavigationAction
                                label="Select"
                                icon={<MousePointer size={20} />}
                                sx={{ color: tool === "select" ? "#3b82f6" : "#6b7280" }}
                            />
                            <BottomNavigationAction
                                label="Pan"
                                icon={<Hand size={20} />}
                                sx={{ color: tool === "hand" ? "#3b82f6" : "#6b7280" }}
                            />
                            <BottomNavigationAction
                                label="Note"
                                icon={<StickyNote size={20} />}
                                sx={{ color: tool === "sticky" ? "#3b82f6" : "#6b7280" }}
                            />
                            <BottomNavigationAction
                                label="Shape"
                                icon={<Square size={20} />}
                                sx={{ color: tool === "rectangle" ? "#3b82f6" : "#6b7280" }}
                            />
                            <BottomNavigationAction label="More" icon={<Add size={20} />} />
                        </BottomNavigation>
                    </Paper>
                )}

                {/* 移动端操作提示 */}
                {isMobile && showMobileHints && elements.length === 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            color: "#9ca3af",
                            pointerEvents: "none",
                            p: 3,
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#374151" }}>
                            Welcome to Mobile Whiteboard
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: "#6b7280" }}>
                            Touch-optimized collaboration
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                <TouchApp size={20} />
                                <Typography variant="body2">Tap to select • Long press for menu</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                <Gesture size={20} />
                                <Typography variant="body2">Drag to move • Double tap to edit</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                <PinchZoom size={20} />
                                <Typography variant="body2">Pinch to zoom • Two fingers to pan</Typography>
                            </Box>
                        </Stack>

                        <Typography variant="body1" sx={{ mb: 1, color: "#9ca3af" }}>
                            Use the bottom toolbar to select tools
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                            Generate code to see automatic mind maps
                        </Typography>

                        <IconButton
                            onClick={() => setShowMobileHints(false)}
                            sx={{
                                position: "absolute",
                                top: -10,
                                right: -10,
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                            }}
                            size="small"
                        >
                            <Close size={16} />
                        </IconButton>
                    </Box>
                )}

                {/* 空状态提示（桌面端） */}
                {!isMobile && elements.length === 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            color: "#9ca3af",
                            pointerEvents: "none",
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "#374151" }}>
                            Welcome to Miro Whiteboard
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: "#6b7280" }}>
                            Collaborate visually with your team
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1, color: "#9ca3af" }}>
                            Start by selecting a tool from the toolbar above
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                            Generate code to see automatic mind maps, or create your own diagrams
                        </Typography>
                        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                            <Chip label="V - Select" variant="outlined" size="small" />
                            <Chip label="R - Rectangle" variant="outlined" size="small" />
                            <Chip label="O - Circle" variant="outlined" size="small" />
                            <Chip label="T - Text" variant="outlined" size="small" />
                            <Chip label="N - Sticky Note" variant="outlined" size="small" />
                        </Box>
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
                            <Chip label="Ctrl+Z - Undo" variant="outlined" size="small" />
                            <Chip label="Ctrl+C - Copy" variant="outlined" size="small" />
                            <Chip label="Del - Delete" variant="outlined" size="small" />
                            <Chip label="+ - Zoom In" variant="outlined" size="small" />
                        </Box>
                    </Box>
                )}

                {/* 状态提示 */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: isMobile ? 80 : 16,
                        right: 16,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: 2,
                        fontSize: "12px",
                        pointerEvents: "none",
                        opacity: selectedElements.length > 0 ? 1 : 0.7,
                        transition: "opacity 0.3s ease",
                    }}
                >
                    {selectedElements.length > 0
                        ? `${selectedElements.length} selected • ${isMobile ? "Long press for menu" : "Del to delete • Ctrl+C to copy"}`
                        : `${Math.round(zoom * 100)}% zoom • ${elements.filter((el) => el.visible).length} objects • All PC shortcuts enabled`}
                </Box>
            </Box>
        </Paper>
    )
}
