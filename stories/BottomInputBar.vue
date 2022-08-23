<template>
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
    <v-btn class="info" small @click="sendMessage" style="sendButtonColor">
      <v-icon>mdi-play</v-icon>{{ sendButtonLabel }}
    </v-btn>
  </v-card-text>
</template>

<script>
export default {
  name: 'BottomInputBar',

  props: {
    sendButtonLabel: {
      type: String,
      required: true,
      default: '送信',
    },
    sendButtonColor:{
      type:String
    }
  },
  data() {
    return {
      message: '',
    }
  },
  computed: {
    style(){
      return{
        
      }
    }
  },
  methods: {
    sendMessage() {
      this.$emit('sendMessage', this.message)
    },
  },
}
</script>

<style>
</style>