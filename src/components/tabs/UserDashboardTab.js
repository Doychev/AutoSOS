import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';

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
          <Text style={styles.tempText}>Тука че има реклами</Text>
        </View>
        <View style={styles.navigationView}>
          <View style={styles.navigationRow}>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressSubmit}>
              <Image style={styles.navIconBig} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_request_service2.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.REQUEST_SERVICE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressSubmit}>
              <Image style={styles.navIcon} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_repair_shops.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.EXPLORE_REPAIR_SHOPS}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.navigationRow}>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressSubmit}>
              <Image style={styles.navIcon} resizeMode='cover' tintColor={Colors.WHITE} source={require('../../images/nav_profile.png')}/>
              <Text style={styles.navButtonText}>
                {Strings.CHANGE_PROFILE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={this.onPressSubmit}>
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
  },
  bannersView: {
    flex: 1,
    backgroundColor: Colors.GRAY,
    alignItems: 'center',
    justifyContent: 'center',
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
