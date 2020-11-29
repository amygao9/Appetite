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
    const [cuisinePreferences, setCuisinePreferences] = useState([])
    const [searchRadius, setSearchRadius] = useState(1.5)
    const [pricePreference, setPricePreference] = useState(0)
    const [buttonsDisabled, setButtonsDisabled] = React.useState(true)

    // fetches when preferences and/or radius have been updated 
    React.useEffect(() => {
      setLoading(true);
      fetchRestaurants(cuisinePreferences, searchRadius, pricePreference);
    }, [cuisinePreferences, searchRadius, pricePreference]);


    async function fetchRestaurants(cuisine, radius, price) {
      setButtonsDisabled(true);
      
      try {

        const restaurants = await apiGetRestaurants(cuisine, radius, price);

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
        setButtonsDisabled(false)
      }
      catch(err) {
        console.log(err)
        if (err.message === "auth invalid") {
          navigation.navigate("Auth");
        } else if (err == 'Restaurants not found') {
          alert("No restaurants found! Change preferences to see more.");
          setCards([]);
          setLoading(false);
          setButtonsDisabled(true);
        }
      }
    } 

    const updatePreferences = (cuisinePreferences, radius, pricePreference) => {       
      setSearchRadius(radius);
      setCuisinePreferences(cuisinePreferences);
      setPricePreference(pricePreference)
    } 

    const onClickSuperlike = () => {
      if(!buttonsDisabled) {
        useSwiper.current.swipeTop(); 
      } 
    }

    const onClickDislike = () => {
      if(!buttonsDisabled) {
        useSwiper.current.swipeLeft();
      } 
    }
    const onClickLike = () => {
      if(!buttonsDisabled) {
        useSwiper.current.swipeRight();
      } 
    }

    const recordLeftSwipe = (index) => {
      recordSwipe(restaurantCards[index].id, -1)
    }

    const recordRightSwipe = (index) => {     
      recordSwipe(restaurantCards[index].id, 1)
    }

    const recordSuperLike = (index) => {
      alert("Superlike!"); 
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
                onPress={() => navigation.navigate('Profile')} 
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
                onPress={() => navigation.navigate('Preferences', {onGoBack: updatePreferences, cuisinePreferences: [...cuisinePreferences], searchRadius: searchRadius, pricePreference: pricePreference})} 
              />
            </View> 

          </View>
     
          <View style={styles.swiper}> 
          
            {!isLoading && !buttonsDisabled && ( 
              <Swiper
                  ref={useSwiper}
                  cards={restaurantCards}
                  renderCard={(card) => <Card card={card} navigation = {navigation}/>}
                  onSwipedRight ={(index) => {recordRightSwipe(index)}}
                  onSwipedLeft={(index) => {recordLeftSwipe(index)}}
                  onSwipedTop={(index) => {recordSuperLike(index)}}
                  onSwipedAll={() => {alert('Viewed all restaurants! Change preferences to see more.')}}
                  backgroundColor={colors.darkGray}
                  infinite = {false}
                  verticalSwipe = {true}
                  stackSize= {3}
                  cardStyle={{
                    top: 20,
                    left: 15,
                    bottom: 20,
                    right: 15,
                    width: 'auto',
                    height: 'auto'
                  }}
                  disableBottomSwipe = {true}> 
              </Swiper>)}

              {isLoading && (
                <ActivityIndicator size="large" color={colors.green} />
              )}
          
          </View> 
          
          <View style={styles.footer}>
              <CircleButton name="x" Icon = {Icon.Feather} disabled={buttonsDisabled}
              color={colors.pink} onPress={() => onClickDislike()}
              />
              <CircleButton name="heart" Icon = {Icon.Entypo} disabled={buttonsDisabled}
              color={colors.purple} onPress={() => onClickSuperlike()}
              />
              <CircleButton name="like" Icon = {Icon.SimpleLineIcons} disabled={buttonsDisabled}
              color={colors.green} onPress={() => onClickLike()}
              />
          </View>
      </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignContent: 'center',
      flexDirection: "column", 
      backgroundColor: colors.darkGray
    },
    header: {
      flex: 0.1, 
      flexDirection: "row", 
      justifyContent: 'space-around', 
      alignItems: 'flex-end', 
    },
    swiper: {
      flexDirection: "column", 
      flex: 0.8, 
      justifyContent: 'center'
    },
    footer: {
      flex: 0.1, 
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'flex-start',
      bottom: 20,
    }, 
    logo: {
      width: 52, 
      height: 52
    }
  });

export default Home;