import { Constants } from '../Constants.js';
import { StyleSheet } from 'react-native';

export const MarkerIconUtils = {

  getMarkerIcon(marker) {
    if (marker.subscription != Constants.SUBSCIPTION_PLAN.PLATINUM) {
      var icon = MARKER_ICONS[this.getIconTypePart(marker) + "_" + this.getIconSubscriptionPart(marker)];
      if (icon == null) {
        icon = MARKER_ICONS[Constants.DEFAULT_MARKER_NAME];
      }
      return icon;
    }
    else {
      return marker.customLogoUrl;
    }
  },

  getMarkerIconSize(marker) {
    if (marker.markerIcon != null && marker.markerIcon == MARKER_ICONS[Constants.DEFAULT_MARKER_NAME]) {
      return styles.unclaimedMarker;
    }
    if (marker.subscription == null || marker.subscription == "null" || marker.subscription == 0) {
      return styles.unclaimedMarker;
    } else {
      switch (marker.subscription) {
        case Constants.SUBSCIPTION_PLAN.SILVER:
        return styles.silverMarker;

        case Constants.SUBSCIPTION_PLAN.GOLD:
        return styles.goldMarker;

        case Constants.SUBSCIPTION_PLAN.PLATINUM:
        return styles.platinumMarker;

        default:
        return styles.unclaimedMarker;
      }
    }
  },

  getIconSubscriptionPart(marker) {
    if (marker.subscription == null || marker.subscription == "null" || marker.subscription == 0) {
      return "unclaimed";
    } else {
      switch (marker.subscription) {
        case Constants.SUBSCIPTION_PLAN.SILVER:
        return "silver";

        case Constants.SUBSCIPTION_PLAN.GOLD:
        return "gold";

        case Constants.SUBSCIPTION_PLAN.PLATINUM:
        return "platinum";

        default:
        return "unclaimed";
      }
    }
  },

  getIconTypePart(marker) {
    if (marker.type == null || marker.type == "null") {
      return "unclaimed";
    } else {
      switch (marker.type) {
        case Constants.SHOP_TYPE.REPAIRS:
        return "repair";

        case Constants.SHOP_TYPE.TYRES:
        return "tires";

        case Constants.SHOP_TYPE.CARWASH:
        return "carwash";

        case Constants.SHOP_TYPE.OTHER:
        default:
        return "other";
      }
    }
  },

};

const MARKER_ICONS = {
  repair_unclaimed: require('../images/pins/repair_unclaimed.png'),
  repair_silver: require('../images/pins/repair_silver.png'),
  repair_gold: require('../images/pins/repair_gold.png'),
  repair_platinum: require('../images/pins/repair_platinum.png'),
  carwash_unclaimed: require('../images/pins/carwash_unclaimed.png'),
  carwash_silver: require('../images/pins/carwash_silver.png'),
  carwash_gold: require('../images/pins/carwash_gold.png'),
  carwash_platinum: require('../images/pins/carwash_platinum.png'),
  tires_unclaimed: require('../images/pins/tires_unclaimed.png'),
  tires_silver: require('../images/pins/tires_silver.png'),
  tires_gold: require('../images/pins/tires_gold.png'),
  tires_platinum: require('../images/pins/tires_platinum.png'),
  other_unclaimed: require('../images/pins/other_unclaimed.png'),
  other_silver: require('../images/pins/other_silver.png'),
  other_gold: require('../images/pins/other_gold.png'),
  other_platinum: require('../images/pins/other_platinum.png'),
}

const styles = StyleSheet.create({
  unclaimedMarker: {
    width: Constants.BASIC_MARKER_SIZE,
    height: Constants.BASIC_MARKER_SIZE,
  },
  silverMarker: {
    width: Constants.BASIC_MARKER_SIZE * Constants.CLAIMED_MARKER_MULTIPLIER,
    height: Constants.BASIC_MARKER_SIZE * Constants.CLAIMED_MARKER_MULTIPLIER * Constants.MARKER_ASPECT_RATIO,
  },
  goldMarker: {
    width: Constants.BASIC_MARKER_SIZE * Constants.CLAIMED_MARKER_MULTIPLIER * 1.25,
    height: Constants.BASIC_MARKER_SIZE * Constants.CLAIMED_MARKER_MULTIPLIER * Constants.MARKER_ASPECT_RATIO * 1.25,
  },
  platinumMarker: {
    width: Constants.BASIC_MARKER_SIZE * Constants.CLAIMED_MARKER_MULTIPLIER * 1.5,
    height: Constants.BASIC_MARKER_SIZE * Constants.CLAIMED_MARKER_MULTIPLIER * Constants.MARKER_ASPECT_RATIO * 1.5,
  },
});
