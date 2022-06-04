<template>
<div class="container">
  <div class="row justify-content-center">
    <b-alert v-model="error" variant="danger" dismissible>Request failed</b-alert>
  </div>
  <div class="row justify-content-center">
    <h1>Your profile</h1>
  </div>
  <div class="row">
    Name: {{ name }}
  </div>
  <div class="row">
    Username: {{ username }}
  </div>
  <div class="row">
    Email: {{ email }}
  </div>

  <div class="row justify-content-center mt-4">
    <h2>Delete User</h2>
  </div>
  <div class="row justify-content-center">
    <b-form @submit.prevent="onDeleteUser" autocomplete="off" inline>
      <label class="sr-only" for="delete-form-input-user">Totp</label>
      <b-form-input
        id="delete-form-input-user"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="TOTP code"
        v-model="deleteForm.totp"
        required
        autocomplete="off"
      ></b-form-input>

      <b-button type="submit" variant="danger">Delete</b-button>
    </b-form>
  </div>
  <div class="row justify-content-center mt-4">
    <h2>Change password</h2>
  </div>
  <div class="row justify-content-center">
    <b-form @submit.prevent="onUpdateUser" autocomplete="off" inline>
      <label class="sr-only" for="update-form-input-password">New password</label>
        <b-form-input
          id="update-form-input-password"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="New password"
          v-model="updateForm.newPassword"
          required
          autocomplete="off"
          type="password"
      ></b-form-input>
      <label class="sr-only" for="update-form-input-totp">Totp</label>
      <b-form-input
        id="update-form-input-totp"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="TOTP code"
        v-model="updateForm.totp"
        required
        autocomplete="off"
      ></b-form-input>

      <b-button type="submit" variant="warning">Change</b-button>
    </b-form>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProfileView',
  data() {
    return {
      name: this.$store.state.user.name,
      username: this.$store.state.user.username,
      email: this.$store.state.user.email,
      error: false,
      deleteForm: {
        totp: '',
      },
      updateForm: {
        newPassword: '',
        totp: '',
      }
    };
  },
  methods: {
    async onDeleteUser() {
      this.error = false;
      
      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/users/' + this.username, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
          'X-Totp': this.deleteForm.totp,
        },
      });
      if (res.ok) {
        this.logout();
        this.$router.replace('/login');
      } else {
        this.error = true;
      }
    },
    async onUpdateUser() {
      this.error = false;
      
      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/users/' + this.username, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
          'X-Totp': this.updateForm.totp,
        },
        body: JSON.stringify({
          password: this.updateForm.newPassword,
        }),
      });
      if (res.ok) {
        this.logout();
        this.$router.replace('/login');
      } else {
        this.error = true;
      }
    },
    ...mapActions([
      'logout',
    ]),
  },
}
</script>