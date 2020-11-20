import * as React from 'react';
import { StyleSheet, Switch, View} from 'react-native';
import { CheckBox } from 'react-native-elements';

export default function CuisineOption(props: any) {
  const [isChecked, setIsChecked] = React.useState(false);
  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
    props.updatePreferences(props.cuisineID, !isChecked);
  }

  return (
      <CheckBox
        textStyle={styles.textStyle}
        containerStyle={styles.buttonStyle}
        title={props.cuisineName}
        iconRight
        iconType='material'
        checkedIcon='check'
        uncheckedIcon='add'
        checkedColor='green'
        checked={isChecked}
        onPress={toggleCheckBox}
      />
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 10,
    fontWeight: 'bold',
  }, 
  buttonStyle: {
    margin: 5,
    padding: 0
  }
});
