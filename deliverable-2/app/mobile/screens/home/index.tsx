import React, {useRef} from 'react';
import { StyleSheet, SafeAreaView, View, Button, Dimensions} from 'react-native';
import * as Icon from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import {Card, CircleButton} from "../../components";
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

const { height } = Dimensions.get('window')

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

            <CircleButton name="x" Icon = {Icon.Feather}
              color="#FF0E83" 
              // onPress={() => console.log("preferences pressed 2")} 
              onPress={() => navigation.navigate('Preferences')}
            />

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

const dislike = () => {
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
      justifyContent: 'center',
      backgroundColor: '#b132bf'
    },
    header: {
      flex: 4, 
      flexDirection: "row", 
      justifyContent: 'space-around', 
      alignItems: 'flex-end', 
      backgroundColor: '#c23237',
    },
    swiper: {
      flex: 36, 
      backgroundColor: '#3289bf',
    },
    footer: {
      flex: 4, 
      backgroundColor: '#32bf57',
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'flex-end', 
    }
  });
export default Home;