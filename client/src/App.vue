<template>
  <div class="wrapper" :class="{ 'debug-border': debug }">

    <p>
      <button @click="toggleDebug">Toggle Debug</button>
      Debug mode is: {{ debug ? 'ON' : 'OFF' }}
    </p>

    <div class="form-block">
        <!-- User Account -->
        <div v-if="activeUser" class="account">
          <h1>Account</h1>
          <p>User Data: {{ activeUser }}</p>
          <button @click="logoutUser">Log Out</button>
          <button v-if="!showNewPostForm" @click="showNewPostForm = !showNewPostForm">Create Post</button>
        </div>
        <!-- Login/SignUp -->
        <div v-else>
          <h1>App</h1>
          <button @click="toggleUserForm">{{ userForm == 'signup' ? 'Login' : 'Sign Up' }}</button> 
          <button @click="toggleAnimationType">Toggle Animation Type ({{ animationType == 'fade' ? 'Slide' : 'Fade' }})</button>
          <div v-if="animationType === 'fade'">
            <transition :name="'fade'" mode="out-in">
              <component 
                :is="userFormDisplay" 
                :key="userForm" 
                v-on="eventHandlers" 
                :error-message="loginErrorMessage"
              />
            </transition>
          </div>
          <div v-else class="form-container" :style="containerStyle">
            <LoginUserForm 
              @login-user="loginUser" 
              :error-message="loginErrorMessage"
              :style="{ opacity: userForm === 'login' ? 1 : 0 }" 
            />
            <NewUserForm @create-user="createUser" :style="{ opacity: userForm === 'signup' ? 1 : 0 }" />
          </div>
        </div>
    </div>

    <section class="row">
      <aside class="col">
        <!-- User List -->
          <UserList 
            :users="users"
            @delete-user="deleteUser"
            @update-user="updateUser"
            @get-user-posts="setPostsByUser"
          />
      </aside>
      <main class="col">

        <!-- NewPostForm -->
        <div v-if="showNewPostForm" class="new-post-form">
            <h2>Make a New Post</h2>
            <form @submit.prevent="createPost(activeUser.id, newPostContent)">
              <div class="new-post-editor">
                <textarea v-model="newPostContent"></textarea>
              </div>
              <button type="submit">Post</button>
              <button @click="showNewPostForm = !showNewPostForm" type="button">Cancel</button>
            </form>
        </div>

        <!-- List Posts -->
        <div>
          <h2>Posts ({{ activePosts.length }})</h2>
          <button @click="setPosts">GET ALL POSTS</button>
          <button @click="clearPosts">Clear POSTS</button>
          <ul class="post-list">
              <li class="post-item" v-for="post in postList" :key="post.id" :class="(activeUser && (activeUser.id  == post.userId))? 'active' : 'inactive'">
                  <div class="post-meta">(postId: {{ post.id }}, userId: {{ post.userId }})</div>
                  <div class="post-author">{{ post.userName }}:</div> 
                  <div class="post-content">{{ post.content }} </div>
                  <button @click="deletePost(post.id)">Delete Post</button>
              </li>
          </ul>
        </div>

      </main>
    </section>

  </div> 
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import NewUserForm from './components/NewUserForm.vue';
import LoginUserForm from './components/LoginUserForm.vue';
import UserList from './components/UserList.vue';

//////////////////////////////////////////////////////////
// Component States (ref and basic)
//////////////////////////////////////////////////////////
const userForm = ref('login');
const animationType = ref('slide');

const toggleUserForm = () => {
  userForm.value = userForm.value === 'signup' ? 'login' : 'signup';
};
const toggleAnimationType = () => {
  animationType.value = animationType.value === 'fade' ? 'slide' : 'fade';
};

const userFormDisplay = computed(() => {
  return userForm.value === 'login' ? LoginUserForm : NewUserForm;
});
const containerStyle = computed(() => {
  let offset = userForm.value === 'signup' ? '-50%' : '0'; // Slide by 50% of the container's width
  return `transform: translateX(${offset});`;
});

const loginErrorMessage = ref('');
const showNewPostForm = ref(false);
const newPostContent = ref('');

//////////////////////////////////////////////////////////
// Store 
//////////////////////////////////////////////////////////
const store = useStore();

const debug = computed(() => store.state.debug);
const toggleDebug = () => {
  store.dispatch('toggleDebug');
};

const users = computed(() => store.state.users);

const setUsers = () => {
  store.dispatch('fetchUsers');
};
const createUser = (userData) => {
  store.dispatch('createUser', userData);
};
const deleteUser = (userId) => {
  store.dispatch('deleteUser', userId);
};
const updateUser = (userId, userData) => {
  store.dispatch('updateUser', { userId, userData });
};

const activeUser = computed(() => store.state.activeUser);

const loginUser = async (loginData) => {
  try {
    await store.dispatch('loginUser', loginData);
  } catch (err) {
    console.error('Login failed:', err);
    loginErrorMessage.value = 'Invalid Login!!!'; // Handle login error
  }
};
const logoutUser = () => {
  store.dispatch('logoutUser');
  // component states...
  newPostContent.value = '';
  showNewPostForm.value = false;
};

// Dynamic Event Handler (:is component)
const eventHandlers = {
  'login-user': loginUser,
  'create-user': createUser
};

// Posts 
const activePosts = computed(() => store.state.activePosts);

const postList = computed(() => {
  return [...activePosts.value].reverse();
});

const setPosts = () => {
  store.dispatch('setPosts');
};
const setPostsByUser = (userId) => {
  store.dispatch('setPostsByUser', userId);
};
const clearPosts = () => {
  store.dispatch('clearPosts');
};

const createPost = (userId, postData) => {
  store.dispatch('createPost', { userId, postData });
};
const deletePost = (postId) => {
  store.dispatch('deletePost', postId);
};

// LifeCycle
onMounted(() => {
  setUsers();
  const storedUser = localStorage.getItem('activeUser');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      store.commit('setActiveUser', user); // Directly commit to store
    } catch (e) {
      console.error('Error parsing user data from local storage:', e);
    }
  }
});

</script>

<style lang="sass" scoped>
h1 
  margin-bottom: 10px

.account 
  // border: solid #1a1a1a
  border: solid 2px yellow
  padding: 10px

// Cols 
aside.col,
main.col 
  border: solid #1a1a1a

// Posts
.post-list 
  display: block 
  padding: 10px
  margin: 0
.post-item 
  display: block 
  background-color: transparentize(#1a1a1a, 0.35)
  margin-bottom: 10px
  text-align: left
  border-left: solid 2px #646cff
  &.active
    border-color: yellow
.post-author
  font-size: 0.8
  font-weight: bold
  padding: 0 10px
.post-content
  padding: 10px
.post-meta
  font-style: italic 
  color: #666
  margin-bottom: 6px
  background-color: #646cff
  color: #fff
  padding: 0 10px
  .active & 
    background-color: yellow
    color: #111
.form-block 
  overflow: hidden

.new-post-form
  border: solid 1px yellow 
  padding-bottom: 20px
.new-post-editor 
  display: block 
  padding: 0 10px 10px 10px
  textarea
    width: 80%

// Slide Animation
.form-container
  display: flex
  width: 200%
  transition: transform 0.3s ease
  > *
    flex: 1
    transition: opacity 0.3s ease 

.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s

.fade-enter-from, .fade-leave-to
  opacity: 0

.fade-leave-from, .fade-enter-to
  opacity: 1

// Debug (store test)
.wrapper 
  display: block
  border: 3px solid transparent
  &.debug-border
    border: 3px solid red

</style>
