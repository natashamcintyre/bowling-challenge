describe ('Scorer', function() {

  var scorer, frame;

  class DoubleFrame {

    constructor() {
      this.pins = [4, 3];
    }

    result() {
      return this.pins[0] + this.pins[1]
    }

    isaSpare() {
      return false;
    }

    isaStrike() {
      return false;
    }

    isNotStrikeOrSpare() {
      return true;
    }
  }

  class DoubleStrike {
    constructor() {
      this.pins = [10];
    }

    isaSpare() {
      return false;
    }

    isaStrike() {
      return true;
    }

    isNotStrikeOrSpare() {
      return false;
    }
  }

  class DoubleSpare {
    constructor() {
      this.pins = [6, 4];
    }

    isaSpare() {
      return true;
    }

    isaStrike() {
      return false;
    }

    isNotStrikeOrSpare() {
      return false;
    }
  }

  beforeEach(function () {
    scorer = new Scorer();
    frame = new DoubleFrame();
    spare = new DoubleSpare();
    strike = new DoubleStrike();
  });

  describe('addFrame', function() {
    it('stores the frame in an array', function() {
      scorer.addFrame(frame);
      expect(scorer.frames).toEqual([frame]);
    });
  });

  describe('_isUpdateNeeded', function() {
    it ('returns false if frame length is equal to score length', function() {
      expect(scorer._isUpdateNeeded()).toBe(false);
    });

    it('returns false if frame length is different from score length', function() {
      scorer.frames = [spare]
      expect(scorer._isUpdateNeeded()).toBe(true);
    });
  });

  describe('update scores', function() {
    it('calls on strikebonus', function() {
      spyOn(scorer, '_strikeBonus');
      scorer.frames = [strike];
      scorer.addFrame(frame);
      expect(scorer._strikeBonus).toHaveBeenCalled();
    });

    it('calls on _consecStrikeBonus', function() {
      spyOn(scorer, '_consecStrikeBonus');
      scorer.frames = [strike, strike];
      scorer.addFrame(frame);
      expect(scorer._consecStrikeBonus).toHaveBeenCalled();
    });
  });

  describe('calculate', function() {
    it('puts result of standard frame into scores array', function() {
      scorer._calculate(frame);
      expect(scorer.scores).toEqual([7]);
    });

    it('adds total to scores list for multiple rolls', function() {
      scorer._calculate(frame);
      scorer._calculate(frame);
      expect(scorer.scores).toEqual([7, 7]);
    });
  });

  describe('spareUpdateNeeded', function() {
    it('returns true if last frame was a spare', function() {
      scorer.addFrame(spare);
      expect(scorer.spareUpdateNeeded()).toBe(true)
    })
  });

  describe('_lastFrame', function() {
    it('returns last frame in the array', function() {
      scorer.addFrame(spare);
      scorer.addFrame(frame);
      expect(scorer._lastFrame()).toBe(frame);
    });
  });

  describe('_isConsecutiveStrikeInProgress', function() {
    it('returns true for consecutive strikes', function() {
      scorer.frames = [strike, strike]
      expect(scorer._isConsecutiveStrikeInProgress()).toBe(true);
    });
  });

  describe('_consecStrikeBonus', function() {
    it('pushes 20 + frame result to scores', function() {
      scorer.frames = [strike, strike];
      scorer._consecStrikeBonus(frame);
      expect(scorer.scores[0]).toEqual(27);
    });
  });

  describe('total', function() {
    it('returns total of all scores', function() {
      scorer.scores = [3, 7, 17]
      expect(scorer.total()).toEqual(27)
    });
  });

  describe('_spareBonus', function() {
    it('calculates bonus of spare as first roll of next frame', function() {
      scorer.addFrame(spare);
      scorer.spareBonus(4);
      expect(scorer.scores[0]).toEqual(14);
    });
  });

  describe('_strikeBonus', function() {
    it('calculates bonus of strike as sum of next frame', function() {
      scorer.addFrame(strike);
      scorer.addFrame(frame);
      expect(scorer.scores[0]).toEqual(17);
    });
  });
});
