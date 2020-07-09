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
    v-bind:colors="colors"
    v-for="chartData in this.chartDataByMetric" :key="chartData.metaData.metricId" v-bind:chartData="chartData" 
    v-bind:showMetricTitlesForSubcharts="showMetricTitlesForSubcharts"/>
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import WikirateEchart from '@/components/WikirateEchart.vue';
import fetchAndTransformData from '@/helpers/wikirate/fetchAndTransformData';
import composeEndpointUrl from "@/helpers/wikirate/composeEndpointUrl";

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
  answerParams!: { [key: string]: any }[];
  @Prop({default: 3})
  numberOfTopAnswersToShow!: number
  @Prop({default: ""})
  title!: string;
  @Prop({default: ""})
  unitName!: string;
  @Prop({default: 1})
  unitDimension!: number;
  @Prop({default: true})
  showMetricTitlesForSubcharts!: boolean;
  @Prop({default: ['#0091E0', '#ED4D50']})
  colors!: string[];

  mounted() {
    //TODO: improve type/error handling
    const urls = this.answerParams.map(
        (params: { [key: string]: any }) => composeEndpointUrl(this.wikirateServer, this.metric, params))
    fetchAndTransformData(urls, this.numberOfTopAnswersToShow)
    .then(chartDataByMetric => this.chartDataByMetric = chartDataByMetric)
  }
}
</script>
d