<template>
<div class="container">
    <div class="row justify-content-center">
      <h1>Signup</h1>
    </div>

    <div>
      <b-alert v-model="error" variant="danger" dismissible>Signup failed</b-alert>
      <b-alert v-model="successful" variant="success" dismissible>Signup successful!</b-alert>
    </div>

    
    <b-form @submit="onSubmit" v-if="!qrImagePath">
      <b-form-group id="input-group-3" label="Full name:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.name"
          placeholder="Enter your full name"
          autocomplete="name"
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
          autocomplete="email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Username:" label-for="input-2" description="Used to identify you">
        <b-form-input
          id="input-2"
          v-model="form.username"
          placeholder="Enter username"
          autocomplete="username"
          required
        ></b-form-input>
      </b-form-group>

      

      <b-form-group id="input-group-4" label="Password:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.password"
          placeholder="Enter password"
          type="password"
          autocomplete="password"
          required
        ></b-form-input>
      </b-form-group>


      <b-button type="submit" variant="primary">Sign Up</b-button>
    </b-form>

    <div v-if="qrImagePath" class="row justify-content-center">
      <qrcode-vue :size="400" :value="qrImagePath" level="H" />
      <h2 class="text-center">Signup successful - Scan the QR code with your favorite 2FA app</h2>
    </div>
    <b-button class="mt-2" @click="backToLogin">Back to login</b-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import QrcodeVue from 'qrcode.vue'

export default {
  data() {
    return {
      form: {
        email: 'carlos@ferrus.es',
        name: 'Carlos Ferrus',
        username: 'charlitosf',
        password: '',
      },
      qrImagePath: '',
      error: false,
      successful: false,
    }
  },
  methods: {
    ...mapActions([
      'signup',
    ]),
    async onSubmit(event) {
      event.preventDefault()
      const res = await this.signup(this.form)
      if (res) {
        this.qrImagePath = res;
        this.successful = true;
        this.error = false;
      } else {
        this.successful = false;
        this.error = true
      }
    },
    backToLogin() {
      this.$router.replace('/login')
    }
  },
  components: {
    QrcodeVue
  }
}
</script>
