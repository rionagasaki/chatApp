import BottomInputBar from './BottomInputBar.vue'
import vuetify from '../plugins/vuetify'
export default {
    title: 'Chat/Input',
    component: BottomInputBar,
    argTypes:{
        sendButtonColor: { control:'color'}
    }
};

const Template = (args, { argTypes }) => ({
    components: { BottomInputBar },
    props: Object.keys(argTypes),
    vuetify,
    template: '<bottom-input-bar v-bind="$props" @sendMessage="sendMessage" />',
})

export const InputBar = Template.bind({});
InputBar.args = {
    sendButtonLabel: '送信'
}
