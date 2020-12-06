import React, {useState} from 'react';
import { View, Text, Image, Dimensions, ImageSourcePropType, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import { Divider } from 'react-native-elements';
import * as Icon from '@expo/vector-icons';
import {apiGetDetails} from "../api/restaurantAPI";
import colors from "../constants/Colors";
import layout from "../constants/Layout";
import Carousel from "react-native-snap-carousel";

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

    const renderItem = ({item, index}) => {
      console.log(item)
      return (
        <View style={styles.carousel} key={index}>
        <Image
          style={styles.image}
          source={{uri: item}}
          resizeMode="cover"
        />
      </View>
      );
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
          <Carousel
          layout={"default"}
          data={details["imageURL"]}
          sliderWidth={400}
          itemWidth={400}
          renderItem={renderItem}
          autoplay={true}
          loop={true}
          /> 
        )}
        </View> 
        <ScrollView style={styles.lower}>
        <View style={styles.lower}>
        <Text style={styles.category}>{`${description}`}</Text>
        <View style={{ flexDirection: 'column'}}>
          <View style={styles.row}>
              <Icon.MaterialIcons name="location-on" style={styles.icons} iconRight title="Mail" color={colors.blue}/>
              <Text style={styles.category}>{`${address}`}</Text>
          </View>
          <View style={styles.row}>
              {rating % 1 == 0.5 && (Array.from(Array(rating-0.5), (e, i) => {
                return (
                  <Icon.MaterialIcons name="star" style={styles.icons} color={"gold"} key={i}/>  
                )
              }))}
              {rating % 1 == 0.5 && 
                  <Icon.MaterialIcons name="star-half" style={styles.icons} color={"gold"}/>  
              }
              {rating % 1 == 0.5 && (Array.from(Array(4-rating+0.5), (e, i) => {
                return (
                  <Icon.MaterialIcons name="star-border" style={styles.icons} color={"gold"} key={i}/>  
                )
              }))}
              {rating % 1 == 0 && (Array.from(Array(rating), (e, i) => {
                return (
                  <Icon.MaterialIcons name="star" style={styles.icons} color={"gold"} key={i}/>  
                )
              }))}
              {rating % 1 == 0 && (Array.from(Array(5-rating), (e, i) => {
                return (
                  <Icon.MaterialIcons name="star-border" style={styles.icons} color={"gold"} key={i}/>  
                )
              }))}
          </View>
          <View style={styles.row}>
          {(Array.from(Array(price), (e, i) => {
                return (
                  <Icon.MaterialIcons name="attach-money" style={styles.icons} color={colors.green} key={i}/>  
                )
              }))}
          </View>
          {!isLoading && (
          <View style={styles.row}>
            <Icon.MaterialIcons name="phone" style={styles.icons} color={colors.blue}/>
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
      backgroundColor: colors.white,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      marginLeft: 15
    },
    carousel: {
      //width: layout.window.width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'transparent',
    },
    upper: {
      backgroundColor: colors.darkGray,
      paddingTop:20,
      height: height - height*0.70,
      paddingBottom:20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lower: {

      backgroundColor: colors.white,
      flex: 5,
    },
    image: {
      
      borderRadius: 10,
      flex: 1,
      width: '95%'
    },
    icons: {
      paddingTop: 20,
      paddingRight: 10,
      fontSize: 24,
      //color: colors.black,
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
      fontFamily: 'Roboto_500Medium',
    },
    hours: {
      paddingTop: 10,
      paddingLeft: 30,
      paddingRight: 30,
      textAlign: 'left',
      fontSize: 16,
      color: colors.black,
      fontFamily: 'Roboto_500Medium',
    }
  })