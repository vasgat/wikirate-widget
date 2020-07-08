import Vue from 'vue'
import App from './App.vue'

interface WidgetOptions {
    element: string;
    numberOfTopAnswersToShow: number;
    wikirateServer: string;
    metric: string;
    answerParams: object[];
    showMetricTitlesForSubcharts: boolean;
    title: string;
    unitName: string;
    unitDimension: number;
}
const WikirateWidget = {
    renderWidget: function ({element, numberOfTopAnswersToShow, wikirateServer, metric, answerParams, showMetricTitlesForSubcharts, title, unitName, unitDimension}: WidgetOptions) {
        Vue.config.productionTip = false
        return new Vue({
            el: element,
            render: h => h(App, { props: { numberOfTopAnswersToShow, wikirateServer, metric, answerParams: answerParams, showMetricTitlesForSubcharts, title, unitName, unitDimension} })
        });
    }
};

declare global {
    interface Window {
        wikirate: any;
    }
}

(function(window: any) {
    if (typeof (window.WikirateWidget) === 'undefined') {
        window.WikirateWidget = WikirateWidget;
    }
})(window);

export default WikirateWidget; 
