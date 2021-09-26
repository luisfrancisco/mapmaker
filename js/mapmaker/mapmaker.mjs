import seedGenerator from "./SeedGenerator.mjs";
let MOUNTAINS;
let RUINS;
const bg = new Image();
bg.src = "img/bg/mapbase.png";
const ruins = new Image();
ruins.src = "img/tiles/ruin.png";
const mountains = new Image();
mountains.src = "img/tiles/mountain.png";
const params = new URLSearchParams(location.search);
let SEED = params.get("map");
let CLIFFS = Math.min(Math.max(params.get("cliffs") ?? 0, 0), 20);
let HEROES = Math.min(Math.max(params.get("heroes") ?? 0, 0), 1);
let BIG = Math.min(Math.max(params.get("big") ?? 0, 0), 1);

let random = getRandomBySeed();
MOUNTAINS =
  Math.min(Math.max(params.get("mountains") ?? 0, 5), 10);

RUINS = Math.min(Math.max(params.get("ruins") ?? 0, 6), 10);

const shield = new Image();
shield.src = "img/bg/shield.png";
const cliffTiles = new Image();
cliffTiles.src = "img/tiles/cliff-tiles.png";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const LINE = 11; //number of cells per column/row
const SIZE = 110.5; //cell size

window.onload = () => {
  document.querySelector("#pdf").addEventListener("click", savePDF);
  const newMap = document.querySelector(".newmap");
  const shareMap = document.querySelector(".share");
  const generate = document.querySelector("#generate");
  const mapSeed = document.querySelector("#map-seed");
  const mapMountains = document.querySelector("#map-mountains");
  const mapRuins = document.querySelector("#map-ruins");
  const mapCliffs = document.querySelector("#map-cliffs");
  const mapBig = document.querySelector("#map-big");
  const mapHeroes = document.querySelector("#map-heroes");

  function updateURL() {

    if (SEED) {
      const nextSeed = Math.floor(Math.random() * (9999999999));
      newMap.href = `./?map=${nextSeed}`;
      shareMap.href = `./?map=${SEED}`;
    }
    mapSeed.value = SEED.substring(0, 9);
    if (MOUNTAINS && MOUNTAINS != 5) {
      newMap.href += `&mountains=${MOUNTAINS}`;
      shareMap.href += `&mountains=${MOUNTAINS}`;
    }
    mapMountains.value = MOUNTAINS ?? 5;
    if (RUINS && RUINS != 6) {
      newMap.href += `&ruins=${RUINS}`;
      shareMap.href += `&ruins=${RUINS}`;
    }
    mapRuins.value = RUINS ?? 6;

    if (CLIFFS) {
      newMap.href += `&cliffs=${CLIFFS}`;
      shareMap.href += `&cliffs=${CLIFFS}`;
      mapCliffs.value = CLIFFS || 0;
    }
    if (BIG) {
      newMap.href += `&big=${BIG}`;
      shareMap.href += `&big=${BIG}`;
    }
    mapBig.checked = BIG > 0;
    if (HEROES) {
      newMap.href += `&heroes=${HEROES}`;
      shareMap.href += `&heroes=${HEROES}`;
    }
    mapHeroes.checked = HEROES > 0;

    shareMap.textContent = shareMap.href;
  }

  generate.addEventListener('click', (e) => {
    SEED = mapSeed.value;
    MOUNTAINS = mapMountains.value;
    RUINS = mapRuins.value;
    CLIFFS = mapCliffs.value;
    BIG = mapBig.checked ? 1 : 0;
    HEROES = mapHeroes.checked ? 1 : 0;
    random = getRandomBySeed();
    updateURL();
    drawMap();
  });
  updateURL();
  drawMap();
};

function drawMap() {
  const ELEMENTS = {
    R: {
      total: RUINS,
      color: "hsl(34, 44%, 29%)",
      img: ruins,
      filter: () => {
        ctx.globalCompositeOperation = "color-burn";
      },
    },
    M: {
      total: MOUNTAINS,
      color: "hsl(34, 0%, 29%)",
      img: mountains,
      filter: () => { },
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
        t -= randomWalk(t, map);
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
  requestAnimationFrame(() => drawBackGround(map, ELEMENTS));
}

function drawBackGround(map, ELEMENTS) {
  ctx.fillStyle = "hsl(34, 44%, 69%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, bg.width, bg.height);
  ctx.save();
  ctx.translate(142, 433);
  for (let r = 0; r < LINE; r++) {
    for (let c = 0; c < LINE; c++) {
      if (map[r][c] && map[r][c] !== "X") {
        if (ELEMENTS[map[r][c]].draw) {
          ELEMENTS[map[r][c]].draw(ctx, r, c, SIZE, map);
          continue;
        }
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = ELEMENTS[map[r][c]].color;
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
    }
  }
  ctx.restore();
  ctx.font = "bolder 24px Courier";
  ctx.textAlign = "right";
  ctx.fillStyle = "#48320f";
  ctx.fillText("(" + SEED + ")", 1386, 398);
  ctx.drawImage(shield, 637, 200);
}


function savePDF() {
  var imgData = canvas.toDataURL("image/png");
  var doc = new jsPDF("p", "mm", [359, 519]);
  doc.addImage(imgData, "PNG", 0, 0, 126.7, 183);
  doc.save(`map-${SEED}.pdf`);
}
function randomWalk(t, map) {
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

const tileSet = [
  47, , 1, , , , , , 2, , 3, 4, , , , , 5, , 6, , , , 7, , 8, , 9, 10, , , 11, 12, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 13, , 14, , , , , , 15, , 16, 17, , , , , 18, , 19, , , , 20, , 21, , 22, 23, , , 24, 25, , , , , , , , , 26, , 27, 28, , , , , , , , , , , , , 29, , 30, 31, , , 32, 33, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 34, , 35, , , , 36, , 37, , 38, 39, , , 40, 41, , , , , , , , , , , , , , , , , , , , , , , , , 42, , 43, 44, , , 45, 46
];

function drawCliff(ctx, r, c, SIZE, map) {
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

  const tc = (tileSet[tile] ?? tile) % 8;
  const tr = Math.floor((tileSet[tile] ?? tile) / 8);

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
    if (!SEED) {
      search = `?map=${seedHash}`;
      if (MOUNTAINS && MOUNTAINS != 5) {
        search += `&mountains=${MOUNTAINS}`;
      }
      if (RUINS && RUINS != 6) {
        search += `&ruins=${RUINS}`;
      }
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
  const seedGen = new seedGenerator({
    seed_1: parseInt(seedHash, 36),
    seed_2_string: seedHash,
  });

  return seedGen;
}
