import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
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
            width: '30%'
        },

        categoriesContainer: {
            width: '30%', 
        },

        ratingContainer: {
            width: '25%'
        }
    });

    return (
        <TouchableOpacity style={styles.container} onPress={() => props.navigation.navigate('Restaurant Details', 
        {title: props.card.name, 
            description: props.card.categories,
            photo: props.card.imageURL,
            address: props.card.address,
            rating: props.card.rating,
            price: props.card.price,
            id: props.card.id
          })}>
            <View style={styles.imageContainer}> 
                <Image style={styles.restaurantImage} source={{ uri: props.card.imageURL[0]}}/>
            </View> 

            <View style={styles.nameContainer}> 
                <Text style={styles.name}>{props.card.name}</Text> 
            </View> 

            <View style={styles.categoriesContainer}> 
                <Text style={styles.categories}>{props.card.categories.join(', ')}</Text> 
            </View> 

            <View style={styles.ratingContainer}> 
                <Text style={styles.rating}>{props.card.rating}</Text> 
            </View>
        </TouchableOpacity>
        
    )
}