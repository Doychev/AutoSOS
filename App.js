import React from 'react';
import { StackNavigator } from 'react-navigation';
import SplashScreen from './src/components/screens/SplashScreen';
import IntroScreen from './src/components/screens/IntroScreen';
import UserHomeScreen from './src/components/screens/UserHomeScreen';
import ReportBugScreen from './src/components/screens/ReportBugScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';
import ServiceRequestScreen from './src/components/screens/ServiceRequestScreen';
import ServiceReviewScreen from './src/components/screens/ServiceReviewScreen';
import SupportScreen from './src/components/screens/SupportScreen';
import ShopProfileScreen from './src/components/screens/ShopProfileScreen';
import WriteReviewScreen from './src/components/screens/WriteReviewScreen';
import RegisterScreen from './src/components/screens/RegisterScreen';

const App = StackNavigator({
  Splash: { screen: SplashScreen },
  Intro: { screen: IntroScreen },
  UserHome: { screen: UserHomeScreen },
  ReportBug: { screen: ReportBugScreen },
  Profile: { screen: ProfileScreen },
  ServiceRequest: { screen: ServiceRequestScreen },
  ServiceReview: { screen: ServiceReviewScreen },
  Support: { screen: SupportScreen },
  ShopProfile: { screen: ShopProfileScreen },
  WriteReview: { screen: WriteReviewScreen },
  Register: { screen: RegisterScreen },
}, {
  headerMode: 'none',
});

export default App;
