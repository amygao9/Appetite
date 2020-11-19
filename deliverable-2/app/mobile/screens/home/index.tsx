import React, {useRef} from 'react';
import { StyleSheet, SafeAreaView, View} from 'react-native';
import * as Icon from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import {Card, CircleButton} from "../../components";
import {apiGetRestaurants} from "../../api/restaurantAPI";

const Home = ({navigation}) => {
    const useSwiper = useRef(null)
    const OnClickDislike = () => useSwiper.current.swipeLeft()
    const OnClickLike = () => useSwiper.current.swipeRight()

    React.useEffect(() => {
      async function fetchRestaurants() {
        try {
          const restaurants = await apiGetRestaurants();
        }
        catch(err) {
          if (err.message === "auth invalid") {
            navigation.navigate("Auth");
          }
        }
      }
      fetchRestaurants();
    }, []);
    return (
    <SafeAreaView style={styles.container}>
        <Swiper
            ref={useSwiper}
            cards={photoCards}
            renderCard={card => <Card card={card} />}
            onSwipedRight ={() => {console.log('swiped right')}}
            onSwipedLeft={() => {console.log('swiped left')}}
            onSwipedAll={() => {console.log('finished stack')}}
            infinite = {true}
            verticalSwipe = {false}
            backgroundColor={'#191A1D'}
            stackSize= {2}>
        </Swiper>
        <View style={styles.footer}>
            <CircleButton name="x" Icon = {Icon.Feather}
            color="#FF0E83" onPress={OnClickDislike}
            />
            <CircleButton name="heart" Icon = {Icon.Entypo}
            color="#6F05D6" onPress={superlike}
            />
            <CircleButton name="like" Icon = {Icon.SimpleLineIcons}
            color="#00CC99" onPress={OnClickLike}
            />
        </View>
    </SafeAreaView>
    )
}

const dislike = () => {
    console.log("pressed x button")
  }
  const like = () => {
    console.log("pressed like button")
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
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#191A1D'
    },
    card: {
      flex: 0.8,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: "#E8E8E8",
      justifyContent: "center",
      backgroundColor: "white"
    },
    text: {
      textAlign: "center",
      fontSize: 50,
      backgroundColor: "transparent"
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
    cards: {
      flex: 1,
      margin: 8,
      zIndex: 100,
    },
    footer: {
      flex: 0.1,
      position: 'absolute',
      bottom:0,
      backgroundColor: 'transparent',
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: 50,
    },
    stretch: {
      resizeMode: 'stretch',
    }
  });
export default Home;