import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList} from 'react-native';
import {LongButton, PersonalInfo, PageHeader, TopPick} from "../../components";
import {apiLogOut} from "../../api/authAPI";
import colors from '../../constants/Colors';
import * as Icon from '@expo/vector-icons'

import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({route, navigation}) => {

    
    const topRestaurantPicks = [ 
      {name: "Place 1", categories: "category1", rating: "5/5", imageURI: "http://shorturl.at/nIXZ7"}, 
      {name: "Place 2", categories: "category2", rating: "4/5", imageURI: "http://shorturl.at/nIXZ7"}, 
      {name: "Place 3", categories: "category3", rating: "5/5", imageURI: "http://shorturl.at/nIXZ7"}, 
      {name: "Place 4", categories: "category4", rating: "3/5", imageURI: "http://shorturl.at/nIXZ7"}, 
      {name: "Place 5", categories: "category5", rating: "5/5", imageURI: "http://shorturl.at/nIXZ7"} 
    ] 
  
  

    const logOut = async () => {

      try {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("userId");
      }
      catch(exception) {
      } finally {
        console.log("logging out!");
        navigation.navigate("Auth", ); 
      }
    }

    return (
  
        <SafeAreaView style={styles.container}> 

          <PageHeader title="Your Profile" navigationFunction={() => navigation.navigate('Home')} /> 
        
          <View style={styles.userInfo}> 
              <PersonalInfo firstname="Joshua" lastname="Chua"/> 
          </View>
    
          <View style={styles.topPicks}> 
              <Text style={styles.title}>Top Restaurant Picks</Text>

              <FlatList style={styles.topPicksList}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              data={topRestaurantPicks}
              renderItem={({ item }) => <TopPick restaurantName={item.name} categories={item.categories} rating={item.rating} imageURI={item.imageURI}/>}
              keyExtractor={(item) => item.name}
              />
          </View> 
    
    
          <View style={styles.logOut}> 
              <LongButton style={styles.logoutButton} title="LOGOUT" onPress={() => logOut()}/>
          </View> 
    
        </SafeAreaView> 

    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', 
      margin: 20
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.offWhite
    },
    userInfo: {
      flex: 2, 
      width: '100%', 
    },
    topPicks: {
      flex: 3, 
      width: '100%', 
      alignItems: 'center', 
    }, topPicksList: {
      marginTop: 20
    }, 
    logOut: {
      flex: 1, 
      width: '100%', 
      alignItems: 'center', 
      justifyContent: 'flex-start' 
    }, 
    logoutButton: {
      width: '100%'
    }
  });


export default Profile;
