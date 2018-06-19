import Vue from 'vue';
import Router from 'vue-router';
import Distance from '@/components/Distance';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Distance',
      component: Distance
    }
  ]
});
