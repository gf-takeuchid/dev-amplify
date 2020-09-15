<template>
  <div id="app" class="container">
    <b-navbar>
      <template slot="start">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">Chat</b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/about' }">About</b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="router-link" :to="{ path: '/signin' }">Sign In</b-navbar-item>
        <b-navbar-item>
          <amplify-sign-out button-text="ログアウト"></amplify-sign-out>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import store from "@/store";

export default {
  name: 'App',
  created() {
    onAuthUIStateChange((authState, authData) => {
      if (authState === AuthState.SignedIn) {
        store.commit("setUser", authData);
        this.$router.push({ path: "/" }).catch(err => {console.log(err)});
      } else if(authState === AuthState.SignedOut) {
        store.commit("setUser", null);
        this.$router.push({ path: "/signin" });
      }
    })
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}
</script>