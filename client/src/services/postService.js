const BASE_URL = '/api/posts';

const fetchAllPostData = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // return data
    } catch(err) {
      throw err; // re-throw for handler
    }
}

const fetchUserPostData = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // return data
    } catch(err) {
      throw err; // re-throw for handler
    }
}

const createPostData = async (postData, userId) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content:  postData,
        userId:  userId
      }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; // return data
  } catch (err) {
    throw err; // re-throw for handler
  }
}

const deletePostData = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Update: Remove the post from the local state
    const data = await response.json();
    return data; // return data
    // end Update
  } catch (err) {
    throw err; // re-throw for handler
  }
}

export { fetchAllPostData, fetchUserPostData, createPostData, deletePostData };