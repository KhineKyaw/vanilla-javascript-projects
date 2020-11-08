// Constants
const PRIMARY_COLOR = "#0095dd"
const BRICK_ROW_COUNT = 9
const BRICK_COL_COUNT = 5
// Vals
let score = 0
let game_start = false

// Compute brick dim
const padding = 10
const offX = 46
const brickWidth =
  (canvas.width - (offX * 2 - padding)) / BRICK_ROW_COUNT - padding

// Brick base
const brickInfo = {
  w: brickWidth,
  h: 20,
  padding: padding,
  offsetX: offX,
  offsetY: 60,
  visible: true
}

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
}

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
}

// Sound
class sound {
  constructor(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    this.sound.style.display = "none"
    document.body.appendChild(this.sound)
  }
  play = () => {
    this.sound.play()
  }
  stop = () => {
    this.sound.pause()
  }
}

const main = () => {
  const rulesBtn = document.getElementById("rules-btn")
  const closeBtn = document.getElementById("close-btn")
  const rules = document.getElementById("rules")
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")

  const loseSound = new sound("sounds/annulet.wav")

  // Create bricks
  const bricks = []
  for (let i = 0; i < BRICK_ROW_COUNT; i++) {
    bricks[i] = []
    for (let j = 0; j < BRICK_COL_COUNT; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
      bricks[i][j] = { x, y, ...brickInfo }
    }
  }

  // Draw ball on canvas
  const drawBall = () => {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
    ctx.fillStyle = PRIMARY_COLOR
    ctx.fill()
    ctx.closePath()
  }

  // Draw paddle on canvas
  const drawPaddle = () => {
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = PRIMARY_COLOR
    ctx.fill()
    ctx.closePath()
  }

  // Draw brick
  const drawBricks = () => {
    bricks.forEach(column => {
      column.forEach(brick => {
        ctx.beginPath()
        ctx.rect(brick.x, brick.y, brick.w, brick.h)
        ctx.fillStyle = brick.visible ? PRIMARY_COLOR : "transparent"
        ctx.fill()
        ctx.closePath()
      })
    })
  }

  // Draw score
  const drawScore = () => {
    ctx.font = "20px Philosopher"
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30)
  }

  // Move pacdle
  movePaddle = () => {
    paddle.x += paddle.dx

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w
    } else if (paddle.x < 0) {
      paddle.x = 0
    }
  }

  // Move ball on canvas
  const moveBall = () => {
    ball.x += ball.dx
    ball.y += ball.dy

    // Wall collision (x)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1
    }
    // Wall collision (y)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1
    }

    // Paddle collision
    if (
      ball.x - ball.size > paddle.x &&
      ball.x - ball.size < paddle.x + paddle.w &&
      ball.y + ball.size >= paddle.y
    ) {
      ball.y = paddle.y - ball.size
      ball.dy *= -1
      ball.dx = paddle.dx / 2 || ball.dx
    }

    // Brick collision
    bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          if (
            ball.y - ball.size < brick.y + brick.h &&
            ball.y + ball.size > brick.y &&
            ball.x - ball.size < brick.x + brick.w &&
            ball.x + ball.size > brick.x
          ) {
            const intersetX =
              Math.min(ball.x + ball.size, brick.x + brick.w) -
              Math.max(ball.x, brick.x)
            const intersetY =
              Math.min(ball.y + ball.size, brick.y + brick.h) -
              Math.max(ball.y, brick.y)

            if (intersetX > intersetY) ball.dy *= -1
            else ball.dx *= -1

            // Play sound
            const brickSound = new sound("sounds/fall.wav")
            brickSound.play()

            brick.visible = false
            increaseScore()
          }
        }
      })
    })

    // Hit bottom wll - lose
    if (ball.y + ball.size > canvas.height) {
      loseSound.play()
      showAllBricks()
      score = 0
    }
  }

  // Increase score
  const increaseScore = () => {
    score++

    if (score % (BRICK_COL_COUNT * BRICK_ROW_COUNT) === 0) {
      showAllBricks()
    }
  }

  // Make all bricks appear
  const showAllBricks = () => {
    bricks.forEach(column => {
      column.forEach(brick => (brick.visible = true))
    })
  }

  // Draw everything
  const draw = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()
  }

  const update = () => {
    if (game_start) {
      movePaddle()
      moveBall()
    }
    draw()
    requestAnimationFrame(update)
  }

  update()

  // Keydown event
  const keyDown = e => {
    if (e.key === "ArrowRight") {
      paddle.dx = paddle.speed
    } else if (e.key === "ArrowLeft") {
      paddle.dx = -paddle.speed
    } else if (e.key === " ") {
      game_start = !game_start
    }
  }

  // Keyup event
  const keyUp = e => {
    paddle.dx = 0
  }

  // Keyboard event handlers
  document.addEventListener("keydown", keyDown)
  document.addEventListener("keyup", keyUp)

  // Rules and close evenet handlers
  rulesBtn.addEventListener("click", () => rules.classList.add("show"))
  closeBtn.addEventListener("click", () => rules.classList.remove("show"))
  canvas.addEventListener("click", () => rules.classList.remove("show"))
}

document.addEventListener("DOMContentLoaded", main)
