import Vue from "vue";
import VueRouter from "vue-router";
import Message from "@/components/Message";
import SignIn from "@/components/SignIn.vue";
import { Auth } from "aws-amplify";
import store from "@/store/index.js";

Vue.use(VueRouter);

let user;

function getUser() {
  return Auth.currentAuthenticatedUser()
    .then(data => {
      if (data && data.signInUserSession) {
        store.commit("setUser", data.username);
        store.commit("setAuthState", true);
        return data;
      }
    })
    .catch(() => {
      store.commit("setUser", null);
      store.commit("setAuthState", false);
      return null;
    });
}

const routes = [
  {
    path: "/",
    name: "message",
    component: Message,
    meta: { requireAuth: true }
  },
  {
    path: "/signin",
    name: "signin",
    component: SignIn
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    user = await getUser();
    if (!user) {
      return next({
        path: "/signin"
      });
    }
    return next();
  }
  return next();
});

export default router;
