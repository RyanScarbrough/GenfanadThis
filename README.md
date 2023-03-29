# GenfanadThis
GenfanadThis is a Chrome extension that uses [Chrome's debugger API](https://developer.chrome.com/docs/extensions/reference/debugger/) to create a global 'genfanad' variable to access Genfanad's IIFE variables, without modifying any of its code.

![screenshot](https://gcdnb.pbrd.co/images/2rcMLy9R9xtt.png)

## How to install

### Step 1
![Step 1](https://gcdnb.pbrd.co/images/qbh7KmTwVGCJ.png)

### Step 2
![Step 2](https://gcdnb.pbrd.co/images/ImcOxRaryWFB.png)

### Step 3
![Step 3](https://gcdnb.pbrd.co/images/eRJbODV6oJfB.png)

## About
Chrome extensions get access to the chrome.debugger API, which "serves as an alternate transport for Chrome's [remote debugging protocol](https://chromedevtools.github.io/devtools-protocol/)." We can use this API to attach a debugger and send commands to it. We then use the debugger to create a breakpoint and call a function on the callstack where the breakpoint gets hit.

**How it works:**

1) We listen for when "https://play.genfanad.com/play" is being navigated to, and then attach chrome.debugger to the Chrome tab that did it.

2) The debugger is enabled and we listen for when "client.js" is parsed.

3) We then get possible breakpoints and find the most ideal breakpoint location (preferably at the very end of the IIFE)

4) The breakpoint is set in the debugger, and it immediately hits after client.js executes.

5) The debugger pauses at the breakpoint and we catch the event, then we retrieve the current JavaScript callstack, and call a function on the callstack that runs "window.genfanad = this".

6) Afterwards, the debugger is disabled and detached along with the eventlistener.

## Implications

Chrome's remote debugging protocol can be used to get access to Genfanad IIFE variables.

An instance of Chrome could be ran with "--remote-debugging-port=9222 --user-data-dir=remote-profile" to enable remote debugging. Then almost any program could access the debugger remotely and use it to create a global Genfanad _this_ variable if needed.
