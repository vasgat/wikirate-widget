import React, { Component } from 'react';
import _ from 'lodash';

import EmissionChart from './EmissionChart';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metricsPerCompany: [],
      companyOptions: [],
      selectedCompanyOption: null,
      chartData: null, 
      foo: null
    }

    this.selectedCompanyChangedHandler = this.selectedCompanyChangedHandler.bind(this);
  }

  selectedCompanyChangedHandler = (selectedCompanyOption, b) => {
    this.setState({ selectedCompanyOption }, this.getDataForCompanyAndUpdateChart);
  }

  getDataForCompanyAndUpdateChart = () => {
    const company = this.state.selectedCompanyOption.value
    const metricsPerCompany = this.state.metricsPerCompany.filter(metricsPerCompany => metricsPerCompany.company == company)[0]

    const isMetricScope1OrScope2 = (metric) => metric.name.startsWith('Commons+Greenhouse Gas Emissions Scope 1+') || metric.name.startsWith('Commons+Greenhouse Gas Emissions Scope 2+')

    const emissionValuesPerScope = metricsPerCompany.metrics
      .filter(isMetricScope1OrScope2)
      .map(metric => ({
        value: metric.value,
        name: metric.name
      }));

    const chartData = {
      chartSeriesLabels: metricsPerCompany.metrics[0].company,
      chartSeriesData: emissionValuesPerScope
    };

    this.setState({
      chartData
    });
  }

  componentDidMount() {
    const that = this;

    const series = []

    const callYear1 = fetch('https://wikirate.org/Commons+Greenhouse_Gas_Emissions_Scope_1_and_2_combined+Answer.json?filter%5Bproject%5D=Question+Widget%3A+GHG+emissions&view=compact&filter[year]=2017')
    const callYear2 = fetch('https://wikirate.org/Commons+Greenhouse_Gas_Emissions_Scope_1_and_2_combined+Answer.json?filter%5Bproject%5D=Question+Widget%3A+GHG+emissions&view=compact&filter[year]=2018')

    Promise.all([callYear1, callYear2])
      .then(function([dataYear1, dataYear2]) {

          let companies = []
          const series = []

          Promise.all([dataYear1.json(), dataYear2.json()])
            .then(([jsonYear1, jsonYear2]) => {
              console.log(jsonYear2.answers)
              const answers = _.values(jsonYear2.answers).map(item2 => {
                const item1 = _.find(_.values(jsonYear1.answers), {"company": item2.company});

                if (item1 == undefined) {
                  return null
                }

                return {
                  company: item1.company,
                  companyName: jsonYear2["companies"][item1.company],
                  valueYear1: parseFloat(item1.value), 
                  valueYear2: parseFloat(item2.value)
                }
              })
              .filter(item => item != null && !isNaN(item.valueYear1) && !isNaN(item.valueYear2))

              const sortedAnswers = _.orderBy(answers, ['valueYear2'], ['asc']).slice(0, 10)
              console.log(sortedAnswers)

              series.push({name: '2018', type: 'bar', data: sortedAnswers.map(item => item.valueYear2), barCategoryGap: '40%'})
              series.push({name: '2017', type: 'bar', data: sortedAnswers.map(item => item.valueYear1)})

              companies = sortedAnswers.map(item => item.companyName)

              const chartData = {
                chartSeriesLabels: companies,
                chartSeriesData: series
              };

              that.setState({
                chartData
              });
            })
      })
    
  }

  render() {
    return (
      <div id="App">
        <EmissionChart chartData={this.state.chartData} />
      </div>
    );
  }
}

export default App;
