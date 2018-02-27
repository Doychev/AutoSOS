import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import * as firebase from 'firebase';

export default class WriteReviewScreen extends React.Component {

  static navigationOptions = { title: 'WriteReview', header: null };

  constructor(props) {
    super(props);
    var shopId = -1, shopName;
    if (this.props.navigation.state.params) {
      shopId = this.props.navigation.state.params.shopId;
      shopName = this.props.navigation.state.params.shopName;
    }
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: "",
      id: shopId,
      name: shopName,
      alreadyReviewed: false,
      rating: 0,
      reviewText: "",
      shouldGoBack: false,
    };
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  async componentDidMount() {
    this.showSpinner();


    this.hideSpinner();
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

  onPressDialogConfirm() {
    this.dialog.hideDialog();
    if (this.state.shouldGoBack) {
      this.props.navigation.dispatch(NavigationActions.back());
      this.props.navigation.dispatch(NavigationActions.back());
    }
  }

  onPressStar = (rating) => {
    this.setState({
      rating: rating,
    });
  }

  onPressSubmit = () => {
    this.showSpinner();
    if (this.state.rating < 1 || this.state.rating > 5) {
      this.showError(Strings.NO_RATING);
      return;
    }
    if (firebase.auth().currentUser) {
      firebase.database().ref('/reviews/' + this.state.id + '/' + firebase.auth().currentUser.uid).set({
        rating: this.state.rating,
        review: this.state.reviewText,
      }, (error) => {
        this.hideSpinner();
        if (error) {
          this.showError();
        } else {
          this.setState({
            shouldGoBack: true,
          });
          //it's not an error, but we reuse the util
          this.showError(Strings.RATING_SUBMITTED);
        }
      });
    } else {
      this.showError(Strings.FAILED_SUBMIT_REPORT);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={Strings.WRITE_REVIEW.toUpperCase()}/>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.shopDescription}>{Strings.RATING_SHOP}: </Text>
            <Text style={styles.shopName}>{this.state.name}</Text>
          </View>
          <View style={styles.rating}>
            <View style={styles.stars}>
              <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(1)}>
                <Image style={styles.star} resizeMode='center' source={this.state.rating > 0 ? require('../../images/star.png') : require('../../images/star_grey.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(2)}>
                <Image style={styles.star} resizeMode='center' source={this.state.rating > 1 ? require('../../images/star.png') : require('../../images/star_grey.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(3)}>
                <Image style={styles.star} resizeMode='center' source={this.state.rating > 2 ? require('../../images/star.png') : require('../../images/star_grey.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(4)}>
                <Image style={styles.star} resizeMode='center' source={this.state.rating > 3 ? require('../../images/star.png') : require('../../images/star_grey.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(5)}>
                <Image style={styles.star} resizeMode='center' source={this.state.rating > 4 ? require('../../images/star.png') : require('../../images/star_grey.png')}/>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingTextWrapper}>
              <Text style={styles.ratingText}>{this.state.rating + ".00"} / {Strings.OUT_OF_5}</Text>
            </View>
          </View>
          <View style={styles.input}>
            <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
              onChangeText={(value) => this.setState({reviewText: value})}
              returnKeyType='go' multiline={true} numberOfLines={5}
              onSubmitEditing={this.onPressSubmit}
              placeholder={Strings.REVIEW_DESCRIPTION} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.reviewText} />
          </View>
        </View>
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
    flex: 1,
  },
  title: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopDescription: {
    fontSize: 16,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 40,
    marginRight: 40,
  },
  starButton: {
    flex: 1,
    margin: 5,
  },
  star: {
    width: '100%',
  },
  ratingTextWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.ACCENT,
  },
  input: {
    flex: 2,
  },
  textEntry : {
    margin: 20,
    width: '90%',
    marginTop: 20,
    paddingBottom: 10,
    fontSize: 18,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  submitButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },});
