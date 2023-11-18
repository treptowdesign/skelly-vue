const BASE_URL = '/api/users';

const fetchUserData = async () => {
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

const createUserData = async (userData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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

const updateUserData = async (userId, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:  userData.name,
        email:  userData.email
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

const deleteUserData = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'DELETE',
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

const passLoginData = async (loginData) => {
  console.log('Login Service Called', loginData);
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('passLoginData failed:', err);
    throw err; // re-throw for handler
  }
}

export { fetchUserData, createUserData, updateUserData, deleteUserData, passLoginData };
