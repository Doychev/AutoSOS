import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import FadeAnimation from './FadeAnimation';
var {height, width} = Dimensions.get('window');

export default class LocationInfo extends React.Component {

  onPressMore = () => {
    this.props.navigation.navigate('ShopProfile', {marker: this.props.marker});
  }

  render() {
    return (
      <FadeAnimation style={styles.wrapper} visible={this.props.visible}>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <View style={styles.title}>
              <Text ellipsizeMode='tail' numberOfLines={1} style={styles.titleText}>{this.props.marker.name}</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.address}>
                <Text ellipsizeMode='tail' numberOfLines={2} style={styles.addressText}>{this.props.marker.address}</Text>
              </View>
              <TouchableOpacity onPress={this.onPressMore} style={styles.button}>
                <Text style={styles.buttonText}>{Strings.MORE_DETAILS}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </FadeAnimation>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    height: 120,
    width: width,
    backgroundColor: Colors.GRAY,
  },
  container: {
    flex: 1,
    marginLeft: 10,
    marginTop: 20,
  },
  title: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'autobus',
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.WHITE,
  },
  content: {
    flex: 2,
    flexDirection: 'row',
  },
  address: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: Colors.WHITE,
    marginBottom: 2,
    marginRight: 10,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    height: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    fontFamily: 'autobus',
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.WHITE,
  },
});
