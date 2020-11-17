import * as React from 'react';
import { StyleSheet, FlatList, SectionList} from 'react-native';
import { Text, View } from './Themed';
import CuisineOption from '../components/CuisineOption';

export default function CuisineOptionSection(props: any) {

  return (
    <View style={styles.container}>
        <Text style={styles.sectionHeader}>{props.sectionName}</Text>

        <FlatList
            style={styles.optionsList}
            numColumns= {3}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={props.options}
            renderItem={({ item }) => <CuisineOption cuisineName={item} updatePreferences={props.updatePreferences}/>}
            keyExtractor={(item) => item}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingBottom: 2,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  }, 
  optionsList: {
  }
});
