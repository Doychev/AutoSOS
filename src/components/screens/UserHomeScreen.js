import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput, AsyncStorage } from 'react-native';
import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { Constants } from '../../Constants.js';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import FadeAnimation from '../elements/FadeAnimation';
import UserDashboardTab from '../tabs/UserDashboardTab';
import UserMoreTab from '../tabs/UserMoreTab';
import Dialog from './../elements/Dialog';
var {height, width} = Dimensions.get('window');
import * as firebase from 'firebase';
import { NavigationUtils } from '../../util/NavigationUtils';

export default class UserHomeScreen extends React.Component {
  static navigationOptions = { title: 'UserHome', header: null };

  constructor(props) {
    super(props);
    this.state = {
      contentVisible : false,
    }
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.showLogoutDialog = this.showLogoutDialog.bind(this);
    this.onPressLogoutDialogConfirm = this.onPressLogoutDialogConfirm.bind(this);
    this.navigateToShare = this.navigateToShare.bind(this);
  }

  componentDidMount() {
    this.setState({
      contentVisible: true,
    });
  }

  showLogoutDialog() {
    this.dialog.showDialog();
  }

  onPressLogoutDialogConfirm() {
    const navigation = this.props.navigation;
    firebase.auth().signOut()
      .then(function() {
        AsyncStorage.removeItem(Constants.ASYNC_STORE_USER);
        NavigationUtils.navigateWithoutBackstack(navigation, 'Intro');
      })
      .catch(function(error) {
        // NavigationUtils.navigateWithoutBackstack(navigation, 'Intro');
      });
  }

  navigateToShare() {
    this.refs.viewPager.setPageWithoutAnimation(3);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressLogoutDialogConfirm} description={Strings.LOGOUT_DESC} showCancelButton={true}
          dismissable = {true}
          confirmText={Strings.CONFIRM_LOGOUT} cancelText={Strings.CANCEL}/>
        <FadeAnimation style={styles.container} visible={this.state.contentVisible}>
          <IndicatorViewPager
            ref="viewPager"
            horizontalScroll={false}
            style={styles.viewPager}
            onPageScroll={this.onPagerScroll}
            indicator={this.renderTabIndicator()} >
            <View>
              <UserDashboardTab navigation={this.props.navigation} navigateToShare={this.navigateToShare} />
            </View>
            <View></View>
            <View></View>
            <View></View>
            <View>
              <UserMoreTab navigation={this.props.navigation} showLogoutDialog={this.showLogoutDialog}/>
            </View>
          </IndicatorViewPager>

        </FadeAnimation>
      </View>
    );
  }

  renderTabIndicator() {
    let tabs = [{
      text: Strings.HOME.toUpperCase(),
      iconSource: require('../../images/bottom_bar_icons/icon_home_gray.png'),
      selectedIconSource: require('../../images/bottom_bar_icons/icon_home_blue.png')
    },{
      text: Strings.SERVICES.toUpperCase(),
      iconSource: require('../../images/bottom_bar_icons/icon_services_gray.png'),
      selectedIconSource: require('../../images/bottom_bar_icons/icon_services_blue.png')
    },{
      text: Strings.REPAIR_SHOPS.toUpperCase(),
      iconSource: require('../../images/bottom_bar_icons/icon_locate_gray.png'),
      selectedIconSource: require('../../images/bottom_bar_icons/icon_locate_blue.png')
    },{
      text: Strings.SHARE.toUpperCase(),
      iconSource: require('../../images/bottom_bar_icons/icon_share_gray.png'),
      selectedIconSource: require('../../images/bottom_bar_icons/icon_share_blue.png')
    },{
      text: Strings.MORE.toUpperCase(),
      iconSource: require('../../images/bottom_bar_icons/icon_more_gray.png'),
      selectedIconSource: require('../../images/bottom_bar_icons/icon_more_blue.png')
    }];
    return <PagerTabIndicator style={styles.tabIndicator} tabs={tabs} changePageWithAnimation={false}
      iconStyle={styles.tabIcon} selectedIconStyle={styles.tabIcon} textStyle={styles.tabText} selectedTextStyle={styles.tabSelectedText}/>;
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
  viewPager: {
    flex: 1,
  },
  tabIndicator: {
    height: Constants.BOTTOM_BAR_HEIGHT,
    backgroundColor : Colors.TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    height: Constants.BOTTOM_BAR_ICON_HEIGHT,
    width: Constants.BOTTOM_BAR_ICON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontFamily: 'autobus',
    color: Colors.GRAY,
    textAlign: 'center',
  },
  tabSelectedText: {
    fontFamily: 'autobus',
    color: Colors.ACCENT,
    textAlign: 'center',
  },
});
