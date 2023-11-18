import { createStore } from 'vuex';
import { fetchUserData, createUserData, deleteUserData, updateUserData, passLoginData } from '../services/UserService';
import { fetchAllPostData, fetchUserPostData, createPostData, deletePostData } from '../services/PostService';

export default createStore({
    state() {
        return {
            debug: false,
            users: [],
            activeUser: null,
            activePosts: [],
            userForm: 'login',
            animationType: 'slide',
        };
    },
    mutations: {
        toggleDebug(state) {
            state.debug = !state.debug;
        },
        setUsers(state, users) {
            state.users = users;
        },
        addUser(state, user) {
            state.users.push(user);
        },
        removeUser(state, userId) {
            state.users = state.users.filter(user => user.id !== userId);
        },
        updateUser(state, updatedUser) {
            const index = state.users.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser);
                // update activeUser if it is the same user
                if (state.activeUser && state.activeUser.id === updatedUser.id) {
                    const updateData = {
                        // just the data the account needs...
                        name: updatedUser.name,
                        email: updatedUser.email,
                        id: updatedUser.id
                    }
                    state.activeUser = updateData;
                    localStorage.setItem('activeUser', JSON.stringify(updateData));
                }
                // update in activePosts
                state.activePosts.forEach(post => {
                    if (post.userId === updatedUser.id) {
                        post.userName = updatedUser.name; 
                    }
                });
            }
        },
        // ACTIVE USER
        setActiveUser(state, user) {
            state.activeUser = user;
        },
        removeActiveUser(state) {
            state.activeUser = null;
        },
        // ACTIVE POSTS
        setAllPosts(state, posts) {
            state.activePosts = posts;
        },
        clearAllPosts(state) {
            state.activePosts = [];
        },
        addPost(state, post) {
            // state.activePosts.unshift(post); // Adds the new post to the beginning of the list
            state.activePosts.push(post);
        },
        removePost(state, postId) {
            state.activePosts = state.activePosts.filter(post => post.id !== postId);
        },
        updateUserPostCount(state, { userId, value }) {
            const userIndex = state.users.findIndex(user => user.id === userId);
            if (userIndex !== -1) {
                state.users[userIndex].postCount += value;
            }
        },
        // USER FORM (signup/login)
        toggleUserForm(state) {
            state.userForm = state.userForm === 'signup' ? 'login' : 'signup';
        },
        toggleAnimationType(state) {
            state.animationType = state.animationType === 'fade' ? 'slide' : 'fade';
        },
    },
    actions: {
        // DEBUG
        toggleDebug({ commit }) {
            commit('toggleDebug');
        },
        // SIGNUP/LOGIN FORM 
        toggleUserForm(){},
        toggleAnimationType(){},
        // USER STUFF
        async fetchUsers({ commit }) {
            try {
                const userData = await fetchUserData();
                commit('setUsers', userData);
                console.log('ACTION: Fetched Users');
            } catch(err) {
                console.error('Error fetching users:', err);
            }
        },
        async createUser({ commit }, userData) {
            try {
                const newUser = await createUserData(userData);
                commit('addUser', newUser);
                console.log('ACTION: Created User:', newUser);
            } catch (err) {
                console.error('Failed to create user:', err);
            }
        },
        async deleteUser({ commit }, userId) {
            if (window.confirm('Are you sure you want to delete this user?')) {
                try {
                    await deleteUserData(userId);
                    commit('removeUser', userId);
                    console.log('ACTION: Deleted User:', userId);
                } catch (err) {
                    console.error('Failed to delete user:', err);
                }
            }
        },
        async updateUser({ commit }, { userId, userData }) {
            try {
                const updatedUser = await updateUserData(userId, userData);
                commit('updateUser', updatedUser);
                console.log('ACTION: Updated User:', updatedUser);
            } catch (err) {
                console.error('Failed to update user:', err);
            }
        },
        // LOGIN
        async loginUser({ commit }, loginData) {
            try {
                const data = await passLoginData(loginData);
                const userId = data.user.id 
                localStorage.setItem('activeUser', JSON.stringify(data.user));
                commit('setActiveUser', data.user);
                console.log('ACTION: Login: ', userId);
            } catch (err) {
                console.error('Error during loginUser!!!!!!!!!!!!!:', err);
                throw err; // Propagate error to the caller
            }
        },
        logoutUser({ commit }) {
            localStorage.removeItem('activeUser');
            commit('removeActiveUser');
            console.log('ACTION: Logout');
        },
        // POSTS
        async setPosts({ commit }) {
            try {
                const postData = await fetchAllPostData();
                commit('setAllPosts', postData);
            } catch (err) {
                console.error('Error setting posts:', err);
            }
        },
        async setPostsByUser({ commit }, userId) {
            try {
                const postData = await fetchUserPostData(userId);
                commit('setAllPosts', postData);
            } catch (err) {
                console.error('Error setting posts by user:', err);
            }
        },
        clearPosts({ commit }) {
            commit('clearAllPosts');
        },
        async createPost({ dispatch, commit, state }, { userId, postData }) {
            try {
                const data = await createPostData(postData, userId);
                const newPost = {
                    userName: state.activeUser.name,
                    content: data.content,
                    id: data.id,
                    userId: userId
                };
                commit('addPost', newPost);
                dispatch('updateUserPostCount', { userId, value: 1 });
            } catch (err) {
                console.error('Failed to create post:', err);
            }
        },
        async deletePost({ dispatch, commit, state }, postId) {
            const isConfirmed = window.confirm('Are you sure you want to delete this post?');
            if (isConfirmed) {
                const postObj = state.activePosts.find(post => post.id === postId);
                const userId = postObj.userId;
                // one line version:
                // const userId = state.activePosts.find(post => post.id === postId)?.userId;
                try {
                    await deletePostData(postId);
                    commit('removePost', postId);
                    dispatch('updateUserPostCount', { userId, value: -1 });
                } catch (err) {
                    console.error('Failed to delete post:', err);
                }
            }
        },
        updateUserPostCount({ commit }, { userId, value }) {
            console.log('update user.postCount: ', { userId, value });
            commit('updateUserPostCount', { userId, value });
        },
    }
});
