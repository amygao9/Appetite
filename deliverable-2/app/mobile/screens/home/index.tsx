import React, {useRef} from 'react';
import { StyleSheet, SafeAreaView, View, Button, Dimensions} from 'react-native';
import * as Icon from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import {Card, CircleButton} from "../../components";
import colors from '../../constants/Colors';

const { height } = Dimensions.get('window')

const Home = ({navigation}) => {
    const useSwiper = useRef(null)
    const OnClickDislike = () => useSwiper.current.swipeLeft()
    const OnClickLike = () => useSwiper.current.swipeRight()

    return (
      <SafeAreaView style={styles.container}>
        {/* TEMPORARY PLACEHOLDER FOR PAGE HEADER */}
          <View style={styles.header}> 
            <CircleButton name="x" Icon = {Icon.Feather}
              color="#FF0E83" 
              onPress={() => navigation.navigate('Preferences')}
            />

            <CircleButton name="x" Icon = {Icon.Feather}
              color="#FF0E83" 
              onPress={() => navigation.navigate('Preferences')}
            />

            <CircleButton name="x" Icon = {Icon.Feather}
              color="#FF0E83" 
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
    }
  });
export default Home;