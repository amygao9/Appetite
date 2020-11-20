import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";

export const apiGetRestaurants = async () => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");
    const restaurants = await client.get(env.apiUrl + 'restaurant', { headers: {"Authorization" : `Bearer ${authToken}`}});
    if (!restaurants || typeof restaurants.data === 'string') {
      throw 'Restaurants not found';
    }
    return restaurants.data;
  } catch (err) {
    throw err;
  }
}