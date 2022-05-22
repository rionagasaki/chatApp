<template>
  <v-app>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <v-card
            class="mx-auto my-10"
            elevation="2"
            max-width="1000"
            color="grey lighten-5"
          >
            <div style="background-color: orange">
              <v-card-title
                ><v-avatar><img :src="user1 ? user1.avatar : ''" /></v-avatar
                >{{ user1 ? user1.email : 'Nouser is selected.' }}</v-card-title
              >
            </div>
            <v-divider></v-divider>
            <div style="background-color: #7da4cd">
              <v-card-text
                ><v-row>
                  <v-col cols="12">
                    <v-container
                      ref="scrollTarget"
                      style="height: 400px"
                      class="overflow-y-auto"
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

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  addDoc,
  setDoc,
  collection,
  doc,
  onSnapshot,
  query
} from 'firebase/firestore'
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

  created() {
    if (process.client) {
      const auth = getAuth()
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.$store.commit('chat/deleteChat')
          await this.$store.dispatch('chat/fetchChat', {
            user1: user.email,
            user2: this.user1 ? this.user1.email : '',
          })
        }
      })
    }
  },

  mounted() {
    if (this.user1 == null) {
      return
    }
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
         const userData = {
          user1 : user.email,

          user2 : this.user1 ? this.user1.email : ''}
        
        const db = getFirestore()
        const q = query(collection(db, "chat", userData.user1 + userData.user2, "message"));
        this.snapshot = null
        this.snapshot = onSnapshot(q, (querySnapshot) => {
            
            querySnapshot.docChanges().forEach( (change) => {
                if (change.type === "added") {
                    
                    console.log("New Message: ", change.doc.data().message);
                    const chatData = {
                        message: change.doc.data().message,
                        sendUser: change.doc.data().sendUser
                    }
                    this.$store.commit('chat/addChat', chatData);
                }

            }) 

        })

       
        
    
        
      }
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

      const auth = getAuth()
      onAuthStateChanged(auth, async (user) => {
        if (user && this.user1) {
          try {
            const messageData = {
              user: [user.email, this.user1.email],
              message: this.message,
            }
            //  チャットが追加される。
            if (messageData.message === '') {
              return
            }
            const db = getFirestore()
            if (user) {
              await setDoc(
                doc(db, 'chat', messageData.user[0] + messageData.user[1]),
                {
                  users: messageData.user,
                }
              )
              await setDoc(
                doc(db, 'chat', messageData.user[1] + messageData.user[0]),
                {
                  users: messageData.user,
                }
              )

              await addDoc(
                collection(
                  db,
                  'chat',
                  messageData.user[0] + messageData.user[1],
                  'message'
                ),
                {
                  message: messageData.message,
                  sendUser: user.email,
                  sendTime: new Date(),
                }
              )
              await addDoc(
                collection(
                  db,
                  'chat',
                  messageData.user[1] + messageData.user[0],
                  'message'
                ),
                {
                  message: messageData.message,
                  sendUser: user.email,
                  sendTime: new Date(),
                }
              )
            }
            
            this.warn = false
            this.message = ''
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