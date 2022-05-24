<template>
<v-app>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
   <ul v-for="user in users" :key="user.avatar">
     <li style="list-style: none; margin-bottom: 40px;"><v-avatar size=80>
      <img :src="user.avatar">
    </v-avatar>{{user.email}} <v-row justify="center">
    <v-btn color="blue" class="mt-n10" @click="talk(user)" dark>Talk</v-btn>
    </v-row></li>
   </ul>
  </v-card>
</v-app>
</template>
<script>

import {  getAuth, onAuthStateChanged } from 'firebase/auth'
import { mapGetters } from 'vuex';
  export default {
    data () {
      return {
        search: '',
        headers: [
          {
            text: 'userName',
            align: 'start',
            filterable: true,
            value: 'name',
          },
        ],
        
      }
    },
    created(){
      const auth = getAuth()
        onAuthStateChanged(auth, async user=>{
            if (user){
              await this.$store.dispatch('chat/addUser', user.email);
              
            }else{
              console.log('no user')
            }
        })
    },

    computed:{
     ...mapGetters('chat',['users']),
    },
    methods:{
      add(){
        console.log(this.users)
      },
      async talk(user){
        console.log(user)
        // talkするユーザーデータを持ってくる。
        await this.$store.dispatch('chat/setUser',user)
        this.$router.push('home')
      },
      
    }
  }
</script>


<style>

</style>