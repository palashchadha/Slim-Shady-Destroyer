let canvasElem = document.querySelector("canvas");
let canvas = canvasElem.getContext("2d");

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

    const image = new Image();
    image.src = "./Images/eminem.jpg";
    this.image = image;
  }

  drawShady() {
    canvas.drawImage(
      this.image,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
  }
  updateShady() {
    this.drawShady();
    this.positionX += this.velocityX;
  }
}

class Projectile {
  constructor(positionX, positionY, velocityX, velocityY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.radius = 5;
  }
  draw() {
    canvas.beginPath();
    canvas.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    canvas.fillStyle = "blue";
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
    this.width = 70;
    this.height = 70;
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
    this.velocityX = 5;
    this.velocityY = 0;
    this.rappers = [];
    let row = Math.floor(Math.random() * 3) + 2;
    let column = Math.floor(Math.random() * 6) + 2;
    this.width = 80 * column;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        this.rappers.push(new Rapper(j * 80, i * 80));
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

const keyPressed = {
  left: false,
  right: false,
  space: false,
};
let frames = 0;

function animate() {
  requestAnimationFrame(animate);
  canvas.fillStyle = "#151414";
  canvas.fillRect(0, 0, canvasElem.width, canvasElem.height);
  eminem.updateShady();
  projectiles.forEach((elem, i) => {
    if (elem.positionY + elem.radius < 0) {
      projectiles.splice(i, 1);
    } else {
      elem.update();
    }
  });
  grids.forEach((grid) => {
    grid.update();
    grid.rappers.forEach((rapper) => {
      rapper.update(grid.velocityX, grid.velocityY);
    });
  });
  if (keyPressed.left && eminem.positionX > 0) {
    eminem.velocityX = -8;
  } else if (
    keyPressed.right &&
    eminem.positionX + eminem.width < canvasElem.width
  ) {
    eminem.velocityX = 8;
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
        -5
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
