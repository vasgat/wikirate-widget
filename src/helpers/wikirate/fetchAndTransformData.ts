import axios from 'axios';
import transformFetchedDataIntoChartData from './transformData';

function answersEndpointToResultDataPromise(answersEndpoint: string) {
    return axios
        .get(answersEndpoint)
        .then(result => result.data)
}

export default function fetchAndTransformData(answersEndpoints: string[], numberOfTopAnswersToShow: number) {
    const answerEndpointCalls = answersEndpoints.map(answersEndpointToResultDataPromise);

    const combinedPromiseOfDataForAllYears = Promise.all(answerEndpointCalls);

    return combinedPromiseOfDataForAllYears.then((fetchedDataForAllYears: any) => transformFetchedDataIntoChartData(fetchedDataForAllYears, numberOfTopAnswersToShow));
}
