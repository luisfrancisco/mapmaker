export default class SeedGenerator {
  constructor(seedString = "pcglab", method = "sin") {
    this.sinSeed = 1;
    this.method = method;
    // Create xmur3 state:
    this.seed32 = this.xmur3(seedString);
  }

  /**
   *  PRNG initialiazator with  xmur3:
   *  @see https://stackoverflow.com/a/47593316/5141996
   */
  xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  nextRandFloat(min, max) {
      switch (this.method) {
        case "math":
          return this.getRandomFloatMethodMath(min, max);
        case "sin":
          return this.getRandomFloatMethodSin(min, max);
        case "sfc32":
          return this.getRandomFloatMethodSFC32(min, max);
        case "mulberry32":
          return this.getRandomFloatMethodMulberry32(min, max);
        default:
          return this.getRandomFloatMethodSin(min, max);
      }
    }

  /**
   * Select next rand integer based on method
   * 
   */

  nextRandInt(min, max) {
    switch (this.method) {
      case "math":
        return this.getRandomIntMethodMath(min, max);
      case "sin":
        return this.getRandomIntMethodSin(min, max);
      case "sfc32":
        return this.getRandomIntMethodSFC32(min, max);
      case "mulberry32":
        return this.getRandomIntMethodMulberry32(min, max);
      default:
        return this.getRandomIntMethodSin(min, max);
    }
  }

  /**
   * Math Method
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  getRandomFloatMethodMath() {
    return Math.random();
  }

  getRandomIntMethodMath(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Sin Method
   * @see https://stackoverflow.com/a/19303725/5141996
   */
  getRandomFloatMethodSin() {
    let x = Math.sin(this.sinSeed++) * 10000;
    return x - Math.floor(x);
  }

  getRandomIntMethodSin(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomFloatMethodSin() * (max - min)) + min;
  }

  /**
   *   sfc32:
   *   @see http://pracrand.sourceforge.net/
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
  // Output four 32-bit hashes to provide the seed for sfc32.
  getRandomFloatMethodSFC32() {
    let func = this.sfc32(
      this.seed32(),
      this.seed32(),
      this.seed32(),
      this.seed32()
    ); //Retorna uma função
    return func(); //Retorna o valor
  }

  getRandomIntMethodSFC32(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomFloatMethodSFC32() * (max - min)) + min;
  }

  /**
   *    Mulberry32
   *    @see http://gjrand.sourceforge.net/
   */
  mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Output one 32-bit hash to provide the seed for mulberry32.
  getRandomFloatMethodMulberry32() {
    let func = this.mulberry32(this.seed32()); //Retorna uma função
    return func(); //Retorna o valor
  }

  getRandomIntMethodMulberry32(minimal, maximus) {
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    let result = Math.floor(this.getRandomFloatMethodMulberry32() * (max - min)) + min;
    return result;
  }
}
