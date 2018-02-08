import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  static navigationOptions = { title: 'Profile', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: "",
      email: "",
      isFbUser: "",
      name: "",
      password: "",
      phoneNumber: "",
      shouldGoBack: false,
    };
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  async componentDidMount() {
    this.showSpinner();
    this.loadProfile();
  }

  async loadProfile() {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then( async (snapshot) => {
      if (snapshot.val()) {
        var user = snapshot.val();
        await AsyncStorage.setItem(Constants.ASYNC_STORE_USER, JSON.stringify(user));
        this.setState({
          savedUserInfo: user,
          email: user.email,
          isFbUser: user.isFbUser,
          name: user.name,
          phoneNumber: user.phoneNumber,
        });
        this.hideSpinner();
      } else {
        this.showError();
      }
    }, (error) => {
      this.showError();
      console.log(error);
    });
  }

  onPressDialogConfirm() {
    this.dialog.hideDialog();
    if (this.state.shouldGoBack) {
      this.props.navigation.dispatch(NavigationActions.back());
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  onPressSubmit = () => {
    this.showSpinner();
    if (!this.validateData()) {
      this.showError(Strings.EMPTY_FIELDS);
      return;
    }
    if (this.state.savedUserInfo) {
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
        email: this.state.email,
        name: this.state.name,
        phoneNumber: this.state.phoneNumber,
        isFbUser: this.state.isFbUser,
      }, (error) => {
        this.hideSpinner();
        if (error) {
          this.setState({
            shouldGoBack: true,
          });
          this.showError(Strings.SAVE_FAILED);
        } else {
          this.setState({
            shouldGoBack: true,
          });
          //it's not an error, but we reuse the util
          this.showError(Strings.SAVE_SUCCESS);
        }
      });
    } else {
      this.setState({
        shouldGoBack: true,
      });
      this.showError(Strings.SAVE_FAILED);
    }
  }

  validateData() {
    if (this.state.email.length == 0) {
      return false;
    }
    if (this.state.name.length == 0) {
      return false;
    }
    if (this.state.phoneNumber.length == 0) {
      return false;
    }
    return true;
  }

  showError(message) {
    if (message) {
      this.setState({
        dialogDescriptionText : message,
      });
    }
    this.hideSpinner();
    this.dialog.showDialog();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={Strings.PROFILE.toUpperCase()}/>
        <ScrollView>
          <View style={styles.content}>
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({email: value})}
              ref='emailField' returnKeyType='next'
              onSubmitEditing={(event) => { this.refs.nameField.focus(); }}
              placeholder={Strings.EMAIL_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.email} />
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({name: value})}
              ref='nameField' returnKeyType='next'
              onSubmitEditing={(event) => { this.refs.phoneNumberField.focus(); }}
              placeholder={Strings.NAME_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.name} />
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({phoneNumber: value})}
              ref='phoneNumberField' returnKeyType='go'
              onSubmitEditing={(event) => { this.onPressSubmit() }}
              placeholder={Strings.PHONE_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.phoneNumber} />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.submitButton} onPress={this.onPressSubmit}>
          <Text style={styles.submitButtonText}>
            {Strings.SAVE.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  statusBarOverlay: {
    height: Expo.Constants.statusBarHeight,
    backgroundColor: Colors.ACCENT,
  },
  content: {
    flex: 3,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  textEntry : {
    width: 300,
    marginTop: 20,
    paddingBottom: 10,
    fontSize: 18,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  submitButton: {
    height: 40,
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
  },
  submitButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
