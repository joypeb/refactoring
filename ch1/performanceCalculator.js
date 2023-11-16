class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        let amountResult = 0;

        switch (this.play.type) {
            case 'tragedy':
                amountResult = 40000;
                if (this.performance.audience > 30) {
                    amountResult += 1000 * (this.performance.audience - 30);
                }
                break;
            case 'comedy':
                amountResult = 30000;
                if (this.performance.audience > 20) {
                    amountResult += 10000 + 500 * (this.performance.audience - 20);
                }
                amountResult += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${this.play.type}`);
        }
        return amountResult;
    }

    get volumeCredits() {
        let volumeCredits = 0;
        volumeCredits += Math.max(this.performance.audience - 30, 0);

        if ('comedy' === this.play.type)
            volumeCredits += Math.floor(this.performance.audience / 5);
        return volumeCredits;
    }
}

module.exports = PerformanceCalculator;