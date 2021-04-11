import SeedGenerator from "./SeedGenerator.mjs";

const bg = new Image();
bg.src = "img/bg/mapbase.png";
const ruins = new Image();
ruins.src = "img/tiles/ruina.png";
const mountains = new Image();
mountains.src = "img/tiles/montanha.png";
const params = new URLSearchParams(location.search);
const SEED = params.get("map");
const CLIFFS = Math.min(Math.max(params.get("cliffs") ?? 0, 0), 20);
const HEROES = Math.min(Math.max(params.get("heroes") ?? 0, 0), 1);
const BIG = Math.min(Math.max(params.get("big") ?? 0, 0), 1);

const shield = new Image();
shield.src = "img/bg/shield.png";
const cliffTiles = new Image();
cliffTiles.src = "img/tiles/cliff-tiles.png";

window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 110.5; //cell size
  const canvas = document.querySelector("canvas");
  document.querySelector("#pdf").addEventListener("click", savePDF);
  const newMap = document.querySelector(".newmap");
  const shareMap = document.querySelector(".share");

  if (SEED) {
    const nextSeed = Math.floor(Math.random() * (9999999999));
    newMap.href = `./?map=${nextSeed}`;
    shareMap.href = `./?map=${SEED}`;
  }
  if (CLIFFS) {
    newMap.href += `&cliffs=${CLIFFS}`;
    shareMap.href += `&cliffs=${CLIFFS}`;
  }
  if (BIG) {
    newMap.href += `&big=${BIG}`;
    shareMap.href += `&big=${BIG}`;
  }
  if (HEROES) {
    newMap.href += `&heroes=${HEROES}`;
    shareMap.href += `&heroes=${HEROES}`;
  }
  shareMap.textContent = shareMap.href;
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
      total: CLIFFS,
      color: "hsl(34, 64%, 89%)",
      img: null,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
      draw: drawCliff,
    },
    B: {
      total: BIG,
      color: "hsl(34, 64%, 89%)",
      img: null,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
      draw: drawCliff,
    },
    L: {
      total: HEROES,
      color: "hsl(34, 64%, 89%)",
      img: null,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
      draw: drawCliff,
    },
    NS: {
      total: HEROES,
      color: "hsl(34, 64%, 89%)",
      img: null,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
      draw: drawCliff,
    },
    WE: {
      total: HEROES,
      color: "hsl(34, 64%, 89%)",
      img: null,
      filter: () => {
        ctx.globalCompositeOperation = "multiply";
      },
      draw: drawCliff,
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
    if (k == "C") {
      let t = ELEMENTS[k].total;
      while (t > 0) {
        t -= randomWalk(t);
      }
      continue;
    }
    let km = 0;
    while (total > 0 && km < 121) {
      km++;
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
        map[r][c] = "C";
        map[r][c + 1] = "C";
        map[r + 1][c] = "C";
      }
      if (r === 10 || k === "NS") {
        if (map[r + 1][c]) {
          continue;
        }
        map[r + 1][c] = "C";
        map[r][c] = "C";
      }
      if (c === 10 || k === "WE") {
        if (map[r][c + 1]) {
          continue;
        }
        map[r][c + 1] = "C";
        map[r][c] = "C";
      }
      if (k === "B") {
        if (
          r > 5 ||
          c === 10 ||
          c === 0 ||
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
        map[r][c] = "C";
        map[r + 1][c] = "C";
        map[r + 2][c] = "C";
        map[r + 3][c] = "C";
        map[r + 1][c - 1] = "C";
        map[r + 2][c - 1] = "C";
        map[r + 2][c + 1] = "C";
      }

      map[r][c] = map[r][c] != "C" ? k : map[r][c];
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
          if (ELEMENTS[map[r][c]].draw) {
            ELEMENTS[map[r][c]].draw(ctx, r, c, SIZE);
            continue;
          }
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = ELEMENTS[map[r][c]].color;
          //ctx.fillRect(c * SIZE + 5, r * SIZE + 5, SIZE - 10, SIZE - 10);
          if (ELEMENTS[map[r][c]].img) {
            ctx.save();
            ELEMENTS[map[r][c]].filter();
            ctx.drawImage(
              ELEMENTS[map[r][c]].img,
              (c + (ELEMENTS[map[r][c]].dc ?? 0)) * SIZE - 3,
              r * SIZE - 3,
              ELEMENTS[map[r][c]].width ?? SIZE + 6,
              ELEMENTS[map[r][c]].height ?? SIZE + 6
            );
            ctx.restore();
          }
        }
        // ctx.fillStyle = "orange";
        // ctx.font = "30px Arial";
        // ctx.fillText(`c${c}r${r}:${map[r][c]}`, c * SIZE + 30, r * SIZE + 30);
        //ctx.globalAlpha = 0.1;
        // ctx.strokeStyle = "black";
        // ctx.strokeRect(c * SIZE + 1, r * SIZE + 1, SIZE - 1, SIZE - 1);
      }
    }
    ctx.restore();
    ctx.font = "bolder 24px Courier";
    ctx.textAlign = "right";
    ctx.fillStyle = "#48320f";
    ctx.fillText("(" + SEED + ")", 1386, 398);
    ctx.drawImage(shield, 637, 200);
  }

  function getRandomBySeed() {
    let seedHash;
    if (SEED) {
      seedHash = SEED.substr(0, 9);
      document.querySelectorAll("img").forEach((i) => (i.style.opacity = 1.0));
      document.querySelector("canvas").style.opacity = 1.0;
      document.querySelector(".actions").style.opacity = 1.0;
      document.querySelector(".loader").style.opacity = 0.0;
    } else {
      let maxValue = 9999999999;
      let minValue = 0;
      seedHash = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
      let search = location.search;
      if(!SEED){ 
        search = `?map=${seedHash}`;
        if (CLIFFS) {
          search += `&cliffs=${CLIFFS}`;
        }
        if (BIG) {
          search += `&big=${BIG}`;
        }
        if (HEROES) {
          search += `&heroes=${HEROES}`;
        }
        location.search = search;
      }
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
    doc.save(`map-${SEED}.pdf`);
  }
  function randomWalk(t) {
    let r = random.randInt(0, 10);
    let c = random.randInt(0, 10);
    let nr = r;
    let nc = c;
    let d = random.randInt(0, 3);
    let v = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    let vr = v[d][0];
    let vc = v[d][1];
    let placed = 0;
    let s = 0;
    let pd = d;
    do {
      d = random.randInt(0, 3);
      vr = v[d][0];
      vc = v[d][1];
      nr = Math.max(Math.min(r + vr, 10), 0);
      nc = Math.max(Math.min(c + vc, 10), 0);
      s++;
      if (pd == d || map[nr][nc] != "") {
        continue;
      }
      r = nr;
      c = nc;
      map[r][c] = "C";
      placed++;
      pd = d;
    } while (placed < t && s < 100);
    return placed;
  }

  const tileset = [];
  tileset[2] = 1;
  tileset[8] = 2;
  tileset[10] = 3;
  tileset[11] = 4;
  tileset[16] = 5;
  tileset[18] = 6;
  tileset[22] = 7;
  tileset[24] = 8;
  tileset[26] = 9;
  tileset[27] = 10;
  tileset[30] = 11;
  tileset[31] = 12;
  tileset[64] = 13;
  tileset[66] = 14;
  tileset[72] = 15;
  tileset[74] = 16;
  tileset[75] = 17;
  tileset[80] = 18;
  tileset[82] = 19;
  tileset[86] = 20;
  tileset[88] = 21;
  tileset[90] = 22;
  tileset[91] = 23;
  tileset[94] = 24;
  tileset[95] = 25;
  tileset[104] = 26;
  tileset[106] = 27;
  tileset[107] = 28;
  tileset[120] = 29;
  tileset[122] = 30;
  tileset[123] = 31;
  tileset[126] = 32;
  tileset[127] = 33;
  tileset[208] = 34;
  tileset[210] = 35;
  tileset[214] = 36;
  tileset[216] = 37;
  tileset[218] = 38;
  tileset[219] = 39;
  tileset[222] = 40;
  tileset[223] = 41;
  tileset[248] = 42;
  tileset[250] = 43;
  tileset[251] = 44;
  tileset[254] = 45;
  tileset[255] = 46;
  tileset[0] = 47;

  function drawCliff(ctx, r, c, SIZE) {
    ctx.globalAlpha = 1.0;
    ctx.save();
    ctx.globalCompositeOperation = "multiply";

    const NW =
      r > 0 &&
      c > 0 &&
      map[r - 1][c - 1] == "C" &&
      map[r - 1][c] == "C" &&
      map[r][c - 1] == "C"
        ? 1
        : 0;
    const N = r > 0 && map[r - 1][c] == "C" ? 2 : 0;
    const NE =
      r > 0 &&
      c < 10 &&
      map[r - 1][c + 1] == "C" &&
      map[r - 1][c] == "C" &&
      map[r][c + 1] == "C"
        ? 4
        : 0;
    const E = c < 10 && map[r][c + 1] == "C" ? 16 : 0;
    const W = c > 0 && map[r][c - 1] == "C" ? 8 : 0;
    const SW =
      r < 10 &&
      c > 0 &&
      map[r + 1][c - 1] == "C" &&
      map[r + 1][c] == "C" &&
      map[r][c - 1] == "C"
        ? 32
        : 0;
    const S = r < 10 && map[r + 1][c] == "C" ? 64 : 0;
    const SE =
      r < 10 &&
      c < 10 &&
      map[r + 1][c + 1] == "C" &&
      map[r + 1][c] == "C" &&
      map[r][c + 1] == "C"
        ? 128
        : 0;
    const tile = N + NW + W + SW + S + SE + E + NE;

    const tc = (tileset[tile] ?? tile) % 8;
    const tr = Math.floor((tileset[tile] ?? tile) / 8);

    ctx.drawImage(
      cliffTiles,
      tc * 112,
      tr * 112,
      1 * 112,
      1 * 112,
      c * SIZE,
      r * SIZE,
      SIZE,
      SIZE
    );
    ctx.restore();
  }
};
