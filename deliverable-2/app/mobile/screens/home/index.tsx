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
    const [restaurants, setResturants] = useState(null);
    React.useEffect(() => {
      navigation.addListener('focus', () => {
        fetchRestaurants();
      });
      fetchRestaurants();  
    }, [navigation]);

    async function fetchRestaurants() {
      try {
        setResturants(await apiGetRestaurants());
        
      }
      catch(err) {
        if (err.message === "auth invalid") {
          navigation.navigate("Auth");
        }
      }
    }
    console.log(restaurants)
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
                onPress={() => navigation.navigate('Preferences')} 
              />
            </View> 

          </View>

          <View style={styles.swiper}> 
            <Swiper
                ref={useSwiper}
                cards={photoCards}
                renderCard={card => <Card card={card} navigation = {navigation}/>}
                onSwipedRight ={() => {console.log('swiped right')}}
                onSwipedLeft={() => {console.log('swiped left')}}
                onSwipedAll={() => {console.log('finished stack')}}
                backgroundColor={colors.darkGray}
                infinite = {true}
                verticalSwipe = {false}
                stackSize= {2}>
            </Swiper>
          </View>

          <View style={styles.footer}>
              <CircleButton name="x" Icon = {Icon.Feather}
              color={colors.pink} onPress={OnClickDislike}
              />
              <CircleButton name="heart" Icon = {Icon.Entypo}
              color={colors.purple} onPress={superlike}
              />
              <CircleButton name="like" Icon = {Icon.SimpleLineIcons}
              color={colors.green} onPress={OnClickLike}
              />
          </View>
      </SafeAreaView>
    )
}

const superlike = () => {
    console.log("pressed superlike button")
 }

const photoCards = [
    {
      title: "Restaurant 1",
      description: "cool",
      photo: require('../../assets/images/restaurant.jpg'),
    },
    {
        title: "Restaurant 2",
        description: "cooler",
        photo: require('../../assets/images/restaurant.jpg'),
    }
  ]

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