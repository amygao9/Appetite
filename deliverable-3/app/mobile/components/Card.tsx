import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import {Button } from 'react-native-elements';
import colors from "../constants/Colors"
import layout from "../constants/Layout"
export const Card = (props: any) => 
(
  <View style={styles.card}>
    <Image
      style={styles.image}
      source={props.card.photo}
      resizeMode="cover"
    />
    <View style={styles.descriptionContainer}>
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
          color: colors.offWhite,
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

const styles = StyleSheet.create({
    card: {
      height: layout.window.height - layout.window.height*0.4,
      backgroundColor: colors.black,
      borderRadius: 10
    },
    image: {
      borderRadius: 10,
      flex: 0.82,
      width: '100%',
    },
    descriptionContainer: {
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
      color: colors.offWhite,
      fontFamily: 'Roboto_700Bold',
    },
    category: {
      paddingTop: 10,
      textAlign: 'center',
      fontSize: 16,
      color: colors.offWhite,
      opacity: 0.60,
      fontFamily: 'Roboto_700Bold',
    },
  })
export default Card