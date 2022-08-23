import vuetify from '../plugins/vuetify'
import MyButton from './Custom'

export default {
  component: MyButton,
  title: 'MyComponents/MyButton',
  argTypes: {
    click: { action: 'click '},
  }
}

const Template = (args, { argTypes }) => ({
  components: { MyButton },
  props: Object.keys(argTypes),
  // vuetifyインスタンスを登録する
  vuetify,
  template: '<my-button v-bind="$props" @click="click" />',
})

export const Default = Template.bind({})
Default.args = {
  text: 'できた！'
}