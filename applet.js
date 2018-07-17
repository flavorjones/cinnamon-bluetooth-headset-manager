//
// This file contains code based on and borrowed from:
//
//   http://developer.linuxmint.com/reference/git/cinnamon-tutorials/index.html
//     (no apparent license)
//
//   https://github.com/linuxmint/blueberry
//     (GPLv3)
//

const Applet = imports.ui.applet;
const GnomeBluetooth = imports.gi.GnomeBluetooth;
const Lang = imports.lang;
const Util = imports.misc.util;

function _sleep(ms) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < ms);
}

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
      "has-source": false,
    },
    "hsp": {
      "name": "hsp",
      "tooltip": "HSP",
      "icon": "audio-headset",
      "profile-name": "headset_head_unit",
      "has-source": true,
    }
  },

  _setState: function(toggle) {
    let previous_mode = this._mode;
    let relevant_device = this._relevantPairedDevice();

    if (relevant_device == null) {
      this.set_applet_enabled(false);
      this._mode = null ;

      if (previous_mode != this._mode) {
        let command = ["notify-send", "--expire-time=1000", "--category=device", "--urgency=low", "--icon=audio-headphones", "'Headphones have been disconnected.'"];
        Util.spawnCommandLine(command.join(" "));
      }

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

    if (previous_mode != this._mode) {
      let commands = new Array()
      this._cmdCardProfile(this._mode, relevant_device, commands);
      this._cmdDefaultSink(this._mode, relevant_device, commands);
      this._cmdDefaultSource(this._mode, relevant_device, commands);
      this._cmdNotify(this._mode, relevant_device, commands);

      for (var j in commands) {
        global.log("CMD: '" + commands[j] + "'");
        Util.spawnCommandLine(commands[j]);
        _sleep(100);
      }

      this.set_applet_tooltip(relevant_device[0] + ": " + this._mode["tooltip"]);
      this.set_applet_icon_symbolic_name(this._mode["icon"]);
      this.set_applet_enabled(true);
    }
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

  _cmdCardProfile: function(mode, relevant_device, commands) {
    let address = relevant_device[1];
    let card_name = "bluez_card." + address.replace(/:/g, "_");
    let command = ["pacmd", "set-card-profile", card_name, mode["profile-name"]];
    commands.push(command.join(" "));
    return;
  },

  _cmdDefaultSink: function(mode, relevant_device, commands) {
    let address = relevant_device[1];
    let sink_name = "bluez_sink." + address.replace(/:/g, "_") + "." + mode["profile-name"];
    let command = ["pacmd", "set-default-sink", sink_name];
    commands.push(command.join(" "));
    return;
  },

  _cmdDefaultSource: function(mode, relevant_device, commands) {
    if (! this._mode["has-source"]) {
      return;
    }
    let address = relevant_device[1];
    let source_name = "bluez_source." + address.replace(/:/g, "_") + "." + mode["profile-name"];
    let command = ["pacmd", "set-default-source", source_name];
    commands.push(command.join(" "));
    return;
  },

  _cmdNotify: function(mode, relevant_device, commands) {
    let name = relevant_device[0];
    let command = ["notify-send", "--expire-time=1000", "--category=device", "--urgency=low", "--icon=" + mode["icon"], "'" + name + "'", "'Profile bas been set to " + mode["tooltip"] + "'"];
    commands.push(command.join(" "));
    return;
  },
}

function main(metadata, orientation, panel_height, instance_id) {
  return new BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id);
}
