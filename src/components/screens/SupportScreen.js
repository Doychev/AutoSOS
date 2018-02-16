import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';

export default class SupportScreen extends React.Component {
  static navigationOptions = { title: 'Support', header: null };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onPressTerms = () => {
    // this.props.navigation.navigate('Terms');
  }

  onPressFaq = () => {
    // this.props.navigation.navigate('FAQ');
  }

  onPressReport = () => {
    this.props.navigation.navigate('ReportBug');
  }

  onPressHelp = () => {
    // this.props.navigation.navigate('ReportBug');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={Strings.SUPPORT.toUpperCase()}/>
        <View style={styles.content}>
          <View style={styles.navigation}>
            <TouchableOpacity onPress={this.onPressTerms}>
              <View style={styles.navigationRow}>
                <View style={styles.textViews}>
                  <Text style={styles.navigationTitle}>{Strings.TERMS}</Text>
                </View>
                <Image style={styles.navigationIcon} resizeMode='contain' source={require('../../images/arrow_right_black.png')}/>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}/>

            <TouchableOpacity onPress={this.onPressFaq}>
              <View style={styles.navigationRow}>
                <View style={styles.textViews}>
                  <Text style={styles.navigationTitle}>{Strings.FAQ}</Text>
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

              <TouchableOpacity onPress={this.onPressHelp}>
                <View style={styles.navigationRow}>
                  <View style={styles.textViews}>
                    <Text style={styles.navigationTitle}>{Strings.SUBMIT_HELP}</Text>
                  </View>
                  <Image style={styles.navigationIcon} resizeMode='contain' source={require('../../images/arrow_right_black.png')}/>
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
  statusBarOverlay: {
    height: Expo.Constants.statusBarHeight,
    backgroundColor: Colors.ACCENT,
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
