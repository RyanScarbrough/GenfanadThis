# GenfanadThis
GenfanadThis is a Chrome extension that uses Chrome's debugger API to create a document.this variable for Genfanad's IIFE

![screenshot](https://gcdnb.pbrd.co/images/XRl78ITVcoPh.png)

## How to install

### Step 1
![Step 1](https://gcdnb.pbrd.co/images/qbh7KmTwVGCJ.png)

### Step 2
![Step 2](https://gcdnb.pbrd.co/images/ImcOxRaryWFB.png)

### Step 3
![Step 3](https://gcdnb.pbrd.co/images/eRJbODV6oJfB.png)

## About
Chrome extensions get access to the chrome.debugger API, which serves as an alternate transport for Chrome's remote debugging protocol.

We are able to listen for when "https://play.genfanad.com/play" is being navigated to, and then attach chrome.debugger to the Chrome tab that did it.
From there, the debugger is enabled and we listen for when "https://play.genfanad.com/play/js/client.js" is parsed.
The client.js source code is then retrieved and we look through the code to find an ideal breakpoint (preferably at the very end of the IIFE)
The breakpoint is set in the debugger, and it is immediately hit after client.js executes.
The debugger pauses and we catch the event, then get the current JavaScript callstack, and call a function on the callstack the runs "document.this = this".
Afterwards, the debugger is disabled and detached along with the eventlistener.
