import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";


export const apiGetSuperLikes = async () => {

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
  
      const res = await client.get(env.apiUrl + 'user/superlike/' + userId, {headers: {"Authorization" : `Bearer ${authToken}`}});

      if (!res || res.status != 200) {
        throw 'Unable to retrieve superlikes.';
      }

      return res.data;

    } catch (err) {
      throw err;
    }
}

export const apiSuperLikeRestaurant = async (restaurantId) => {

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
  
      const res = await client.post(env.apiUrl + 'user/add/superlike/', {id: userId, restaurantId: restaurantId}, {headers: {"Authorization" : `Bearer ${authToken}`}});

      if (!res || res.status != 200) {
        throw 'Unable to record superlike for user ' + userId + ' on restaurant ID ' + restaurantId + '.';
      }

      console.log('Successfully recorded superlike for user ' + userId + ' on restaurant ID ' + restaurantId + '.'); 

  
      return res.data;
    } catch (err) {
      throw err;
    }
}

export const userLogOut = async (navigation) => {
    try {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userId");
    }
    catch(exception) {
    } finally {
      console.log("logging out!");
      navigation.navigate("Auth"); 
    }
}


