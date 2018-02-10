import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';

export default class ServiceItem extends React.Component {

  onPress = () => {
    this.props.onPressItem(this.props.item.uniqueId);
  }

  getStatusText = () => {
    return Strings.REQUEST_STATUS[this.props.item.status];
  }

  getStatusTextStyle = () => {
    var status = [styles.status];
    switch (this.props.item.status) {
      case 0:
      status.push({color: Colors.BLACK});
      break;
      case 1:
      status.push({color: Colors.ACCENT_LIGHT});
      break;
      case 2:
      status.push({color: Colors.GREEN});
      break;
      case 3:
      status.push({color: Colors.RED});
      break;
      default:
      break;
    }
    return status;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.content} onPress={this.onPress}>
          <View style={styles.iconView}>
            <Image style={styles.markerIcon} resizeMode='contain' source={this.props.iconSource} />
          </View>
          <View style={styles.textContents}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.date}>{Strings.DATE}: {this.props.item.date.slice(0,10)}</Text>
            <Text ellipsizeMode='tail' numberOfLines={2} style={styles.description}>{Strings.DESCRIPTION}: {this.props.item.serviceDescription}</Text>
            <View style={styles.row}>
              <Text ellipsizeMode='tail' numberOfLines={1} style={styles.statusDesc}>{Strings.STATUS}: </Text>
              <Text ellipsizeMode='tail' numberOfLines={1} style={this.getStatusTextStyle()}>{this.getStatusText()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  markerIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconView: {
    flex: 1,
  },
  textContents: {
    flex: 4,
    marginLeft: 5,
    marginRight: 20,
  },
  date: {
    fontFamily: 'autobus',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  statusDesc: {
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
