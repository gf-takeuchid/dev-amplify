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
