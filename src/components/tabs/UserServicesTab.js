import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, Share, FlatList } from 'react-native';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import Toolbar from '../elements/Toolbar';
import ServiceItem from '../elements/ServiceItem';
import * as firebase from 'firebase';

export default class UserServicesTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: Strings.UNKNOWN_ERROR,
      placeholderText: Strings.NO_SERVICE_REQUESTS,
      requestsData: [],
    }
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
    this.onPressItem = this.onPressItem.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async componentDidMount() {
    this.refresh();
  }

  refresh() {
    this.showSpinner();
    const ref = firebase.database().ref().child('/serviceRequests/' + firebase.auth().currentUser.uid);
    var data = [];
    ref.once('value', async (snapshot) => {
      snapshot.forEach(item => { data.push({key: item.key, data: item.val()}); });
      await this.setState({
        requestsData: data,
      });
      this.hideSpinner();
    }, (error) => {
      this.showError();
      console.log(error);
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

  onPressNewService = () => {
    this.props.navigation.navigate('ServiceRequest');
  }

  keyExtractor = (item, index) => index;

  renderItem = ({item}) => {
    return (
      <ServiceItem item={item} iconSource={require('../../images/app_icon.png')}
        onPressItem={this.onPressItem} />
    );
  }

  handleScroll = (event) => {
    // this.props.hideLocationInfo();
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('ServiceReview', {item: item});
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <Toolbar title={Strings.SERVICES.toUpperCase()} extraAction={this.refresh} extraActionIcon={require('../../images/icon_refresh.png')}/>
        <View style={styles.services}>
          {
            this.state.requestsData.length > 0 ?
            <FlatList
              style={styles.list}
              data={this.state.requestsData}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              onScroll={this.handleScroll}
              />
            :
            <View style={styles.placeholderWrapper}>
              <Text style={styles.placeholder}>{this.state.placeholderText}</Text>
            </View>
          }
          <TouchableOpacity style={styles.newServiceButton} onPress={this.onPressNewService}>
            <Text style={styles.newServiceButtonText}>
              {Strings.REQUEST_SERVICE.toUpperCase()}
            </Text>
          </TouchableOpacity>
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
  services: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  placeholderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 18,
    textAlign: 'center',
  },
  newServiceButton: {
    height: 40,
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
  },
  newServiceButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
