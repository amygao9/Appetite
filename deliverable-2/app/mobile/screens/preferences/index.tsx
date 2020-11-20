import * as React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import CuisineOptionSection from '../../components/Preferences/CuisineOptionSection';
import Slider from '@react-native-community/slider';
import {LongButton} from "../../components";
import colors from '../../constants/Colors';

const Preferences = ({navigation}) => {

  const [cuisinePreferences, setCuisinePreferences] = React.useState(new Array()); 
  const [distanceRadius, setDistanceRadius] = React.useState(1); 

  const cuisines = [
    {name: "Cuisines", options: [{displayText: 'Traditional American', id: 'tradmerican'}, {displayText: 'Italian', id: 'italian'}, {displayText: 'Chinese', id: 'chinese'}, {displayText: 'Korean', id: 'korean'}, {displayText: 'Japanese', id: 'japanese'}, {displayText: 'Greek', id: 'greek'}]}, 
    {name: "Popular Items", options: [{displayText: 'Sandwiches', id: 'sandwiches'}, {displayText: 'Bakeries', id: 'bakeries'}, {displayText: 'Ice Cream', id: 'icecream'}, {displayText: 'Salad', id: 'salad'}, {displayText: 'Desserts', id: 'desserts'}, {displayText: 'Coffee', id: 'coffee'}]},
    {name: "Dietary", options: [{displayText: 'Gluten Free ', id: 'glutenfree'}, {displayText: 'Vegan', id: 'vegan'}]} 
  ]

  const updatePreferences = (option: string, checked: boolean) => {
    
    if(cuisinePreferences.includes(option) && !checked){
      cuisinePreferences.splice(cuisinePreferences.indexOf(option), 1)
    } else if (!cuisinePreferences.includes(option) && checked){
      cuisinePreferences.push(option)
    }

    setCuisinePreferences(cuisinePreferences) 
  }

  const cuisineSections = cuisines.map((section,index) => <CuisineOptionSection key={index} sectionName={section.name} options ={section.options} updatePreferences={updatePreferences}/>)

  const applyPreferences = () => {

    console.log("hello!"); 
    //user preferences to be persisted 
    // console.log("done selecting, here are preferences: " + cuisinePreferences + " within " + distanceRadius + " km of me")
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>User Preferences</Text>

        <View style={styles.cuisineSections}> 
        {cuisineSections}
        </View>

        <View style={styles.distanceSlider}> 
            <Slider
            step={0.1}
            minimumValue={0.1}
            maximumValue={2}
            value={1}
            onValueChange={slideValue => setDistanceRadius(slideValue)}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b9e4c9"
            />
            
            <Text style={{color: colors.offWhite}} >
            Look for restaurants within: {distanceRadius.toFixed(1)}km
            </Text>
        </View> 


        <View style={styles.buttonsPanel}> 
            <LongButton title="Apply" onPress={() => {applyPreferences}} secondary/>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10, 
    paddingRight: 10
  },
  title: {
    flex: 2, 
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 80, 
    color: colors.offWhite
  },
  cuisineSections: {
    flex: 10
  },
  buttonsPanel: {
    flex: 2
  },
  distanceSlider: {
    width: 250, 
    height: 40,
    flex: 2
  }
});


export default Preferences;