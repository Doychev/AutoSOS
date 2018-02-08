import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';

export default class UserMoreTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onPressProfile = () => {
    this.props.navigation.navigate('Profile');
  }

  onPressSupport = () => {
    this.props.navigation.navigate('Support');
  }

  onPressReport = () => {
    this.props.navigation.navigate('ReportBug');
  }

  onPressLogout = () => {
    this.props.showLogoutDialog();
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar title={Strings.SETTINGS.toUpperCase()}/>
        <View style={styles.content}>
          <View style={styles.navigation}>
            <TouchableOpacity onPress={this.onPressProfile}>
              <View style={styles.navigationRow}>
                <View style={styles.textViews}>
                  <Text style={styles.navigationTitle}>{Strings.PROFILE}</Text>
                </View>
                <Image style={styles.navigationIcon} resizeMode='contain' source={require('../../images/arrow_right_black.png')}/>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}/>

            <TouchableOpacity onPress={this.onPressSupport}>
              <View style={styles.navigationRow}>
                <View style={styles.textViews}>
                  <Text style={styles.navigationTitle}>{Strings.SUPPORT}</Text>
                </View>
                <Image style={styles.navigationIcon} resizeMode='contain' source={require('../../images/arrow_right_black.png')}/>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}/>

            <TouchableOpacity onPress={this.onPressReport}>
              <View style={styles.navigationRow}>
                <View style={styles.textViews}>
                  <Text style={styles.navigationTitle}>{Strings.REPORT_BUG}</Text>
                </View>
                <Image style={styles.navigationIcon} resizeMode='contain' source={require('../../images/arrow_right_black.png')}/>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}/>

            <TouchableOpacity onPress={this.onPressLogout}>
              <View style={styles.navigationRow}>
                <View style={styles.textViews}>
                  <Text style={styles.navigationTitle}>{Strings.LOGOUT}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}/>
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
  navigation: {
    alignSelf: 'stretch',
    marginTop: 5,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 15,
    marginBottom: 15,
  },
  navigationTitle: {
    fontFamily: 'autobus',
    marginLeft: 20,
    fontSize: 20,
  },
  textViews: {
    flex: 1,
  },
  navigationIcon: {
    alignSelf: 'flex-end',
    width: 20,
    height: 20,
    marginRight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    marginTop: 7,
    marginBottom: 7,
  },
});
