import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput, AsyncStorage } from 'react-native';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import FadeAnimation from '../elements/FadeAnimation';
var {height, width} = Dimensions.get('window');
import * as firebase from 'firebase';
import { NavigationUtils } from '../../util/NavigationUtils';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from './../elements/Dialog';

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
      dialogDescriptionText : Strings.LOGIN_FAILED,
      isFbReg: false,
    }
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  async componentDidMount() {
    this.setState({
      contentVisible: true,
      bottomButtonsVisible : true,
    });

    var callToUnsubscribe = firebase.auth().onAuthStateChanged( async (user) => {
      if (user != null) {
        firebase.database().ref('/users/' + user.uid).once('value').then( async (snapshot) => {
          if (snapshot.val()) {
            //registered
            await AsyncStorage.setItem(Constants.ASYNC_STORE_USER, JSON.stringify(snapshot.val()));
          } else {
            //not registered
            if (this.state.isFbReg) {
              firebase.database().ref('/users/' + user.uid).set({
                name: user.providerData[0].displayName,
                email: user.providerData[0].email,
                phoneNumber: "",
                password: "",
                cars: "",
                isFbUser: true, //TODO fix that
                userType: "user",
              }, (error) => {
                this.showError();
                return;
              });
            }
          }
        }, (error) => {
          this.showError();
        });
        this.hideSpinner();
        callToUnsubscribe();
        NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'UserHome');
      }
    });
  }

  async loginWithFacebook() {
    this.setState({
      isFbReg: true,
    });
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      Constants.getEnvironment().FACEBOOK_APP_ID,
      { permissions: Constants.FACEBOOK_PERMISSIONS }
    );

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase.auth().signInWithCredential(credential).catch((error) => {
        this.showError();
        console.log(error);
      });
    } else {
      this.showError();
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
      isFbReg: false,
    });

    //todo real login
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

  onPressDialogConfirm() {
    this.dialog.hideDialog();
    if (this.state.reportSucceeded) {
      this.props.navigation.dispatch(NavigationActions.back());
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  showError(message) {
    if (message) {
      this.setState({
        dialogDescriptionText : message,
      });
    }
    this.hideSpinner();
    if (this.dialog) {
      this.dialog.showDialog();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
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
