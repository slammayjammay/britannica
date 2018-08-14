import Vue from 'vue';
import Router from 'vue-router';
import SearchQueryComponent from './js/components/SearchQueryComponent.vue';
import TopicViewComponent from './js/components/TopicViewComponent.vue';

Vue.use(Router);

export default () => {
	return new Router({
		mode: 'history',
		routes: [
			{ path: '/', component: SearchQueryComponent },
			{ path: '/:category/:topic', component: TopicViewComponent },
			{ path: '/:category/:topic/:subpage', component: TopicViewComponent }
		]
	});
};
