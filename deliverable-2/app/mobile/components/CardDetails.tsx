import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, SafeAreaView} from 'react-native';
import { Divider } from 'react-native-elements';
import * as Icon from '@expo/vector-icons'
//{ details }: RestaurantProps
export default function CardDetails({ route, navigation }) {
  const {title, description, photo, address, rating, price, id} = route.params;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.upper}>
          <Image
              style={styles.image}
              source={photo}
              resizeMode="cover"
          />
        </View> 
        <View style={styles.lower}>
        <Text style={styles.title}>{`${title}`}</Text>
        <Divider style={{ height: 3, backgroundColor: '#F2F2F2' }} />
        <Text style={styles.category}>{`${description}`}</Text>
        <View style={{ flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row'}}>
              <Icon.MaterialIcons name="location-on" style={styles.icons} iconRight title="Mail"/>
              <Text style={styles.category}>{`${address}`}</Text>
          </View>
          <View style={{ flexDirection: 'row'}}>
          <Icon.MaterialIcons name="star" style={styles.icons} />
              <Text style={styles.category}>{`${rating}`+'/5'}</Text>
          </View>
          <View style={{ flexDirection: 'row'}}>
          <Icon.MaterialIcons name="phone" style={styles.icons} />
              <Text style={styles.category}>insert phone number</Text>
          </View>
          <View style={{ flexDirection: 'row'}}>
          <Icon.MaterialIcons name="attach-money" style={styles.icons} />
              <Text style={styles.category}>{`${price}`+'/4'}</Text>
          </View>
        </View>
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
    icons: {
      paddingTop: 20,
      paddingLeft: 20,
      fontSize: 24,
      color: "black",
      opacity: 0.60,
    },
    title: {
      textAlign: 'left',
      paddingLeft: 10,
      paddingTop: 20,
      paddingBottom: 10,
      fontSize: 24,
      color: "black",
      fontFamily: 'Roboto_700Bold',
    },
    category: {
      paddingTop: 20,
      paddingLeft: 10,
      textAlign: 'left',
      fontSize: 20,
      color: "black",
      opacity: 0.60,
      fontFamily: 'Roboto_700Bold',
    },
  })