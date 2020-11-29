import React, {useState} from 'react';
import { View, Text, Image, Dimensions, ImageSourcePropType, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import { Divider } from 'react-native-elements';
import * as Icon from '@expo/vector-icons';
import {apiGetDetails} from "../api/restaurantAPI";
import colors from "../constants/Colors";
import layout from "../constants/Layout";
import Carousel from "react-native-carousel";

const { height } = Dimensions.get('window')
export default function CardDetails({ route, navigation }) {
  const {title, description, photo, address, rating, price, id} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      fetchDetails()});
    }, [navigation]);

  async function fetchDetails() {
    try {
      console.log(height)
      const details = await apiGetDetails(id);
      console.log(details)
      setDetails(details)
      setLoading(false)
    }
    catch(err) {
      if (err.message === "auth invalid") {
        navigation.navigate("Auth");
      }
    }
    }
    return (
      <SafeAreaView style={styles.container}>
        
        <View style={styles.upper}>
        {isLoading && ( 
          <Image
            style={styles.image}
            source={photo}
            resizeMode="cover"
          /> )}
        {!isLoading && ( 
          <Carousel>
            <View style={styles.carousel}>
              <Image
                style={styles.image}
                source={photo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.carousel}>
              <Image
                style={styles.image}
                source={{uri: details["imageURL"][1]}}
                resizeMode="cover"
            />
            </View>
            <View style={styles.carousel}>
              <Image
                style={styles.image}
                source={{uri: details["imageURL"][2]}}
                resizeMode="cover"
            />
            </View>
          </Carousel> )}
          
        </View> 
        <ScrollView >
        <View style={styles.lower}>
        <Text style={styles.title}>{`${title}`}</Text>
        <Divider style={{ height: 3, backgroundColor: "#808080"}} />
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
          <Icon.MaterialIcons name="attach-money" style={styles.icons} />
              <Text style={styles.category}>{`${price}`+'/4'}</Text>
          </View>
          {!isLoading && (
          <View style={{ flexDirection: 'row'}}>
            <Icon.MaterialIcons name="phone" style={styles.icons} />
             <Text style={styles.category}>{`${details["phonenumber"]}`}</Text>
          </View>)} 
          
          {!isLoading && ( 
          <View>
          <Text style={styles.category}>Hours</Text>
          <Text style = {styles.hours}>{"Sunday:         " + `${details["hours"]["Sunday"]}`}</Text>
          <Text style = {styles.hours}>{"Monday:        " + `${details["hours"]["Monday"]}`}</Text>
          <Text style = {styles.hours}>{"Tuesday:       " + `${details["hours"]["Tuesday"]}`}</Text>
          <Text style = {styles.hours}>{"Wednesday: " + `${details["hours"]["Wednesday"]}`}</Text>
          <Text style = {styles.hours}>{"Thursday:     " + `${details["hours"]["Thursday"]}`}</Text>
          <Text style = {styles.hours}>{"Friday:           " + `${details["hours"]["Friday"]}`}</Text>
          <Text style = {styles.hours}>{"Saturday:      " +`${details["hours"]["Saturday"]}`}</Text>
          </View>
          )}
          {!isLoading && ( 
          <View>
          <Text style={styles.category}>Top Review</Text>
          <Text style={styles.review}>{`${details["topreview"]["reviewtext"]}`}</Text>
          </View>)}
        </View>
        </View>
        </ScrollView>
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
    carousel: {
      width: layout.window.width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    upper: {
      /* Setting the height according to the screen height*/
      paddingTop:20,
      height: height - height*0.70,
      paddingBottom:20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lower: {
      /* Setting the height according to the screen height*/
      backgroundColor: colors.offWhite,
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
      color: colors.black,
      opacity: 0.60,
    },
    title: {
      textAlign: 'left',
      paddingLeft: 10,
      paddingTop: 20,
      paddingBottom: 10,
      fontSize: 24,
      color: colors.black,
      fontFamily: 'Roboto_700Bold',
    },
    category: {
      paddingTop: 20,
      paddingLeft: 10,
      textAlign: 'left',
      fontSize: 20,
      color: colors.black,
      opacity: 0.60,
      fontFamily: 'Roboto_700Bold',
    },
    review: {
      paddingTop: 20,
      paddingLeft: 30,
      paddingRight: 30,
      paddingBottom: 30,
      textAlign: 'left',
      fontSize: 16,
      color: colors.black,
      opacity: 0.60,
      fontFamily: 'Roboto_500Medium',
    },
    hours: {
      paddingTop: 10,
      paddingLeft: 30,
      paddingRight: 30,
      textAlign: 'left',
      fontSize: 16,
      color: colors.black,
      opacity: 0.60,
      fontFamily: 'Roboto_500Medium',
    }
  })