import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import colors from '../../constants/Colors';

export default function TopPick(props) {
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'flex-start'
        },     
        restaurantImage: {
            width: 48,
            height: 48,
            borderRadius: 48/2
        }, 
        name: {
            padding: 15,
            color: colors.offWhite, 
            fontSize: 16,
            fontWeight: 'bold'
        }, 
        categories: {
            padding: 15,
            color: colors.offWhite, 
            fontSize: 16,
            fontStyle: 'italic'
        }, 
        rating: {
            padding: 15,
            color: 'gold', 
            fontSize: 18,
            fontWeight: 'bold', 
        }, 

        imageContainer: {
            width: '15%'
        },

        nameContainer: {
            width: '30%', 
            // textWrap: 'wrap'
        },

        categoriesContainer: {
            width: '30%', 
        },

        ratingContainer: {
            width: '25%'
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}> 
                <Image style={styles.restaurantImage} source={{ uri: props.imageURI}}/>
            </View> 

            <View style={styles.nameContainer}> 
                <Text style={styles.name}>{props.restaurantName}</Text> 
            </View> 

            <View style={styles.categoriesContainer}> 
                <Text style={styles.categories}>{props.categories}</Text> 
            </View> 

            <View style={styles.ratingContainer}> 
                <Text style={styles.rating}>{props.rating}</Text> 
            </View> 
        
        
            {/* <Image style={styles.restaurantImage} source={{ uri: props.imageURI}}/>
            <Text style={styles.name}>{props.restaurantName}</Text> 
            <Text style={styles.categories}>{props.categories}</Text> 
            <Text style={styles.rating}>{props.rating}</Text>  */}

        </View> 
    )
}