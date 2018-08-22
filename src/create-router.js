import Vue from 'vue';
import Router from 'vue-router';
import GHPagesComponent from './js/components/GHPagesComponent.vue';

Vue.use(Router);

export default () => {
	return new Router({
		mode: 'history',
		routes: [
			{ path: '*', component: GHPagesComponent }
		]
	});
};
