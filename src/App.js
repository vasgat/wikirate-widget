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
      chartData: null
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
      companyName: metricsPerCompany.metrics[0].company,
      chartSeriesData: emissionValuesPerScope
    };

    this.setState({
      chartData
    });
  }

  componentDidMount() {
    const that = this;

    fetch('https://wikirate.org/Commons+Greenhouse_Gas_Emissions_Scope_1_and_2_combined+Answer.json?filter%5Bproject%5D=Question+Widget%3A+GHG+emissions&view=compact&filter[year]=2017')
    //fetch('mocked-wikirate-emissions-data.json')
      .then(response => response.json())
      // .then(response => { console.log(response); return response; })
      .then(data => {
          // const data = response.json();
          console.log(data);
          
          for (const company in data.companies) {
            console.log(company);
          }
      })
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
        <CompanyDropdownList selectedCompanyChangedHandler={this.selectedCompanyChangedHandler} companyOptions={this.state.companyOptions} />
        <EmissionChart chartData={this.state.chartData} />
      </div>
    );
  }
}

export default App;
