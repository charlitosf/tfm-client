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
            dataKey: '',
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
                dataKey: '',
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
                if (response.ok) {
                    const r = await response.json();
                    commit('doNothing');
                    return r.otp;
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        },
        async login({ commit }, credentials) {
            const passHash = await Crypt.digestSHA512(credentials.password);
            let loginK = passHash.slice(0, 32);
            let dataKey = passHash.slice(32);

            let loginKey = await Crypt.createKeyFromRaw(loginK);
            dataKey = await Crypt.createKeyFromRaw(dataKey);
            loginKey = await Crypt.exportKey(loginKey);
            
            try {
                const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/auth/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: loginKey,
                        username: credentials.username,
                        totp: credentials.totp,
                    })
                })
                if (response.ok) {
                    const r = await response.json();
                    const decPublicKey = await Crypt.importRSAPublicKey(r.user.publicKey);
                    const decPrivKey = await Crypt.decodeRSAPrivateKey(r.user.privateKey, dataKey);
                    const user = {
                        username: credentials.username,
                        name: r.user.name,
                        email: r.user.email,
                        token: r.token,
                        privateKey: decPrivKey,
                        publicKey: decPublicKey,
                        dataKey,
                    }
                    commit('setUser', user);
                    return true;
                } else {
                    commit('unsetUser');
                    return false;
                }
            } catch (error) {
                return false;
            }
        },
        async logout({ commit }) {
            const token = this.state.user.token;
            commit('unsetUser');
            try {
                const response = await fetch(process.env.VUE_APP_REMOTE_HOST + "/auth/logout", {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                })
                return response.ok;
            } catch (error) {
                return false;
            }
        }
    },
})