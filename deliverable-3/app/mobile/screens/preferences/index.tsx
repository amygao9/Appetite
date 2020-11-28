import * as React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import CuisineOptionSection from '../../components/Preferences/CuisineOptionSection';
import Slider from '@react-native-community/slider';
import {LongButton} from "../../components";
import colors from '../../constants/Colors';
import { LogBox } from 'react-native';

import {HorizontalScrollPicker} from '../../components/react-native-horizontal-scroll-picker';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);


const priceOptions = [{label: 'Any Price', value: 0}, {label: '$', value: 1}, {label: '$$', value: 2}, {label: '$$$', value: 3}, {label: '$$$$', value: 4}]

const Preferences = ({route, navigation}) => {
  const [cuisinePreferences, setCuisinePreferences] = React.useState(route.params.cuisinePreferences); 
  const [distanceRadius, setDistanceRadius] = React.useState(route.params.searchRadius); 
  const [pricePreference, setPricePreference] = React.useState(route.params.pricePreference)
  
  const isSelected = (item: string) => {
    return cuisinePreferences.includes(item) 
  }

  //stores cuisine options (this is an alternative to persisting cuisine preferences for each user in the database, which is a TO-DO item for future deliverables)
  const cuisines = [
    {name: "Cuisines", options: [{displayText: 'Traditional American', id: 'tradmerican', selected: isSelected('tradmerican')}, {displayText: 'Italian', id: 'italian', selected: isSelected('italian')}, {displayText: 'Chinese', id: 'chinese', selected: isSelected('chinese')}, {displayText: 'Korean', id: 'korean', selected: isSelected('korean')}, {displayText: 'Japanese', id: 'japanese', selected: isSelected('japanese')}, {displayText: 'Greek', id: 'greek', selected: isSelected('greek')}]}, 
    {name: "Popular Items", options: [{displayText: 'Sandwiches', id: 'sandwiches', selected: isSelected('sandwiches')}, {displayText: 'Bakeries', id: 'bakeries', selected: isSelected('bakeries')}, {displayText: 'Ice Cream', id: 'icecream', selected: isSelected('icecream')}, {displayText: 'Salad', id: 'salad', selected: isSelected('salad')}, {displayText: 'Desserts', id: 'desserts', selected: isSelected('desserts')}, {displayText: 'Coffee', id: 'coffee', selected: isSelected('coffee')}]},
    {name: "Dietary", options: [{displayText: 'Gluten Free ', id: 'glutenfree', selected: isSelected('glutenfree')}, {displayText: 'Vegan', id: 'vegan', selected: isSelected('vegan')}]} 
  ]

  //function that is passed to child components, to update the list of selected cuisines
  const updatePreferences = (option: string, checked: boolean) => {
    
    if(cuisinePreferences.includes(option) && !checked){
      cuisinePreferences.splice(cuisinePreferences.indexOf(option), 1)
    } else if (!cuisinePreferences.includes(option) && checked){
      cuisinePreferences.push(option)
    }

    setCuisinePreferences(cuisinePreferences) 
  }

  //maps the cuisines array to sections and options that will be visible to user 
  const cuisineSections = cuisines.map((section,index) => <CuisineOptionSection key={index} sectionName={section.name} options ={section.options} updatePreferences={updatePreferences}/>)

  const applyPreferences = () => {
    //passes in the selected cuisines and distance radius to the main page 
    navigation.goBack(); 
    route.params.onGoBack(cuisinePreferences, distanceRadius, pricePreference);
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
            value={distanceRadius}
            onValueChange={slideValue => setDistanceRadius(slideValue)}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b9e4c9"
            />
            
            <Text style={{color: colors.offWhite, alignSelf: 'center'}} >
            Look for restaurants within: {distanceRadius.toFixed(1)}km
            </Text>
        </View> 


        <View style={styles.priceOptions}> 
          <HorizontalScrollPicker
            items={priceOptions}
            textStyle={styles.textStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.pricesContainer}
            itemStyle={styles.itemContainer}
            selectorStyle={styles.selectedItem}
            onSelect={(selection) => setPricePreference(selection)}
            initialIdx={pricePreference}
          />
        </View> 


        <View style={styles.buttonsPanel}> 
            <LongButton title="Apply" onPress={() => applyPreferences()} secondary/>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingLeft: 5
  },
  title: {
    flex: 1.5, 
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 80, 
    color: colors.offWhite
  },
  cuisineSections: {
    flex: 7
  },

  buttonsPanel: {
    flex: 2, 
    width: 250
  },
  distanceSlider: {
    width: 250, 
    height: 40,
    flex: 2
  },   
  priceOptions: {
    flex: 2
  }, 
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    padding: 10
  },
  selectedItem: {
    flex: 1,
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.offWhite, 
    borderRadius: 12,
  },
  textStyle: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: colors.offWhite, 
      fontSize: 18,
  },
  selectedTextStyle: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.offWhite, 
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricesContainer: {
    flexGrow: 0,
    flexDirection: 'row',
  },  
});






export default Preferences;