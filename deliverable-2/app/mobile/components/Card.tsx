import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions, Button } from 'react-native'
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
      <Text style={styles.text}>
        {`${card.title}`}
      </Text>
      <Text style={styles.text}>
        {`${card.description}`}
      </Text>
      <Button 
        title="Menu >"
        onPress={() => console.log('Simple Button pressed')}/>
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
      height: height - 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "white",
      borderRadius: 5,
      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 6,
      shadowOpacity: 0.3,
      elevation: 2,
    },
    image: {
      borderRadius: 5,
      flex: 1,
      width: '100%',
    },
    photoDescriptionContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'column',
      height: '100%',
      position: 'absolute',
      left: 10,
      bottom: 10,
    },
    text: {
      textAlign: 'center',
      fontSize: 20,
      color: "white",
      fontFamily: 'Roboto_700Bold',
      textShadowColor: "black",
      textShadowRadius: 10,
    },
  })
export default Card