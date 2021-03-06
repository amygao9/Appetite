import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Switch, View} from 'react-native';
import { Input } from 'react-native-elements';
import colors from '../../constants/Colors';

export default function LoginForm(props) {
    const styles = StyleSheet.create({
            input: {
                backgroundColor: colors.offWhite,
                color: colors.darkGray,
                padding: 15,
                borderRadius: 40
            },
            label: {
                color: colors.green,
                fontFamily: 'Roboto_700Bold'
            },
            container: {
                borderBottomWidth: 0
            }
    });

    return (
        <>
            <Input
                label='Email'
                onChangeText={props.onChangeEmail}
                labelStyle={styles.label}
                underlineColorAndroid="transparent"
                inputStyle={styles.input}
                inputContainerStyle={styles.container}
            />
            <Input
                label='Password'
                onChangeText={props.onChangePassword}
                labelStyle={styles.label}
                underlineColorAndroid="transparent"
                inputStyle={styles.input}
                inputContainerStyle={styles.container}
                secureTextEntry={true}
            />
        </>
    )
}