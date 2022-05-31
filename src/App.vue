<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">ISS</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#/passwords">Contraseñas</b-nav-item>
        <b-nav-item href="#/files">Archivos</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            User
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <component :is="currentView"></component>
</div>
</template>

<script>

import HomePage from './pages/HomePage.vue'
import Passwords from './pages/PasswordsPage.vue'
import Files from './pages/FilesPage.vue'
import NotFound from './pages/NotFound.vue'

const routes = {
  '/': {
    component: HomePage
  },
  '/passwords': {
    component: Passwords
  },
  '/files': {
    component: Files
  },
}

export default {
  name: 'ISS',
  data() {
    return {currentRoute: window.location.pathname}
  },
  computed: {
    ViewComponent () {
      const route = routes[this.currentRoute]
      return route ? route.component : NotFound
    }
  },
  render (h) {
    return h(this.ViewComponent)
  }
}
</script>

<style>

</style>
