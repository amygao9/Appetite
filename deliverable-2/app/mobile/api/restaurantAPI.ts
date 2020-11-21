import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";

// export const apiGetRestaurants = async (categories, radius) => {
//   try {
//     const authToken = await AsyncStorage.getItem("authToken");
//     const restaurants = await client.post(env.apiUrl + 'restaurant', {
//                   "categories": categories,
//                   "lat": 43.661282922175914,
//                   "lng": -79.39409611053878,
//                   "radius": radius
//                 }, {headers: {"Authorization" : `Bearer ${authToken}`}});
export const apiGetRestaurants = async (preferences, searchRadius) => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");

    const requestBody = {
      "categories": preferences,
      "lat": 43.661282922175914,
      "lng": -79.39409611053878, 
      "radius": searchRadius
    }

    console.log('preferences to send: ' + preferences)
    console.log('search radius to send: ' + searchRadius)

    const restaurants = await client.post(env.apiUrl + 'restaurant', requestBody, {headers: {"Authorization" : `Bearer ${authToken}`}});
      
    if (!restaurants || typeof restaurants.data === 'string') {
      throw 'Restaurants not found';
    }
    return restaurants.data;
  } catch (err) {
    throw err;
  }
}
export const apiGetDetails = async (id) => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");

    const details = await client.get(env.apiUrl + 'restaurant/'+id, {headers: {"Authorization" : `Bearer ${authToken}`}});
      
    if (!details || typeof details.data === 'string') {
      throw 'Restaurants not found';
    }
    console.log(details.data)
    return details.data;
  } catch (err) {
    throw err;
  }
}