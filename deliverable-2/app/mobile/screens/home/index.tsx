import React, {useRef} from 'react';
import { StyleSheet, SafeAreaView, View, Button} from 'react-native';
import * as Icon from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import {Card, CircleButton} from "../../components";
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

const Home = ({navigation}) => {
    const useSwiper = useRef(null)
    const OnClickDislike = () => useSwiper.current.swipeLeft()
    const OnClickLike = () => useSwiper.current.swipeRight()

    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}> 
          <CircleButton name="x" Icon = {Icon.Feather}
            color="#FF0E83" 
            // onPress={() => console.log("preferences pressed 2")} 
            onPress={() => navigation.navigate('Preferences')}
          />
        </View>

        <View style={styles.swiper}> 
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
        </View>

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

const dislike = (navigation) => {
    console.log("pressed x button");
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
    text: {
      textAlign: "center",
      fontSize: 50,
      backgroundColor: "transparent"
    },
    header: {
      position: 'absolute',
      top:0,
      flexDirection: "row",
      justifyContent: "space-between"
    },
    swiper: {
      flex: 1, 
      justifyContent: 'center'
    },
    footer: {
      position: 'absolute',
      bottom:0,
      backgroundColor: 'transparent',
      flexDirection: "row",
      justifyContent: "space-evenly",
      paddingTop: 20,
      paddingBottom: 70
    },
    stretch: {
      resizeMode: 'stretch',
    }
  });
export default Home;