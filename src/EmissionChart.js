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
    backgroundColor: '#2c343c',

    title: {
      text: `Emissions of '${this.props.chartData.companyName}'`,
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
        data: this.props.chartData.chartSeriesData,
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
      <div className="Chart">
        {!!this.props.chartData && <ReactEcharts option={this.getEchartsOptions()} />}
      </div>
    );
  }
}

export default EmissionChart;
