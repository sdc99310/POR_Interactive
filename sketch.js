let font, bg, pgPlain, pgFx
let c1, c2, tileSize

const PHRASE = 'Plan of Record'
const FX_INDEX = [0, 2, 8, 11, 13] // P, a, R, o (Record), d  -> add 5 for the "o" in "of"
const FONT_SIZE = 190
const tiles = 95

const colors = [
  'rgba(255, 0, 0, 0.9)',
  'rgba(10, 155, 2, 0.9)',
  'rgba(0, 0, 255, 0.9)'
]

function preload() {
  font = loadFont('SEASRN__.ttf')
}

function setup() {
  const cnv = createCanvas(1440, 900)
  cnv.parent(document.querySelector('main'))
  pixelDensity(1)
  frameRate(30)
  tileSize = width / tiles

  // background gradient (drawn once)
  c1 = color(205, 11, 255)
  c2 = color(176, 255, 54)
  bg = createGraphics(width, height)
  bg.pixelDensity(1)
  for (let i = 0; i <= height; i++) {
    bg.stroke(lerpColor(c1, c2, i / height))
    bg.line(0, i, width, i)
  }

  // plain letters / effect letters on separate layers
  pgPlain = createGraphics(width, height)
  pgFx = createGraphics(width, height)
  pgPlain.pixelDensity(1)
  pgFx.pixelDensity(1)
  pgFx.blendMode(SCREEN)

  const k = FONT_SIZE / 1000 // scale the original offsets
  const startX = 80
  const baseY = height / 2 + FONT_SIZE * 0.35

  for (let g of [pgPlain, pgFx]) {
    g.textFont(font)
    g.textSize(FONT_SIZE)
    g.textAlign(LEFT, BASELINE)
  }

  for (let i = 0; i < PHRASE.length; i++) {
    const ch = PHRASE[i]
    const x = startX + pgPlain.textWidth(PHRASE.substring(0, i))

    if (FX_INDEX.includes(i)) {
      pgFx.fill(colors[0]); pgFx.text(ch, x + 2, baseY + 2)
      pgFx.fill(colors[1]); pgFx.text(ch, x, baseY)
      pgFx.fill(colors[2]); pgFx.text(ch, x - 50 * k, baseY - 50 * k)
      pgFx.fill(colors[2]); pgFx.text(ch, x + 10 * k, baseY + 10 * k)
    } else {
      pgPlain.fill(255)
      pgPlain.text(ch, x, baseY)
    }
  }
}

function draw() {
  image(bg, 0, 0)
  image(pgPlain, 0, 0)

  for (let y = 0; y < tiles; y++) {
    for (let x = 0; x < tiles; x++) {
      const wave1 = floor(tan((frameCount + ((tiles - y) * 0.025) * (tiles - x)) * 0.0125) * 50)
      const wave2 = floor(sin((frameCount + ((tiles - y) * 0.025) * x) * 0.025) * 15)

      const sx = x * tileSize + wave2
      const sy = y * tileSize + wave2
      const sw = tileSize - 10
      const sh = tileSize - 10

      const dx = x * tileSize + wave1
      const dy = y * tileSize + wave1

      image(pgFx, dx, dy, tileSize, tileSize, sx, sy, sw, sh)
    }
  }
}

function mousePressed() {
  saveCanvas('por-hero', 'png')
}
