import * as React from 'react';
import { StyleSheet, FlatList, SectionList, Text, View } from 'react-native';
import CuisineOption from './CuisineOption';
import colors from '../../constants/Colors';


export default function CuisineOptionSection(props: any) {

  return (
    <View style={styles.container}>
        <Text style={styles.sectionHeader}>
          {props.sectionName}
        </Text>

        <FlatList
            numColumns= {3}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={props.options}
            renderItem={({ item }) => <CuisineOption cuisineName={item.displayText} cuisineID={item.id} updatePreferences={props.updatePreferences} checked={item.selected}/>}
            keyExtractor={(item) => item.displayText}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 30
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingBottom: 2,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.offWhite
  }
});
