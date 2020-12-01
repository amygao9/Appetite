import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
 

const getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    alert("Permission denied to access location! ")
  } else {
    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
    const { latitude , longitude } = location.coords
    console.log("LATITUDE: " + latitude + ", LONGITUDE: " + longitude)
  } 
};


export const apiGetRestaurants = async (cuisines, radius, price) => {

  await getLocationAsync(); 

  try {
    const authToken = await AsyncStorage.getItem("authToken");

    //user location is hardcoded at 1 King's College Circle (to be updated for future deliverables)
    const requestBody = {
      "categories": cuisines,
      "lat": 43.661282922175914,
      "lng": -79.39409611053878, 
      "radius": radius, 
    }

    if(price >= 1 && price <= 4){
      requestBody["price"] = price
    } 
      
    const restaurants = await client.post(env.apiUrl + 'restaurant', requestBody, {headers: {"Authorization" : `Bearer ${authToken}`}});

    if (restaurants == undefined) {
      AsyncStorage.removeItem("authToken");
      throw new Error("auth invalid")
    }

    if (!restaurants || !restaurants.data || typeof restaurants.data === 'string') {
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

    return details.data;
  } catch (err) {
    throw err;
  }
}

export const apiSwipeOnRestaurant = async (restaurantID, weight) => {
  try {
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await client.put(env.apiUrl + 'restaurant/swipe/' + restaurantID, {"weight": weight}, {headers: {"Authorization" : `Bearer ${authToken}`}});
      
    if (!res || res.status != 200) {
      throw 'Unable to record swipe with weight ' + weight + ' on restaurant ID ' + restaurantID + '.';
    }

    console.log('Successfully recorded swipe with weight ' + weight + ' on restaurant ID ' + restaurantID + '.');

  } catch (err) {
    throw err;
  }
}

