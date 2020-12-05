import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from "../env";
import client from "./axios";


export const apiGetUserDetails = async () => {

  try {
    const authToken = await AsyncStorage.getItem("authToken");
    const userId = await AsyncStorage.getItem("userId");

    console.log("GET USER DETAILS")
    console.log("authToken: " + authToken)
    console.log("userId: " + userId)


    const res = await client.get(env.apiUrl + 'user/' + userId, {headers: {"Authorization" : `Bearer ${authToken}`}});

    if (!res || res.status != 200 || typeof(res.data) == "string") {
      throw 'Unable to retrieve user details.';
    }

    return res.data;

  } catch (err) {
    throw err;
  }
}


export const apiGetSuperLikes = async () => {

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      console.log("GET SUPERLIKES")
      console.log("authToken: " + authToken)
      console.log("userId: " + userId)
  
      const res = await client.get(env.apiUrl + 'user/superlike/' + userId, {headers: {"Authorization" : `Bearer ${authToken}`}});

      if (!res || res.status != 200 || typeof(res.data) == "string") {
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

      console.log("SUPERLIKE")
      console.log("authToken: " + authToken)
      console.log("userId: " + userId)
  
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

        const authToken = await AsyncStorage.getItem("authToken");  
        const userId = await AsyncStorage.getItem("userId");

        console.log("LOGOUT")
        console.log("authToken: " + authToken)
        console.log("userId: " + userId)

        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userId");
    }
    catch(exception) {
      console.log("ERROR DESTROYING AUTHTOKEN OR USERID")
    } finally {
      console.log("logging out!");
      navigation.navigate("Auth"); 
    }
}


