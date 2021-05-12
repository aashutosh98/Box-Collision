function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  function distanceBetween(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }  
  
  const MAX_RADIUS = 20;
  const TOTAL_BALLS = 100;
  
  const MAX_SPEED =  4;
  const WIDTH = 1000;
  const HEIGHT = 500;
  const COLORS = ["red","blue","green","yellow","white","black","silver","purple"];
  
  class Ball {
    constructor(x,y ,color,r , dx ,dy) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
    }   
    update(ctx) {
      this.draw(ctx);
      this.move();
      this.checkCollision(ctx);
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
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
  
    checkBallCollision(balls) {
      balls.forEach((ball) => {
        if (ball == this) {
          return;
        }
  
        let ballAX = this.x;
        let ballAY = this.y;
        let ballARad = this.r;
        let ballADx = this.dx;
        let ballADy = this.dy;
  
        let ballBX = ball.x;
        let ballBY = ball.y;
        let ballBRad = ball.r;
        let ballBDx = ball.dx;
        let ballBDy = ball.dy;
  
        let distance = distanceBetween(
          { x: ballAX, y: ballAY },
          { x: ballBX, y: ballBY }
        );
  
        if (distance < ballARad + ballBRad) {
          if (ballAX < ballBX) {
            this.x = ballAX - 1;
          } else {
            this.x = ballAX + 1;
          }
  
          if (ballAY < ballBY) {
            this.y = ballAY - 1;
          } else {
            this.y = ballAY + 1;
          }
  
          this.dx = ballBDx;
          this.dy = ballBDy;
          ball.dx = ballADx;
          ball.dy = ballADy;
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
    }
  
    init = function()  {
      this.createBall(TOTAL_BALLS);
      window.requestAnimationFrame(this.update);
    };
  
    update = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
      this.ballsInfo.forEach( (ball) =>{
        ball.update(this.ctx);
        ball.checkBallCollision(this.ballsInfo);
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
  
        let radius = getRandomBetween(7, MAX_RADIUS);
       
        let ball = new Ball(randX, randY, color, radius, randDx, randDy);
        this.ballsInfo.push(ball);
      }
    }
  }
  
  
  window.addEventListener("load", () => {
    let b = new Box("box", WIDTH, HEIGHT);
  });
  