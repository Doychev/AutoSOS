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
import { MarkerIconUtils } from '../../util/MarkerIconUtils.js';
import MarkerView from '../elements/MarkerView.js';
import LocationInfo from './../elements/LocationInfo';

export default class UserMapTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locationInfo: {
        visible: false,
        marker: {},
      },
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
    this.onPressMarker = this.onPressMarker.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  onRegionChange(region) {
    this.setState({ mapRegion : region });
  }

  async componentDidMount() {
    this.searchShops();
  }

  searchShops() {
    const ref = firebase.database().ref().child('/shops/');
    var shops = [];
    ref.once('value', async (snapshot) => {
      snapshot.forEach(item => { shops.push(item.val()) });
      this.handleShops(shops);
      this.hideSpinner();
    }, (error) => {
      this.showError();
      console.log(error);
    });
  }

  onPressMap = (event) => {
    this.hideLocationInfo();
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

  async handleShops(shops) {
    var currentMarkers = [];
    for (var result of shops) {
      currentMarkers.push(result);
      currentMarkers[currentMarkers.length - 1].markerIcon = await MarkerIconUtils.getMarkerIcon(currentMarkers[currentMarkers.length - 1]);
      // currentMarkers[currentMarkers.length - 1].distance = this.calculateDistance(currentMarkers[currentMarkers.length - 1]);
    }

    await this.setState({
      unfilteredMarkers: currentMarkers,
    });

    this.filterMarkers();
  }

  async filterMarkers() {
    // var dispensaries = this.state.filtersActive.dispensaries;
    // var doctors = this.state.filtersActive.doctors;
    // var headShops = this.state.filtersActive.headShops;

    // var filteredMarkers = [];
    // for (var marker of this.state.markers) {
    //   if ((dispensaries && doctors && headShops) === true ||
    //   (!dispensaries && !doctors && !headShops) === true ||
    //   (dispensaries && (marker.isRecreational == 'true' || marker.isMedical == 'true' ||
    //   marker.isRecreational == true || marker.isMedical == true)) === true ||
    //   (headShops && (marker.isHeadShop == 'true' || marker.isHeadShop == true)) === true ||
    //   (doctors && (marker.isDoctor == 'true' || marker.isDoctor == true)) === true) {
    //
    //     filteredMarkers.push(marker);
    //   }
    // }

    await this.setState({
      markers: this.state.unfilteredMarkers,
    });

    // this.submitImpressions(AnalyticsUtils.IMPRESSION_TYPE.LOCATE_PIN);
    // this.locateMapTab.handleLocationResults(filteredMarkers);
    // this.locateListTab.handleLocationResults(filteredMarkers);
    this.map.fitToElements(true);
    this.hideSpinner();
  }

  getMarkerIconSize = (marker) => {
    return MarkerIconUtils.getMarkerIconSize(marker);
  }

  onPressMarker = (event) => {
    var marker;
    for (var currentMarker of this.state.markers) {
      if (event.id == currentMarker.uniqueId) {
        marker = currentMarker;
        break;
      }
    }
    this.showLocationInfo(marker);
  }

  async showLocationInfo(info) {
    await this.setState({
      locationInfo: {
        visible: true,
        marker: info,
      },
    });
  }

  hideLocationInfo() {
    this.setState({
      locationInfo: {
        visible: false,
      },
    })
  }

  getImageSource = (markerIcon) => {
    var source;
    if (typeof markerIcon == 'string') {
      source = {uri: markerIcon};
    }  else {
      source = markerIcon;
    }
    return source;
  }

  onPressSwitch = () => {

  }

  getMarkerView = (marker) => {
    return (
      <MapView.Marker
        key={marker.uniqueId}
        identifier={marker.uniqueId.toString()}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        onPress={e => this.onPressMarker(e.nativeEvent)}
        image={this.getImageSource(marker.markerIcon)}>
      </MapView.Marker>
    );
  }

  render() {
    var markers = this.state.markers || [];
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
          {
            markers.map(marker => this.getMarkerView(marker))
          }
        </MapView>
        <TouchableOpacity style={styles.switchButton} onPress={this.onPressSwitch}>
          <Text style={styles.switchButtonText}>
            {Strings.REPAIR_SHOPS_LIST}
          </Text>
        </TouchableOpacity>
        <LocationInfo
          navigation={this.props.navigation}
          visible={this.state.locationInfo.visible}
          marker={this.state.locationInfo.marker}
          />
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
