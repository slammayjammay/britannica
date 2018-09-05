import Vue from 'vue';
import App from './js/components/App.vue';
import createRouter from './create-router';

const IS_GH_PAGES = true;

export default () => {
	const router = createRouter();

	const app = new Vue({
		router,
		render: h => h(App, {
			props: { IS_GH_PAGES }
		}),
	});

	return { app, router };
};
