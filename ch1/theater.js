const PerformanceCalculator = require('./performanceCalculator');

const invoice = require('./invoices.json');
const play = require('./play.json');

//항상 리팩터링을 할때마다 테스트를 하자
//테스트 코드를 같이 작성하면 좋지만 여기는 없으니깐 그냥 작성함
console.log(statement(invoice, play));

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = playFor(aPerformance);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result)
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playId];
    }

    function amountFor(aPerformance) {
        amountResult = 0;

        switch (aPerformance.play.type) {
            case 'tragedy':
                amountResult = 40000;
                if (aPerformance.audience > 30) {
                    amountResult += 1000 * (aPerformance.audience - 30);
                }
                break;
            case 'comedy':
                amountResult = 30000;
                if (aPerformance.audience > 20) {
                    amountResult += 10000 + 500 * (aPerformance.audience - 20);
                }
                amountResult += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
        }
        return amountResult;
    }

    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);

        if ('comedy' === aPerformance.play.type)
            volumeCredits += Math.floor(aPerformance.audience / 5);
        return volumeCredits;
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0)
    }
}

function renderPlainText(data) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (let perf of data.performances) {
        result += `${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience}석)\n`;
    }

    result += `총액: ${usd(data.totalAmount / 100)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(aNumber);
    }

}
