<template>
  <v-app id="inspire">
    <v-system-bar color="orange darken-3" app>
      <v-spacer></v-spacer>
    </v-system-bar>

    <v-navigation-drawer
      v-model="drawer"
      color="orange darken-1"
      app
    >
      <v-sheet
        color="orange lighten-3"
        class="pa-4"
      >
        <v-avatar
          class="mb-4"
          color="grey darken-1"
          size="64"
        ><v-img :src="avatar"></v-img></v-avatar>

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
    </v-main>
    <v-footer> 
      <v-container>
        <v-row>
          <v-col cols="6" class="mx-auto">
            <v-spacer></v-spacer>
            <v-text-field label="message" class="mb-0"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>



<script>
import { signOut, getAuth } from 'firebase/auth'
import { mapGetters } from 'vuex'

export default {
  layout: 'home',
  data(){
    return{
      drawer: null,
      links: [

        ['mdi-send', 'Send'],
        ['mdi-logout', 'ログアウト'],
      ],
    }
  },
 computed: {
   ...mapGetters(['avatar']),
   ...mapGetters(['name'])
 },
 methods:{
   async signOut(text){
     if(text !== 'Send'){
       const auth = getAuth()
       await signOut(auth).then(()=>{
        this.$router.push('/')
        
       }).catch((e)=>{
        console.error(e)
       })
       
     
   }
 }
}
}

</script>

<style>

</style>