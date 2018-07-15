const Applet = imports.ui.applet;
const GnomeBluetooth = imports.gi.GnomeBluetooth;
const Lang = imports.lang;
const Util = imports.misc.util;

function BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id) {
  this._init(metadata, orientation, panel_height, instance_id);
}

BluetoothHeadsetManager.prototype = {
  __proto__: Applet.IconApplet.prototype,

  _init: function(metadata, orientation, panel_height, instance_id) {
    Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

    this._client = new GnomeBluetooth.Client();
    this._model = this._client.get_model();

    this._model.connect('row-changed', Lang.bind(this, this._setState));
    this._model.connect('row-deleted', Lang.bind(this, this._setState));
    this._model.connect('row-inserted', Lang.bind(this, this._setState));

    this._setState();
  },

  on_applet_clicked: function() {
    this._setState(true);
  },

  _mode: null,

  _modes: {
    "a2dp": {
      "name": "a2dp",
      "tooltip": "A2DP",
      "icon": "audio-headphones",
      "profile-name": "a2dp_sink",
    },
    "hsp": {
      "name": "hsp",
      "tooltip": "HSP",
      "icon": "audio-headset-symbolic",
      "profile-name": "headset_head_unit",
    }
  },

  _setState: function(toggle) {
    let relevant_device = this._relevantPairedDevice();
    if (relevant_device == null) {
      this.set_applet_enabled(false);
      this._mode = null ;
      return;
    }

    if (this._mode == null) {
      this._mode = this._modes["a2dp"];
    } else if (toggle == true) {
      if (this._mode["name"] == "hsp") {
        this._mode = this._modes["a2dp"];
      } else {
        this._mode = this._modes["hsp"];
      }
    }

    this._setCardProfile(this._mode, relevant_device);

    this.set_applet_tooltip(relevant_device[0] + ": " + this._mode["tooltip"]);
    this.set_applet_icon_symbolic_name(this._mode["icon"]);
    this.set_applet_enabled(true);
  },

  _relevantPairedDevice: function() {
    let connected_devices = this._getConnectedDevices();
    return connected_devices[0];
  },

  _getDefaultAdapter: function() {
    let [ret, iter] = this._model.get_iter_first();
    while (ret) {
      let isDefault = this._model.get_value(iter, GnomeBluetooth.Column.DEFAULT);
      let isPowered = this._model.get_value(iter, GnomeBluetooth.Column.POWERED);

      if (isDefault && isPowered) {
        return iter;
      }
      ret = this._model.iter_next(iter);
    }
    return null;
  },

  _getConnectedDevices: function() {
    let connected_devices = new Array();

    let adapter = this._getDefaultAdapter();
    if (!adapter) {
      return connected_devices;
    }

    let [ret, iter] = this._model.iter_children(adapter);
    while (ret) {
      let isConnected = this._model.get_value(iter, GnomeBluetooth.Column.CONNECTED);
      let isPaired = this._model.get_value(iter, GnomeBluetooth.Column.PAIRED);
      let isTrusted = this._model.get_value(iter, GnomeBluetooth.Column.TRUSTED);
      let deviceType = this._model.get_value(iter, GnomeBluetooth.Column.TYPE);

      if (isConnected && isPaired && isTrusted
          && (deviceType == GnomeBluetooth.Type.HEADPHONES
              || deviceType == GnomeBluetooth.Type.HEADSET)
         ) {
        let name = this._model.get_value(iter, GnomeBluetooth.Column.NAME);
        let address = this._model.get_value(iter, GnomeBluetooth.Column.ADDRESS);
        connected_devices.push([name, address]);
      }
      ret = this._model.iter_next(iter);
    }

    return connected_devices;
  },

  _setCardProfile: function(mode, relevant_device) {
    let address = relevant_device[1];
    let card_name = "bluez_card." + address.replace(/:/g, "_");
    let command = ["pacmd", "set-card-profile", card_name, mode["profile-name"]];
    global.log(JSON.stringify(command));
    Util.spawn(command);
  }
}

function main(metadata, orientation, panel_height, instance_id) {
  return new BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id);
}
