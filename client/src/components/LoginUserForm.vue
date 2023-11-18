<template>
  <div class="form">
    <h2>Log In</h2>
    <form @submit.prevent="emitLoginUser">
        <input type="email" v-model="userLogin.email" placeholder="Email" required>
        <input type="password" v-model="userLogin.password" placeholder="Password" required>
        <button type="submit">Submit</button>
        <div v-if="errorMessage" class="err">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userLogin = ref({email: '', password: ''});
const emit = defineEmits(['login-user']);

const props = defineProps({
  errorMessage: String
});

const emitLoginUser = () => {
  emit('login-user', userLogin.value);
  userLogin.value = { email: '', password: '' }; // Reset form
};
</script>

<style lang="sass" scoped>
h2 
  margin: 8px 0
.form 
  border: solid 1px #1a1a1a
.err 
  color: red
</style>