<template>
  <v-btn color="success" @click="$emit('click')">
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    text: {
      type: String,
      default: 'ボタン',
    }
  }
}
</script>