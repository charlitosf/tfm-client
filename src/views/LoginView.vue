<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1>Login</h1>
    </div>

    <div>
      <b-alert v-model="error" variant="danger" dismissible>Login failed</b-alert>
    </div>
    
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.username"
          placeholder="Enter username"
          autocomplete="username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          placeholder="Enter password"

          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Token TOTP:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.totp"
          autocomplete="totp"
          placeholder="Enter TOTP"

          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    <b-button class="mt-2" type="button" to="/signup" variant="info">Signup</b-button>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          username: 'charlitosf',
          password: '',
          totp: ''
        },
        error: false,
      }
    },
    methods: {
      async onSubmit(event) {
        event.preventDefault()

        const res = await this.$store.dispatch('login', this.form)
        if (res) {
          this.$router.push('/')
        } else {
          this.error = true
        }
      },
    }
  }
</script>
