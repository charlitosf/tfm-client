<template>
<div class="container">
    <div class="row justify-content-center">
      <h1>Signup</h1>
    </div>
    
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-3" label="Full name:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.name"
          placeholder="Enter your full name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Username:" label-for="input-2" description="Used to identify you">
        <b-form-input
          id="input-2"
          v-model="form.username"
          placeholder="Enter username"
          required
        ></b-form-input>
      </b-form-group>

      

      <b-form-group id="input-group-4" label="Password:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.password"
          placeholder="Enter password"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Sign Up</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        form: {
          email: '',
          name: '',
          username: '',
          password: '',
        },
      }
    },
    methods: {
      ...mapActions([
        'signup',
      ]),
      onSubmit(event) {
        event.preventDefault()
        
        this.signup(this.form)
      }
    }
  }
</script>
