<style scoped>
#chart {
  width:100%; 
  height:100%;
  /* min-width: 400px; */
}
</style>

<template>
    <div id="chart" ref="chart"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import * as echarts from 'echarts';

@Component
export default class WikirateEchart extends Vue {

  @Prop({default: []}) 
  chartData!: any[]; 
  @Prop({default: true}) 
  showMetricTitlesForSubcharts!: boolean;
  @Prop({default: String}) 
  unitName!: string;
  @Prop({default: 1})
  unitDimension!: number;
  @Prop({default: String}) 
  title!: string;

  drawChart(chartOption: any) {
    const chartContainer = this.$refs["chart"];
    const myChart = echarts.init(chartContainer as HTMLDivElement);
    myChart.setOption(chartOption);
  }

  generateEchartsOptions = (chartData: any, title: string, showMetricTitlesForSubcharts: boolean, unitName: string) => {
    const chartTitle = showMetricTitlesForSubcharts ? 
    `Top ${chartData.metaData.numberOfTopAnswersToShow} companies: \n ${chartData.metaData.metricName}` : 
    title
    ;
    
    return {
        color: ['#0091E0', '#ED4D50'],
        title: {
          text: chartTitle,
          left: 'center',
          top: 10,
          textStyle: {
            color: '#ccc'
          }
        }, 
      legend: {
          data: chartData.mainData.legendData,
          bottom: 10, 
          left: 'center'
      },

      grid: {
          left: '0',
          // right: '4%',
          bottom: '8%',
          containLabel: true
      },

      xAxis: {
          type: 'value', 
          name: unitName,
          axisLabel: {
              formatter: (value: number) => {
                  return value == 0 ? 0 : value / this.unitDimension;
              }
          }
      },

      yAxis: {
          type: 'category',
          data: chartData.mainData.chartSeriesLabels,
          // TODO: put (DUMMY) Switzerland as a reference at the end to the dataset and mark it in redd
          // axisLabel: {
          //   textStyle: {
          //     // fontWeight: 'bold',
          //     color: function (value: string, index: number) {
          //       // return value === 'DUMMY Switzerland' ? 'red' : 'black';
          //       return value === 'Nippon Steel & Sumitomo Metal' ? 'green' : 'black';
          //     }
          //   }
          // }
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
      },

      series: chartData.mainData.chartSeriesData
    };

  }

  mounted() {
      const echartOptions = this.generateEchartsOptions(this.chartData, this.title, this.showMetricTitlesForSubcharts, this.unitName);
      this.drawChart(echartOptions);
  }
  
}
</script>
