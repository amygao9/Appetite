import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions } from 'react-native'
import {Button } from 'react-native-elements';

const { height } = Dimensions.get('window')

export const Card = (props: any) => 
(
  <View style={styles.card}>
    <Image
      style={styles.image}
      source={props.card.photo}
      resizeMode="cover"
    />
    <View style={styles.photoDescriptionContainer}>
      <Text style={styles.title}>
        {`${props.card.title}`}
      </Text>
      <Text style={styles.category}>
        {`${props.card.description}`}
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
        onPress={() => props.navigation.navigate('Restaurant Details', 
        {title: props.card.title, 
          description: props.card.description,
          photo: props.card.photo,
          address: props.card.address,
          rating: props.card.rating,
          price: props.card.price,
          id: props.card.id
        })}/>
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
      height: height - height*0.4,
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