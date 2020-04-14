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

@Component({
  components: {
    WikirateEchart
  }
})
export default class WikirateWidget extends Vue {

  chartDataByMetric: any[] = [];

  @Prop({default: []}) 
  answerEndpoints!: string[];

  @Prop({default: 3})
  numberOfTopAnswersToShow!: number;

  @Prop({default: ""}) 
  title!: string;

  @Prop({default: ""}) 
  unitName!: string;

  @Prop({default: true})
  showMetricTitlesForSubcharts!: boolean;

  mounted() {
    //TODO: improve type/error handling
    fetchAndTransformData(this.answerEndpoints, this.numberOfTopAnswersToShow)
    .then(chartDataByMetric => this.chartDataByMetric = chartDataByMetric)
  }

}
</script>
