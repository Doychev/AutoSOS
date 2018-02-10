import React from 'react';
import { Platform, AsyncStorage, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Colors } from '../../Colors.js';

export default class CarSelectionDialog extends React.Component {

  constructor(props) {
    super(props);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
  }

  showDialog() {
    this.popupDialog.show();
  }

  hideDialog() {
    this.popupDialog.dismiss();
  }

  onPressDialogConfirm(car) {
    this.props.dialogConfirm(car);
  }

  renderCar(car, i) {
    return (
      <View key={i}>
        <TouchableOpacity onPress={() => this.onPressDialogConfirm(car)} dialog={this.popupDialog}>
          <View style={styles.car}>
            <Text style={styles.carText}>{car.carRegNumber}: {car.carBrand} {car.carModel}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} >
        <PopupDialog width={this.props.width ? this.props.width : 0.7} height={this.props.height ? this.props.height : 0.6}
          dismissOnTouchOutside={this.props.dismissable === true ? true : false }
          dismissOnHardwareBackPress={this.props.dismissable === true ? true : false }
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          dialogAnimation={slideAnimation}>
          <View style={styles.dialog}>
            <View style={styles.dialogHeader}>
              {
                this.props.description && this.props.description.length > 1 ?
                <View style={styles.dialogDescription}>
                  <Text style={styles.dialogDescriptionText}>{this.props.description}</Text>
                </View>
                : null
              }
            </View>
            <View style={styles.dialogContent}>
              <ScrollView>
                {
                  this.props.cars ?
                  this.props.cars.map((car, i) => this.renderCar(car, i))
                  : null
                }
              </ScrollView>
            </View>
          </View>
        </PopupDialog>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        zIndex: 1,
      },
      android: {
      },
    }),
  },
  dialog: {
    flex: 1,
  },
  dialogHeader: {
    flex: 1,
    backgroundColor: Colors.ACCENT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogHeaderImage: {
    width: 70,
    height: 70,
  },
  dialogContent: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogDescription: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  dialogDescriptionText: {
    fontFamily: 'autobus',
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 16,
  },
  car: {
    backgroundColor: Colors.ACCENT_LIGHT,
    alignSelf: 'stretch',
    width: 180,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  carText: {
    fontFamily: 'autobus',
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});
