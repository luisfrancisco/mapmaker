window.onload = () => {
  const LINE = 11; //number of cells per column/row
  const SIZE = 20; //cell size
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = LINE * SIZE;
  canvas.height = LINE * SIZE;

  ctx.fillStyle = "tan";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < LINE; r++) {
    for (let c = 0; c < LINE; c++) {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "brown";
      ctx.strokeRect(c * SIZE + 1, r * SIZE + 1, SIZE - 1, SIZE - 1);
    }
  }
};

var seedValueURL = location.search;

if (seedValueURL.length != 0) {
  //seed na url
  let aux = "?map=";
  seedValueURL = seedValueURL.substring(aux.length, seedValueURL.length);
  seedValueURL = parseInt(seedValueURL);
} else {
  //seed aleatória
  let maxValue = 5000000;
  let minValue = 500000;
  seedValueURL = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}
var seedGen = new SeedGenerator({
  seed_1: seedValueURL,
  seed_2_string: "baroni",
});
