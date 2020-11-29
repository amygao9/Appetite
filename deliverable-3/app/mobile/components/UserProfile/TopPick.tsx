import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import colors from '../../constants/Colors';

export default function TopPick(props) {
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'space-around'
        },     
        restaurantImage: {
            width: 48,
            height: 48,
            borderRadius: 48/2
        }, 
        name: {
            padding: 15,
            color: colors.offWhite, 
            fontSize: 18,
            fontWeight: 'bold'
        }, 
        categories: {
            padding: 15,
            color: colors.offWhite, 
            fontSize: 18,
            fontStyle: 'italic'
        }, 
        rating: {
            padding: 15,
            color: 'gold', 
            fontSize: 18,
            fontWeight: 'bold', 
        }
    });

    return (
        <View style={styles.container}>
            <Image style={styles.restaurantImage} source={{ uri: props.imageURI}}/>
            <Text style={styles.name}>{props.restaurantName}</Text> 
            <Text style={styles.categories}>{props.categories}</Text> 
            <Text style={styles.rating}>{props.rating}</Text> 
        </View> 
        
    )
}