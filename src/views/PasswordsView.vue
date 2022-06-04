<template>
<div class="container">
  <div class="row justify-content-center">
    <h2>Create or update new password</h2>
  </div>

  <div class="row justify-content-center">
    <b-alert v-model="error" variant="danger" dismissible>Request failed</b-alert>
    <b-alert v-model="successful" variant="success" dismissible>Request successful!</b-alert>
  </div>

  <div class="row justify-content-center">
    <b-form @submit.prevent="onCreate" autocomplete="off" inline>
      <label class="sr-only" for="create-form-input-website">Website</label>
      <b-form-input
        id="create-form-input-website"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="URL related to password"
        v-model="createForm.website"
        required
        autocomplete="off"
      ></b-form-input>

      <label class="sr-only" for="create-form-input-username">Username</label>
      <b-form-input
        class="mb-2 mr-sm-2 mb-sm-0"
        id="create-form-input-username"
        placeholder="Username"
        v-model="createForm.username"
        required
        autocomplete="off"
      ></b-form-input>

      <label class="sr-only" for="create-form-input-password">Password</label>
      <b-form-input
        class="mb-2 mr-sm-2 mb-sm-0"
        id="create-form-input-password"
        placeholder="Password"
        type="password"
        v-model="createForm.password"
        required
        autocomplete="off"
      ></b-form-input>


      <b-button type="submit" variant="primary">Save</b-button>
      <b-button @click="onUpdate" type="button" variant="warning">Update</b-button>
    </b-form>
  </div>

  <div class="row justify-content-center mt-4">
    <h2>Retrieve or delete a certain password</h2>
  </div>
  <div class="row justify-content-center">
    <b-form @submit.prevent="onRetrieveSingle" autocomplete="off" inline>
      <label class="sr-only" for="retrieve-single-form-input-website">Website</label>
      <b-form-input
        id="retrieve-single-form-input-website"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="URL related to password"
        v-model="retrieveSingleForm.website"
        required
        autocomplete="off"
      ></b-form-input>

      <label class="sr-only" for="retrieve-single-form-input-username">Username</label>
      <b-form-input
        class="mb-2 mr-sm-2 mb-sm-0"
        id="retrieve-single-form-input-username"
        placeholder="Username"
        v-model="retrieveSingleForm.username"
        required
        autocomplete="off"
      ></b-form-input>

      <b-button type="submit" variant="primary">Retrieve</b-button>
      <b-button @click="onDelete" type="button" variant="danger">Delete</b-button>
    </b-form>
  </div>

  <div class="row justify-content-center mt-4">
    <h2>Retrieve passwords from a webpage</h2>
  </div>
  <div class="row justify-content-center">
    <b-form @submit.prevent="onRetrieveSome" autocomplete="off" inline>
      <label class="sr-only" for="retrieve-some-form-input-website">Website</label>
      <b-form-input
        id="retrieve-some-form-input-website"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="URL related to password"
        v-model="retrieveSomeForm.website"
        required
        autocomplete="off"
      ></b-form-input>

      <b-button type="submit" variant="primary">Retrieve</b-button>
    </b-form>
  </div>

  <div class="row justify-content-center mt-4">
    <h2>Download all passwords</h2>
  </div>
  <div class="row justify-content-center">
    <b-form @submit.prevent="onRetrieveAll" autocomplete="off" inline>
      <label class="sr-only" for="retrieve-all-form-input-website">Website</label>
      <b-form-input
        id="retrieve-all-form-input-website"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="TOTP code"
        v-model="retrieveAllForm.totp"
        required
        autocomplete="off"
      ></b-form-input>

      <b-button type="submit" variant="primary">Retrieve</b-button>
    </b-form>
  </div>


  <b-modal v-model="passwordRetrieved" id="modal-password" centered title="Your password">
    <p class="my-4">{{retrievedPassword}}</p>
    <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="retrievedPassword=''; passwordRetrieved=false"
          >
            Close
          </b-button>
        </div>
      </template>
  </b-modal>
  <b-modal v-model="passwordsRetrieved" id="modal-passwords" centered :title="'Passwords from ' + retrieveSomeForm.website">
    <b-table striped hover :items="retrievedPasswords"></b-table>
    <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="retrievedPasswords=[]; passwordsRetrieved=false"
          >
            Close
          </b-button>
        </div>
      </template>
  </b-modal>
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
      },
      retrieveSingleForm: {
        website: 'www.google.es',
        username: 'asdf',
      },
      retrieveSomeForm: {
        website: 'www.google.es',
      },
      retrieveAllForm: {
        totp: '',
      },
      retrievedPassword: '',
      retrievedPasswords: [],
      passwordRetrieved: false,
      passwordsRetrieved: false,
    }
  },
  methods: {
    async onCreate() {
      this.error = false;
      
      const encryptedPassword = await Crypt.encryptAES(this.createForm.password, this.$store.state.user.dataKey);
      const encodedPassword = Crypt.encodeBase64(encryptedPassword);
      const signature = await Crypt.signRSA(encodedPassword, this.$store.state.user.privateKey);
      const encodedSignature = Crypt.encodeBase64(signature);

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/' + this.createForm.website, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
        },
        body: JSON.stringify({
          username: this.createForm.username,
          password: encodedPassword,
          signature: encodedSignature,
        }),
      });
      if (res.ok) {
        this.successful = true;
      } else {
        this.error = true;
      }
    },
    async onRetrieveSingle() {
      this.error = false;
      this.successful = false;

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/' + this.retrieveSingleForm.website + '/' + this.retrieveSingleForm.username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
        },
      });
      if (res.ok) {
        const json = await res.json();
        const decodedPassword = Crypt.decodeBase64(json.password);
        const decryptedPassword = await Crypt.decryptAES(decodedPassword, this.$store.state.user.dataKey);
        const decodedSignature = Crypt.decodeBase64(json.signature);
        const verified = await Crypt.verifyRSA(json.password, decodedSignature, this.$store.state.user.publicKey);
        if (verified) {
          this.retrievedPassword = decryptedPassword;
          this.passwordRetrieved = true;
        } else {
          this.error = true;
        }
      } else {
        this.error = true;
      }
    },
    async onRetrieveSome() {
      this.error = false;
      this.successful = false;

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/' + this.retrieveSomeForm.website, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
        },
      });
      if (res.ok) {
        const json = await res.json();
        this.retrievedPasswords = [];
        for (let [username, passObj] of Object.entries(json)) {
          const decodedPassword = Crypt.decodeBase64(passObj.password);
          const decryptedPassword = await Crypt.decryptAES(decodedPassword, this.$store.state.user.dataKey);
          const decodedSignature = Crypt.decodeBase64(passObj.signature);
          const verified = await Crypt.verifyRSA(passObj.password, decodedSignature, this.$store.state.user.publicKey);
          if (verified) {
            this.retrievedPasswords.push({
              username: username,
              password: decryptedPassword,
            });
          } else {
            this.retrievedPasswords.push({
              username: username,
              password: '<<<PASSWORD INTEGRITY CHECK FAILED>>>',
            });
          }
        }
        this.passwordsRetrieved = true;
      } else {
        this.error = true;
      }
    },
    async onRetrieveAll() {
      this.error = false;
      this.successful = false;

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
          'X-Totp': this.retrieveAllForm.totp,
        },
      });
      if (res.ok) {
        const json = await res.json();
        for (let [website, websiteObj] of Object.entries(json)) {
          for (let [username, passwordObj] of Object.entries(websiteObj)) {
            const decodedPassword = Crypt.decodeBase64(passwordObj.password);
            const decryptedPassword = await Crypt.decryptAES(decodedPassword, this.$store.state.user.dataKey);
            const decodedSignature = Crypt.decodeBase64(passwordObj.signature);
            const verified = await Crypt.verifyRSA(passwordObj.password, decodedSignature, this.$store.state.user.publicKey);
            if (verified) {
              json[website][username] = decryptedPassword;
            } else {
              json[website][username] = '<<<PASSWORD INTEGRITY CHECK FAILED>>>';
            }
          }
        }
        let text = JSON.stringify(json);
        let filename = 'passwords.json';
        let element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);   
      } else {
        this.error = true;
      }
    },
    async onDelete() {
      this.error = false;
      this.successful = false;

      const signature = await Crypt.signRSA(this.retrieveSingleForm.website + this.retrieveSingleForm.username, this.$store.state.user.privateKey);
      const encodedSignature = Crypt.encodeBase64(signature);

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/' + this.retrieveSingleForm.website + '/' + this.retrieveSingleForm.username, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
        },
        body: JSON.stringify({
          signature: encodedSignature,
        }),
      });
      if (res.ok) {
        this.successful = true;
      } else {
        this.error = true;
      }
    },
    async onUpdate() {
      this.error = false;
      this.successful = false;

      const encryptedPassword = await Crypt.encryptAES(this.createForm.password, this.$store.state.user.dataKey);
      const encodedPassword = Crypt.encodeBase64(encryptedPassword);

      const signature = await Crypt.signRSA(encodedPassword, this.$store.state.user.privateKey);
      const encodedSignature = Crypt.encodeBase64(signature);

      const res = await fetch(process.env.VUE_APP_REMOTE_HOST + '/passwords/' + this.createForm.website + '/' + this.createForm.username, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.user.token,
        },
        body: JSON.stringify({
          password: encodedPassword,
          signature: encodedSignature,
        }),
      });
      if (res.ok) {
        this.successful = true;
      } else {
        this.error = true;
      }
    },
  }
}
</script>