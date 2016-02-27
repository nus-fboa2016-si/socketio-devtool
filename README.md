#basic skeleton for Chrome Devtool

This is a MVP version of the dev tool. To use it:

1. clone repo to local directory
2. run `npm install` and `gulp JS` in the repo folder
2. open `Chrome` browser and type in the address bar `chrome://extensions`
3. click `load unpacked extensions...` and select the `<repo>/src/` folder
4. This will add a `Socket.io` tab to your Chrome Developer Window
5. Navigate to a page that is using Socket.io and open the Chrome Developer Window, then switch to the `Socket.io` tab
6. If `io` is detected as a global variable on the page, and sockets have been created, it should show up on under `Managers` tab

This is a really really early version of the dev-tool. A lot of things are still broken.

##Application flow:
`Manifest.json` declares to Chrome what the application is about.
There are 3 points of entry (for now):

* background.js
* devtoolsBackground.html
* content_script.js


**background.js** runs in the background of Chrome and faciliates communication between all the tabs. For now, we are only using it to communicate between `content_script.js` and the devtool page, and for logging errors.


**devtoolsBackground.html** is the entry point of our devtool. 
`devtoolsBackground.html` basically injects `devtoolBackground.js`, which then creates a *panel* (the devtool tab), which can be rendered in Chrome Web Inspector. In our case, the panel is named `panel.html`. `panel.html` then runs `init.js`, which injects a script (`inject.js`) using `chrome.devtools.inspectedWindow.eval()`. `inject.js` runs in the context of the inspectedWindow's environment. It then tries to look for `window.io`, and emit an message event with property, type, of value, `socketiodev`. `content_script.js` is supposed to receive this event and relay to `background.js`.


**content_script.js** runs alongside the webpage that we want to inspect. It has access to the webpage's DOM, but not the javascript environment.
`content_script.js` listens to message events. If message events has property, type with value `socketiodev`. It relay the message to `background.js`






