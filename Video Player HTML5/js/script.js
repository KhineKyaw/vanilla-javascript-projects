const main = () => {
  const video = document.getElementById("video")
  const play = document.getElementById("play")
  const stop = document.getElementById("stop")
  const progress = document.getElementById("progress")
  const timestamp = document.getElementById("timestamp")

  const formatZero = str => `${"0".repeat(2 - str.length)}`

  const formatTimeMillis = timeMillis => {
    const denominator = 1000 * 60 * 60
    const denominator2 = 1000 * 60
    const hours = Math.floor(timeMillis / denominator).toString()
    const minutes = Math.floor(
      (timeMillis % denominator) / denominator2
    ).toString()
    const seconds = Math.floor((timeMillis % denominator2) / 1000).toString()
    let hour_string = ""
    if (+hours) hour_string = `${formatZero(hours)}${hours}`
    return `${hour_string}${formatZero(minutes)}${minutes}:${formatZero(
      seconds
    )}${seconds}`
  }

  // Play & pause video
  const toggleVideoStatus = () => {
    if (video.paused) video.play()
    else video.pause()
  }

  // update play/pause icon
  const updatePlayIcon = () => {
    if (video.paused) {
      play.innerHTML = '<i class="ion-ios-play"></i>'
    } else {
      play.innerHTML = '<i class="ion-ios-pause"></i>'
    }
  }

  // update progress & timestamp
  const updateProgress = () => {
    progress.value = video.currentTime / video.duration

    timestamp.innerHTML = formatTimeMillis(video.currentTime * 1000)
  }

  // Set video time to progress
  const setVideoProgress = props => {
    video.currentTime = +props.target.value * video.duration
  }

  // Stop the video
  const stopVideo = () => {
    video.currentTime = 0
    video.pause()
  }

  // Event listeners
  video.addEventListener("click", toggleVideoStatus)
  video.addEventListener("pause", updatePlayIcon)
  video.addEventListener("play", updatePlayIcon)
  video.addEventListener("timeupdate", updateProgress)

  play.addEventListener("click", toggleVideoStatus)
  stop.addEventListener("click", stopVideo)
  // progress.addEventListener("change", setVideoProgress)
  progress.addEventListener("click", setVideoProgress)
}

document.addEventListener("DOMContentLoaded", main)
