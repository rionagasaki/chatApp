<!-- view -->
<template>
  <v-app>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <v-card
            class="allChat"
            elevation="2"
            max-width="1000"
            color="grey lighten-5"
          >
            <div style="background-color: orange">
              <v-card-title
                ><v-avatar><img :src="user1 ? user1.avatar : ''" /></v-avatar
                >{{ user1 ? user1.email : 'Nouser is selected.' }}</v-card-title>
            </div>
            <v-divider></v-divider>
            <div style="background-color: #7da4cd">
              <v-card-text
                ><v-row>
                  <v-col cols="12">
                    <v-container
                      ref="scrollTarget"
                      style="height: 400px"
                      class="chatContent"

                    >
                      <div v-if="user1">
                        <v-row v-for="(oneChat, i) in chat" :key="i" dense>
                          <v-col>
                            <div
                              class="balloon6"
                              v-if="oneChat.sendUser == user1.email"
                            >
                              <div class="chatting">
                                <div class="says">
                                  <p>{{ oneChat.message }}</p>
                                </div>
                              </div>
                            </div>

                            <div
                              class="mycomment"
                              v-if="oneChat.sendUser != user1.email"
                            >
                              <p>{{ oneChat.message }}</p>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </v-container>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-text-field
                    autofocus
                    label="message"
                    v-model="message"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-alert type="error" v-if="warn">
                送信するユーザーを選択してください。
              </v-alert>
              <v-btn class="info" small @click="sendMessage">
                <v-icon>mdi-play</v-icon>送信
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<!-- viewModel -->
<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'home',

  data() {
    return {
      message: '',
      name: '',
      warn: false,
      talkUser: '',
      checked: true,
      snapshot: ()=>{}
    }
  },

  created(){
    if (process.client) {
      this.$store.dispatch('chat/fetchLoginUser').then(async (user)=>{
          this.$store.commit('chat/deleteChat')
          await this.$store.dispatch('chat/fetchChat', {
            user1: user.email,
            user2: this.user1 ? this.user1.email : '',
          })
      })
    }
  },

  mounted() {
     if (this.user1 == null) {
      return
    }
    this.snapshot = null
    this.$store.dispatch('chat/fetchLoginUser').then(async (user)=>{
    await this.$store.dispatch('chat/realTimeListener',{
      user,
      user1: this.user1,
    })
    }).then((snapshot)=>{
      this.snapshot = snapshot
      console.log("aaa!!a")
    })
  },

  computed: {
    ...mapGetters('chat', ['chat']),
    ...mapGetters('chat', ['user1']),
  },

  methods: {
    sendMessage() {
      if (this.message === '') {
        return
      }
     this.$store.dispatch('chat/fetchLoginUser').then(async (user)=>{
       const messageData = {
              user: [user.email, this.user1.email],
              message: this.message,
            }
        if (user && this.user1) {
          try {
            await this.$store.dispatch('chat/setChat',{
              user,
              messageData
            }).then(()=>{
               this.warn = false
               this.message = ''
            })
          } catch (e) {
            console.error(e)
            this.warn = true
          }
        }
     })
    },
  },

  beforeDestroy() {
    this.$store.commit('chat/userliset')
    this.$store.commit('chat/deleteChat')
    this.snapshot()
  },
}
</script>

<style>
</style>