import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import aws_exports from "./aws-exports";

Vue.config.productionTip = false;

Amplify.configure(aws_exports);
Vue.use(AmplifyPlugin, AmplifyModules);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");