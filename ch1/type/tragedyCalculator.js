const PerformanceCalculator = require('../performanceCalculator');
class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if(this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }

        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

module.exports = TragedyCalculator;