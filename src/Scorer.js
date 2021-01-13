class Scorer {

  constructor() {
    this.scores = [];
  }

  calculate(frame) {
    let frameTotal = frame.reduce((a, b) => a + b );
    this.scores.push(frameTotal);
  }

  total() {
    return this.scores.reduce((a, b) => a + b );
  }

}