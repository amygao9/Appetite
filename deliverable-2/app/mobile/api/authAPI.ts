import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";

export const apiLogin = async (email: string, password: string) => {
  try {
    const user = await axios.post(env.apiUrl + 'user/auth', {
      email,
      password,
    });
    if (!user || typeof user.data === 'string') {
      throw 'User not found';
    }
    return user.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const apiSignup = async (email: string, password: string) => {
    try {
      const user = await axios.post(env.apiUrl  + 'user/add', {
        email,
        password,
      });
      if (!user || typeof user.data === 'string') {
        throw 'User not found';
      }
      return user.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
};

export const logout = async () => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken === null) {
      throw 'Token Missing';
    }
    const res = await axios.post(env.API_URL  + 'api/auth/logout', {
      headers: {
        Cookie: `token=${authToken}`,
      },
    });
    await AsyncStorage.removeItem('authToken');
  } catch (err) {
    console.log(err);
    throw err;
  }
};
