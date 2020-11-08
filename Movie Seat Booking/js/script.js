const main = () => {
  const container = document.querySelector(".container")
  const seats = document.querySelectorAll(".row .seat:not(.occupied)")
  const count = document.getElementById("count")
  const total = document.getElementById("total")
  const movieSelect = document.getElementById("movie")

  let ticketPrice = +movieSelect.value

  // save selected movie index and price
  const setMovieData = (movieIndex, moviePrice) => {
    localStorage.setItem("selectedMovieIndex", movieIndex)
    localStorage.setItem("selectedMoviePrice", moviePrice)
  }

  // update total and count
  const updateSelectedCount = () => {
    const selectedSeats = document.querySelectorAll(".row .seat.selected")

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat))

    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex))

    const seatCount = selectedSeats.length
    count.innerText = seatCount
    total.innerText = seatCount * ticketPrice
  }

  // Get data from localstorage and populate UI
  const populateUI = () => {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"))

    if (selectedSeats !== null && selectedSeats.length > 0) {
      seats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) > -1) {
          seat.classList.add("selected")
        }
      })
    }

    const selectedIndex = localStorage.getItem("selectedMovieIndex")
    if (selectedIndex !== null) {
      movieSelect.selectedIndex = selectedIndex
    }
  }

  // movie select event
  movieSelect.addEventListener("change", e => {
    ticketPrice = +e.target.value
    updateSelectedCount()
    setMovieData(e.target.selectedIndex, e.target.value)
  })

  // seat click event
  container.addEventListener("click", e => {
    if (
      e.target.classList.contains("seat") &&
      !e.target.classList.contains("occupied")
    ) {
      e.target.classList.toggle("selected")
      updateSelectedCount()
    }
  })

  // loading data and updating screen
  populateUI()
  updateSelectedCount()
}

document.addEventListener("DOMContentLoaded", main)
