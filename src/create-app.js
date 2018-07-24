import Vue from 'vue';
import App from './js/components/App.vue';

export default () => {
	return new Vue({
		render: h => h(App)
	});
};
