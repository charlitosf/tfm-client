import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Crypt from '@/lib/crypt.js'


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
        doNothing() {

        },
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
            const passHash = await Crypt.digestSHA512(user.password);
            let loginK = passHash.slice(0, 32);
            let dataKey = passHash.slice(32);

            let loginKey = await Crypt.createKeyFromRaw(loginK);
            dataKey = await Crypt.createKeyFromRaw(dataKey);
            loginKey = await Crypt.exportKey(loginKey);
            
            const keyPair = await Crypt.generateRSAKeyPair()
            const encPubKey = await Crypt.exportRSAPublicKey(keyPair.publicKey);
            const ciphPrivKey = await Crypt.encodeRSAPrivateKey(keyPair.privateKey, dataKey);
            try {
                const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/auth/signup", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: loginKey,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        publicKey: encPubKey,
                        privateKey: ciphPrivKey,
                    })
                })
                const r = await response.json();
                commit('doNothing');
                return r.otp;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    },
})