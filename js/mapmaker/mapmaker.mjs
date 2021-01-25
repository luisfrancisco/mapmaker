import SeedGenerator from "./SeedGenerator.mjs";

const bg = new Image();
bg.src = "img/bg/mapbase.png";
const ruins = new Image();
ruins.src = "img/tiles/ruina.png";
const mountains = new Image();
mountains.src = "img/tiles/montanha.png";
const cliffs = new Image();
cliffs.src = "img/tiles/cliff.png";
const params = new URLSearchParams(location.search);
let seed = params.get("map");
const shield = new Image();
shield.src = "img/bg/shield.png";

window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 110.5; //cell size
  const canvas = document.querySelector("canvas");
  document.querySelector("#pdf").addEventListener("click", savePDF);

  const ctx = canvas.getContext("2d");
  const random = getRandomBySeed();
  const ELEMENTS = {
    R: {
      total: Math.min(
        Math.max(params.get("ruins") ?? random.randInt(6, 8), 0),
        10
      ),
      color: "hsl(34, 44%, 29%)",
      img: ruins,
      filter: () => {
        ctx.globalCompositeOperation = "color-burn";
      },
    },
    M: {
      total: Math.min(
        Math.max(params.get("mountains") ?? random.randInt(5, 7), 0),
        10
      ),
      color: "hsl(34, 0%, 29%)",
      img: mountains,
      filter: () => {},
    },
    C: {
      total: Math.min(Math.max(params.get("cliffs") ?? 0, 0), 10),
      color: "hsl(34, 64%, 89%)",
      img: cliffs,
      filter: () => {},
    },
  };

  canvas.width = LINE * SIZE;
  canvas.height = LINE * SIZE;

  const map = Array(LINE)
    .fill()
    .map(() => Array(LINE).fill(""));
  for (const k in ELEMENTS) {
    let ur = new Set();
    let uc = new Set();

    let total = ELEMENTS[k].total;
    while (total > 0) {
      const r = random.randInt(0, 10);
      const c = random.randInt(0, 10);
      if (map[r][c]) continue;
      if (k === "M") {
        if (ur.has(r) || uc.has(c)) {
          continue;
        } else {
          ur.add(r);
          uc.add(c);
        }
      }
      map[r][c] = k;
      total--;
    }
  }

  canvas.width = bg.width;
  canvas.height = bg.height;

  requestAnimationFrame(drawBackGround);

  function drawBackGround() {
    ctx.fillStyle = "hsl(34, 44%, 69%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);
    ctx.save();
    ctx.translate(142, 433);
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
              c * SIZE - 3,
              r * SIZE - 3,
              SIZE + 6,
              SIZE + 6
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
    ctx.fillText("(" + seed + ")", 1386, 398);
    ctx.drawImage(shield, 637, 200);
  }

  function getRandomBySeed() {
    let seedHash;
    if (seed) {
      seedHash = seed;
      document.querySelectorAll("img").forEach((i) => (i.style.opacity = 1.0));
      document.querySelector("canvas").style.opacity = 1.0;
      document.querySelector(".actions").style.opacity = 1.0;
      document.querySelector(".loader").style.opacity = 0.0;
    } else {
      //seed aleatória
      let maxValue = 999999;
      let minValue = 99;
      seedHash = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
      location.search = `?map=${seedHash}`;
      seed = seedHash;
    }
    const seedGen = new SeedGenerator({
      seed_1: parseInt(seedHash, 36),
      seed_2_string: seedHash,
    });
    console.log(seedGen);

    return seedGen;
  }
  function savePDF() {
    var imgData = canvas.toDataURL("image/png");
    var doc = new jsPDF("p", "mm", [359, 519]);
    doc.addImage(imgData, "PNG", 0, 0, 126.7, 183);
    doc.save(`map-${seed}.pdf`);
  }
};
