# Web Bluetooth Terminal

Ce projet a été honteusement pompé sur celui de loginov-rocks.
Il a été adapté pour fonctionner avec les modules Adafruit Bluefruit LE:
les identifiants UUID des services et des caractéristiques sont différents


![Favicon](https://raw.githubusercontent.com/loginov-rocks/Web-Bluetooth-Terminal/master/icons/favicon-16x16.png)
[https://loginov-rocks.github.io/Web-Bluetooth-Terminal](https://loginov-rocks.github.io/Web-Bluetooth-Terminal/) — try
it out, see how it works on [YouTube](https://www.youtube.com/watch?v=BNXN_931W_M), read tutorial on
[Medium](https://medium.com/@loginov_rocks/how-to-make-a-web-app-for-your-own-bluetooth-low-energy-device-arduino-2af8d16fdbe8)
(English) or on [Habr](https://habr.com/post/339146/) (Russian).

Web Bluetooth Terminal is a website that can **connect** with the remote devices which support **Bluetooth Low Energy**
(also called Bluetooth Smart) and **exchange data bidirectionally**. It can be installed on your homescreen as an
application and work offline.


One of browsers which supports Web Bluetooth API by default
([Chrome Platform Status](https://www.chromestatus.com/feature/5264933985976320),
[Can I use](https://caniuse.com/#feat=web-bluetooth)):

1. Chrome for desktop 56+
2. Chrome for Android 56+
3. Opera 43+
4. Opera for Android 43+

All this browsers support other necessary features, such as [ES6 classes](https://caniuse.com/#feat=es6-class) and PWA
capabilities ([Web App Manifest](https://caniuse.com/#feat=web-app-manifest) and
[Service Workers](https://caniuse.com/#feat=serviceworkers)), so I don't pay attention to it here.


#### BLE module configuration

When a BLE module is waiting for connection it can be configured with `AT` commands. So if you have troubles trying to
make BLE module work as expected you can use following commands, but again, read specifications! Here are some commands
I use with CC41-A module:

* `AT+DEFAULT` — resets the module to the defaults;
* `AT+RESET` — resets the module softly;
* `AT+ROLE` — gets the module working mode;
* `AT+ROLE0` — makes the module to work in slave mode, waiting for connection from other devices;
* `AT+NAME` — gets the module name;
* `AT+NAMESimon` — sets the module name to `Simon`;
* `AT+PIN` — gets the module pin (password);
* `AT+PIN123456` — sets the module pin to `123456`;
* `AT+UUID` — gets the module service UUID;
* `AT+CHAR` — gets the module characteristic UUID.

Commands can be case insensitive and may need to be terminated with `CR` (`\r`) and `LF` (`\n`).

## Reference

1. [Web Bluetooth Specification](https://webbluetoothcg.github.io/web-bluetooth/)
2. [Web Bluetooth Samples](https://googlechrome.github.io/samples/web-bluetooth/)
3. [Interact with Bluetooth devices on the Web](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web/)
4. [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
5. [Service Worker Toolbox](https://github.com/GoogleChromeLabs/sw-toolbox/)

