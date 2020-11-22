import React, {useRef, useState} from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions, Image, ActivityIndicator} from 'react-native';
import * as Icon from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import {Card, CircleButton} from "../../components";
import {apiGetRestaurants, apiSwipeOnRestaurant} from "../../api/restaurantAPI";
import colors from '../../constants/Colors';
const { height } = Dimensions.get('window')

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Possible Unhandled Promise Rejection',
]);

const Home = ({navigation}) => {
    const useSwiper = useRef(null)
    const [isLoading, setLoading] = useState(true);
    const [restaurantCards, setCards] = useState([]);
    const [preferences, setPreferences] = useState([])
    const [searchRadius, setSearchRadius] = useState(1.5)


    //fetches restaurants on initial render
    React.useEffect(() => {
      fetchRestaurants(preferences, searchRadius)
    }, []);

    // fetches when preferences and/or radius have been updated 
    React.useEffect(() => {
      setLoading(true);
      fetchRestaurants(preferences, searchRadius);
    }, [preferences, searchRadius]);


    async function fetchRestaurants(preferences, searchRadius) {
      try {

        const restaurants = await apiGetRestaurants(preferences, searchRadius);

        let cards = [];
        restaurants.forEach((restaurant) => {
          cards.push({
            title: restaurant["name"],
            description: restaurant["categories"],
            photo: {uri: restaurant["imageURL"][0]},
            address: restaurant["address"],
            rating: restaurant["rating"],
            price: restaurant["price"],
            id: restaurant["id"]
          });
        });
        
        setCards(cards)
        setLoading(false)
      }
      catch(err) {
        console.log(err)
        if (err.message === "auth invalid") {
          navigation.navigate("Auth");
        } else if (err == 'Restaurants not found') {
          alert("No restaurants found! Change preferences to see more.");
        }
      }
    } 

    const updatePreferences = (preferences, radius) => {       
      setSearchRadius(radius);
      setPreferences(preferences);
    } 

    const onClickDislike = () => {
      useSwiper.current.swipeLeft();
    }
    const onClickLike = () => {
      useSwiper.current.swipeRight();
    }

    const recordLeftSwipe = (index) => {
      recordSwipe(restaurantCards[index].id, -1)
    }

    const recordRightSwipe = (index) => {     
      recordSwipe(restaurantCards[index].id, 1)
    }

    const recordSwipe = async (restaurantID, weight) => {
      try {
        await apiSwipeOnRestaurant(restaurantID, weight);
      }
      catch(err) {
        if (err.message === "auth invalid") {
          navigation.navigate("Auth");
        }
      }
    }

    return (
      
      <SafeAreaView style={styles.container}>        
          <View style={styles.header}> 

          <View> 
              <Icon.FontAwesome.Button  
                name="user-circle"
                color={colors.offWhite} 
                backgroundColor="transparent"
                size = {32}
                onPress={() => alert('Profile page coming soon!')} 
              />
            </View> 

            <View> 
              <Image
                style={styles.logo}
                source={require('../../assets/images/temp_logo.png')}
                backgroundColor="transparent"
              />
            </View> 

            <View> 
              <Icon.FontAwesome.Button  
                name="sliders"
                color={colors.offWhite} 
                backgroundColor="transparent"
                size = {32}
                onPress={() => navigation.navigate('Preferences', {onGoBack: updatePreferences, preferences: [...preferences], searchRadius: searchRadius})} 
              />
            </View> 

          </View>
     
          <View style={styles.swiper}> 
          
            {!isLoading && ( 
              <Swiper
                  ref={useSwiper}
                  cards={restaurantCards}
                  renderCard={(card) => <Card card={card} navigation = {navigation}/>}
                  onSwipedRight ={(index) => {recordRightSwipe(index)}}
                  onSwipedLeft={(index) => {recordLeftSwipe(index)}}
                  onSwipedAll={() => {alert('Viewed all restaurants! Change preferences to see more.')}}
                  backgroundColor={colors.darkGray}
                  infinite = {false}
                  verticalSwipe = {false}
                  stackSize= {1}>
              </Swiper>)}

              {isLoading && (
                <ActivityIndicator size="large" color={colors.green} />
              )}
          
          </View> 
          
          <View style={styles.footer}>
              <CircleButton name="x" Icon = {Icon.Feather}
              color={colors.pink} onPress={() => onClickDislike()}
              />
              <CircleButton name="like" Icon = {Icon.SimpleLineIcons}
              color={colors.green} onPress={() => onClickLike()}
              />
          </View>
      </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.darkGray
    },
    header: {
      flex: 4, 
      flexDirection: "row", 
      justifyContent: 'space-around', 
      alignItems: 'flex-end', 
    },
    swiper: {
      flex: 24, 
      justifyContent: 'center'
    },
    footer: {
      flex: 4, 
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'flex-start'
    }, 
    logo: {
      width: 52, 
      height: 52
    }
  });
export default Home;