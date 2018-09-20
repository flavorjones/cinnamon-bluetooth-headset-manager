# Cinnamon bluetooth-headset-manager

This repository contains the code and development tools for a [Cinnamon][] [applet][] to manage the [Bluetooth][] [profile][] for a connected headset.

  [Cinnamon]: https://en.wikipedia.org/wiki/Cinnamon_(software)
  [applet]: https://cinnamon-spices.linuxmint.com/applets
  [Bluetooth]: https://en.wikipedia.org/wiki/Bluetooth
  [profile]: https://en.wikipedia.org/wiki/List_of_Bluetooth_profiles


## Features

The applet is disabled until a bluetooth headset or headphones are connected and paired.

When an applicable device is connected and paired, a "headphones" icon appears to indicate they're connected, and the applet:

* sets the A2DP profile for the device,
* sets the device as the default sink,
* and posts a desktop notification.

Clicking on the icon will toggle between A2DP (stereo headphones) and HSP (headset with mic) profiles.

When switched to HSP mode, the icon will appear as a "headset", and the applet:

* sets the HSP profile for the device,
* sets the device as the default sink,
* sets the device as the default source,
* and posts a desktop notification.


## Installation

You'll need `jq` installed to package this up.

1. Clone this repo
2. `make install`

To uninstall:

1. `make uninstall`
