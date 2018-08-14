import Vue from 'vue';
import App from './js/components/App.vue';
import createRouter from './create-router';

export default (context) => {
	const router = createRouter();

	const app = new Vue({
		render: h => h(App),
		router
	});

	return { app, router };
};
