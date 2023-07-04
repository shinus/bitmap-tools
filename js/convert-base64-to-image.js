function handleDownload() {
  const getScript = document.currentScript;
  const pageTool = getScript.dataset.tool;
  const lang = getScript.dataset.lang;

  const downloadButton = document.querySelector('#download-button');
  const workspace = document.querySelector('.workspace');
  workspace.style.display = "block";
  const canvasPanel = document.getElementById('canvas-box-panel');
  let placeholderImage = new Image();
  placeholderImage.onload = function (e) {
    canvasPanel.appendChild(placeholderImage);
    placeholderImage.style.width = "100%";
  };
  placeholderImage.src = "/img/placeholder-image.jpg";
  let inputFile = '';
  let fileName = '';
  let image = null;

  const base64 = document.getElementById('data-uri');
  const copyBtn = document.querySelector('.copy-btn');
  base64.focus();

  const drawImage = function () {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas-img');
    let ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    canvasPanel.innerHTML = '';
    canvasPanel.appendChild(canvas);
  };

  base64.addEventListener('input', function (e) {
    handleFile(e.target.value);
  });

  const handleFile = function (file) {
    inputFile = file;
    if (file) {
      image = new Image();
      image.addEventListener('load', function () {
        canvasPanel.innerHTML = '';
        canvasPanel.appendChild(image);
      });

      image.src = "data:" + workspace.dataset.mime + ";base64," + inputFile;
    }
  };

  const downloadToText = function (txt) {
    document.querySelector('.download-txt').addEventListener('click', function () {
      let fileType = '.txt';
      let a = document.createElement('a');
      a.href = 'data:attachment/text,' + encodeURI(txt);
      a.download = "safeimagekit." + fileType;
      document.body.appendChild(a);
      a.click();
      if (lang === 'en') {
        window.location.href = "/download?tool=" + pageTool;
      } else {
        window.location.href = "/" + lang + "/download?tool=" + pageTool;
      }
    });
  };

  const getBase64String = function (dataURL) {
    const idx = dataURL.indexOf('base64,') + 'base64,'.length;
    return dataURL.substring(idx);
  };

  const dataURLtoBlob = function (dataurl) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  downloadButton.addEventListener('click', function () {
    workspace.style.display = 'none';
    canvasPanel.style.display = 'none';

    let fileType = document.querySelector("#image-format").value;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let image = canvasPanel.querySelector("img");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    let a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = "safeimagekit." + fileType;
    document.body.appendChild(a);
    a.click();

    if (lang === 'en') {
      window.location.href = "/download?tool=" + pageTool;
    } else {
      window.location.href = "/" + lang + "/download?tool=" + pageTool;
    }
  });
}

handleDownload();