class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        throw new Error('서브클래스에서 처리');
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

module.exports = PerformanceCalculator;