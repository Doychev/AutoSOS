import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';
import { Strings } from '../../Strings.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from '../elements/Dialog';
import * as firebase from 'firebase';

export default class ReportBugScreen extends React.Component {
  static navigationOptions = { title: 'ReportBug', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      dialogDescriptionText: "",
      problemTitle: "",
      problemDescription: "",
      problemSteps: "",
      reportSucceeded: false,
    };
    this.onPressDialogConfirm = this.onPressDialogConfirm.bind(this);
  }

  onPressDialogConfirm() {
    this.dialog.hideDialog();
    if (this.state.reportSucceeded) {
      this.props.navigation.dispatch(NavigationActions.back());
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  onPressSubmit = () => {
    this.showSpinner();
    if (!this.validateData()) {
      this.showError(Strings.EMPTY_FIELDS);
      return;
    }
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('bugReports').push({
        userId: user.uid,
        problemTitle: this.state.problemTitle,
        problemDescription: this.state.problemDescription,
        problemSteps: this.state.problemSteps,
      }, (error) => {
        this.hideSpinner();
        if (error) {
          this.showError(Strings.FAILED_SUBMIT_REPORT);
        } else {
          this.setState({
            reportSucceeded: true,
          });
          //it's not an error, but we reuse the util
          this.showError(Strings.SUBMITTED_REPORT);
        }
      });
    } else {
      this.hideSpinner();
      this.showError(Strings.FAILED_SUBMIT_REPORT);
    }
  }

  validateData() {
    if (this.state.problemTitle.length == 0) {
      return false;
    }
    if (this.state.problemDescription.length == 0) {
      return false;
    }
    if (this.state.problemSteps.length == 0) {
      return false;
    }
    return true;
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarOverlay}/>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={Strings.LOADING} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Dialog ref={(dialog) => { this.dialog = dialog; }} dialogConfirm={this.onPressDialogConfirm} dismissable={false}
          description={this.state.dialogDescriptionText} confirmText={Strings.OK}/>
        <Toolbar showBackButton={true} navigation={this.props.navigation} title={Strings.REPORT_BUG.toUpperCase()}/>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.header}>
              <Image style={styles.warningImage} resizeMode='cover' source={require('../../images/warning_icon.png')}/>
            </View>
            <View style={styles.content}>
              <Text style={styles.guide}>{Strings.REPORT_GUIDE}</Text>
              <TextInput underlineColorAndroid={Colors.GRAY} style={styles.textEntry}
                onChangeText={(value) => this.setState({problemTitle: value})}
                ref='problemTitleField' returnKeyType='next'
                onSubmitEditing={(event) => { this.refs.problemDescriptionField.focus(); }}
                placeholder={Strings.PROBLEM_TITLE_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.problemTitle} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={[styles.textEntry, styles.multilineHeight]}
                onChangeText={(value) => this.setState({problemDescription: value})}
                ref='problemDescriptionField' returnKeyType='next'
                multiline={true} numberOfLines={5}
                onSubmitEditing={(event) => { this.refs.problemStepsField.focus(); }}
                placeholder={Strings.PROBLEM_DESCRIPTION_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.problemDescription} />
              <TextInput underlineColorAndroid={Colors.GRAY} style={[styles.textEntry, styles.multilineHeight]}
                onChangeText={(value) => this.setState({problemSteps: value})}
                ref='problemStepsField' returnKeyType='go'
                multiline={true} numberOfLines={5}
                onSubmitEditing={(event) => { this.onPressSubmit() }}
                placeholder={Strings.PROBLEM_STEPS_PLACEHOLDER} placeholderTextColor={Colors.LIGHT_GRAY} value={this.state.problemSteps} />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={this.onPressSubmit}>
              <Text style={styles.submitButtonText}>
                {Strings.SUBMIT_REPORT.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  warningImage: {
    height: 100,
    width: 100,
  },
  content: {
    flex: 3,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  guide: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  textEntry : {
    width: 300,
    marginTop: 20,
    paddingBottom: 10,
    fontSize: 18,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  multilineHeight: {
    height: 100,
  },
  submitButton: {
    height: 40,
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
  },
  submitButtonText: {
    alignItems: 'center',
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },});
