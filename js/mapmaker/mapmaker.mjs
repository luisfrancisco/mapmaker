import SeedGenerator from "./SeedGenerator.mjs";

window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 20; //cell size
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const random = getRandomBySeed();

  canvas.width = LINE * SIZE;
  canvas.height = LINE * SIZE;

  drawBackGround();

  function drawBackGround() {
    ctx.fillStyle = "tan";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < LINE; r++) {
      for (let c = 0; c < LINE; c++) {
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "brown";
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
