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
            const hash = CryptoES.SHA3("xdd")
            commit('setUser', user)
            console.log(hash);
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