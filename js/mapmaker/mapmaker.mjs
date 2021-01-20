import SeedGenerator from "./SeedGenerator.mjs";

window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 20; //cell size
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const random = getRandomBySeed();

  canvas.width = LINE * SIZE;
  canvas.height = LINE * SIZE;

  const map = Array(11).fill(Array(11).fill(""));
  console.log(map);

  drawBackGround();

  function drawBackGround() {
    ctx.fillStyle = "hsl(34, 44%, 69%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < LINE; r++) {
      for (let c = 0; c < LINE; c++) {
        ctx.globalAlpha = 1.0;
        switch (map[r][c]) {
          case "C":
            ctx.fillStyle = "hsl(34, 44%, 29%)";
            break;
          case "R":
            ctx.fillStyle = "hsl(34, 64%, 89%)";
            break;
          case "M":
            ctx.fillStyle = "hsl(34, 0%, 29%)";
            break;
        }
        ctx.fillRect(c * SIZE+5, r * SIZE+5, SIZE-10, SIZE-10);
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

  console.log(random.randInt(0, 10));
  console.log(random.randInt(0, 10));
};
