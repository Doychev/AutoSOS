export const Constants = {

  getEnvironment() {
    const channel = Expo.Constants.manifest.releaseChannel;
    if (channel === undefined) {
      return require('../dev.config.js');
    } else if (channel.indexOf('prod') !== -1) {
      return require('../prod.config.js');
    } else {
      return require('../dev.config.js');
    }
  },

  SPLASH_DELAY_MILLIS : 2000,
  INTRO_AUTOPLAY_INTERVAL : 5000,

  FACEBOOK_PERMISSIONS : ["public_profile", "email", "user_birthday", "user_location"],
  FACEBOOK_PROFILE_FIELDS : "id,name,email,gender,birthday,location",

  TOOLBAR_HEIGHT : 60,
  BOTTOM_BAR_HEIGHT : 60,
  BOTTOM_BAR_ICON_HEIGHT : 30,

  ASYNC_STORE_USER : "@AutoSosDataStore:UserData",

};
