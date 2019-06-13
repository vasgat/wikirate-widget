import React, { Component } from 'react';
import Select from 'react-select';
import ReactEcharts from 'echarts-for-react';

import logo from './logo.svg';
import './App.css';

import _ from 'lodash';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metricsPerCompany: [],
      companyOptions: [], 
      selectedCompanyOption: null, 
      chartData: null
    }
  }

  handleChange = (selectedCompanyOption, b) => {
    console.log('selectedCompanyOption, b');
    console.log(selectedCompanyOption);
    console.log(b);
    this.setState({ selectedCompanyOption }, this.getDataForCompanyAndUpdateChart);
  }

  getDataForCompanyAndUpdateChart = () => {
    //TODO: normalizedCompanyName constant remove/replace with dynamic value
    // const normalizedCompanyName = 'Marks_and_Spencer_Group_plc';
    const normalizedCompanyName = this.state.selectedCompanyOption.value;
    console.log('this.state');
    console.log(this.state);

    const scope1DeferredData = fetch(`https://wikirate.org/CDP+Scope_1_Emissions+${normalizedCompanyName}+2017.json`) .then(data => { return data.json() });

    const scope2DeferredData = fetch(`https://wikirate.org/CDP+Scope_2_Emissions+${normalizedCompanyName}+2017.json`)
      .then(data => { return data.json() });

    Promise
      .all([scope1DeferredData, scope2DeferredData])
      .then(emissionData => {

        console.log(emissionData);
        const humanizedCompanyName = emissionData[0].company;

        const emissionValuesPerScope = emissionData.map(data => ({
          value: data.value,
          name: data.metric
        }));

        const chartData = {
          companyName: humanizedCompanyName,
          chartSeriesData: emissionValuesPerScope
        };

        this.setState({
          chartData
        });

        console.log("chartData"); 
        console.log(chartData); 

      });
  }

  componentDidMount() {
    console.log("COMPONENT DID MOIUNT");
    const that = this;

    // GOAL: build an array of objects of only companies with scope 1, scope 2 and both combined available and for year 2017, 
    // with a data structure for the suggested search field that looks like: 
    // {
    //    companyName
    //    canonicalName
    //    metricValue
    // }

    fetch('https://wikirate.org/Question_Widget_GHG_emissions.json')
      .then(response => response.json())
      .then(response => {console.log(response); return response; })
      .then(data => data.items)
      .then(items => {
        const BAR = _.chain(items)
        .filter(item => item.year === 2017)
        .groupBy('company')
        .pickBy((items, companyName) => {
          console.log('items');
          console.log(items);
          const hasScope1 = _.some(items, ['metric', 'Commons+Greenhouse Gas Emissions Scope 1']);
          const hasScope2 = _.some(items, ['metric', 'Commons+Greenhouse Gas Emissions Scope 2']);
          const hasScope1And2Combined = _.some(items, ['metric', 'Commons+Greenhouse Gas Emissions Scope 1 and 2 combined']);
          const containsAllDesiredScopes = hasScope1 && hasScope2 && hasScope1And2Combined;
          console.log('containsAllDesiredScopes'); 
          console.log(containsAllDesiredScopes);
          return containsAllDesiredScopes;
        });


        const optionsForSuggestDropdownlist = BAR.map(itemsByOneCompany => ({
          value: itemsByOneCompany[0].url.split('+')[2], 
          label: itemsByOneCompany[0].company
        }))
        .value();

        const metricsPerCompany = BAR.map(itemsByOneCompany => ({
          metrics: itemsByOneCompany, 
          company: itemsByOneCompany[0].company
        }))
        .value();
        that.setState({ metricsPerCompany })

        console.log('optionsForSuggestDropdownlist');
        console.log(optionsForSuggestDropdownlist);
        that.setState({ companyOptions: optionsForSuggestDropdownlist });

        // const lookupListOfCompaniesAndMetrics = BAR.map(itemsByOneCompany => ({
        //   value: itemsByOneCompany[0].url.split('+')[2], 
        //   label: itemsByOneCompany[0].company
        // }))


        // console.log("lookupListOfCompaniesAndMetrics");
        // console.log(lookupListOfCompaniesAndMetrics);

        // .map(companies => companies.map(company => ({
        //   value: company.canonicalName,
        //   label: company.humanizedName
        // })))

        // .mapValues(itemsByOneCompany => {
        //   console.log("itemsByOneCompany:");
        //   console.log(itemsByOneCompany);
        //   return {
        //     scope: itemsByOneCompany.metric };
        // }
        // )
        // .value()

        // .map(items => _.groupBy(items, 'company'))
      }
      )
      // .then(FOO => {
      //   console.log("FOO: ");
      //   console.log(FOO);
      // })


      //   .map(item => ({
      //     canonicalName: item.url.split('+')[2], 
      //     humanizedName: item.company
      //   }))
      //   )
      // .then(companies => _.uniqBy(companies, 'humanizedName'))
      // .then(companies => companies.map(company => ({
      //   value: company.canonicalName,
      //   label: company.humanizedName
      // })))
      // .then(companyOptions => {
      //   console.log('companyOptions');
      //   console.log(companyOptions);
      //   that.setState({ companyOptions })
      // });
  }

  getEchartsOptions = () => ({
    backgroundColor: '#2c343c',

      title: {
      text: `Emissions of '${this.state.chartData.companyName}'`,
        left: 'center',
          top: 20,
            textStyle: {
        color: '#ccc'
      }
    },

    tooltip: {
      trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    series: [
      {
        name: 'Scope 1 and 2 Emissions',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: this.state.chartData.chartSeriesData,
        roseType: 'radius',
        label: {
          normal: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        },
        itemStyle: {
          normal: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  });

  render() {
    return (
    <div className="App">
      <Select
        options={this.state.companyOptions}
        value={this.state.selectedOption}
        onChange={this.handleChange}
      />
      { !!this.state.chartData && <ReactEcharts option={this.getEchartsOptions()} /> }
    </div>
    );
  }
}

export default App;
