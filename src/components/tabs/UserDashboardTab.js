import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
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

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({
          userEmail: user.providerData[0].email,
          userDisplayName: user.displayName,
        });        
      }
    });
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
          <Text style={styles.tempText}>Here be main navigation</Text>
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
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationView: {
    flex: 1,
    backgroundColor: Colors.GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavigationBar: {
    height: Constants.BOTTOM_BAR_HEIGHT,
    backgroundColor: Colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempText: {
    color: Colors.BLACK,
    fontSize: 12,
    textAlign: 'center',
  },
});
