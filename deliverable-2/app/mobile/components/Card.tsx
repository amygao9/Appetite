import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions } from 'react-native'
import {Button } from 'react-native-elements';

const { height } = Dimensions.get('window')

export const Card = ({ card }: CardProps) => 
(
  <View style={styles.card}>
    <Image
      style={styles.image}
      source={card.photo}
      resizeMode="cover"
    />
    <View style={styles.photoDescriptionContainer}>
      <Text style={styles.title}>
        {`${card.title}`}
      </Text>
      <Text style={styles.category}>
        {`${card.description}`}
      </Text>
      </View>
    <View style = {styles.rightSideContainer}>
      <Button 
        title="Menu >"
        titleStyle={{
          color: "white",
          fontSize: 16,
          fontFamily: 'Roboto_700Bold',
        }}
        type="clear"
        onPress={() => console.log('Menu Button pressed')}/>
    </View>
    
  </View>
)
type FixedShape =  {
    photo: ImageSourcePropType, 
    title: string, 
    description: string
  }
  
type CardProps = {
    card: FixedShape
}

const styles = StyleSheet.create({
    card: {
      /* Setting the height according to the screen height*/
      height: height - 375,
      backgroundColor: "black",
      borderRadius: 10
    },
    image: {
      borderRadius: 10,
      flex: 0.82,
      width: '100%',
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
export default Card