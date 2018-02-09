import React from 'react';
import { StyleSheet, View, Button, Image, Text, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { Strings } from '../../Strings.js';
import { NavigationUtils } from '../../util/NavigationUtils';
const timer = require('react-native-timer');
import Expo from 'expo';
import * as firebase from 'firebase';

export default class SplashScreen extends React.Component {

  static navigationOptions = { title: 'Splash', header: null };

  constructor(props){
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
  }

  loadFont = () => {
    Expo.Font.loadAsync({
      'autobus': require('../../assets/fonts/autobus.ttf'),
    });
  }

  async componentWillMount() {
    firebase.initializeApp(Constants.getEnvironment().FIREBASE_CONFIG);
    await this.loadFont();
  }

  async componentDidMount() {
    var screen = 'Intro';

    var callToUnsubscribe = await firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        screen = 'UserHome';
      } else {
        screen = 'Intro';
      }
    });
    callToUnsubscribe();
    timer.setTimeout(this, 'Splash Timer', () => NavigationUtils.navigateWithoutBackstack(this.props.navigation, screen), Constants.SPLASH_DELAY_MILLIS);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image style={styles.logo} resizeMode='contain' source={require('../../images/app_icon.png')}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
  },
});
