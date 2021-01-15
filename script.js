const brushSlider = document.getElementById('brush-slider')
const brushSize = document.getElementById('brush-size')
const clearCanvas = document.getElementById('clear-canvas')
const bucketColorBtn = document.getElementById('bucket-color')
const brushColorBtn = document.getElementById('brush-color')
const eraser = document.getElementById('eraser')
const brush = document.getElementById('brush')
const activeTool = document.getElementById('active-tool')
const downloadBtn = document.getElementById('download')
const saveStorage = document.getElementById('save-storage')
const loadStorage = document.getElementById('load-storage')
const clearStorage = document.getElementById('clear-storage')
const {body} = document
const canvas = document.createElement('canvas')
canvas.id = 'canvas'
const ctx = canvas.getContext('2d')

let bucketColor = `#${bucketColorBtn.value}`
let brushColor = `#${brushColorBtn.value}`
let currentSize = 10
let mouseDown = false
let isErase = false
let drawArr = []

function createCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight - 50
    ctx.fillStyle = bucketColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    body.appendChild(canvas)
    switchToBrush()
}

function getMousePosition(event) {
    const boundaries = canvas.getBoundingClientRect()
    return {
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top
    }
}

function restoreCanvas() {
    for (let i = 1; i < drawArr.length; i++) {
        ctx.beginPath()
        ctx.moveTo(drawArr[i - 1].x, drawArr[i - 1].y)
        ctx.lineWidth = drawArr[i].size
        ctx.lineCap = 'round'
        if (drawArr[i].erase) {
            ctx.strokeStyle = bucketColor
        } else {
            ctx.strokeStyle = drawArr[i].color
        }
        ctx.lineTo(drawArr[i].x, drawArr[i].y)
        ctx.stroke()
    }
}

function switchToBrush() {
    isErase = false
    brushColor = `#${brushColorBtn.value}`
    currentSize = 10
    brushSlider.value = 10
    brush.style.color = 'black'
    eraser.style.color = 'white'
    activeTool.textContent = 'Brush'
    changeBrushSlider()
}

function storeDrawn(x, y, color, size, erase) {
    const line = {x, y, color, size, erase}
    drawArr.push(line)
}

function changeBrushSlider() {
    currentSize = brushSlider.value
    brushSize.textContent = currentSize
}

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true
    const currentPosition = getMousePosition(event)
    ctx.moveTo(currentPosition.x, currentPosition.y)
    ctx.beginPath()
    ctx.strokeStyle = brushColor
    ctx.lineWidth = currentSize
    ctx.lineCap = "round"
})

canvas.addEventListener('mousemove', (event) => {
    if (mouseDown === true) {
        const currentPosition = getMousePosition(event)
        ctx.lineTo(currentPosition.x, currentPosition.y)
        ctx.stroke()
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            brushColor,
            currentSize,
            isErase
        )
    } else {storeDrawn(undefined)}
})

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false
})

clearCanvas.addEventListener('click', () => {
    createCanvas()
    drawArr = []
    activeTool.textContent = 'Canvas Cleared'
    setTimeout(switchToBrush, 1500)
})

brushColorBtn.addEventListener('change', () => {
    brushColor = `#${brushColorBtn.value}`
})

brushSlider.addEventListener('change', changeBrushSlider)

brush.addEventListener('click', switchToBrush)

bucketColorBtn.addEventListener('change', () => {
    bucketColor = `#${bucketColorBtn.value}`
    createCanvas()
    restoreCanvas()
})

eraser.addEventListener('click', () => {
    isErase = true
    brush.style.color = 'white'
    eraser.style.color = 'black'
    brushColor = bucketColor
    currentSize = 50
    brushSlider.value = 50
    activeTool.textContent = 'Eraser'
    changeBrushSlider()
})

downloadBtn.addEventListener('click', () => {
    downloadBtn.href = canvas.toDataURL('image/jpeg', 1)
    activeTool.textContent = 'Image saved'
    setTimeout(switchToBrush, 2000)
})

saveStorage.addEventListener('click', () => {
    localStorage.setItem(`savedCanvas`, JSON.stringify(drawArr))
    activeTool.textContent = 'Saved to Local Storage'
    setTimeout(switchToBrush, 1500)
})

loadStorage.addEventListener('click', () => {
    if (localStorage.getItem('savedCanvas')) {
        drawArr = JSON.parse(localStorage.savedCanvas)
        restoreCanvas()
        activeTool.textContent = 'Load from Local Storage'
        setTimeout(switchToBrush, 1500)
    } else {
        activeTool.textContent = 'No Canvas Found'
        setTimeout(switchToBrush, 1500)
    }
})

clearStorage.addEventListener('click', () => {
    localStorage.removeItem(`savedCanvas`)
    activeTool.textContent = 'Canvas cleared'
    setTimeout(switchToBrush, 1500)
})

createCanvas()







