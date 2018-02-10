import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import CarSelectionDialog from '../elements/CarSelectionDialog';
import * as firebase from 'firebase';
import CheckBox from 'react-native-checkbox';

export default class ServiceRequestScreen extends React.Component {
  static navigationOptions = { title: 'ServiceRequest', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: "",
      checkBoxChecked: false,
      userProfile: {},
      name: "",
      phoneNumber: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      carRegNumber: "",
      preferedRepairShop: "",
      serviceDescription: "",
      requestSucceeded: false,
    };
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
    this.onPressCarSelectionDialogConfirm = this.onPressCarSelectionDialogConfirm.bind(this);
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem(Constants.ASYNC_STORE_USER);
    if (value !== null) {
      this.setState({
        userProfile: JSON.parse(value),
      });
    } else {
      //show error, navigate back?
    }
  }

  onPressCarSelectionDialogConfirm(car) {
    this.carSelectionDialog.hideDialog();
    this.fillData(car);
  }

  onPressDialogConfirm() {
    this.dialog.hideDialog();
    if (this.state.requestSucceeded) {
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
    this.dialog.showDialog();
  }

  onCheck = (isChecked) => {
    this.setState({
      checkBoxChecked: !isChecked,
    });
    if (!isChecked) {
      //it's now changed to checked
      var cars = this.state.userProfile.cars;
      var car = {};
      if (typeof cars == 'object' && cars.length > 0) {
        if (cars.length == 1) {
          car = cars[0];
          this.fillData(car);
        } else {
          this.carSelectionDialog.showDialog();
        }
      }
    } else {
      //it's not checked
      this.setState({
        name: "",
        phoneNumber: "",
        carBrand: "",
        carModel: "",
        carYear: "",
        carRegNumber: "",
      });
    }
  }

  fillData(car) {
    this.setState({
      name: this.state.userProfile.name,
      phoneNumber: this.state.userProfile.phoneNumber,
      carBrand: car.carBrand,
      carModel: car.carModel,
      carYear: car.carYear,
      carRegNumber: car.carRegNumber,
    });
  }


  onPressSubmit = () => {
    this.showSpinner();
    if (!this.validateData()) {
      this.showError(Strings.EMPTY_FIELDS);
      return;
    }
    if (firebase.auth().currentUser) {
      firebase.database().ref('/serviceRequests/' + firebase.auth().currentUser.uid).push({
        name: this.state.name,
        phoneNumber: this.state.phoneNumber,
        carBrand: this.state.carBrand,
        carModel: this.state.carModel,
        carYear: this.state.carYear,
        carRegNumber: this.state.carRegNumber,
        preferedRepairShop: this.state.preferedRepairShop,
        serviceDescription: this.state.serviceDescription,
        date: new Date().toISOString(),
        status: 0,
      }, (error) => {
        this.hideSpinner();
        if (error) {
          this.showError(Strings.FAILED_SUBMIT_REPORT);
        } else {
          this.setState({
            requestSucceeded: true,
          });
          //it's not an error, but we reuse the util
          this.showError(Strings.SUBMITTED_REQUEST);
        }
      });
    } else {
      this.hideSpinner();
      this.showError(Strings.FAILED_SUBMIT_REPORT);
    }
  }

  validateData() {
    if (this.state.name.length == 0) {
      return false;
    }
    if (this.state.phoneNumber.length == 0) {
      return false;
    }
    if (this.state.carBrand.length == 0) {
      return false;
    }
    if (this.state.carModel.length == 0) {
      return false;
    }
    if (this.state.carYear.length == 0) {
      return false;
    }
    if (this.state.carRegNumber.length == 0) {
      return false;
    }
    if (this.state.serviceDescription.length == 0) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <CarSelectionDialog ref={(dialog) => { this.carSelectionDialog = dialog; }} dialogConfirm={this.onPressCarSelectionDialogConfirm}
          description={Strings.PICK_CAR} cars={this.state.userProfile.cars} />
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={Strings.REQUEST_SERVICE.toUpperCase()}/>
        <ScrollView>
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <Image style={styles.logo} resizeMode='cover' source={require('../../images/app_icon.png')}/>
            </View>
            <View style={styles.content}>
              <Text style={styles.guide}>{Strings.REQUEST_SERVICE_GUIDE}</Text>
              <CheckBox
                labelStyle={styles.checkboxText}
                label={Strings.USE_PROFILE_INFO}
                checked={this.state.checkBoxChecked}
                onChange={(checked) => this.onCheck(checked)}
                />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({name: value})}
                ref='nameField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.phoneNumberField.focus(); }}
                placeholder={Strings.NAME_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.name} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({phoneNumber: value})}
                ref='phoneNumberField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.carBrandField.focus(); }}
                placeholder={Strings.PHONE_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.phoneNumber} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({carBrand: value})}
                ref='carBrandField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.carModelField.focus(); }}
                placeholder={Strings.CAR_BRAND_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.carBrand} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({carModel: value})}
                ref='carModelField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.carYearField.focus(); }}
                placeholder={Strings.CAR_MODEL_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.carModel} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({carYear: value})}
                ref='carYearField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.carRegNumberField.focus(); }}
                placeholder={Strings.CAR_YEAR_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.carYear} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({carRegNumber: value})}
                ref='carRegNumberField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.preferedRepairShopField.focus(); }}
                placeholder={Strings.CAR_REG_NUMBER_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.carRegNumber} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({preferedRepairShop: value})}
                ref='preferedRepairShopField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.serviceDescriptionField.focus(); }}
                placeholder={Strings.PREFERED_REPAIR_SHOP_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.preferedRepairShop} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={[styles.textEntry, styles.multilineHeight]}
                onChangeText={(value) => this.setState({serviceDescription: value})}
                ref='serviceDescriptionField' returnKeyType='go'
                multiline={true} numberOfLines={5}
                onSubmitEditing={(event) => { this.onPressSubmit() }}
                placeholder={Strings.SERVICE_DESCRIPTION_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.serviceDescription} />
            </View>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={this.onPressSubmit}>
            <Text style={styles.submitButtonText}>
              {Strings.REQUEST_SERVICE.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 3,
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logo: {
    height: 100,
    width: 100,
  },
  guide: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  textEntry : {
    width: 300,
    marginTop: 20,
    paddingBottom: 10,
    fontSize: 14,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  checkboxText: {
    color: Colors.BLACK,
  },
  multilineHeight: {
    height: 100,
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
