import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, Share } from 'react-native';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import * as firebase from 'firebase';
import { MapView } from 'expo';

export default class UserMapTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: Strings.UNKNOWN_ERROR,
      mapRegion: {
        latitude: Constants.DEFAULT_MAP_LATITUDE,
        longitude: Constants.DEFAULT_MAP_LONGITUDE,
        latitudeDelta: Constants.DEFAULT_MAP_ZOOM,
        longitudeDelta: Constants.DEFAULT_MAP_ZOOM,
      },
    }
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  onRegionChange(region) {
    this.setState({ mapRegion : region });
  }

  async componentDidMount() {

  }

  onPressMap = (event) => {

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
        <Toolbar title={Strings.REPAIR_SHOPS.toUpperCase()}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <MapView
          ref={ref => { this.map = ref; }}
          onPress={e => this.onPressMap(e.nativeEvent)}
          style={styles.mapStyle}
          initialRegion={this.state.mapRegion}
          onRegionChange={this.onRegionChange}>
        </MapView>
        <TouchableOpacity style={styles.switchButton} onPress={this.onPressSwitch}>
          <Text style={styles.switchButtonText}>
            {Strings.REPAIR_SHOPS_LIST}
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
  mapStyle: {
    flex: 1,
  },
  switchButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 30,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
    borderRadius: 6,
  },
  switchButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
