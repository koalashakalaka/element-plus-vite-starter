import { createApp } from 'vue';
import { createWebHashHistory, createRouter } from 'vue-router';
import routes from '~pages';

import App from './App.vue';
import '~/styles/index.scss';
import 'element-plus/theme-chalk/src/message.scss';

console.log(routes);

const app = createApp(App);
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

app.use(router);
app.mount('#app');
