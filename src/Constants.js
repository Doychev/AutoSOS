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

  DEFAULT_MAP_LATITUDE : 42.698334,
  DEFAULT_MAP_LONGITUDE : 23.319941,
  DEFAULT_MAP_ZOOM : 0.1,

  SHOP_TYPE : {
    REPAIRS : 1,
    CARWASH : 2,
    TYRES : 3,
    OTHER : 4,
  },

  SUBSCIPTION_PLAN : {
    UNCLAIMED : 0,
    SILVER : 1,
    GOLD : 2,
    PLATINUM : 3,
  },

  DEFAULT_MARKER_NAME : "other_unclaimed",
  BASIC_MARKER_SIZE : 15,
  CLAIMED_MARKER_MULTIPLIER : 2,
  MARKER_ASPECT_RATIO : 1.35,
  LIST_ICON_PLATINUM : 1.3,

};
