# Cinnamon bluetooth-headset-manager

This repository contains the code and development tools for a [Cinnamon][] [applet][] to manage the [BluetoothⓇ][] [profile][] for a connected headset.


  [Cinnamon]: https://en.wikipedia.org/wiki/Cinnamon_(software)
  [applet]: https://cinnamon-spices.linuxmint.com/applets
  [BluetoothⓇ]: https://en.wikipedia.org/wiki/Bluetooth
  [profile]: https://en.wikipedia.org/wiki/List_of_Bluetooth_profiles


## Features

Please keep in mind that in the spirit of Readme-driven-development, this list of features is aspirational until a 1.0 release is made.

* detect when a Bluetooth headset is connected (make an applet icon visible)
* provide one-click toggling between A2DP (stereo listening) and HSP (mic + mono) modes

If this seems like a pretty short list of features, it's also an achievable set of features for a 1.0 release.


## TODO

learn:

- [x] how to list connected, paired, trusted bluetooth devices
- [ ] how to get notified when bluetooth devices are added/leave
  - see blueberry/usr/share/cinnamon/applets/blueberry@cinnamon.org/applet.js

- [ ] how to list available profiles for the devices
  - maybe look at Cinnamon/files/usr/share/cinnamon/cinnamon-settings/modules/cs_sound.py
  - Cvc → MixerCard →
    https://lazka.github.io/pgi-docs/Cvc-1.0/classes/MixerCard.html#Cvc.MixerCard.get_profiles
    https://lazka.github.io/pgi-docs/Cvc-1.0/classes/MixerCardProfile.html#Cvc.MixerCardProfile

    and check out sound150@claudiux/files/sound150@claudiux/3.4/applet.js to see how to use Cvc

- [ ] how to set a profile for a device

- [ ] how to show/hide the icon (depending on connected devices)
- [ ] how to change the icon
- [x] how to get notified when user clicks
