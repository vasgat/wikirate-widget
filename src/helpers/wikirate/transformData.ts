import _ from 'lodash';

function getReferenceSequenceOfOrderedCompaniesByFirstYear(mergedDataGroupedAndOrderedByYear: any, numberOfTopAnswersToShow: number) {
    const answersOfFirstYear = mergedDataGroupedAndOrderedByYear[0].answers;

    return _.chain(answersOfFirstYear)
            .orderBy('value', 'desc')
            .slice(0, numberOfTopAnswersToShow)
            // now again reverse the order so we show the highest value at first 
            // TODO: consider to move this revert logic into place/layer which is more UI related
            .orderBy('value', 'asc')
            .map(answer => answer.company)
            .value();
}

function createDefaultAnswerWithZeroValue(answersForYear: any, company: number) {
    return {
        metric: answersForYear[0].metric,
        year: answersForYear[0].year,
        company: company,
        value: null
    };
}

function findAnswerForCompanyOrReturnAnswerWithZeroValue(answersForYear: any, company: number) {
    const answerForCompany = _.find(answersForYear, { 'company': company });

    return answerForCompany || createDefaultAnswerWithZeroValue(answersForYear, company);
}

function sortAnswersByReferenceSequenceOfOrderedCompanies(answers: any, referenceSequenceOfOrderedCompanies: number[]) {
    return referenceSequenceOfOrderedCompanies.map((company: number) => findAnswerForCompanyOrReturnAnswerWithZeroValue(answers, company));
}

// TODO: maybe extract this out into a adapter (with an interface) / designPattern: a function, which is passed in then into the 
// whole fetchAndTransform workflow and is generating chart-library specific configuration
function buildEchartsCompliantData(companyToNameMapping: any, metricToNameMapping: any, metricId: number, referenceSequenceOfOrderedCompanies: any, orderedAnswersByReferenceSequenceOfOrderedCompaniesGroupedAndOrderedByYear: any, numberOfTopAnswersToShow: number) {
    const companyNamesOrderedByReferenceSequence = referenceSequenceOfOrderedCompanies.map((company: number) => companyToNameMapping[company]);

    const years = orderedAnswersByReferenceSequenceOfOrderedCompaniesGroupedAndOrderedByYear.map((yearGroup: any) => yearGroup.year);

    const answersByYearSeries = orderedAnswersByReferenceSequenceOfOrderedCompaniesGroupedAndOrderedByYear.map((answersForOneYear: any) => {
        // TODO: extract this (outer) map function handler into it's own method
        const data = answersForOneYear.answers
            .map((answer: any) => answer.value);

        const echartConfigForAnswersForOneYear = {
            name: answersForOneYear.year, 
            // TODO: consider to handle 'type' (and the insertion of 'barCategoryGap' into every item besides the first one) on a different layer - e.g. in the UI component or a chart specific decorator, since it is more chart library/UI specific
            type: 'bar',
            data: data, 
            barCategoryGap: '40%', 
        //     markLine: {
        //         symbol: 'none',
        //         lineStyle: {
        //             color: 'green',
        //             type: 'dotted', 
        //             shadowColor: 'rgba(0, 0, 0, 0.5)',
        //             shadowBlur: 10
        //         },
        //         label: {
        //             show: true, 
        //             formatter: 'Emissions of all DUMMY Switzerland private \n households in 2019 (reference baseline)',
        //             position: 'start', 
        //             distance: -30,
        //         }, 
        //         data: [{xAxis: 130000000}],
        //    }
        };

        return echartConfigForAnswersForOneYear
    });

    const metricName = metricToNameMapping[metricId];

    const chartData = {
        metaData: {
            metricId,
            metricName: metricName,
            numberOfTopAnswersToShow, 
            years
        },
        mainData: {
            chartSeriesLabels: companyNamesOrderedByReferenceSequence,
            chartSeriesData: answersByYearSeries, 
            legendData: years.map((year: number) => year.toString())
        }
    };

    return chartData;
}

function createChartDataForOneMetricGroup(answersForOneMetric: any, companyToNameMapping: any, metricToNameMapping: any, metricId: number, numberOfTopAnswersToShow: any) {

    const answersGroupedAndOrderedByYear = _.chain(answersForOneMetric)
                            .groupBy('year')
                            // groupBy returns objects (where the keys are the groupBy attribute), but we want arrays of the form: 
                            // [year: abc, answers: [...]]
                            .map((value, key) => ({ year: Number.parseInt(key), answers: value }))
                            .orderBy('year', 'desc')
                            .value();

    const referenceSequenceOfTopNOrderedCompanies = getReferenceSequenceOfOrderedCompaniesByFirstYear(answersGroupedAndOrderedByYear, numberOfTopAnswersToShow);

    const orderedAnswersByReferenceSequenceOfOrderedCompaniesGroupedAndOrderedByYear = answersGroupedAndOrderedByYear.map((answersForOneYear: any) => ({
        year: answersForOneYear.year, 
        answers: sortAnswersByReferenceSequenceOfOrderedCompanies(answersForOneYear.answers, referenceSequenceOfTopNOrderedCompanies)
    }));

    const chartData = buildEchartsCompliantData(companyToNameMapping, metricToNameMapping, metricId, referenceSequenceOfTopNOrderedCompanies, orderedAnswersByReferenceSequenceOfOrderedCompaniesGroupedAndOrderedByYear, numberOfTopAnswersToShow);

    return chartData;
}




function cleanAnswersForAllYears(answers: any) {
    const answersWithoutInvalidValues = answers.filter((answer: any) => !isNaN(answer.value));
    const answersWithCorrectedTypes = answersWithoutInvalidValues
                                      .map((answer: any) => _.assign({}, answer, {metric: Number.parseInt(answer.metric)}))
                                      .map((answer: any) => _.assign({}, answer, {year: Number.parseInt(answer.year)}))
                                      .map((answer: any) => _.assign({}, answer, {value: Number.parseFloat(answer.value)}));
    return answersWithCorrectedTypes;
}

export default function transformFetchedDataIntoChartData(fetchedDataForAllYears: any, numberOfTopAnswersToShow: number) {

    const mergedDataForAllYears = _.merge({}, ...fetchedDataForAllYears);
    const mergedAnswersForAllYears = _.values(mergedDataForAllYears.answers); 

    const cleanedAnswersForAllYears = cleanAnswersForAllYears(mergedAnswersForAllYears);

    // TODO: extraxt this into its own method
    const cleanedAnswersGroupedByMetric = _.chain(cleanedAnswersForAllYears)
                            .groupBy('metric')
                            .map((value, key) => ({ metric: Number.parseInt(key), answers: value }))
                            .value();

    const chartDataGroupedByMetric = cleanedAnswersGroupedByMetric
        .map(answersForOneMetric =>
            createChartDataForOneMetricGroup(
                answersForOneMetric.answers,
                mergedDataForAllYears.companies,
                mergedDataForAllYears.metrics,
                answersForOneMetric.metric,
                numberOfTopAnswersToShow
            )
        )

    return chartDataGroupedByMetric;
}