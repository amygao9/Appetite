import * as React from 'react';
import { StyleSheet, Button} from 'react-native';
import { Text, View } from './Themed';
import CuisineOptionSection from './CuisineOptionSection';
import Slider from '@react-native-community/slider';

export default function UserPreferences() {

  const [cuisinePreferences, setCuisinePreferences] = React.useState(new Array()); 
  const [distanceRadius, setDistanceRadius] = React.useState(1); 

  const cuisines = [
    {name: "Most Popular", options: ['Chinese', 'American', 'Japanese', 'Korean']}, 
    {name: "Underrated", options: ['Greek', 'Mediterranean', 'Jamaican', 'English']}, 
    {name: "Overrated", options: ['Vegan', 'Ketogenic', 'Plant-based', 'Pizza Pizza']}
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

  const doneSelecting = () => {
    //user preferences to be persisted 
    console.log("done selecting, here are preferences: " + cuisinePreferences + " within " + distanceRadius + " km of me")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allows user to select favourite cuisines.</Text>

      <View style={styles.cuisineSections}> 
        {cuisineSections}
      </View>

      <Slider
        style={styles.distanceSlider}
        step={0.5}
        minimumValue={0.1}
        maximumValue={3}
        value={1}
        onValueChange={slideValue => setDistanceRadius(slideValue)}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />

      <Text>
        Look for restaurants within: {distanceRadius}km
      </Text>

      <View style={styles.buttonsPanel}> 
        <Button title="Continue" onPress={doneSelecting}/>
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
    paddingTop: 80
  },
  cuisineSections: {
    flex: 10
  },
  buttonsPanel: {
    flex: 2, 
    flexDirection: 'row'
  },
  distanceSlider: {
    width: 200, 
    height: 40,
    flex: 2
  }
});
