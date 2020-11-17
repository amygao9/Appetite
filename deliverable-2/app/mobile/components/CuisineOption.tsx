import * as React from 'react';
import { StyleSheet, Switch, View} from 'react-native';
import { CheckBox } from 'react-native-elements';

export default function CuisineOption(props: any) {
  const [isChecked, setIsChecked] = React.useState(false);
  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
    props.updatePreferences(props.cuisineName, !isChecked);
  }

  return (
      <CheckBox
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
