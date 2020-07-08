<style scoped>
  .chart-container {
    /* padding: 9px; */
    flex-grow: 1;
    display: flex;
    align-items: center;
    height: 100%;

    /* min-width: 400px; */
  }
</style>

<template>
  <div class="chart-container">
    <WikirateEchart 
    v-bind:title="title" 
    v-bind:unit-name="unitName"
    v-bind:unit-dimension="unitDimension"
    v-for="chartData in this.chartDataByMetric" :key="chartData.metaData.metricId" v-bind:chartData="chartData" 
    v-bind:showMetricTitlesForSubcharts="showMetricTitlesForSubcharts"/>
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import WikirateEchart from '@/components/WikirateEchart.vue';
import fetchAndTransformData from '@/helpers/wikirate/fetchAndTransformData';
import echarts from "echarts";

@Component({
  components: {
    WikirateEchart
  }
})
export default class WikirateWidget extends Vue {
  chartDataByMetric: any[] = [];

  @Prop({default: "https://wikirate.org"})
  wikirateServer!: string;

  @Prop({default: "Commons+Greenhouse_Gas_Emissions_Scope_1_and_2_combined"})
  metric!: string;

  @Prop({default: [{}]})
  answerParams!: object[];

  @Prop({default: 3})
  numberOfTopAnswersToShow!: number;

  @Prop({default: ""})
  title!: string;

  @Prop({default: ""})
  unitName!: string;

  @Prop({default: 1})
  unitDimension!: number;

  @Prop({default: true})
  showMetricTitlesForSubcharts!: boolean;


  toUrl(params: object): string {
    // Commons+Greenhouse_Gas_Emissions_Scope_1_and_2_combined+Answer.json?filter%5Bproject%5D=Question+Widget%3A+GHG+emissions&view=compact&filter[year]=2017'
    const url = this.wikirateServer + "/" + this.metric + "+Answer.json?view=compact&" +
            this.toQueryString(params, null);
    return url;
  }

  toQueryString(obj: any, prefix: any): string {
    const str = [];
    let k, v;
    for(const p in obj) {
      // if (!obj.hasOwnProperty(p)) {continue;} // skip things from the prototype
      if (~p.indexOf('[')) {
        k = prefix ? prefix + "[" + p.substring(0, p.indexOf('[')) + "]" + p.substring(p.indexOf('[')) : p;
        // only put whatever is before the bracket into new brackets; append the rest
      } else {
        k = prefix ? prefix + "[" + p + "]" : p;
      }
      v = obj[p];
      str.push(typeof v == "object" ?
              this.toQueryString(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
  }

  mounted() {
    //TODO: improve type/error handling
    const urls = this.answerParams.map((params: object) => this.toUrl(params))
    fetchAndTransformData(urls, this.numberOfTopAnswersToShow)
    .then(chartDataByMetric => this.chartDataByMetric = chartDataByMetric)
  }

}
</script>
