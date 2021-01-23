export default class SeedGenerator {
  constructor(params = {}) {
    this.seed_1 = params.seed_1 ?? 1;
    this.seed_2 = params.seed_2 ?? 0;
    this.seed_2_string = params.seed_2_string ?? "bananas";
    // Create xmur3 state:
    this.seed_2 = this.xmur3(this.seed_2_string);
  }

  getRandomMethod_1() {
    let x = Math.sin(this.seed_1++) * 10000;
    return x - Math.floor(x);
  }

  getRandomIntMethod_1(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomMethod_1() * (max - min)) + min;
  }

  getRandomIntDefault(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randInt(min, max) {
    return this.getRandomIntMethod_1(min, max);
  }

  /**
   *   randomMethod 2:
   *
   *   xmur3:
   */

  xmur3(str) {
    let h;
    for (let i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  /**
   *   sfc32:
   */

  sfc32(a, b, c, d) {
    return function () {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  /**
   *    Mulberry32:
   */

  mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Output four 32-bit hashes to provide the seed for sfc32.
  getRandomMethod_2() {
    let func = this.sfc32(
      this.seed_2(),
      this.seed_2(),
      this.seed_2(),
      this.seed_2()
    ); //Retorna uma função
    return func(); //Retorna o valor
  }

  getRandomIntMethod_2(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomMethod_2() * (max - min)) + min;
  }

  // Output one 32-bit hash to provide the seed for mulberry32.
  getRandomMethod_3() {
    let func = this.mulberry32(this.seed_2()); //Retorna uma função
    return func(); //Retorna o valor
  }

  getRandomIntMethod_3(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomMethod_3() * (max - min)) + min;
  }
}
