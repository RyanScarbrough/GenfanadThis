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
Chrome extensions get access to the chrome.debugger API, which serves as an alternate transport for Chrome's remote debugging protocol. We can use this API to attach a debugger and send commands to it.

**How it works:**

1) We listen for when "https://play.genfanad.com/play" is being navigated to, and then attach chrome.debugger to the Chrome tab that did it.

2) The debugger is enabled and we listen for when "https://play.genfanad.com/play/js/client.js" is parsed.

3) The client.js source code is then retrieved and we look through the code to find an ideal breakpoint (preferably at the very end of the IIFE)

4) The breakpoint is set in the debugger, and it is immediately hits after client.js executes.

5) The debugger pauses at the breakpoint and we catch the event, then we retrieve the current JavaScript callstack, and call a function on the callstack that runs "document.this = this".

6) Afterwards, the debugger is disabled and detached along with the eventlistener.
