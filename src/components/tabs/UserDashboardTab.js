import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import * as firebase from 'firebase';

export default class UserDashboardTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      userDisplayName: "",
    }
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem(Constants.ASYNC_STORE_USER);
    if (value !== null) {
      var user = JSON.parse(value);
      this.setState({
        userDisplayName: user.name,
        userEmail: user.email,
      });
    }

    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    // Create a reference to the file we want to download
    var starsRef = storageRef.child('ads/sample-ad.png');

    // Get the download URL
    starsRef.getDownloadURL().then(function(url) {
      // console.log(url);
      this.setState({
        adImage: url,
      })
      // Insert url into an <img> tag to "download"
    }.bind(this)).catch(function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object_not_found':
        // File doesn't exist
        break;

        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

        case 'storage/canceled':
        // User canceled the upload
        break;

        case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
      }
    });
  }

  onPressRequestService = () => {
    this.props.navigation.navigate('ServiceRequest');
  }

  onPressExploreRepairShops = () => {
    this.props.navigateToExplore();
  }

  onPressChangeProfile = () => {
    this.props.navigation.navigate('Profile');
  }

  onPressShare = () => {
    this.props.navigateToShare();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>
            {this.state.userDisplayName.length > 0 ? Strings.WELCOME + ", " + this.state.userDisplayName + "!" : Strings.WELCOME + "!"}
          </Text>
        </View>
        <View style={styles.bannersView}>
          {
            this.state.adImage ?
            <Image style={styles.adImage} resizeMode='cover' source={{uri: this.state.adImage}}/>
            :
            <Text style={styles.tempText}>Тука че има реклами</Text>
          }
        </View>
        <View style={styles.navigationView}>
          <View style={styles.navigationRow}>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressRequestService}>
              <Image style={styles.navIconBig} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_request_service.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.REQUEST_SERVICE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressExploreRepairShops}>
              <Image style={styles.navIcon} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_repair_shops.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.EXPLORE_REPAIR_SHOPS}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.navigationRow}>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressChangeProfile}>
              <Image style={styles.navIcon} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_profile.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.CHANGE_PROFILE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressShare}>
              <Image style={styles.navIcon} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_share.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.SHARE_AND_WIN}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  topBar: {
    height: Constants.TOOLBAR_HEIGHT,
    backgroundColor: Colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannersView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adImage: {
    width: '100%',
    flex: 1,
  },
  navigationView: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempText: {
    color: Colors.BLACK,
    fontSize: 12,
    textAlign: 'center',
  },
  navigationRow: {
    flex: 1,
    flexDirection: 'row',
  },
  navButton: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
    padding: 20,
  },
  navButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navIconBig: {
    width: 45,
    height: 45,
  },
});
