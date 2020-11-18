import * as React from 'react';
import { StyleSheet, Image, SafeAreaView, Button } from 'react-native';
import { Feather as Icon } from "@expo/vector-icons";
import { SimpleLineIcons as Like } from "@expo/vector-icons";
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Swiper from 'react-native-deck-swiper';
import Card from '../components/Card';

const photoCards = [
  {
    title: "Restaurant 1",
    description: "cool",
    photo: require('./../assets/images/restaurant.jpg'),
    key: 'caseex6qfO4TPMYyhorner',
  },
  {
      title: "Restaurant 2",
      description: "cooler",
      photo: require('./../assets/images/restaurant.jpg'),
      key: 'caseex6qfO4TPMYyhorgyur',
  }
]
const TabOneScreen = () => {
  const dislike = () => {
    console.log("pressed x button")
  }
  const like = () => {
    console.log("pressed like button")
  }
  const superlike = () => {
    console.log("pressed superlike button")
  }
  return (
    <SafeAreaView style={styles.container}>
        <Swiper
            cards={photoCards}
            renderCard={card => <Card card={card} />}
            onSwiped={(cardIndex) => {console.log(cardIndex)}}
            onSwipedAll={() => {console.log('finished stack')}}
            cardIndex={0}
            verticalSwipe = {false}
            backgroundColor={'#191A1D'}
            stackSize= {3}>
        </Swiper>
      <View style={styles.footer}>
          <View style={styles.circle}>
            <Icon name="x" size={32} color="#ec5288" onPress={dislike} />
          </View>
          <View style={styles.circle}>
            <Icon name="heart" size={32} color="#6ee3b4" onPress={superlike} />
          </View>
          <View style={styles.circle}>
            <Like name="like" size={32} color="#6F05D6" onPress={like} />
          </View>
        </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 0.8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cards: {
    flex: 1,
    margin: 8,
    zIndex: 100,
  },
  footer: {
    flex: 0.1,
    position: 'absolute',
    bottom:0,
    backgroundColor: 'transparent',
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "gray",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  stretch: {
    resizeMode: 'stretch',
  }
});
export default TabOneScreen;
        