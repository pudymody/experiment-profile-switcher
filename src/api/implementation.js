const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
const { XPCOMUtils } = ChromeUtils.import(
  "resource://gre/modules/XPCOMUtils.jsm"
);

XPCOMUtils.defineLazyServiceGetter(
  this,
  "ProfileService",
  "@mozilla.org/toolkit/profile-service;1",
  "nsIToolkitProfileService"
);

this.ProfileManager = class extends ExtensionAPI {
	getAPI(context) {
		return {
			ProfileManager: {
				getAll(x, y) {
					let current = ProfileService.currentProfile;
					let p = [];
					for( let profile of ProfileService.profiles){
						p.push({ name: profile.name, inUse: profile.name == current.name });
					}

					return p;
				},

				open(name){
					if( name == ProfileService.currentProfile.name ){
						return true;
					}

					let profile = ProfileService.getProfileByName(name);

					let cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(
						Ci.nsISupportsPRBool
					);
					Services.obs.notifyObservers(
						cancelQuit,
						"quit-application-requested",
						"restart"
					);

					if (cancelQuit.data) {
						return;
					}

					Services.startup.createInstanceWithProfile(profile);
					return true;
				}
			}
		}
	}
}