<template>
  <v-app>
    <v-system-bar color="orange lighten-1" app>
      <v-spacer></v-spacer>
    </v-system-bar>

    <v-navigation-drawer v-model="drawer" color="orange lighten-1" app>
      <v-sheet color="orange lighten-3" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64"
          ><v-img :src="avatar"></v-img
        ></v-avatar>

        <div>{{ name }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text] in links"
          :key="icon"
          @click="signOut(text)"
          link
          dark
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
    <chat-display />
    </v-main>
  </v-app>
</template>

<script>
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'
import { mapGetters } from 'vuex'
import chatDisplay from './ChatDisplay.vue'


export default {
  components: { chatDisplay },
  layout: 'home',

  data() {
    return {
      drawer: null,
      links: [
        ['mdi-send', 'ユーザー'],
        ['mdi-logout', 'ログアウト'],
      ],
      unsubscribe: null,
    }
  },
  
  created() {
    const auth = getAuth()

    if (process.client) {
      this.unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await this.$store.dispatch('addUser', user.email)
        }
      })
    }
  },
  
  computed: {
    ...mapGetters(['avatar']),
    ...mapGetters(['name']),
  },

  methods: {
    async signOut(text) {
      if (text === 'ログアウト') {
        const auth = getAuth()
        
        await signOut(auth)
          .then(() => {
            this.$store.commit('deleteUser')
            this.$router.push('/')
          })
          .catch((e) => {
            console.error(e)
          })
      } else {
        this.$router.push('user')
      }
    },
  },

  beforeDestroy() {
  
    this.$store.commit('chat/deleteChat')
    
    this.$store.commit('chat/userliset')
    this.$store.commit('chat/talkuserliset')
    this.unsubscribe()
  },
}
</script>

<style>

</style>