const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const lang = getScript.dataset.lang
const gdrive = document.querySelector('#filepicker')
const inputBox = document.querySelector('#Inputbox')
const fileDropBox = document.querySelector('.custom-box')
const cropBoxPanel = document.getElementById('crop-box-panel')
const downloadButton = document.querySelector('#download-button')
let cropper = null
const workspace = document.querySelector('.workspace')
const canvasPanel = document.getElementById('canvas-box-panel')
let inputFile = ''
let fileName = "";
let image = null;


const showLoader = () => {
    showLoading()
}
const closeLoader = () => { }
const mimeTypes = 'image/png,image/jpg,image/jpeg,image/webp'
const filemimes = ['.png', '.webp', '.jpg', '.jpeg']
gdrive.addEventListener(
    'click',
    (getFile, mimeTypes, showLoader, closeLoader) => {
        const data = loadPicker()
    }
)
const getDropBoxFile = (file) => {
    handleFile(file)
}
const getFile = (file) => {
    handleFile(file)
}
const fileOnChange = () => {
    handleFile(file.files[0])
}
const dropbox = document.getElementById('dropbox')
dropbox.addEventListener(
    'click',
    async (getDropBoxFile, showLoader, closeLoader) => {
        const getFile = chooseFromDropbox()
    }
)
inputBox.onclick = function () {
    document.querySelector('#file').click()
}
fileDropBox.addEventListener('dragover', (e) => {
    e.preventDefault()
})
fileDropBox.addEventListener('drop', (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
})

const setCropper = (img, args = null) => {
    if (cropper !== null)
        cropper.destroy()
    let canCrop = true

    return cropper = new Cropper(img, {
        viewMode: 2,
        zoomable: false,
        modal: false,
        autoCropArea: 1,
        ready() {
            if (args !== null) cropper.setData(args)
            document.querySelector("#width").max = img.width
            document.querySelector("#height").max = img.height
            document.querySelector("#posx").value = Math.round(cropper.getData().x)
            document.querySelector("#posy").value = Math.round(cropper.getData().y)
            document.querySelector("#width").value = Math.round(cropper.getData().width)
            document.querySelector("#height").value = Math.round(cropper.getData().height)

            document.querySelector("#posx").oninput = () => { if (canCrop) { cropper.setData({ x: Number(document.querySelector("#posx").value) }) } }
            document.querySelector("#posy").oninput = () => { if (canCrop) { cropper.setData({ y: Number(document.querySelector("#posy").value) }) } }
            document.querySelector("#width").oninput = () => {
                if (canCrop) {
                    cropper.setData({ width: Number(document.querySelector("#width").value) })
                    document.querySelector("#posx").value = Math.round(cropper.getData().x)
                }
            }
            document.querySelector("#width").onchange = () => {
                if (canCrop) {
                    cropper.setData({ width: Number(document.querySelector("#width").value) })
                    document.querySelector("#posx").value = Math.round(cropper.getData().x)
                }
            }
            document.querySelector("#height").oninput = () => {
                if (canCrop) {
                    cropper.setData({ height: Number(document.querySelector("#height").value) })
                    document.querySelector("#posy").value = Math.round(cropper.getData().y)
                }
            }
            document.querySelector("#height").onchange = () => {
                if (canCrop) {
                    cropper.setData({ height: Number(document.querySelector("#height").value) })
                    document.querySelector("#posy").value = Math.round(cropper.getData().y)
                }
            }
        },
        cropstart() {
            canCrop = false
        },
        cropmove() {
            document.querySelector("#posx").value = Math.round(cropper.getData().x)
            document.querySelector("#posy").value = Math.round(cropper.getData().y)
            document.querySelector("#width").value = Math.round(cropper.getData().width)
            document.querySelector("#height").value = Math.round(cropper.getData().height)
        },
        cropend() {
            document.querySelector("#posx").value = Math.round(cropper.getData().x)
            document.querySelector("#posy").value = Math.round(cropper.getData().y)
            document.querySelector("#width").value = Math.round(cropper.getData().width)
            document.querySelector("#height").value = Math.round(cropper.getData().height)
            canCrop = true
        }
    })
}

let canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
let posx = document.querySelector("#posx"), posy = document.querySelector("#posy"), width = document.querySelector("#width"), height = document.querySelector("#height"), opacity = document.querySelector("#opacity")
const drawImage = () => {
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    ctx.drawImage(image, 0, 0)
    ctx.clearRect(Number(posx.value), Number(posy.value), Number(width.value), Number(height.value))
    ctx.globalAlpha = Number(opacity.value) / 100
    ctx.drawImage(image, Number(posx.value), Number(posy.value), Number(width.value), Number(height.value), Number(posx.value), Number(posy.value), Number(width.value), Number(height.value))
    ctx.globalAlpha = 1
    let newImage = new Image()
    newImage.onload = () => {
        canvasPanel.appendChild(newImage)
        setCropper(newImage, { x: Number(posx.value), y: Number(posy.value), width: Number(width.value), height: Number(height.value) })
        canvasPanel.querySelector("img").remove()
    }
    newImage.src = canvas.toDataURL()
}

const handleFile = (file) => {
    removeNav()
    showLoading()
    document.querySelector('#image-format').value = file.type.split('/')[1]
    inputFile = file
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target.result) {
                image = new Image()
                image.onload = () => {
                    stopLoading()
                    workspace.style.display = "block"
                    canvasPanel.appendChild(image)
                    posx.value = 0
                    posy.value = 0
                    width.value = image.naturalWidth
                    height.value = image.naturalHeight
                    document.querySelector("#applyButton").onclick = () => drawImage(image)
                    document.querySelector("#resetButton").onclick = () => {
                        posx.value = 0
                        posy.value = 0
                        width.value = image.naturalWidth
                        height.value = image.naturalHeight
                        opacity.value = 50
                        document.querySelector("#counter").innerText = "50%"
                        drawImage()
                    }
                    drawImage()
                }
                image.src = e.target.result
            }
        }
        reader.readAsDataURL(file)
    }
}

const showLoading = () => {
    document.querySelector('#file-loader').style.display = 'flex'
    document.querySelector('.file-input').style.display = 'none'
}
const stopLoading = () => {
    fileDropBox.style.display = 'none'
}
const showDropDown = document.querySelector('.file-pick-dropdown')
const icon = document.querySelector('.arrow-sign')
const dropDown = document.querySelector('.file-picker-dropdown')
showDropDown.addEventListener('click', () => {
    addScripts()
    if (dropDown.style.display !== 'none') {
        dropDown.style.display = 'none'
        icon.classList.remove('fa-angle-up')
        icon.classList.add('fa-angle-down')
    } else {
        dropDown.style.display = 'block'
        icon.classList.remove('fa-angle-down')
        icon.classList.add('fa-angle-up')
    }
})
const handleDownload = () => {
    document.getElementById('saving-data').style.display = 'block'
    canvasPanel.style.display = 'none'

    let fileType = document.querySelector('#image-format').value
    let url = canvasPanel.querySelector('img').src

    let a = document.createElement('a')
    a.href = url
    a.download = `${inputFile.name.split('.')[0]}-${document.querySelector("#site-name").dataset.filename}.${fileType}`
    document.body.appendChild(a)
    a.click()
    if (lang === 'en') {
        window.location.href = `/download?tool=${pageTool}`
    } else {
        window.location.href = `/${lang}/download?tool=${pageTool}`
    }
}
downloadButton.addEventListener('click', handleDownload);