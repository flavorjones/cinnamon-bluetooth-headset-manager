# Cinnamon bluetooth-headset-manager

This repository contains the code and development tools for a [Cinnamon][] [applet][] to manage the [Bluetooth][] [profile][] for a connected headset.

  [Cinnamon]: https://en.wikipedia.org/wiki/Cinnamon_(software)
  [applet]: https://cinnamon-spices.linuxmint.com/applets
  [Bluetooth]: https://en.wikipedia.org/wiki/Bluetooth
  [profile]: https://en.wikipedia.org/wiki/List_of_Bluetooth_profiles


## Features

Please keep in mind that in the spirit of Readme-driven-development, this list of features is aspirational until a 1.0 release is made.

* detect when a Bluetooth headset is connected (make an applet icon visible)
* provide one-click toggling between A2DP (stereo listening) and HSP (mic + mono) modes

If this seems like a pretty short list of features, it's also an achievable set of features for a 1.0 release.


## Installation

1. Clone this repo
2. `make install`

To uninstall:

1. `make uninstall`


## TODO

MVP features:

- [x] enabled when a bluetooth headset is connected
- [x] disabled when no bluetooth headset is connected

- [x] set mode to A2DP when a headset is connected, set tooltip
- [x] set mode to HSP when icon is clicked, set tooltip

- [x] display visually-distinct icon when mode is set to A2DP
- [x] set profile to A2DP when mode is A2DP
- [x] set default sink when profile is set to A2DP

- [x] display visually-distinct icon when mode is set to HSP
- [x] set profile to HSP when mode is HSP
- [x] set default sink when profile is set to HSP
- [x] set default source when profile is set to HSP

- [x] create a notification on toggle
- [x] create a notification on disconnect


non-MVP features:

- detect when profile is changed outside of the applet
- don't send so many notifications!
