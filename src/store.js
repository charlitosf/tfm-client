import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
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
        async login({ commit }, credentials) {
            try {
                const response = await Vue.axios.post(process.env.VUE_APP_REMOTE_HOST, credentials)
                console.log(response);
                commit('setUser', response.data)
                return response.data
            } catch (error) {
                console.log(error);
                throw error
            }
        }
    },
})