const canvas_dim = 400
const R_OFFSET = 0
const G_OFFSET = 1
const B_OFFSET = 2

const main = () => {
  const fileinput = document.getElementById("fileinput")
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  const srcImage = new Image()
  let imgData = null
  let originalPixels = null
  let currentPixels = null
  fileinput.onchange = function (e) {
    if (e.target.files && e.target.files.item(0)) {
      srcImage.src = URL.createObjectURL(e.target.files[0])
    }
  }
  srcImage.onload = function () {
    // canvas.width = srcImage.width
    // canvas.height = srcImage.height
    canvas.width = canvas_dim
    canvas.height = canvas_dim
    // ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
    ctx.drawImage(srcImage, 0, 0, canvas_dim, canvas_dim)
    // imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
    imgData = ctx.getImageData(0, 0, canvas_dim, canvas_dim)
    originalPixels = imgData.data.slice()
  }

  /* Filter functions */
  // Transfers the changes we made to be displayed on the canvas
  function commitChanges() {
    // Copy over the current pixel changes to the image
    for (let i = 0; i < imgData.data.length; i++) {
      imgData.data[i] = currentPixels[i]
    }

    // Update the 2d rendering canvas with the image we just updated so the user can see
    ctx.putImageData(imgData, 0, 0, 0, 0, canvas_dim, canvas_dim)
  }

  function getIndex(x, y) {
    return (x + y * canvas_dim) * 4
  }

  // Clamp
  function clamp(value) {
    return Math.max(0, Math.min(Math.floor(value), 255))
  }

  function addBlue(x, y, value) {
    const index = getIndex(x, y) + B_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
  }

  function addGreen(x, y, value) {
    const index = getIndex(x, y) + G_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
  }

  function addRed(x, y, value) {
    const index = getIndex(x, y) + R_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
  }

  // Get
  const red = document.getElementById("red")
  const green = document.getElementById("green")
  const blue = document.getElementById("blue")
  const brightness = document.getElementById("brightness")
  const grayscale = document.getElementById("grayscale")
  const contrast = document.getElementById("contrast")

  function runPipeline(e) {
    currentPixels = originalPixels.slice()

    // Get each input value
    for (let i = 0; i < canvas_dim; i++) {
      for (let j = 0; j < canvas_dim; j++) {
        if (e.target.id === "blue") addBlue(j, i, +e.target.value)
        if (e.target.id === "green") addGreen(j, i, +e.target.value)
        if (e.target.id === "red") addRed(j, i, +e.target.value)
      }
    }
    commitChanges()
  }
  // Create a copy of the array of integers with 0-255 range

  red.onchange = runPipeline
  green.onchange = runPipeline
  blue.onchange = runPipeline
  brightness.onchange = runPipeline
  grayscale.onchange = runPipeline
  contrast.onchange = runPipeline
}

document.addEventListener("DOMContentLoaded", main)
