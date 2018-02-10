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
      confirmPassword: "",
      phoneNumber: "",
      shouldGoBack: false,
      cars: [],
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
          cars: user.cars,
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

  onPressSubmit = async () => {
    this.showSpinner();
    if (!this.validateData()) {
      return;
    }
    if (this.state.savedUserInfo) {
      var updateFields = {
        email: this.state.email,
        name: this.state.name,
        phoneNumber: this.state.phoneNumber,
      };
      if (this.state.password.length > 0) {
        updateFields.password = this.state.password;
      }
      if (this.state.cars.length > 0) {
        updateFields.cars = this.state.cars;
      }
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update(updateFields, async (error) => {
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
          await AsyncStorage.mergeItem(Constants.ASYNC_STORE_USER, JSON.stringify(updateFields));
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
    if (this.state.email.length == 0 || this.state.name.length == 0 || this.state.phoneNumber.length == 0) {
      this.showError(Strings.EMPTY_FIELDS);
      return false;
    }
    if (this.state.password.length > 0) {
      if (this.state.password.length < 6 || this.state.password.length > 25) {
        this.showError(Strings.INVALID_PASSWORD);
        return false;
      } else if (this.state.password != this.state.confirmPassword) {
        this.showError(Strings.PASSWORDS_MUST_MATCH);
        return false;
      }
    }
    if (typeof this.state.cars != 'string' && this.state.cars.length > 0) {
      for (var car of this.state.cars) {
        if (car.carBrand.length == 0 || car.carModel.length == 0 || car.carYear.length == 0 || car.carRegNumber.length == 0) {
          this.showError(Strings.EMPTY_FIELDS);
          return false;
        }
      }
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

  onPressAddCar = () => {
    var cars = this.state.cars;
    var car = {
      carBrand: "",
      carModel: "",
      carYear: "",
      carRegNumber: "",
    }
    if (typeof cars == 'string') {
      cars = [car];
    } else {
      cars.push(car);
    }
    this.setState({
      cars: cars,
    })
  }

  getRef(i, field) {
    return 'car' + i + field + 'Field';
  }

  onPressDelete = () => {
    var cars = this.state.cars;
    cars.pop();
    this.setState({
      cars: cars,
    });
  }

  updateCar = (car, i, value, param) => {
    var cars = this.state.cars;
    cars[i][param] = value;
    this.setState({
      cars: cars,
    });
  }

  renderCar(car, i) {
    return (
      <View key={i}>
        <View style={styles.carTitleRow}>
          <Text style={styles.carTitle}>{Strings.CAR} #{i+1}</Text>
          {
            i == this.state.cars.length - 1 ?
            <TouchableOpacity onPress={this.onPressDelete}>
              <Image style={styles.deleteIcon} resizeMode='cover' source={require('../../images/icon_delete.png')}/>
            </TouchableOpacity>
            : null
          }
        </View>
        <View style={styles.carRow}>
          <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntryShort}
            onChangeText={(value) => this.updateCar(car, i, value, 'carBrand')}
            ref={this.getRef(i, 'brand')} returnKeyType='next'
            onSubmitEditing={(event) => { this.refs['car' + i + 'modelField'].focus(); }}
            placeholder={Strings.CAR_BRAND_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.cars[i].carBrand} />
          <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntryShort}
            onChangeText={(value) => this.updateCar(car, i, value, 'carModel')}
            ref={this.getRef(i, 'model')} returnKeyType='next'
            onSubmitEditing={(event) => { this.refs['car' + i + 'yearField'].focus(); }}
            placeholder={Strings.CAR_MODEL_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.cars[i].carModel} />
        </View>
        <View style={styles.carRow}>
          <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntryShort}
            onChangeText={(value) => this.updateCar(car, i, value, 'carYear')}
            ref={this.getRef(i, 'year')} returnKeyType='next' keyboardType='numeric'
            onSubmitEditing={(event) => { this.refs['car' + i + 'regNumberField'].focus(); }}
            placeholder={Strings.CAR_YEAR_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.cars[i].carYear} />
          <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntryShort}
            onChangeText={(value) => this.updateCar(car, i, value, 'carRegNumber')}
            ref={this.getRef(i, 'regNumber')}
            placeholder={Strings.CAR_REG_NUMBER_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.cars[i].carRegNumber} />
        </View>
      </View>
    );
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
            <Text style={styles.sectionTitle}>{Strings.PERSONAL_INFO}</Text>
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({email: value})}
              ref='emailField' returnKeyType='next' keyboardType='email-address'
              onSubmitEditing={(event) => { this.refs.nameField.focus(); }}
              placeholder={Strings.EMAIL_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.email} />
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({name: value})}
              ref='nameField' returnKeyType='next'
              onSubmitEditing={(event) => { this.refs.passwordField.focus(); }}
              placeholder={Strings.NAME_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.name} />
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({password: value})}
              ref='passwordField' returnKeyType='next' secureTextEntry={true}
              onSubmitEditing={(event) => { this.state.password.length > 0 ? this.refs.confirmPasswordField.focus() : this.refs.phoneNumberField.focus() }}
              placeholder={Strings.NEW_PASSWORD_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.password} />
            {
              this.state.password.length > 0 ?
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({confirmPassword: value})}
                ref='confirmPasswordField' returnKeyType='next' secureTextEntry={true}
                onSubmitEditing={(event) => { this.refs.phoneNumberField.focus(); }}
                placeholder={Strings.CONFIRM_PASSWORD_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.confirmPassword} />
              : null
            }
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({phoneNumber: value})}
              ref='phoneNumberField' returnKeyType='next'
              placeholder={Strings.PHONE_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.phoneNumber} />
            <Text style={styles.sectionTitle}>{Strings.CARS_INFO}</Text>
            {
              this.state.cars.length > 0 ?
              this.state.cars.map((car, i) =>
              this.renderCar(car, i))
              : null
            }
            <TouchableOpacity style={[styles.submitButton, {backgroundColor: Colors.ACCENT_LIGHT}]} onPress={this.onPressAddCar}>
              <Text style={styles.submitButtonText}>
                {Strings.ADD_CAR.toUpperCase()}
              </Text>
            </TouchableOpacity>
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
  sectionTitle: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  carTitle: {
    fontSize: 14,
  },
  carTitleRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  carRow: {
    flexDirection: 'row',
  },
  textEntryShort: {
    width: 150,
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
    paddingBottom: 10,
    fontSize: 14,
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
