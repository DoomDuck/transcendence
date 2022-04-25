// import { Ball } from "./Ball.js";
// const Ball = import('./Ball.mjs')


////

const ballRadius = 10

function updateValues1D(prevOffset, valMin, valMax, speed, elapsed) {
  newOffset = prevOffset + speed * elapsed;
  if (newOffset - ballRadius < valMin) {
    speed = Math.abs(speed);
  }
  else if (newOffset + ballRadius > valMax) {
    speed = Math.abs(speed);
  }
  else {
    return [newOffset, speed];
  }
  return [prevOffset + speed * elapsed, speed];
}

class Ball {
  constructor(x, y, vx, vy) {
    this.set(x, y, vx, vy)
  }

  set(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  nextPos(elapsed) {
    return [this.x + this.vx * elapsed, this.y + this.vy * elapsed]
  }

  collision(elapsed) {
    [x, y] = this.nextPos(elapsed)
    this.vx = collisionNewSpeed(x, this.stage)
  }

  update(elapsed) {
    this.x, this.vx = updateValues1D(this.x, 0, this.stageW, this.vx, elapsed)
    this.y, this.vy = updateValues1D(this.y, 0, this.stageH, this.vy, elapsed)
  }
}

////

class BallServer extends Ball {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy);
  }

  send(...sockets) {
    for (var socket of sockets) {
      socket.emit("ballUpdate", this.x, this.y, this.vx, this.vy)
    }
  }
}

module.exports = {
  BallServer: BallServer,
}
