@import url('https://fonts.googleapis.com/css?family=Droid+Sans:400,700');


<style scoped>
.widget-container {
  -webkit-font-smoothing: antialiased;
  font-family: "Roboto","Helvetica Neue", Helvetica, Arial, sans-serif;
  height: 600px;
  /* min-width: 400px; */
}
.powered-by {
  font-family: sans-serif;
  font-size: 13px;
}
.powered-by a {
  color: green;
}
</style>

<template>
  <div class="widget-container">
    <WikirateWidget 
    v-bind:number-of-top-answers-to-show="numberOfTopAnswersToShow" 
    v-bind:answer-params="answerParams"
    v-bind:metric="metric"
    v-bind:wikirate-server="wikirateServer"
    v-bind:title="title"
    v-bind:show-metric-titles-for-subcharts="showMetricTitlesForSubcharts"
    v-bind:unit-name="unitName"
    v-bind:unit-dimension="unitDimension"
    />
    <div class='powered-by'>
      <span>Powered by </span><a href="https://wikirate.org/" target="_blank">
      <img src="wikirate-logo.png" height="30px" /></a>
    </div>
  </div>
</template>

<script>
import WikirateWidget from './components/WikirateWidget.vue';

export default {
  name: 'App',
  props: [
    'answer-params',
    'number-of-top-answers-to-show',
    'metric',
    'wikirate-server',
    'title', 
    'show-metric-titles-for-subcharts', 
    'unit-name',
    'unit-dimension'
  ],
  components: {
    WikirateWidget
  }
}
</script> 

