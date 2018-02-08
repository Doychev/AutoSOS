import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import FadeAnimation from '../elements/FadeAnimation';
var {height, width} = Dimensions.get('window');
import * as firebase from 'firebase';
import { NavigationUtils } from '../../util/NavigationUtils';
import Spinner from 'react-native-loading-spinner-overlay';

export default class IntroScreen extends React.Component {
  static navigationOptions = { title: 'Intro', header: null };

  constructor(props) {
    super(props);
    this.state = {
      contentVisible : false,
      bottomButtonsVisible : false,
      loginFieldsVisible : false,
      autoPlayEnable : true,
      spinnerVisible : false,
    }
  }

  componentDidMount() {
    this.setState({
      contentVisible: true,
      bottomButtonsVisible : true,
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
          if (snapshot) {
            console.log(snapshot);
            // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
          } else {
            console.log('errorReading');
          }
        }, (error) => {
          console.log('errorCaught');
        });
        this.hideSpinner();
        NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'UserHome');
      }

      // Do other things
    });
  }

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      Constants.getEnvironment().FACEBOOK_APP_ID,
      { permissions: Constants.FACEBOOK_PERMISSIONS }
    );

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase.auth().signInWithCredential(credential).catch((error) => {
        this.hideSpinner();
        console.log(error);
      });
    }
  }

  onPressIntroLogin = async () => {
    this.setState({
      bottomButtonsVisible: false,
      loginFieldsVisible: true,
      autoPlayEnable: false,
    });
  }

  onPressIntroRegister = () => {
    //navigate elsewhere
  }

  onPressLogin = async () => {
    this.showSpinner();
    this.setState({
      loginFieldsVisible: false,
      bottomButtonsVisible: true,
    });
    this.hideSpinner();
  }

  onPressFacebook = async () => {
    this.showSpinner();
    this.loginWithFacebook();
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <FadeAnimation style={styles.container} visible={this.state.contentVisible}>
          <IndicatorViewPager
            ref="viewPager"
            onPageScroll={this.onPagerScroll}
            style={styles.viewPager}
            horizontalScroll={false}
            autoPlayEnable={this.state.autoPlayEnable}
            autoPlayInterval={Constants.INTRO_AUTOPLAY_INTERVAL}
            >
            <View style={styles.imageTab}>
              <Image style={styles.image} resizeMode='cover' source={require('../../images/intro1.png')}/>
            </View>
            <View>
              <Image style={styles.image} resizeMode='cover' source={require('../../images/intro2.png')}/>
            </View>
            <View>
              <Image style={styles.image} resizeMode='cover' source={require('../../images/intro3.png')}/>
            </View>
            <View>
              <Image style={styles.image} resizeMode='cover' source={require('../../images/intro4.png')}/>
            </View>
          </IndicatorViewPager>
          <View style={styles.title}>
            <View style={styles.titleRow}>
              <Image style={styles.logo} resizeMode='contain' source={require('../../images/app_icon.png')}/>
              <Text style={styles.titleText}>{Strings.APP_TITLE}</Text>
            </View>
            <Text style={styles.descText}>{Strings.INTRO_DESC}</Text>
          </View>
          <View style={styles.loginFields}>
            <FadeAnimation visible={this.state.loginFieldsVisible}>
              <TextInput underlineColorAndroid={Colors.GRAY} keyboardType='email-address' style={styles.textEntry}
                onChangeText={(value) => this.setState({loginEmail: value})}
                ref='emailField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.passwordField.focus(); }}
                placeholder={Strings.EMAIL_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.loginEmail} />
              <TextInput underlineColorAndroid={Colors.GRAY} secureTextEntry={true} style={styles.textEntry}
                onChangeText={(value) => this.setState({loginPassword: value})}
                ref='passwordField'
                returnKeyType='go'
                onSubmitEditing={(event) => { this.onPressLogin() }}
                placeholder={Strings.PASSWORD_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.loginPassword} />
              <TouchableOpacity style={styles.button} onPress={this.onPressLogin}>
                <Text style={styles.buttonText}>
                  {Strings.LOGIN}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.fbButton]} onPress={this.onPressFacebook}>
                <View style={styles.row}>
                  <Image style={styles.fbIcon} resizeMode='contain' source={require('../../images/ic_facebook.png')}/>
                  <Text style={styles.buttonText}>
                    {Strings.FACEBOOK_LOGIN}
                  </Text>
                </View>
              </TouchableOpacity>
            </FadeAnimation>
          </View>
          <View style={styles.bottomButtons}>
            <FadeAnimation visible={this.state.bottomButtonsVisible}>
              <TouchableOpacity style={styles.button} onPress={this.onPressIntroLogin}>
                <Text style={styles.buttonText}>
                  {Strings.LOGIN}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={this.onPressIntroRegister}>
                <Text style={styles.buttonText}>
                  {Strings.REGISTER}
                </Text>
              </TouchableOpacity>
            </FadeAnimation>
            <Text style={styles.disclaimer}>{Strings.LOGIN_DISCLAIMER}</Text>
            <View style={styles.marginBottom}/>
          </View>
        </FadeAnimation>
      </View>
    );
  }

  // indicator={this.renderDotIndicator()}
  // renderDotIndicator() {
  //   return <PagerDotIndicator pageCount={4} />;
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
  },
  imageTab: {
    backgroundColor: Colors.OVERLAY,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 20,
  },
  image: {
    width: width,
    height: '100%',
  },
  statusBarOverlay: {
    height: Expo.Constants.statusBarHeight,
    backgroundColor: Colors.ACCENT,
  },
  title: {
    position: 'absolute',
    top: 0,
    width: width,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  viewPager: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  titleText: {
    fontFamily: 'autobus',
    color: Colors.WHITE,
    fontSize: 50,
    textShadowColor: Colors.BLACK,
    textShadowRadius: 3,
    textShadowOffset: {width: 3, height: 3},
  },
  descText: {
    fontFamily: 'autobus',
    color: Colors.WHITE,
    fontSize: 16,
    marginTop: 10,
    textShadowColor: Colors.BLACK,
    textShadowRadius: 3,
    textShadowOffset: {width: 3, height: 3},
  },
  loginFields : {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textEntry : {
    color: Colors.WHITE,
    width: 300,
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    fontSize: 18,
    textShadowColor: Colors.BLACK,
    textShadowRadius: 3,
    textShadowOffset: {width: 3, height: 3},
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.ACCENT,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fbButton: {
    backgroundColor: Colors.FACEBOOK_BLUE,
  },
  fbIcon: {
    height: 25,
    width: 25,
  },
  buttonText: {
    fontFamily: 'autobus',
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 16,
    textShadowColor: Colors.BLACK,
    textShadowRadius: 3,
    textShadowOffset: {width: 3, height: 3},
    paddingLeft: 20,
    paddingRight: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
  disclaimer: {
    color: Colors.WHITE,
    fontSize: 10,
    textAlign: 'center',
  }
});
