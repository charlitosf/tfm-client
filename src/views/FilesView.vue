<template>
<div class="container">
  <div class="row justify-content-center">
    <h2>Upload file</h2>
  </div>
  <div class="row justify-content-center">
    <label class="mb-2 mr-sm-2 mb-sm-0" for="upload-input">File to upload</label>
    <input
      id="upload-input"
      class="mr-sm-2 mb-sm-0"
      type="file"
      ref="file"
      @change="onUpload"
    >
  </div>
  <div class="row justify-content-center">
    <b-alert v-model="error" variant="danger" dismissible>Request failed</b-alert>
    <b-alert v-model="successful" variant="success" dismissible>Request successful!</b-alert>
  </div>

  <div class="row justify-content-center mt-4">
    <h2>Stored files</h2>
  </div>
  <div class="row justify-content-center">
    <b-button @click="onRetrieveFiles">Reload</b-button>
  </div>
  <b-table striped hover :items="filenames" :fields="fields">
    <template #cell(actions)="data">
      <b-button
        variant="primary"
        @click="onRetrieveFile(data.item.name)"
      >
        Retrieve
      </b-button>
      <b-button
        variant="danger"
        @click="onDeleteFile(data.item.name)"
        class="ml-2"
      >
        Delete
      </b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import Crypt from '@/lib/crypt';

export default {
  data() {
    return {
      filenames: [],
      fields: [{
        key: 'name',
        label: 'Name',
        sortable: true,
      }, {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        class: 'actionsColumn',
      }],
      filenamesRetrieved: false,
      successful: false,
      error: false,
    }
  },
  methods: {
    download(data, filename) {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);     
    },
    async onUpload() {
      this.successful = false;
      this.error = false;

      const file = this.$refs.file.files[0]
      if (!file) {
        return
      }
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      // reader.readAsArrayBuffer(file);
      
      reader.onload = async (evt) =>  {
        const text = evt.target.result;
        // Encrypt and encode file content
        const encrypted = await Crypt.encryptAES(text, this.$store.state.user.dataKey);
        // const encrypted = await Crypt.encryptAESBuffer(new Uint8Array(text), this.$store.state.user.dataKey);
        const encoded = Crypt.encodeBase64(encrypted);

        // Upload encoded file to server
        try {
          const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/files/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.$store.state.user.token,
            },
            body: JSON.stringify({
                name: file.name,
                content: encoded,
            })
          })
          if (response.ok) {
            this.onRetrieveFiles();
            this.successful = true;
          } else {
            this.error = true;
          }
        } catch (error) {
          this.error = true;
        }
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async onRetrieveFiles() {
      this.error = false;
      this.successful = false;

      try {
        const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/files/", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.$store.state.user.token,
          },
        })
        if (response.ok) {
          this.filenames = await response.json();
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
    async onRetrieveFile(filename) {
      this.error = false;
      this.successful = false;

      try {
        const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/files/" + filename, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.$store.state.user.token,
          },
        })
        if (response.ok) {
          const json = await response.json();
          const decoded = Crypt.decodeBase64(json.content);
          const decrypted = await Crypt.decryptAES(decoded, this.$store.state.user.dataKey);
          // const decrypted = await Crypt.decryptAESBuffer(decoded, this.$store.state.user.dataKey);
          this.download(decrypted, json.name);
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
    async onDeleteFile(filename) {
      this.error = false;
      this.successful = false;

      try {
        const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/files/" + filename, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.$store.state.user.token,
          },
        })
        if (response.ok) {
          this.onRetrieveFiles();
          this.successful = true;
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
  },
  mounted: function() {
    this.onRetrieveFiles();
  },
}
</script>

<style>
.actionsColumn {
  width: 200px;
}
</style>