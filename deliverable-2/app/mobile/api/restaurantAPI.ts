import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";

export const apiGetRestaurants = async (preferences, searchRadius) => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");

    //user location is hardcoded at 1 King's College Circle (to be updated for future deliverables)
    const requestBody = {
      "categories": preferences,
      "lat": 43.661282922175914,
      "lng": -79.39409611053878, 
      "radius": searchRadius
    }

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

export const apiSwipeOnRestaurant = async (restaurantID, weight) => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await client.put(env.apiUrl + 'restaurant/swipe/' + restaurantID, {"weight": weight}, {headers: {"Authorization" : `Bearer ${authToken}`}});
      
    if (!res || res.data.length > 0) {
      throw 'Unable to record swipe with weight ' + weight + ' on restaurant ID ' + restaurantID + '.';
    }

    console.log('Successfully recorded swipe with weight ' + weight + ' on restaurant ID ' + restaurantID + '.');

    //return restaurants.data;
  } catch (err) {
    throw err;
  }
}