import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';

export default class MarkerView extends React.Component {

  componentWillMount() {
    if (typeof this.props.markerIcon == 'string') {
      Image.prefetch(this.props.markerIcon);
    }
  }

  getImageSource = () => {
    var source;
    if (typeof this.props.markerIcon == 'string') {
      source = {uri: this.props.markerIcon};
    }  else {
      source = this.props.markerIcon;
    }
    return source;
  }

  render() {
    return (
      <Image style={this.props.iconStyle} source={this.getImageSource()} />
    );
  }
}
