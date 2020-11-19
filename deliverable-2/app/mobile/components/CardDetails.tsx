import React, {useRef} from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions, SafeAreaView} from 'react-native'
import {Button } from 'react-native-elements';
const { height } = Dimensions.get('window');

export default function CardDetails({ details }: RestaurantProps) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.upper}>
          <Image
              style={styles.image}
              source={require('../assets/images/restaurant.jpg')}
              resizeMode="cover"
          />
        </View>
        <View style={styles.lower}>

        </View>
      </SafeAreaView>
      
    );
}
type RestaurantProps = {
    details: FixedShape
}
type FixedShape =  {
    photo: ImageSourcePropType, 
    title: string, 
    description: string
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    upper: {
      /* Setting the height according to the screen height*/
      paddingTop:20,
      paddingBottom:20,
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lower: {
      /* Setting the height according to the screen height*/
      backgroundColor: "white",
      flex: 5,
    },
    image: {
      borderRadius: 10,
      flex: 1,
      width: '95%'
    },
    photoDescriptionContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'column',
      height: '100%',
      position: 'absolute',
      left: 15,
      bottom: 30,
    },
    rightSideContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'column',
      height: '100%',
      position: 'absolute',
      right: 15,
      bottom: 20,
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
      color: "white",
      fontFamily: 'Roboto_700Bold',
    },
    category: {
      paddingTop: 10,
      textAlign: 'center',
      fontSize: 16,
      color: "white",
      opacity: 0.60,
      fontFamily: 'Roboto_700Bold',
    },
  })