<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Chat</router-link> |
      <router-link to="/signin">Sign In</router-link> |
      <router-link to="/about">About</router-link>
    </div>
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