import SeedGenerator from "./SeedGenerator.mjs";

window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 20; //cell size
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const random = getRandomBySeed();
  const ELEMENTS = {
    R: { total: 8, color: "hsl(34, 44%, 29%)" },
    C: { total: 6, color: "hsl(34, 64%, 89%)" },
    M: { total: 6, color: "hsl(34, 0%, 29%)" },
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

  drawBackGround();

  function drawBackGround() {
    ctx.fillStyle = "hsl(34, 44%, 69%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < LINE; r++) {
      for (let c = 0; c < LINE; c++) {
        console.log(r, c);
        if (map[r][c]) {
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = ELEMENTS[map[r][c]].color;
          ctx.fillRect(c * SIZE + 5, r * SIZE + 5, SIZE - 10, SIZE - 10);
        }
        ctx.globalAlpha = 0.1;
        ctx.strokeRect(c * SIZE + 1, r * SIZE + 1, SIZE - 1, SIZE - 1);
      }
    }
  }

  function getRandomBySeed() {
    let seedHash = location.hash;
    if (seedHash.length > 0) {
      seedHash = seedHash.substring(1, seedHash.length);
    } else {
      //seed aleatória
      let maxValue = 5000000;
      let minValue = 500000;
      seedHash = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
      location.hash = seedHash;
    }
    const seedGen = new SeedGenerator({
      seed_1: Number(seedHash),
      seed_2_string: seedHash,
    });
    return seedGen;
  }
};
