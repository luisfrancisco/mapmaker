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
      ctx.strokeRect(c*SIZE+1, r*SIZE+1,SIZE-1, SIZE-1);
    }        
  }

};
