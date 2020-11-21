import React, {useRef, useState} from 'react';
import { StyleSheet, SafeAreaView, View, Button, Dimensions, Image} from 'react-native';
import * as Icon from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import {Card, CircleButton} from "../../components";
import {apiGetRestaurants} from "../../api/restaurantAPI";
import colors from '../../constants/Colors';
const { height } = Dimensions.get('window')

const Home = ({navigation}) => {
    const useSwiper = useRef(null)
    const OnClickDislike = () => useSwiper.current.swipeLeft()
    const OnClickLike = () => useSwiper.current.swipeRight()

    const [isLoading, setLoading] = useState(true);

    const [restaurantCards, setCards] = useState([]);
    const [preferences, setPreferences] = useState([])
    const [searchRadius, setSearchRadius] = useState(1.5)

    //fetches restaurants on initial render, and whenever preferences and/or radius have been updated 
    React.useEffect(() => {
      fetchRestaurants(preferences, searchRadius)
    }, [preferences, searchRadius]);

    async function fetchRestaurants(preferences, searchRadius) {
      try {
        const restaurants = await apiGetRestaurants(preferences, searchRadius);
        console.log(restaurants)
        
        let cards = [];
        restaurants.forEach((restaurant) => {
          console.log(restaurant)
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
        
        console.log(cards)
        
        setCards(cards)
        setLoading(false)
      }
      catch(err) {
        if (err.message === "auth invalid") {
          navigation.navigate("Auth");
        }
      }
    } 

    function updatePreferences(preferences, radius){

      console.log('PREFERENCES after navigating: ' + preferences)
      console.log('RADIUS after navigating: ' + radius)
                        
      setSearchRadius(radius);
      setPreferences(preferences);
      fetchRestaurants(preferences, radius);
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
                onPress={() => navigation.navigate('Preferences', {onGoBack: updatePreferences, preferences: preferences, searchRadius: searchRadius})} 
              />
            </View> 

          </View>
          {!isLoading && ( 
          <View style={styles.swiper}> 
            <Swiper
                ref={useSwiper}
                cards={restaurantCards}
                renderCard={card => <Card card={card} navigation = {navigation}/>}
                onSwipedRight ={() => {console.log('swiped right')}}
                onSwipedLeft={() => {console.log('swiped left')}}
                onSwipedAll={() => {console.log('finished stack')}}
                backgroundColor={colors.darkGray}
                infinite = {true}
                verticalSwipe = {false}
                stackSize= {2}>
            </Swiper>
          </View> )}
          
          <View style={styles.footer}>
            
              <CircleButton name="x" Icon = {Icon.Feather}
              color={colors.pink} onPress={OnClickDislike}
              />
              <CircleButton name="like" Icon = {Icon.SimpleLineIcons}
              color={colors.green} onPress={OnClickLike}
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
      flex: 22, 
      marginBottom: 100
    },
    footer: {
      flex: 4, 
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'flex-start', 
    }, 
    logo: {
      width: 52, 
      height: 52
    }
  });
export default Home;