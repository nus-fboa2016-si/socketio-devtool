#basic skeleton for Chrome Devtool

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






