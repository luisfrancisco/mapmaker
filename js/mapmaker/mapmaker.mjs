import SeedGenerator from "./SeedGenerator.mjs";

const bg = new Image();
bg.src = "img/bg/mapbase.png";
const ruins = new Image();
ruins.src = "img/tiles/ruina.png";
const mountains = new Image();
mountains.src = "img/tiles/montanha.png";
let seed = new URLSearchParams(location.search).get("map");

window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 110.5; //cell size
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const random = getRandomBySeed();
  const ELEMENTS = {
    R: {
      total: 8,
      color: "hsl(34, 44%, 29%)",
      img: ruins,
      filter: () => {
        ctx.globalCompositeOperation = "color-burn";
      },
    },
    C: { total: 6, color: "hsl(34, 64%, 89%)", filter: ()=>{} },
    M: { total: 6, color: "hsl(34, 0%, 29%)", img: mountains, filter: ()=>{} },
  };

  canvas.width = LINE * SIZE;
  canvas.height = LINE * SIZE;

  const map = Array(LINE)
    .fill()
    .map(() => Array(LINE).fill(""));
  for (const k in ELEMENTS) {
    let total = ELEMENTS[k].total;
    while (total > 0) {
      const r = random.randInt(0, 10);
      const c = random.randInt(0, 10);
      if (map[r][c]) continue;
      map[r][c] = k;
      total--;
    }
  }
  canvas.width = bg.width;
  canvas.height = bg.height;

  requestAnimationFrame(drawBackGround);

  function drawBackGround() {
    ctx.scale(1, 1);
    ctx.fillStyle = "hsl(34, 44%, 69%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);
    ctx.save();
    ctx.translate(143, 433);
    for (let r = 0; r < LINE; r++) {
      for (let c = 0; c < LINE; c++) {
        if (map[r][c]) {
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = ELEMENTS[map[r][c]].color;
          //ctx.fillRect(c * SIZE + 5, r * SIZE + 5, SIZE - 10, SIZE - 10);
          if (ELEMENTS[map[r][c]].img) {
              ctx.save();
              ELEMENTS[map[r][c]].filter();
            ctx.drawImage(
              ELEMENTS[map[r][c]].img,
              c * SIZE + 0,
              r * SIZE + 0,
              SIZE - 0,
              SIZE - 0
            );
            ctx.restore();
          }
        }
        //ctx.globalAlpha = 0.1;
        // ctx.strokeStyle = "black";
        // ctx.strokeRect(c * SIZE + 1, r * SIZE + 1, SIZE - 1, SIZE - 1);
      }
    }
    ctx.restore();
    ctx.font = "bolder 24px Courier";
    ctx.textAlign = "right";
    ctx.fillStyle = "#48320f";
    ctx.fillText(seed, 1379, 401);
  }

  function getRandomBySeed() {
    let seedHash;
    if (seed) {
      seedHash = seed;
    } else {
      //seed aleatória
      let maxValue = 5000000;
      let minValue = 500000;
      seedHash = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
      location.search = `?map=${seedHash}`;
      seed = seedHash;
    }
    const seedGen = new SeedGenerator({
      seed_1: Number(seedHash),
      seed_2_string: seedHash,
    });
    return seedGen;
  }
};
