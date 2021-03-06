
import React from 'react';
import { StyleSheet, Switch, View} from 'react-native';
import colors from '../../constants/Colors';

export default function CircleButton(props) {
    const styles = StyleSheet.create({
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
            margin: 10
        }

    });
    const { Icon, name, color, onPress } = props
    return (
        <View style={[styles.circle, { backgroundColor: color }]}>
            <Icon name={name} 
                size={32} 
                color= {colors.offWhite} 
                onPress={onPress} />
        </View>
        
    )
}