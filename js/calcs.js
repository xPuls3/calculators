function calculate(elem) {
    let $section = $(elem).parent().parent().parent();
    let calc = $section.attr("calc");
    let inputs = [];
    let temp;
    for (let i = 0; i < $section.find(".calc-inputs > input").length; i++) {
        temp = prepare($section.find(".calc-inputs > input").eq(i).val());
        if (isNumber(Number(temp)) && temp.replace(/\s/g, '').length) {
            inputs.push(Number(temp));
        } else {
            respond($section, "Inputs must be numbers!");
            return;
        }
    }
    respond($section, calcs[calc](...inputs));
}

function respond($section, i) {
    if (Array.isArray(i)) {
        for (let i = 0; i < i.length; i++) {
            $section.find(".calc-returns").eq(i).text(i).show();
        }
    } else {
        $section.find(".calc-returns").text(i).show();
    }
}

calcs = {

    upboost: function (current, wanted) {
        let result = 0;
        current /= 5;
        wanted /= 5;
        if (isNotWhole(current) || isNotWhole(wanted)) {
            return "Error! Inputs must be multiples of 5!";
        }
        while (current < wanted) {
            result += 50000000*current;
            if (result < 0) { result = 0 }
            result += 50000000;
            current++;
        }
        return comma(result) + " Gold Required";
    },

    classic: function (current, wanted) {
        let result = 0;
        while (current < wanted) {
            current++;
            result += Math.round(current * 2);
        }
        return comma(result) + " Rhodium Required";
    },

    expboost: function (current, wanted) {
        let result = 0;
        while (current < wanted) {
            current++;
            result += 2;
            result += Math.floor(current / 10 - 0.0000001);
        }
        return comma(result) + " Rhodium Required";
    },

    ingot: function (db, ww) {
        db = Number(db) / 100 + 1;
        ww = Number(ww) / 100 + 1;
        let result = Math.round(((6 / db) / ww) * 1000);
        return "One Rhodium Ingot Per " + comma(result) + " Actions.";
    },

    quint: function (current, wanted, scrapyard) {
        scrapyard = Math.pow(0.99, scrapyard);
        current *= 10;
        wanted *= 10;
        wanted = (wanted - current);
        let result = karuboFuncs.doTheThingQuint(current, wanted, scrapyard);
        return comma(result) + " Spare Parts Required";
    },

    resourceBoost: function (current, wanted, scrapyard) {
        scrapyard = Math.pow(0.99, scrapyard);
        current *= 10;
        wanted *= 10;
        wanted = (wanted - current);
        let result = karuboFuncs.doTheThingResBoost(current, wanted, scrapyard);
        return comma(result) + " Spare Parts Required";
    },

};

karuboFuncs = {

    doTheThingQuint: function(current, wanted, scrapyard) {
        return Math.round(((karuboFuncs.spBaseCost(current+wanted,15)+karuboFuncs.spCostGrowthModifierSum(current+wanted,"Quint"))-(karuboFuncs.spBaseCost(current,15)+karuboFuncs.spCostGrowthModifierSum(current,"Quint")))*scrapyard);
    },

    doTheThingResBoost: function(current, wanted, scrapyard) {
        return Math.round(((karuboFuncs.spBaseCost(current+wanted,8)+karuboFuncs.spCostGrowthModifierSum(current+wanted,""))-(karuboFuncs.spBaseCost(current,8)+karuboFuncs.spCostGrowthModifierSum(current,"")))*scrapyard);
    },

    spCostGrowthModifierSum: function (amount, type) {
        let growthModifierSum;
        let tmpAmount = amount;
        let tmpGrowth = 0.01;
        if (type === "Quint") {tmpGrowth = 0.02;}
        if (type === "Satchel") {tmpGrowth = 1;}
        if (type !== "Satchel") {growthModifierSum = ((Math.pow(amount, 3) / 3) + Math.pow(amount, 2) + (amount * 2 / 3)) * tmpGrowth / 2;} else {growthModifierSum = 0;}
        let tmpAmountThousands = 1;
        let increasedGrowth = 0;
        while (tmpAmount > 1000) {
            let addedGrowth = ((Math.pow((amount - (tmpAmountThousands * 1000)), 3) / 3) + Math.pow((amount - (tmpAmountThousands * 1000)), 2) + ((amount - (tmpAmountThousands * 1000)) * 2 / 3)) * tmpGrowth / 2;
            if (type === "Satchel") {addedGrowth *= 50;}
            tmpAmount -= 1000;
            tmpGrowth *= 2;
            tmpAmountThousands++;
            increasedGrowth += addedGrowth;
        }
        growthModifierSum += increasedGrowth;
        return growthModifierSum;

    },

    spBaseCost: function (level, costPerLevel) {
        return (level * (level + 1) / 2) * costPerLevel;
    },

};