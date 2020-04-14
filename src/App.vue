<style scoped>
.widget-container {
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
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <WikirateWidget 
    v-bind:number-of-top-answers-to-show="numberOfTopAnswersToShow" 
    v-bind:answer-endpoints="answerEndpoints" 
    v-bind:title="title"
    v-bind:show-metric-titles-for-subcharts="showMetricTitlesForSubcharts"
    v-bind:unit-name="unitName"
    />
    <div class='powered-by'>
      Powered by <a href="https://wikirate.org/" target="_blank">WikiRate</a>
    </div>
  </div>
</template>

<script>
import WikirateWidget from './components/WikirateWidget.vue';

export default {
  name: 'App',
  props: [
    'answer-endpoints', 
    'number-of-top-answers-to-show', 
    'title', 
    'show-metric-titles-for-subcharts', 
    'unit-name'
  ],
  components: {
    WikirateWidget
  }
}
</script> 

