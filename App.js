import React from 'react';
import { StackNavigator } from 'react-navigation';
import SplashScreen from './src/components/screens/SplashScreen';
import IntroScreen from './src/components/screens/IntroScreen';
import UserHomeScreen from './src/components/screens/UserHomeScreen';
import ReportBugScreen from './src/components/screens/ReportBugScreen';

const App = StackNavigator({
  Splash: { screen: SplashScreen },
  Intro: { screen: IntroScreen },
  UserHome: { screen: UserHomeScreen },
  ReportBug: { screen: ReportBugScreen },
}, {
  headerMode: 'none',
});

export default App;
