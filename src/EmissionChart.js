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
      text: `Top 10 companies emitting greenhouse gas`,
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    legend: {
        data: ['2018', '2017']
    },

    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },

    xAxis: {
        type: 'value'
    },

    yAxis: {
        type: 'category',
        data: this.props.chartData.chartSeriesLabels
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'shadow'
      }
    },

    series: this.props.chartData.chartSeriesData
  });

  render() {
    return (
      <div className="widgetContainer">
        {!!this.props.chartData && <ReactEcharts id="Chart" option={this.getEchartsOptions()} style={{height: '100%', width: '100%'}} />}
      </div>
    );
  }
}

export default EmissionChart;
