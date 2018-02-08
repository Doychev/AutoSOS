import { NavigationActions } from 'react-navigation';

export const NavigationUtils = {

  navigateWithoutBackstack(navigation, screen) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen})
      ]
    });
    navigation.dispatch(resetAction);
  },

  navigateToWalletWithHomeBackStack(navigation) {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
        NavigationActions.navigate({ routeName: 'Wallet'}),
      ]
    });
    navigation.dispatch(resetAction);
  },

};
