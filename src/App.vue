<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">ISS</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="this.$store.state.user.token">
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/passwords">Passwords</b-nav-item>
        <b-nav-item to="/files">Files</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" v-if="this.$store.state.user.token">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            {{$store.state.user.name}}
          </template>
          <b-dropdown-item to="/profile">Profile</b-dropdown-item>
          <b-dropdown-item @click="logoutVue">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <router-view/>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import store from '@/store'

export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  store,
  methods: {
    ...mapActions([
      'logout'
    ]),
    async logoutVue() {
      await this.logout()
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss">
</style>
