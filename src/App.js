import React, { Component } from 'react';
import Select from 'react-select';

import logo from './logo.svg';
import './App.css';

import _ from 'lodash';

import EmissionChart from './EmissionChart';
import CompanyDropdownList from './CompanyDropdownList';


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

    // _.values(callYear2answers])

    Promise.all([callYear1, callYear2])
      .then(function([dataYear1, dataYear2]) {
          // console.log('Year1')
          // console.log(dataYear1)

          // console.log('Year2')
          // console.log(dataYear2)

          // this.setState({
          //   foo: dataYear1.json()
          // });

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

              const sortedAnswers = _.orderBy(answers, ['valueYear2'], ['asc'])
              console.log(sortedAnswers)

              series.push({name: '2017', type: 'bar', data: sortedAnswers.map(item => item.valueYear1)})
              series.push({name: '2018', type: 'bar', data: sortedAnswers.map(item => item.valueYear2)})

              companies = sortedAnswers.map(item => item.companyName)
              console.log(companies)
              //companies.push({name: '2018', type: 'bar', data: sortedAnswers.map(item => item.valueYear2)})

              const chartData = {
                chartSeriesLabels: companies,
                chartSeriesData: series
              };

              that.setState({
                chartData
              });
            })

          console.log(series)

          // dataYear1.json()
          //   .then(response => 
          //       response.answers.map(item1 => {
          //           const item2 = _.findBy(dataYear1.answers, "companyName", item1.companyName);
          //           return {
          //               companyName: item1.companyName, 
          //               valueYear1: item1.value, 
          //               valueYear2: item2.value
          //           };
          //       })
          //   )

          // dataYear2.json()
          //   .then(response => {
          //       _.values(response.answers)
          //           .forEach(item => answers.push(item))
          //   })

          // console.log('Answers')
          // console.log(answers)

          // for (const answer in dataYear2.json()['answers']) {
          //      console.log(answer)
          // }

          // dataYear2.then()
      })
    
    

    // fetch('https://wikirate.org/Commons+Greenhouse_Gas_Emissions_Scope_1_and_2_combined+Answer.json?filter%5Bproject%5D=Question+Widget%3A+GHG+emissions&view=compact&filter[year]=2017')
    // //fetch('mocked-wikirate-emissions-data.json')
    //   .then(response => response.json())
    //   // .then(response => { console.log(response); return response; })
    //   .then(data => {
    //       // const data = response.json();
    //       console.log(data);
    //       const companiesData = []

    //       for (const companyId in data.companies) {
    //         companiesData
    //       }
    //   })
      // .then(items => {
      //   const itemsByCompany = _.chain(items)
      //     .filter(item => item.year === 2017)
      //     .groupBy('company')
      //     .pickBy((items, companyName) => {
      //       const hasScope1 = _.some(items, ['metric', 'Commons+Greenhouse Gas Emissions Scope 1']);
      //       const hasScope2 = _.some(items, ['metric', 'Commons+Greenhouse Gas Emissions Scope 2']);
      //       const hasScope1And2Combined = _.some(items, ['metric', 'Commons+Greenhouse Gas Emissions Scope 1 and 2 combined']);
      //       const containsAllDesiredScopes = hasScope1 && hasScope2 && hasScope1And2Combined;
      //       return containsAllDesiredScopes;
      //     });


      //   const optionsForSuggestDropdownlist = itemsByCompany.map(itemsByOneCompany => ({
      //     value: itemsByOneCompany[0].url.split('+')[2],
      //     label: itemsByOneCompany[0].company
      //   }))
      //     .value();

      //   const metricsPerCompany = itemsByCompany.map(itemsByOneCompany => ({
      //     metrics: itemsByOneCompany,
      //     company: itemsByOneCompany[0].url.split('+')[2]
      //   }))
      //     .value();
      //   that.setState({ metricsPerCompany })
      //   that.setState({ companyOptions: optionsForSuggestDropdownlist });
      // }
      // )
  }

  render() {
    return (
      <div className="App">
         {this.state.foo}
        <CompanyDropdownList selectedCompanyChangedHandler={this.selectedCompanyChangedHandler} companyOptions={this.state.companyOptions} />
        <EmissionChart chartData={this.state.chartData} />
      </div>
    );
  }
}

export default App;
