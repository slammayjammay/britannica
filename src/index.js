import Vue from 'vue';
import App from './components/App.vue';

Vue.config.silent = true;

const vm = new Vue({
	el: '#root',
	render: h => h(App)
});

