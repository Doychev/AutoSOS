import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, Share } from 'react-native';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import * as firebase from 'firebase';

export default class UserDashboardTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: Strings.UNKNOWN_ERROR,
      shareCode: "",
    }
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  async componentDidMount() {
    this.showSpinner();
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('/shareCodes/' + user.uid).once('value').then( async (snapshot) => {
        if (snapshot.val()) {
          this.setState({
            shareCode: snapshot.val(),
          })
          this.hideSpinner();
        } else {
          this.showError();
        }
      }, (error) => {
        this.showError();
        console.log(error);
      });
    } else {
      this.showError();
    }
  }

  onPressShare = () => {
    Share.share({
      message: Strings.SHARE_DESC + " " + this.state.shareCode + " " + Strings.SHARE_LINK,
      url: Strings.SHARE_LINK,
      title: Strings.SHARE_TITLE,
    });
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <View style={styles.header}>
          <Image style={styles.headerImage} resizeMode='contain' tintColor={Colors.WHITE} source={require('../../images/savings.png')}/>
        </View>
        <View style={styles.shareCode}>
          <Text style={styles.codeDesc}>{Strings.SHARE_CODE_DESC}</Text>
          <Text style={styles.code}>{this.state.shareCode}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{Strings.SHARE_DESCRIPTION}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={this.onPressShare}>
          <Text style={styles.shareButtonText}>
            {Strings.SHARE_WITH_FRIENDS.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ACCENT_LIGHT,
  },
  header: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    height: '60%',
  },
  description: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
    color: Colors.WHITE,
  },
  shareCode: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.WHITE,
    borderWidth: 3,
    marginLeft: 20,
    marginRight: 20,
  },
  codeDesc: {
    fontSize: 24,
    textAlign: 'center',
    color: Colors.WHITE,
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  code: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'autobus',
    margin: 20,
    marginBottom: 30,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    color: Colors.WHITE,
  },
  shareButton: {
    height: 40,
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  shareButtonText: {
    alignItems: 'center',
    color: Colors.ACCENT,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
