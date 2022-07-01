let canvasElem = document.querySelector("canvas");
let canvas = canvasElem.getContext("2d");
let scoreElm = document.querySelector("#score-elm");

canvasElem.width = window.innerWidth;
canvasElem.height = window.innerHeight;

class Eminem {
  constructor() {
    this.width = 70;
    this.height = 70;
    this.positionX = canvasElem.width / 2 - this.width / 2;
    this.positionY = canvasElem.height - this.height - 15;
    this.velocityX = 0;
    this.velocityY = 0;
    this.opacity = 1;

    const image = new Image();
    image.src = "./Images/eminem.jpg";
    this.image = image;
  }

  drawShady() {
    canvas.save();
    canvas.globalAlpha = this.opacity;
    canvas.drawImage(
      this.image,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
    canvas.restore();
  }
  updateShady() {
    this.drawShady();
    this.positionX += this.velocityX;
  }
}

class Projectile {
  constructor(positionX, positionY, velocityX, velocityY, color, radius) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.radius = radius;
  }
  draw() {
    canvas.beginPath();
    canvas.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    canvas.fillStyle = this.color;
    canvas.fill();
    canvas.closePath();
  }
  update() {
    this.draw();
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;
  }
}

const imgArray = [
  "./Images/drake.jpg",
  "./Images/jack.jpg",
  "./Images/mgk.jpg",
];

class Rapper {
  constructor(positionX, positionY) {
    this.width = 50;
    this.height = 50;
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = 0;
    this.velocityY = 0;

    const image = new Image();
    image.src = imgArray[Math.floor(Math.random() * 3)];
    this.image = image;
  }

  draw() {
    canvas.drawImage(
      this.image,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
  }
  update(velocityX, velocityY) {
    this.draw();
    this.positionX += velocityX;
    this.positionY += velocityY;
  }
}

class Grid {
  constructor() {
    this.positionX = 0;
    this.positionY = 0;
    this.velocityX = 7;
    this.velocityY = 0;
    this.rappers = [];
    let row = Math.floor(Math.random() * 2) + 2;
    let column = Math.floor(Math.random() * 7) + 2;
    this.width = 60 * column;
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row; j++) {
        this.rappers.push(new Rapper(i * 60, j * 60));
      }
    }
  }
  update() {
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;
    this.velocityY = 0;
    if (this.positionX + this.width > canvasElem.width || this.positionX < 0) {
      this.velocityX = -this.velocityX;
      this.velocityY = 15;
    }
  }
}

const eminem = new Eminem();
const grids = [];

const projectiles = [];
const rapperProjectiles = [];
const particles = [];
const keyPressed = {
  left: false,
  right: false,
  space: false,
};
let frames = 0;
let game = {
  over: false,
  active: true,
};
let score = 0;

function createBlood(obj) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Projectile(
        obj.positionX + obj.width / 2,
        obj.positionY + obj.height / 2,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        "red",
        Math.random() * 4
      )
    );
  }
}

function animate() {
  if (!game.active) return;
  requestAnimationFrame(animate);
  let background = new Image();
  background.src = "./Images/background.jpg";
  canvas.drawImage(background, 0, 0, canvasElem.width, canvasElem.height);
  eminem.updateShady();
  projectiles.forEach((elem, i) => {
    if (elem.positionY + elem.radius < 0) {
      projectiles.splice(i, 1);
    } else {
      elem.update();
    }
  });
  rapperProjectiles.forEach((elem, i) => {
    if (elem.positionY + elem.radius > canvasElem.height) {
      rapperProjectiles.splice(i, 1);
    } else {
      elem.update();
    }
    if (
      elem.positionY + elem.radius >= eminem.positionY &&
      elem.positionX + elem.radius >= eminem.positionX &&
      elem.positionX - elem.radius <= eminem.positionX + eminem.width &&
      elem.positionY - elem.radius <= eminem.positionY + eminem.height
    ) {
      createBlood(eminem);
      rapperProjectiles.splice(i, 1);
      game.over = true;
      eminem.opacity = 0;
      console.log("Game Over");
      setTimeout(() => {
        game.active = false;
        canvas.font = "70px sans-serif";
        canvas.fillStyle = "red";
        canvas.fillText("Game Over!!", 450, 300);
        canvas.font = "50px Segoe-UI";
        canvas.fillStyle = "violet";
        canvas.fillText("Press spacebar to restart", 450, 350);
      }, 2000);
    }
  });
  particles.forEach((elem, i) => {
    elem.update();
    elem.radius -= 0.01;
    if (elem.radius <= 0) {
      particles.splice(i, 1);
    }
  });
  grids.forEach((grid, g) => {
    grid.update();
    if (frames % 80 === 0) {
      for (let i = 0; i < 3; i++) {
        let rapper1 =
          grid.rappers[Math.floor(Math.random() * grid.rappers.length)];
        rapperProjectiles.push(
          new Projectile(
            rapper1.positionX + rapper1.width / 2,
            rapper1.positionY + rapper1.height / 2,
            Math.floor((Math.random() - 0.5) * 3),
            8,
            "yellow",
            7
          )
        );
      }
    }
    grid.rappers.forEach((rapper, r) => {
      rapper.update(grid.velocityX, grid.velocityY);
      projectiles.forEach((proj, p) => {
        if (
          proj.positionY - proj.radius <= rapper.positionY + rapper.height &&
          proj.positionX + proj.radius >= rapper.positionX &&
          proj.positionX - proj.radius <= rapper.positionX + rapper.width &&
          proj.positionY + proj.radius >= rapper.positionY
        ) {
          score += 50;
          scoreElm.innerHTML = score;
          createBlood(rapper);
          grid.rappers.splice(r, 1);
          projectiles.splice(p, 1);
          if (grid.rappers.length > 0) {
            let firstRapper = grid.rappers[0];
            let lastRapper = grid.rappers[grid.rappers.length - 1];
            grid.width = lastRapper.positionX - firstRapper.positionX + 60;
            grid.positionX = firstRapper.positionX;
          } else {
            grids.splice(g, 1);
          }
        }
      });
    });
  });
  if (keyPressed.left && eminem.positionX > 0) {
    eminem.velocityX = -12;
  } else if (
    keyPressed.right &&
    eminem.positionX + eminem.width < canvasElem.width
  ) {
    eminem.velocityX = 12;
  } else {
    eminem.velocityX = 0;
  }
  if (frames % 1000 === 0) {
    grids.push(new Grid());
  }
  frames++;
}
animate();

addEventListener("keydown", (event) => {
  let key = event.key;

  if (game.over) {
    if (key === " ") {
      window.location.reload();
    }
    return;
  }

  switch (key) {
    case "ArrowLeft":
      keyPressed.left = true;
      break;
    case "ArrowRight":
      keyPressed.right = true;
      break;
    case " ":
      let proj = new Projectile(
        eminem.positionX + eminem.width / 2,
        eminem.positionY,
        0,
        -8,
        "blue",
        7
      );
      projectiles.push(proj);
  }
});

addEventListener("keyup", (event) => {
  let key = event.key;
  switch (key) {
    case "ArrowLeft":
      keyPressed.left = false;
      break;
    case "ArrowRight":
      keyPressed.right = false;
      break;
    case " ":
  }
});
