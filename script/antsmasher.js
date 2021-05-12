function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  function distanceBetween(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
  
  function isIntersect(point, circle) {
    return (
      Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) <
      circle.radius
    );
  }
  
  const MAX_RADIUS = 20;
  const TOTAL_BALLS = 20;
  
  const MAX_SPEED = 1;
  const WIDTH = 1000;
  const HEIGHT = 500;
  const COLORS = [];
  
   class Ball {
    constructor(x ,y, color,r  ,dx , dy ,antImg) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
      this.ant = antImg;
    }
  
    init(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  
    update(ctx) {
      this.draw(ctx);
      this.move();
      this.checkCollision(ctx);
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  
      ctx.drawImage(this.ant, this.x - 25, this.y - 15, 60, 30);
  
      ctx.closePath();
    }
  
    move() {
      this.x += this.dx;
      this.y += this.dy;
    }
  
    checkCollision(ctx) {
      if (this.x - this.r < 0) {
        this.x = this.r;
        this.dx = -this.dx;
      }
  
      if (this.x + this.r > ctx.canvas.width) {
        this.x = ctx.canvas.width - this.r;
        this.dx = -this.dx;
      }
  
      if (this.y - this.r < 0) {
        this.y = this.r;
        this.dy = -this.dy;
      }
  
      if (this.y + this.r > ctx.canvas.height) {
        this.y = ctx.canvas.height - this.r;
        this.dy = -this.dy;
      }
    }
  
    checkOtherBallCollision(balls) {
      balls.forEach((ball) => {
        if (ball == this) {
          return;
        }
  
        let AX = this.x;
        let AY = this.y;
        let ARad = this.r;
        let ADx = this.dx;
        let ADy = this.dy;
  
        let BX = ball.x;
        let BY = ball.y;
        let BRad = ball.r;
        let BDx = ball.dx;
        let BDy = ball.dy;
  
        let distance = distanceBetween(
          { x: AX, y: AY },
          { x: BX, y: BY }
        );
  
        if (distance < ARad + BRad) {
          if (AX < BX) {
            this.x = AX - 1;
          } else {
            this.x = AX + 1;
          }
  
          if (AY < BY) {
            this.y = AY - 1;
          } else {
            this.y = AY + 1;
          }
  
          this.dx = BDx;
          this.dy = BDy;
          ball.dx = ADx;
          ball.dy = ADy;
        }
      });
    }
  }
  
  class Box {
    constructor(canvasId, width, height) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.ballsInfo = [];
      this.canvas.width = width;
      this.canvas.height = height;
      this.init();
      this.addClickListener();
    }
  
    init = () => {
      this.ant = new Image();
      this.ant.src = "images/1.png";
      this.createBall(TOTAL_BALLS);
      this.ant.onload = this.update;
      // window.requestAnimationFrame(this.update);
    };
  
    update = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
      this.ballsInfo.forEach((ball) => {
        ball.update(this.ctx);
        ball.checkOtherBallCollision(this.ballsInfo);
      });
      window.requestAnimationFrame(this.update);
    };
  
    createBall(n) {
      for (let i = 0; i < n; i++) {
        let randX = getRandomBetween(
          MAX_RADIUS,
          this.canvas.width - MAX_RADIUS
        );
        let randY = getRandomBetween(
          MAX_RADIUS,
          this.canvas.height - MAX_RADIUS
        );
  
        let randDx = getRandomBetween(-MAX_SPEED, MAX_SPEED);
        let randDy = getRandomBetween(-MAX_SPEED, MAX_SPEED);
        let color = COLORS[getRandomBetween(0, COLORS.length)];
  
        let radius = MAX_RADIUS;
  
        if (randDx == 0) {
          randDx = 1;
        }
        if (randDy == 0) {
          randDy = 1;
        }
  
        let ball = new Ball(randX,randY,color,radius,randDx,randDy,this.ant);
        this.ballsInfo.push(ball);
      }
    }
    addClickListener() {
      this.canvas.addEventListener(
        "mouseup",
        (e) => {
          let mousePos = {
            x: e.offsetX,
            y: e.offsetY,
          };
  
          this.ballsInfo.forEach((ball, index) => {
            let circle = {
              x: ball.x,
              y: ball.y,
              radius: ball.r,
            };
            if (isIntersect(mousePos, circle)) {
              this.ballsInfo.splice(index, 1);
            }
          });
        },
        false
      );
    }
  }
  
  
  
  window.addEventListener("load", () => {
    let b = new Box("box", WIDTH, HEIGHT);
  });
  