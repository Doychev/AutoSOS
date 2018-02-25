import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import * as firebase from 'firebase';
import openMap from 'react-native-open-maps';

export default class ShopProfileScreen extends React.Component {

  static navigationOptions = { title: 'ShopProfile', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: "",
      editing: false,
      newDescription: "",
      name: "",
      image: "",
      address: "",
      phoneNumber: "",
      subscription: "",
      type: "",
      website: "",
      description: "",
    };
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  async componentDidMount() {
    this.showSpinner();
    if (this.props.navigation.state.params != null && this.props.navigation.state.params.marker != null) {
      var marker = this.props.navigation.state.params.marker;
      await this.setState({
        id : marker.uniqueId,
        name : marker.name,
        image : marker.image,
        address: marker.address,
        phoneNumber: marker.phoneNumber,
        subscription: marker.subscription,
        type: marker.type,
        website: marker.website,
        description: marker.description,
        latitude: marker.latitude,
        longitude: marker.longitude,
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

  onPressHowToReach = () => {
    openMap({ latitude: this.state.latitude, longitude: this.state.longitude });
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={this.state.name.toUpperCase()}/>
        <ScrollView style={styles.content}>
          <View style={styles.imageView}>
            {
              this.state.image.length > 0 ?
              <Image style={styles.image} resizeMode='center' source={{uri: this.state.image}}/>
              : null
            }
          </View>
          <View style={styles.description}>
            <View style={styles.infoRow}>
              <Text style={styles.titleText} ellipsizeMode='tail' numberOfLines={1}>{this.state.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.descriptionText}>{Strings.ADDRESS}: </Text>
              <Text style={styles.descriptionText}>{this.state.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.descriptionText}>{Strings.PHONE}: </Text>
              <Text style={styles.descriptionText}>{this.state.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.descriptionText}>{Strings.TYPE}: </Text>
              <Text style={styles.descriptionText}>{this.state.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.descriptionText}>{Strings.WEBSITE}: </Text>
              <Text style={styles.websiteText} onPress={() => Linking.openURL(this.state.website)}>{this.state.website}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.descriptionText}>{Strings.DESCRIPTION}: {this.state.description}</Text>
            </View>
          </View>
          <View style={styles.reviews}>

          </View>
        </ScrollView>
        <TouchableOpacity style={styles.howToReach} onPress={this.onPressHowToReach}>
          <Text style={styles.submitButtonText}>
            {Strings.HOW_TO_REACH.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={this.onPressWriteReview}>
          <Text style={styles.submitButtonText}>
            {Strings.WRITE_REVIEW.toUpperCase()}
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
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  imageView: {
    flex: 1,
    marginBottom: 5,
  },
  image: {
    flex: 1,
    height: 100,
  },
  description: {
    flex: 1,
  },
  reviews: {
    flex: 1,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
  },
  websiteText: {
    fontSize: 16,
    color: Colors.ACCENT_LIGHT,
    textDecorationLine: 'underline',
  },
  submitButton: {
    height: 40,
    margin: 20,
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
  },
  howToReach: {
    height: 40,
    margin: 20,
    marginBottom: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN,
  },
  submitButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
