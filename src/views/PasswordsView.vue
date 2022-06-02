<template>
<div class="container">
  <div class="row justify-content-center">
    <h2>Create new password</h2>
  </div>

  <div>
    <b-alert v-model="error" variant="danger" dismissible>Request failed</b-alert>
    <b-alert v-model="successful" variant="success" dismissible>Request successful!</b-alert>
  </div>

  <div @submit="onCreate" class="row justify-content-center">
    <b-form autocomplete="off" inline>
      <label class="sr-only" for="inline-form-input-website">Website</label>
      <b-form-input
        id="inline-form-input-website"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="URL related to password"
        v-model="createForm.website"
        required
        autocomplete="off"
      ></b-form-input>

      <label class="sr-only" for="inline-form-input-username">Username</label>
      <b-form-input
        class="mb-2 mr-sm-2 mb-sm-0"
        id="inline-form-input-username"
        placeholder="Username"
        v-model="createForm.username"
        required
        autocomplete="off"
      ></b-form-input>

      <label class="sr-only" for="inline-form-input-password">Password</label>
      <b-form-input
      class="mb-2 mr-sm-2 mb-sm-0"
      id="inline-form-input-password"
      placeholder="Password"
      type="password"
      v-model="createForm.password"
      required
      autocomplete="off"
    ></b-form-input>

      <b-button type="submit" variant="primary">Save</b-button>
    </b-form>
  </div>

</div>
</template>

<script>
import Crypt from '@/lib/crypt';

export default {
  data() {
    return {
      error: false,
      successful: false,
      createForm: {
        website: 'www.google.es',
        username: 'asdf',
        password: 'asdf'
      }
    }
  },
  methods: {
    async onCreate(event) {
      event.preventDefault();
      this.error = false;
      
      const encryptedPassword = await Crypt.encryptAES(this.createForm.password, this.$store.state.user.dataKey);
      const encodedPassword = Crypt.encodeBase64(encryptedPassword);

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/' + this.createForm.website, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
        },
        body: JSON.stringify({
          username: this.createForm.username,
          password: encodedPassword,
        }),
      });
      if (res.ok) {
        this.successful = true;
      } else {
        this.error = true;
      }
    }
  }
}
</script>