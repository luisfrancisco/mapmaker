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
const cliffNS = new Image();
cliffNS.src = "img/tiles/cliff-ns.png";
const cliffWE = new Image();
cliffWE.src = "img/tiles/cliff-we.png";
const cliffL = new Image();
cliffL.src = "img/tiles/cliff-l.png";
const cliffBig = new Image();
cliffBig.src = "img/tiles/cliff-big.png";

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
    NS: {
      total: params.get("heroes") ? 1 : 0,
      color: "hsl(34, 64%, 89%)",
      img: cliffNS,
      height: 2 * SIZE + 12,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
    },
    WE: {
      total: params.get("heroes") ? 1 : 0,
      color: "hsl(34, 64%, 89%)",
      img: cliffWE,
      width: 2 * SIZE + 12,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
    },
    L: {
      total: params.get("heroes") ? 1 : 0,
      color: "hsl(34, 64%, 89%)",
      img: cliffL,
      width: 2 * SIZE + 12,
      height: 2 * SIZE + 12,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
    },
    B: {
      total: params.get("big") ? 1 : 0,
      color: "hsl(34, 64%, 89%)",
      img: cliffBig,
      width: 3 * SIZE ,
      height: 4 * SIZE,
      dc: -1,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
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
      if (k === "L") {
        if (r === 10 || c === 10 || map[r][c + 1] || map[r + 1][c]) {
          continue;
        }
        map[r][c + 1] = "X";
        map[r + 1][c] = "X";
      }
      if (r === 10 || k === "NS") {
        if (map[r + 1][c]) {
          continue;
        }
        map[r + 1][c] = "X";
      }
      if (c === 10 || k === "WE") {
        if (map[r][c + 1]) {
          continue;
        }
        map[r][c + 1] = "X";
      }
      if (k === "B") {
        if (
          r > 5 ||
          c === 10 || c===0||
          map[r][c + 1] ||
          map[r][c + 2] ||
          map[r][c + 3] ||
          map[r][c + 4] ||
          map[r + 1][c - 1] ||
          map[r + 2][c - 1] ||
          map[r + 2][c + 1]
        ) {
          continue;
        }
        map[r + 1][c] = "X";
        map[r + 2][c] = "X";
        map[r + 3][c] = "X";
        map[r + 1][c - 1] = "X";
        map[r + 2][c - 1] = "X";
        map[r + 2][c + 1] = "X";
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
        if (map[r][c] && map[r][c] !== "X") {
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = ELEMENTS[map[r][c]].color;
          //ctx.fillRect(c * SIZE + 5, r * SIZE + 5, SIZE - 10, SIZE - 10);
          if (ELEMENTS[map[r][c]].img) {
            ctx.save();
            ELEMENTS[map[r][c]].filter();
            ctx.drawImage(
              ELEMENTS[map[r][c]].img,
              (c+(ELEMENTS[map[r][c]].dc ?? 0)) * SIZE - 3,
              r * SIZE - 3,
              ELEMENTS[map[r][c]].width ?? SIZE + 6,
              ELEMENTS[map[r][c]].height ?? SIZE + 6
            );
            ctx.restore();
          }
        }
        // ctx.fillStyle = "black";
        // ctx.font="30px Arial";
        // ctx.fillText(`c${c}r${r}:${map[r][c]}`,  c * SIZE+30,r * SIZE+30);
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

    return seedGen;
  }
  function savePDF() {
    var imgData = canvas.toDataURL("image/png");
    var doc = new jsPDF("p", "mm", [359, 519]);
    doc.addImage(imgData, "PNG", 0, 0, 126.7, 183);
    doc.save(`map-${seed}.pdf`);
  }
};
