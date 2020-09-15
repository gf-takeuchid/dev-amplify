import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Vue.config.productionTip = false;

Amplify.configure(awsconfig);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
