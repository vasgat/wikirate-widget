import React, { Component } from 'react';
import Select from 'react-select';
import ReactEcharts from 'echarts-for-react';

import logo from './logo.svg';
import './App.css';

import _ from 'lodash';


class EmissionChart extends Component {
  constructor(props) {
    super(props);
  }

  getEchartsOptions = () => ({
    title: {
      text: `Emissions of ...`,
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    legend: {
        data: ['2017', '2018']
    },

    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },

    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },

    yAxis: {
        type: 'category',
        data: this.props.chartData.chartSeriesLabels
    },

    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    series: this.props.chartData.chartSeriesData
  });

  render() {
    return (
      <div>
        {!!this.props.chartData && <ReactEcharts id="Chart" option={this.getEchartsOptions()} />}
      </div>
    );
  }
}

export default EmissionChart;
