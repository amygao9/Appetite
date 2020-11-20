import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";

export const apiGetRestaurants = async () => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");
    const restaurants = await client.post(env.apiUrl + 'restaurant', {
                  "categories": ["japanese", "tradamerican"],
                  "lat": 43.661282922175914,
                  "lng": -79.39409611053878,
                  "price": 1, // can be omitted
                  "radius": 1.5
                }, {headers: {"Authorization" : `Bearer ${authToken}`}});
      
    if (!restaurants || typeof restaurants.data === 'string') {
      throw 'Restaurants not found';
    }
    return restaurants.data;
  } catch (err) {
    throw err;
  }
}