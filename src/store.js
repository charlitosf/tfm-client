import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import CryptoES from 'crypto-es'


export default new Vuex.Store({
    state: {
        user: {
            username: '',
            name: '',
            email: '',
            token: '',
            privateKey: '',
            publicKey: '',
        }
    },
    getters: {
        isAuthenticated() {
            return this.$store.state.user.token !== '';
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        unsetUser(state) {
            state.user = {
                name: '',
                email: '',
                token: '',
                privateKey: '',
                publicKey: '',
            }
        }
    },
    actions: {
        async signup({ commit }, user) {
            const hash = CryptoES.SHA256("xdd")
            const hash2 = Array.from(new Uint8Array(await window.crypto.subtle.digest('SHA-256', (new TextEncoder()).encode("xdd")))).map(b => b.toString(16).padStart(2, '0')).join('')
            commit('setUser', user)
            console.log(hash.toString());
            console.log(hash2);
            let keyPair = await window.crypto.subtle.generateKey(
                {
                  name: "RSA-OAEP",
                  modulusLength: 4096,
                  publicExponent: new Uint8Array([1, 0, 1]),
                  hash: "SHA-256"
                },
                true,
                ["encrypt", "decrypt"]
              );
            let publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
            let privateKey = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
            console.log(publicKey);
            console.log(privateKey);
            // try {
            //     const response = await Vue.axios.post(process.env.VUE_APP_REMOTE_HOST, {
            //         password: loginKey,
            //         username: user.username,
            //         name: user.name,
            //         email: user.email,
            //         publicKey: encodedPublicKey,
            //         privateKey: encryptedPrivateKey,
            //     })
            //     console.log(response);
            //     commit('setUser', response.data)
            //     return response.data
            // } catch (error) {
            //     console.log(error);
            //     throw error
            // }
        }
    },
})