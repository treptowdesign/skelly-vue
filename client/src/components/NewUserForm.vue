<template>
  <div class="form">
    <h2>Create New User</h2>
    <form @submit.prevent="emitCreateUser">
        <input type="text" v-model="newUser.name" placeholder="Name" required>
        <input type="email" v-model="newUser.email" placeholder="Email" required>
        <input type="password" v-model="newUser.password" placeholder="Password" required>
        <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const newUser = ref({name: '', email: '', password: ''});
const emit = defineEmits(['create-user']);

const emitCreateUser = () => {
  emit('create-user', newUser.value);
  newUser.value = { name: '', email: '', password: '' }; // Reset form
};
</script>

<style lang="sass" scoped>
h2 
  margin: 8px 0
.form 
  border: solid 1px #1a1a1a
</style>