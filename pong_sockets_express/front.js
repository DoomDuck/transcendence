import BallClient from "./BallClient";

// var two = new Two({
//   autostart: true
// }).appendTo(document.body);

var twoDOM = document.getElementById('game-surface');
var two = new Two({
  autostart: true,
  domElement: twoDOM,
})

// two.style.width = '100vh'
// two.style.height = '70vh'
// two.style.border = '10px solid black'

let dpi = window.devicePixelRatio;
const W = two.width;
const H = two.height;
// const W = 32 * dpi;
// const H = 18 * dpi;
const barW = (2 * W) / 100
const barH = (15 * H) / 100
const bar1X = (3 * W) / 100
const bar2X = (97 * W) / 100
const barY = (20 * H) / 100

var stage = new Two.Group();

// function fix_dpi(canvas) {
//   const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
//   const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
//   canvas.setAttribute('height', style_height * dpi);
//   canvas.setAttribute('width', style_width * dpi);
// }

// var canvas = document.getElementById('game-surface');
// const ctx = canvas.getContext('2d');
// const H = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
// const W = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

console.log(`H: ${H}`)
console.log(`W: ${W}`)


class Bar {
  constructor(id) {
    // this.ctx = ctx;
    const x = (id == 1) ? bar1X : bar2X;
    this.shape = new Two.Rectangle(x, barY, barW, barH);
    this.shape.fill = 'red';
    this.x = x
    this.y = barY
    this.id = id;
    // this.direction = 'up';
    this.upKey = false;
    this.downKey = false;
    this.vy = 0;
    this.isControlled = false;
  }

  // clear() {
  //   this.ctx.clearRect(this.x, this.y, barW, barH);
  // }

  // draw() {
  //   this.ctx.fillStyle = 'black'
  //   this.ctx.fillRect(this.x + .5, this.y + .5, barW - 1, barH - 1);
  // }
  setY(y) {
    this.y = y
    this.shape.position.set(this.x, this.y)
  }

  update(elapsed) {
    const oldY = this.y;
    const vy = 1 * (+this.downKey - this.upKey);

    this.y += elapsed * vy;
    this.y = Math.min(this.y, H - barH);
    this.y = Math.max(this.y, 0);
    if (this.y != oldY) {
      socket.emit('barUpdateFromClient', this.id, this.y);
    }
    this.shape.position.set(this.x, this.y)
  }
}

var isPlayer = false;
var playerNumber = null;


var entities = []
var bar1 = new Bar(1);
var bar2 = new Bar(2);
var ball = new BallClient(two.width, two.height, .5, .5, .1, .1);
entities.push(bar1, bar2, ball);
for (entity of entities) {
  stage.add(entity.shape)
}
two.add(stage)
// const landmark = new Two.Circle(two.width / 2, two.height / 2, 10)
// landmark.fill = 'red'
// two.add(landmark)

const takeControl1down = (e) => {
  if (e.key === 'ArrowUp') {
    bar1.upKey = true;
  }
  if (e.key === 'ArrowDown') {
    bar1.downKey = true;
  }
}
const takeControl2down = (e) => {
  if (e.key === 'ArrowUp') {
    bar2.upKey = true;
  }
  if (e.key === 'ArrowDown') {
    bar2.downKey = true;
  }
}
const takeControl1up = (e) => {
  if (e.key === 'ArrowUp') {
    bar1.upKey = false;
  }
  if (e.key === 'ArrowDown') {
    bar1.downKey = false;
  }
}
const takeControl2up = (e) => {
  if (e.key === 'ArrowUp') {
    bar2.upKey = false;
  }
  if (e.key === 'ArrowDown') {
    bar2.downKey = false;
  }
}


socket.on('p1', () => {
  alert('P1');
  window.addEventListener('keydown', takeControl1down, false);
  window.addEventListener('keyup', takeControl1up, false);
  bar1.isControlled = true;
  console.log('taken control of bar 1')
});

socket.on('p2', () => {
  alert('P2');
  window.addEventListener('keydown', takeControl2down, false);
  window.addEventListener('keyup', takeControl2up, false);
  bar2.isControlled = true;
  console.log('taken control of bar 2')
});

socket.on('gameEnd', () => {
  window.removeEventListener('keydown', takeControl1down, false);
  window.removeEventListener('keyup', takeControl1up, false);
  window.removeEventListener('keydown', takeControl2down, false);
  window.removeEventListener('keyup', takeControl2up, false);
  bar1.isControlled = false;
  bar2.isControlled = false;
});

socket.on('barUpdateFromServer', (n, y) => {
  var bar = n == 1 ? bar1 : bar2;
  // bar.clear();
  // bar.y = y;
  // bar.draw();
  bar.setY(y)
});

socket.on('ballUpdate', (x, y, vx, vy) => {
  ball.set(x, y, vx, vy);
  console.log('k')
})

var now;
var lastNow = Date.now();

// // fix_dpi(canvas);
// function draw() {
//   now = Date.now();
//   elapsed = now - lastNow;
//   lastNow = now;

//   if (bar1.isControlled) {
//     bar1.clear();
//     bar1.update(elapsed);
//     bar1.draw();
//   }
//   if (bar2.isControlled) {
//     bar2.clear();
//     bar2.update(elapsed);
//     bar2.draw();
//   }
//   window.requestAnimationFrame(draw);
// }
// draw()

two.bind('update', function () {
  // rect.rotation += 0.001;
  now = Date.now();
  elapsed = now - lastNow;
  lastNow = now
  // for (entity of entities) {
  //   entity.update(elapsed)
  // }
});
