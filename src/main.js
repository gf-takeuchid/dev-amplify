import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconPack: 'fas',
});
Amplify.configure(awsconfig);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
