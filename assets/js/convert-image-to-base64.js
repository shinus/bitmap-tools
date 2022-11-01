const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const lang = getScript.dataset.lang
const gdrive = document.querySelector('#filepicker')
const inputBox = document.querySelector('#Inputbox')
const fileDropBox = document.querySelector('.custom-box')
const cropBoxPanel = document.getElementById('crop-box-panel')
const downloadButton = document.querySelector('#download-button')
let cropper = ''
let croppedImageWidth = ''
let root = document.querySelector(':root')
root.style.setProperty('--maincolor', fileDropBox.dataset.color)
const workspace = document.querySelector('.workspace')
const canvasPanel = document.getElementById('canvas-panel')
let inputFile = ''
let fileName = ''
let image = null

const dataUri = document.getElementById('data-uri')
const copyBtn = document.querySelector('.copy-btn')

const copyToClipboard = (str) => {
  try {
    const el = document.createElement('textarea')
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copyBtn.setAttribute('data-tooltip', 'Copied !')
  } catch (error) {
    console.log(error)
  }
}

copyBtn.setAttribute('data-tooltip', 'Copy')

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

const drawImage = () => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'canvas-img')
  let ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  canvasPanel.innerHTML = ''
  canvasPanel.appendChild(canvas)
  workspace.style.display = 'block'
}

const handleFile = (file) => {
  showLoading()
  inputFile = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target.result) {
        image = new Image()
        image.addEventListener('load', () => {
          drawImage()
          stopLoading()
        })
        let fVal = getBase64String(e.target.result)
        const changeText = () => {
          let value = getBase64String(e.target.result)
          if (getScript.dataset.filename === "base64-encode-png" || getScript.dataset.filename === "convert-image-to-base64") {
            if (document.querySelector("#validate").checked)
              value = `data:${file.type};base64,${value}`
            if (document.querySelector("#splitting").checked && document.querySelector("#chunks").value !== "" && Number(document.querySelector("#chunks").value) > 0) {
              let arr = value.match(new RegExp('.{1,' + Number(document.querySelector("#chunks").value) + '}', 'g'))
              let newVal = ''
              for (let i = 0; i < arr.length; i++) {
                if (i !== arr.length - 1)
                  newVal += arr[i] + '\n'
                else
                  newVal += arr[i]
              }
              dataUri.value = fVal = newVal
            } else
              dataUri.value = fVal = value
          }
        }
        changeText()
        if (getScript.dataset.filename === "base64-encode-png" || getScript.dataset.filename === "convert-image-to-base64") {
          document.querySelector("#validate").onchange = () => changeText()
          document.querySelector("#chunks").onchange = () => changeText()
          document.querySelector("#splitting").onchange = () => changeText()
        }
        image.src = e.target.result
        document.querySelector('.download-txt').addEventListener('click', () => {
          let a = document.createElement('a')
          let blob = new Blob([fVal], { type: "text/plain" })
          a.href = URL.createObjectURL(blob)
          a.download = `${inputFile.name.split('.')[0]}-safeimagekit.txt`
          document.body.appendChild(a)
          a.click()
          if (lang === 'en') {
            window.location.href = `/download?tool=${pageTool}`
          } else {
            window.location.href = `/${lang}/download?tool=${pageTool}`
          }
        })
        copyBtn.addEventListener('click', () => {
          copyToClipboard(fVal)
        })
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
  workspace.style.display = 'none'
  canvasPanel.style.display = 'none'
  document.querySelector('#file-loader').style.display = 'none'
  fileDropBox.style.display = 'flex'
  // document.querySelector('.saving-file-download-wrap').style.display = 'flex'
  let fileType = inputFile.type.split('image/')[1]
  let canvas = document.querySelector('#canvas-img')
  let url = canvas.toDataURL(`image/${fileType}`)

  let a = document.createElement('a')
  a.href = url
  a.download = `${inputFile.name.split('.')[0]}-safeimagekit.${fileType}`
  document.body.appendChild(a)
  a.click()
  if (lang === 'en') {
    window.location.href = `/download?tool=${pageTool}`
  } else {
    window.location.href = `/${lang}/download?tool=${pageTool}`
  }
}
downloadButton.addEventListener('click', handleDownload)

const getBase64String = (dataURL) => {
  const idx = dataURL.indexOf('base64,') + 'base64,'.length
  return dataURL.substring(idx)
}
const dataURLtoBlob = (dataurl) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
