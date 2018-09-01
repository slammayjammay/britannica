import Vue from 'vue';
import Router from 'vue-router';
import TopicViewComponent from './js/components/TopicViewComponent.vue';

Vue.use(Router);

export default () => {
	return new Router({
		mode: 'history',
		routes: [
			{ path: '*', component: TopicViewComponent }
		]
	});
};
