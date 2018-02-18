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

export default class ServiceReviewScreen extends React.Component {
  static navigationOptions = { title: 'ServiceReview', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: "",
      editing: false,
      newDescription: "",
    };
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  async componentDidMount() {
    this.showSpinner();
    if (this.props.navigation.state.params != null && this.props.navigation.state.params.item != null) {
      this.setState({
        item : this.props.navigation.state.params.item.data,
        key : this.props.navigation.state.params.item.key,
      });
    }
    this.hideSpinner();
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

  onPressUpdateDescription = async () => {
    this.showSpinner();
    if (this.state.editing) {
      this.setState({
        editing: false,
      });

      var dateInfo = this.getItemDateString(new Date().toISOString());
      var newDescription = this.state.item.serviceDescription + "; " + Strings.DESCRIPTION_ADDITION + " (" + dateInfo + ") " + this.state.newDescription;
      firebase.database().ref('/serviceRequests/' + firebase.auth().currentUser.uid + '/' + this.state.key).update({
        serviceDescription: newDescription,
      }, (error) => {
        this.hideSpinner();
        if (error) {
          this.showError(Strings.FAILED_SUBMIT_REPORT);
        } else {
          this.setState({
            requestSucceeded: true,
          });
          //it's not an error, but we reuse the util
          this.setState({
            shouldGoBack: true,
          });
          this.showError(Strings.SUBMITTED_UPDATE);
        }
      });

      //submit request
    } else {
      this.setState({
        editing: true,
      });
    }
    this.hideSpinner();
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

  getItemDateString = (date) => {
    return dateString = date.slice(0,10) + ", " + date.slice(11,16);
  }

  getStatusText = (status) => {
    return Strings.REQUEST_STATUS[status];
  }

  getStatusTextStyle = (statusParam) => {
    var status = [styles.itemInfoText, {fontWeight: 'bold'}];
    switch (statusParam) {
      case 0:
      status.push({color: Colors.BLACK});
      break;
      case 1:
      status.push({color: Colors.ACCENT_LIGHT});
      break;
      case 2:
      status.push({color: Colors.GREEN});
      break;
      case 3:
      status.push({color: Colors.RED});
      break;
      default:
      break;
    }
    return status;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={Strings.SERVICE_DETAILS.toUpperCase()}/>
        <View style={styles.content}>
          <View style={styles.marginTop} />
          {
            this.state.item ?
            <ScrollView style={styles.serviceInfo}>
              <Text style={styles.descriptionTitle}>{Strings.CAR_INFO}: </Text>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.CAR_BRAND}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.carBrand}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.CAR_MODEL}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.carModel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.CAR_REG_NUMBER}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.carRegNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.CAR_YEAR}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.carYear}</Text>
              </View>
              <View style={styles.marginTop} />
              <Text style={styles.descriptionTitle}>{Strings.ORDER_INFO}: </Text>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.ORDER_DATE_DESCRIPTION}: </Text>
                <Text style={styles.itemInfoText}>{this.getItemDateString(this.state.item.date)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.ORDER_NAME_DESCRIPTION}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.ORDER_PHONE_DESCRIPTION}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.phoneNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.SELECTED_REPAIR_SHOP}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.preferedRepairShop}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.descriptionText}>{Strings.SERVICE_DESCRIPTION}: </Text>
                <Text style={styles.itemInfoText}>{this.state.item.serviceDescription}</Text>
              </View>
              <View style={styles.marginTop} />
              <View style={styles.infoRow}>
                <Text style={styles.descriptionTitle}>{Strings.STATUS}: </Text>
                <Text style={this.getStatusTextStyle(this.state.item.status)}>{this.getStatusText(this.state.item.status)}</Text>
              </View>
            </ScrollView>
            : null
          }
        </View>
        {
          this.state.editing ?
          <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
            onChangeText={(value) => this.setState({newDescription: value})}
            returnKeyType='go'
            onSubmitEditing={this.onPressUpdateDescription}
            placeholder={Strings.DESCRIPTION} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.carModel} />
          : null
        }
        {
          this.state.item && (this.state.item.status == 0 || this.state.item.status == 1) ?
          <TouchableOpacity style={styles.submitButton} onPress={this.onPressUpdateDescription}>
            <Text style={styles.submitButtonText}>
              {this.state.editing ? Strings.SAVE.toUpperCase() : Strings.UPDATE_DESCRIPTION.toUpperCase()}
            </Text>
          </TouchableOpacity>
          : null
        }
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
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  serviceInfo: {
    marginTop: 10,
    flex: 1,
  },
  marginTop: {
    marginTop: 10,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 18,
  },
  itemInfoText : {
    fontSize: 18,
  },
  textEntry : {
    height: 40,
    margin: 20,
    width: 300,
    marginTop: 20,
    paddingBottom: 10,
    fontSize: 18,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  deleteIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
