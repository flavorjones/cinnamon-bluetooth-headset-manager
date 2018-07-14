const Applet = imports.ui.applet;
const Util = imports.misc.util;
const GnomeBluetooth = imports.gi.GnomeBluetooth;

function BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id) {
  this._init(metadata, orientation, panel_height, instance_id);
}

BluetoothHeadsetManager.prototype = {
  __proto__: Applet.IconApplet.prototype,

  _init: function(metadata, orientation, panel_height, instance_id) {
    Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

    this._client = new GnomeBluetooth.Client();
    this._model = this._client.get_model();

    this.set_applet_icon_name(metadata["icon"]);
    this.set_applet_tooltip(_("OHAI"));
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

  _get_connected_devices: function() {
    let nDevices = 0;
    let connected_devices = new Array();

    let adapter = this._getDefaultAdapter();
    if (!adapter)
      return [-1, connected_devices];

    let [ret, iter] = this._model.iter_children(adapter);
    while (ret) {
      let isConnected = this._model.get_value(iter, GnomeBluetooth.Column.CONNECTED);
      let isPaired = this._model.get_value(iter, GnomeBluetooth.Column.PAIRED);
      let isTrusted = this._model.get_value(iter, GnomeBluetooth.Column.TRUSTED);
      if (isConnected && isPaired && isTrusted) {
        let name = this._model.get_value(iter, GnomeBluetooth.Column.NAME);
        connected_devices.push(name);
        nDevices++;
      }
      ret = this._model.iter_next(iter);
    }

    return [nDevices, connected_devices];
  },

  on_applet_clicked: function() {
    global.log("here we go ...");

    let [nDevices, connected_devices] = this._get_connected_devices();
    global.log("found " + nDevices + " devices:");
    for (var j = 0 ; j < nDevices ; j++) {
      global.log(connected_devices[j])
    }

    global.log("... done");
  }
};

function main(metadata, orientation, panel_height, instance_id) {
  return new BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id);
}
