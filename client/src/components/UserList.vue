<template>
  <div>
    <h2>User List ({{ users.length }})</h2>
    <button @click="reverseList = !reverseList">
      {{ reverseList ? 'Ascending' : 'Descending' }}
    </button>

    <ul>
      <li class="item" v-for="user in userList" :key="user.id">
        <div v-if="editingUserId === user.id">
          <input type="text" v-model="user.name">
          <input type="email" v-model="user.email">
          <div>
            <button @click="emitUpdate(user.id, user)">Save</button>
            <button @click="editingUserId = null">Cancel</button>
          </div>
          <!-- <div class="pass">{{ user.password }}</div> -->
        </div>
        <div v-else>
          {{ user.name }}: {{ user.email }} ({{ user.postCount }})
          <div>
            <button @click="$emit('delete-user', user.id)">Delete</button>
            <button @click="editingUserId = user.id">Edit</button>
            <button @click="emitGetUserPosts(user.id)">View Posts</button>
          </div>
          <!-- <div class="pass">{{ user.password }}</div> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  users: Array
});

const editingUserId = ref(null);
const reverseList = ref(true);

const userList = computed(() => {
  return reverseList.value ? [...props.users].reverse() : props.users;
});

const emit = defineEmits(['edit-user', 'delete-user', 'update-user', 'get-user-posts']);

const emitUpdate = (userId, userData) => {
  emit('update-user', userId, userData);
  editingUserId.value = null;
};

const emitGetUserPosts = (userId) => {
  emit('get-user-posts', userId);
};

</script>

<style lang="sass" scoped>
ul 
  padding: 0
.item 
  margin-bottom: 8px
  text-align: left
  display: block
  padding: 6px
  border-bottom: solid 1px #1a1a1a
  &:last-child
    border: 0
.num-users 
  display: inline-block
  border-radius: 8px
  border: 1px solid transparent
  padding: 0.3em 0.6em
  font-size: 1em
.pass 
  font-size: 0.8em
  font-style: italic 
  color: #555
</style>
