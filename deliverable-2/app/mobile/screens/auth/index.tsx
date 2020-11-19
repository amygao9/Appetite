import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {LongButton, Container, LoginForm} from "../../components";

const Auth = ({navigation}) => {
    const [currentView, setView] = React.useState('main');

    const styles = StyleSheet.create({
        logo: {
          width: 270,
          height: 100,
          alignSelf: 'center',
        },
      });

    const Main = (
        <View>
            <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
            />
            <LongButton title="LOGIN" onPress={() => setView("login")}/>
            <LongButton title="SIGN UP" onPress={() => setView("signup")} secondary />
        </View>
    )
    
    const Login = (
        <View>
            <Image
                style={styles.logo}
                source={require('../../assets/images/logo.png')}
            />
            <LoginForm />
            <LongButton title="LOGIN" onPress={() => navigation.navigate('Home')} />
        </View>
    )

    const SignUp = (
        <View>
            <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
            />
            <LongButton title="SIGN UP" secondary />
        </View>
    )

    let view;
    if (currentView == 'main') {
        view = Main;
    } else if (currentView == 'login') {
        view = Login;
    } else {
        view = SignUp;
    }
    
    return (
        <Container>
            {view}
        </Container>
    )
}

export default Auth; 