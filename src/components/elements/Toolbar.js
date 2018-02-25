import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  onPressBack = () => {
    if (this.props.customBackButtonAction != null) {
      this.props.customBackButtonAction();
    } else {
      this.props.navigation.dispatch(NavigationActions.back());
    }
  }

  onPressExtraAction = () => {
    if (this.props.extraAction != null) {
      this.props.extraAction();
    }
  }

  renderExtraAction() {
    return (
      <TouchableOpacity style={styles.extraActionButton} onPress={this.onPressExtraAction}>
        {
          this.props.extraActionText ?
          <Text style={styles.extraActionText}>{this.props.extraActionText}</Text>
          : null
        }
        {
          this.props.extraActionIcon ?
          <Image style={styles.extraIcon} tintColor={this.props.iconTint ? this.props.iconTint : null} resizeMode='contain' source={this.props.extraActionIcon}/>
          : null
        }
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.props.showBackButton ?
          <TouchableOpacity style={styles.backButton} onPress={this.onPressBack}>
            <Image style={styles.backIcon} tintColor={Colors.WHITE} resizeMode='contain' source={require('../../images/arrow_left_black.png')}/>
          </TouchableOpacity>
          :
          null
        }
        <Text style={styles.headerText} ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
        {
          this.props.extraAction ?
          this.renderExtraAction()
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Constants.TOOLBAR_HEIGHT,
    backgroundColor: Colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'autobus',
    color: Colors.WHITE,
    fontSize: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backIcon: {
    height: Constants.TOOLBAR_HEIGHT - 47,
    width: Constants.TOOLBAR_HEIGHT - 47,
  },
  extraActionButton: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraActionText: {
    fontFamily: 'autobus',
    color: Colors.ACCENT_LIGHT,
    fontSize: 14,
    marginRight: 3,
  },
  extraIcon: {
    height: Constants.TOOLBAR_HEIGHT - 30,
    width: Constants.TOOLBAR_HEIGHT - 30,
  }
});
