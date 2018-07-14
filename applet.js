const Applet = imports.ui.applet;
const Util = imports.misc.util;

function BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id) {
  this._init(metadata, orientation, panel_height, instance_id);
}

BluetoothHeadsetManager.prototype = {
  __proto__: Applet.IconApplet.prototype,

  _init: function(metadata, orientation, panel_height, instance_id) {
    Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

    this.set_applet_icon_name(metadata["icon"]);
    this.set_applet_tooltip(_("OHAI"));
  },

  on_applet_clicked: function() {
    Util.spawn(['gnome-terminal']);
  }
};

function main(metadata, orientation, panel_height, instance_id) {
  return new BluetoothHeadsetManager(metadata, orientation, panel_height, instance_id);
}
