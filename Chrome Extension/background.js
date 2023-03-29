/*
chrome.webNavigation.onCommitted:

Fired when a navigation is committed.
At least part of the new document has been received from the server
and the browser has decided to switch to the new document.
*/

chrome.webNavigation.onCommitted.addListener(function(details) {
  // Check for when browser is navigating Genfanad play URL
  if (details.url.startsWith("https://play.genfanad.com/play")) {
    console.clear()

    // get Genfanad tab Id
    let genTabId = details.tabId

    console.log("Genfanad found: tabId " + genTabId)
    
    /*
    The chrome.debugger API serves as an alternate transport for Chrome's remote debugging protocol.
    */

    // Attach the debugger to
    chrome.debugger.attach({tabId: genTabId}, '1.0', function() {
      console.log("Debugger attached")

      // Send command to debugger to enable
      chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.enable', {}, function(result) {
        console.log("Debugger enabled")
      });

      function handleEvent(debuggeeId, message, params) {

        // If client.js was just parsed
        if (message == 'Debugger.scriptParsed' && debuggeeId.tabId == genTabId
            && params.url.includes("client.js")) {

            console.log("Found client.js:")
            console.log(params)

            // get client.js scriptId
            let scriptId = params.scriptId

            // get possible debugger breakpoints
            chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.getPossibleBreakpoints', {
              start: {
                scriptId: scriptId,
                lineNumber: 0
              },
              restrictToFunction: true
            }, function(result) {

              // get second last possible breakpoint
              let lastPossibleBreakpoint = result.locations[result.locations.length-2]

              console.log("Breakpoints found:")
              console.log(result.locations)

              // subtract columnNumber by 2 to get ideal breakpoint location
              let idealLocation = {
                columnNumber: lastPossibleBreakpoint.columnNumber - 2,
                lineNumber: lastPossibleBreakpoint.lineNumber,
                scriptId: scriptId
              }

              console.log("Ideal breakpoint (end of IIFE):")
              console.log(idealLocation)

              // set breakpoint at ideal location
              chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.setBreakpoint', {
                location: idealLocation
              }, function(result) {
                console.log("Breakpoint set!")
                console.log(result)
              })
            })

            /*

            Alternate method to find a breakpoint using lastIndexOf:

            // get client.js source code
            chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.getScriptSource', {
              scriptId: scriptId
            }, function(script) {
              console.log("Script Source:")
              console.log(script)

              let scriptSource = script.scriptSource
              
              // get the index of the end of the IIFE, ideal breakpoint location
              let IIFECallIndex = scriptSource.lastIndexOf("})();")

              console.log("IDEAL BREAKPOINT FOUND (END OF IIFE):")
              console.log(scriptSource.slice(IIFECallIndex))

              // create breakpoint location
              let idealLocation = {
                columnNumber: IIFECallIndex,
                lineNumber: 0,
                scriptId: scriptId
              }

              console.log("BREAKPOINT LOCATION CREATED:")
              console.log(idealLocation)

              // set a breakpoint at the ideal location
              chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.setBreakpoint', {
                location: idealLocation
              }, function(result) {
                console.log("BREAKPOINT SET")
                console.log(result)
              })

            });

            */
        }

        // Else if debugger was paused, then the breakpoint was hit
        else if(message == 'Debugger.paused') {
          let breakpointId = params.hitBreakpoints[0]
          console.log("Breakpoint hit:")
          console.log(breakpointId)
          console.log("IIFE Call frame OBJECT ID:")
          console.log(params.callFrames[0].scopeChain[0].object.objectId)
          
          // Call a custom function on call stack
          chrome.debugger.sendCommand({tabId: genTabId}, 'Runtime.callFunctionOn', {
            objectId: params.callFrames[0].scopeChain[0].object.objectId,
            functionDeclaration: 'function() { window.genfanad = this; }',
            returnByValue: false
          }, function(result) {
            console.log("Created window.genfanad within callframe")

            // Resume debugger
            chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.resume', {}, function(result) {
              console.log("Resuming script")

              // Remove breakpoint
              chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.removeBreakpoint', {
                breakpointId: breakpointId
              }, function(result) {
                console.log("Breakpoint removed")

                // Disable debugger
                chrome.debugger.sendCommand({tabId: genTabId}, 'Debugger.disable', {}, function(result) {
                  console.log("Debugger disabled")

                  // Detach debugger
                  chrome.debugger.detach({tabId: genTabId}, function() {
                    console.log('Debugger detached');

                    // Remove eventListener
                    chrome.debugger.onEvent.removeListener(handleEvent);
                    console.log("Event handler removed")

                    console.log("Finished debugging!")

                  });
                });
              });
            });
          });
        }

      }

      chrome.debugger.onEvent.addListener(handleEvent)
      console.log("Event handler created")
    });

  }
});