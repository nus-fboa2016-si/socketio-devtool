#basic skeleton for Chrome Devtool

This is the alpha version of the dev tool. To install from source:

1. clone repo to local directory
2. install `webpack` globally with `npm install -g webpack`
2. run `npm install` and `webpack` in the repo folder
2. open `Chrome` browser and type in the address bar `chrome://extensions`
3. click `load unpacked extensions...` and select the `<repo>/src/chrome` folder
4. This will add a `Socket.io` tab to your Chrome Developer Window
5. Navigate to a page that is using Socket.io and open the Chrome Developer Window, then switch to the `Socket.io` tab
6. If `io` is detected as a global variable on the page, and sockets have been created, it should show up on under `Managers` tab

This is a really really early version of the dev-tool. A lot of features are still broken/unsupported. Please file issues to report broken stuff.






