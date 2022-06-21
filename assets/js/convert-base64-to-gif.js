const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const lang = getScript.dataset.lang

const downloadButton = document.querySelector('#download-button')
const workspace = document.querySelector('.workspace')
const canvasPanel = document.getElementById('canvas-panel')
let inputFile = ''
let fileName = ''
let image = null

const base64 = document.getElementById('data-uri')
const copyBtn = document.querySelector('.copy-btn')
base64.focus()

// const copyToClipboard = (str) => {
//   try {
//     const el = document.createElement('textarea')
//     el.value = str
//     document.body.appendChild(el)
//     el.select()
//     document.execCommand('copy')
//     document.body.removeChild(el)
//     copyBtn.setAttribute('data-tooltip', 'Copied !')
//   } catch (error) {
//     console.log(error)
//   }
// }

// copyBtn.setAttribute('data-tooltip', 'Copy')

const drawImage = () => {
  canvasPanel.innerHTML = ''
  canvasPanel.appendChild(image)
}

base64.addEventListener('input', (e) => {
  handleFile(e.target.value)
})

const handleFile = (file) => {
  inputFile = file
  if (file) {
    image = new Image()
    image.addEventListener('load', () => {
      drawImage()
    })

    image.src = 'data:image/gif;base64,' + inputFile

    // downloadToText(getBase64String(e.target.result))
    // copyBtn.addEventListener('click', () => {
    //     copyToClipboard(getBase64String(e.target.result))
    // })
  }
}

const downloadToText = () => {
  let txt = document.querySelector('#data-uri').value
  document.querySelector('.download-txt').addEventListener('click', () => {
    let fileType = '.txt'
    let a = document.createElement('a')
    a.href = 'data:attachment/text,' + encodeURI(txt)
    a.download = `safeimagekit.${fileType}`
    document.body.appendChild(a)
    a.click()
    if (lang === 'en') {
      window.location.href = `/download?tool=${pageTool}`
    } else {
      window.location.href = `/${lang}/download?tool=${pageTool}`
    }
  })
}

const handleDownload = () => {
  var url = image.src
  fetch(url)
    .then((res) => res.blob())
    .then((bloburl) => {
      let a = document.createElement('a')
      console.log(bloburl)
      a.href = URL.createObjectURL(bloburl)
      a.download = `safeimagekit.gif`
      document.body.appendChild(a)
      a.click()
      if (lang === 'en') {
        window.location.href = `/download?tool=${pageTool}`
      } else {
        window.location.href = `/${lang}/download?tool=${pageTool}`
      }
    })
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
