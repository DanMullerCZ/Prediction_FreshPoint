function calculatePredictions(data, params, numPredictions) {
    const lastDate = new Date(data[data.length - 1].timestamp); // last date to know when predictions start
    let values = data.map(data => data.value) // extract values from data
    const avgOfDiffs = calculateAvgOfDiffs(values); // average difference between values
    let predictions = [];

    // declaring default params in case they are not provided
    let defaultParams = {
        changepoint_prior_scale: 5, 
        changepoint_range: 1,
        interval_width: 1 
    }

    // change the default parameters if different values are provided
    params.forEach(param => {
        defaultParams[param.name] = param.value
    });

    // function to calculate the average difference between values
    function calculateAvgOfDiffs(vals) {
        let difArray = [];
        for (let i = 0; i < vals.length - 1; i++) {
            const dif = vals[i + 1] - vals[i];
            difArray.push(dif);
        }
        let sum = difArray.reduce((acc, cur) => acc + cur, 0)
        let avg = Math.round(sum / difArray.length)
        return avg
    }

    for (let index = 0; index < numPredictions; index++) {
        let { changepoint_prior_scale, changepoint_range, interval_width } = defaultParams; // extracting parameters
        let previousValue = values[values.length - 1]; // finding previous value

        // sets date for next week since last date
        lastDate.setDate(lastDate.getDate() + 7)

        // calculates prediction value
        let range = index * changepoint_range
        let scaledAvg = avgOfDiffs * changepoint_prior_scale
        let dividedAddVal = ( scaledAvg + range ) / interval_width
        let calculatedValue = Math.round(previousValue + dividedAddVal);

        // creates new prediction
        let prediction = {
            timestamp: lastDate.toISOString(),
            value: calculatedValue,
        }

        // pushing new prediction and new last value
        values.push(calculatedValue);
        predictions.push(prediction);
    }
    return predictions
}

module.exports = calculatePredictions;