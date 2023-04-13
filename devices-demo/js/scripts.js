'use strict';

const featureSelector = document.getElementById('feature-selector');
const output = document.getElementById('output');

// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js', { scope: '/' })
    .catch(function (error) {
      console.log('Service Worker failed to register:', error);
    });
}
else {
  console.log('Service Worker is not supported by this browser.');
}

/**
 * Handles the feature selector.
 * Validates the selected option and calls the proper function.
 */
featureSelector.addEventListener('change', (event) => {
  output.innerText = '';

  const selectedOption = event.target.value;
  switch (selectedOption) {
    case 'battery': handleBatteryStatusAPI(); break;
    case 'network-info': handleNetworkInformation(); break;
    case 'fullscreen': handleFullscreenAPI(); break;
    case 'screen-orientation': handleScreenOrientationAPI(); break;
    case 'vibration': handleVibrationAPI(); break;
    case 'badging': handleBadgingAPI(); break;
    case 'page-visibility': handlePageVisibility(); break;
    case 'idle-detection': handleIdleDetectionAPI(); break;
    case 'screen-wake-lock': handleScreenWakeLockAPI(); break;
    case 'geolocation': handleGeolocationAPI(); break;

    // Permissions API
    case 'permissions': handlePermissionsAPI(); break;

    // Sensor APIs
    case 'accelerometer': handleAccelerometer(); break;
    case 'linear-acceleration': handleLinearAccelerationSensor(); break;
    case 'gyroscope': handleGyroscope(); break;
    case 'gravity': handleGravitySensor(); break;
    case 'magnetometer': handleMagnetometer(); break;
    case 'ambient-light': handleAmbientLightSensor(); break;
    case 'absolute-orientation': handleAbsoluteOrientationSensor(); break;
    case 'relative-orientation': handleRelativeOrientationSensor(); break;
  }
});

/**
 * The Battery Status API provides information about the system's
 * battery charge level.
 * https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API
 */
function handleBatteryStatusAPI() {
  console.log('navigator:', navigator);
  if ('getBattery' in navigator) {

    // Returns a Promise that resolves with a BatteryManager object.
    // https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager
    navigator.getBattery()
      .then(battery => {
        console.log('Battery:', battery);

        // Helper function to write the battery info
        function writeBatteryInfo() {

          const batteryCharging = battery.charging ? 'Yes' : 'No';
          const batteryLevel = (battery.level * 100).toFixed(0) + '%';
          const chargingTime = battery.chargingTime + ' seconds';
          const dischargingTime = battery.dischargingTime + ' seconds';

          output.innerHTML = `
            <div>Bettery charging: <strong>${batteryCharging}</strong></div>
            <div>Bettery level: <strong>${batteryLevel}</strong></div>
            <div>Charging time: <strong>${chargingTime}</strong></div>
            <div>Discharging time: <strong>${dischargingTime}</strong></div>
          `;
        }
        writeBatteryInfo(); // Write the initial state

        // Fired when the battery charging state (the charging property) is updated.
        battery.addEventListener('chargingchange', () => {
          console.log("Battery charging:", battery.charging);
          writeBatteryInfo();
        });

        // Fired when the battery level (the level property) is updated.
        battery.addEventListener('levelchange', () => {
          console.log("Battery level:", battery.level);
          writeBatteryInfo();
        });

        // Fired when the battery charging time (the chargingTime property) is updated.
        battery.addEventListener('chargingtimechange', () => {
          console.log("Charging time:", battery.chargingTime);
          writeBatteryInfo();
        });

        // Fired when the battery discharging time (the dischargingTime property) is updated.
        battery.addEventListener('dischargingtimechange', () => {
          console.log("Discharging time:", battery.dischargingTime);
          writeBatteryInfo();
        });

      });
  }
  else {
    output.innerText = 'Battery API not supported on this device.';
  }
}

/**
 * The Navigator.connection property returns an object containing information 
 * about the system's connection.
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
 */
function handleNetworkInformation() {
  console.log('navigator:', navigator);
  if ('connection' in navigator) {
    console.log('Connection:', navigator.connection);

    // Helper function to write the network information
    function writeNetworkInfo() {
      const { type, effectiveType, downlink, downlinkMax } = navigator.connection;

      const networkType = type || 'unknown';
      const networkEffectiveType = effectiveType || 'unknown';
      const networkDownlink = downlink || 'unknown';
      const networkDownlinkMax = downlinkMax || 'unknown';

      output.innerHTML = `
        <div>Current network type: <strong>${networkType}</strong></div>
        <div>Cellular connection type: <strong>${networkEffectiveType}</strong></div>
        <div>Estimated bandwidth: <strong>${networkDownlink}</strong> Mbps</div>
        <div>Maximum downlink: <strong>${networkDownlinkMax}</strong> Mbps</div>
      `;
    }
    writeNetworkInfo(); // Write the initial state

    // The event that's fired when connection information changes.
    navigator.connection.addEventListener('change', () => {
      console.log('Connection changed:', navigator.connection);
      writeNetworkInfo();
    });
  }
  else {
    output.innerText = 'Network information not available on this device.';
  }
}

/**
 * The Fullscreen API adds methods to present a specific Element
 * (and its descendants) in fullscreen mode, and to exit fullscreen
 * mode once it is no longer needed.
 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 */
function handleFullscreenAPI() {
  console.log('Document:', document);
  if ('fullscreenElement' in document && 'exitFullscreen' in document && document.fullscreenEnabled) {

    // Create the helper elements
    const button = document.createElement('button');
    button.innerText = 'Toggle Fullscreen';
    output.appendChild(button);

    const message = document.createElement('div');
    message.innerText = 'Click on the button above';
    output.appendChild(message);

    // Adds an action to the toggle button
    button.addEventListener('click', () => {
      if (!document.fullscreenElement) {

        /**
         * Asks the user agent to place the specified element
         * (and, by extension, its descendants) into fullscreen
         * mode, removing all of the browser's UI elements
         * as well as all other applications from the screen.
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
         */
        document.documentElement.requestFullscreen()
          .then(() => {
            message.innerText = 'You are on fullscreen mode now.'
          });
      }
      else {

        /**
         * Requests that the user agent switch from
         * fullscreen mode back to windowed mode.
         * https://developer.mozilla.org/en-US/docs/Web/API/Document/exitFullscreen
         */
        document.exitFullscreen()
          .then(() => {
            message.innerText = 'You left the fullscreen mode.'
          });
      }
    });
  }
  else {
    output.innerText = 'Fullscreen not available or enabled on this device.';
  }
}

/**
 * The Screen Orientation API provides information about the 
 * orientation of the screen, and allows locking the device on 
 * a specific orientation.
 * https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation
 */
function handleScreenOrientationAPI() {
  console.log('Screen:', screen);
  if ('orientation' in screen) {
    console.log('Screen Orientation:', screen.orientation);

    // Include the fullscreen mode functionality 
    handleFullscreenAPI();

    // Create the helper elements
    const buttonLockPortrait = document.createElement('button');
    buttonLockPortrait.innerText = 'Lock Portrait';
    output.appendChild(buttonLockPortrait);

    const buttonLockLandscape = document.createElement('button');
    buttonLockLandscape.innerText = 'Lock Landscape';
    output.appendChild(buttonLockLandscape);

    const buttonUnlock = document.createElement('button');
    buttonUnlock.innerText = 'Unlock';
    output.appendChild(buttonUnlock);

    const message = document.createElement('div');
    message.innerText = '';
    output.appendChild(message);

    // Create a helper function for lockig the screen
    const lockOrientation = (orientation) => {

      /**
       * Locks the orientation of the containing document
       * to the specified orientation.
       * https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock
       */
      screen.orientation.lock(orientation)
        .then(() => {
          message.innerText = `Locked to ${screen.orientation.type}`;
        })
        .catch(error => {
          message.innerText = `Lock error: ${error}`;
        });
    };

    buttonLockPortrait.addEventListener('click', () => {
      lockOrientation('portrait');
    });

    buttonLockLandscape.addEventListener('click', () => {
      lockOrientation('landscape');
    });

    buttonUnlock.addEventListener('click', () => {

      /**
       * Unlocks the orientation of the containing document
       * from its default orientation.
       * https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/unlock
       */
      screen.orientation.unlock();
      message.innerHTML = 'Orientation unlocked';
    });

  }
  else {
    output.innerText = 'Screen orientation is not available on this device.';
  }
}

/**
 * The Navigator.vibrate method pulses the vibration 
 * hardware on the device. Vibration is described as
 * a pattern of on-off pulses.
 * https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API 
 */
function handleVibrationAPI() {
  console.log('Navigator:', navigator);
  if ('vibrate' in navigator) {

    // Create the helper elements
    const buttonSingle = document.createElement('button');
    output.appendChild(buttonSingle);
    buttonSingle.innerText = 'Single Vibration';

    const buttonMultiple = document.createElement('button');
    output.appendChild(buttonMultiple);
    buttonMultiple.innerText = 'Multiple Vibration';

    // Single vibration
    buttonSingle.addEventListener('click', () => {

      /**
       * Pulses the vibration hardware on the device.
       * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
       */
      navigator.vibrate(200); // Vibrate for 200ms
    });

    // Multiple vibration
    buttonMultiple.addEventListener('click', () => {

      /**
       * Pulses the vibration hardware on the device.
       * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
       */
      navigator.vibrate([200, 100, 200, 300, 600]); // A sequence of vibrations and pauses.
    });
  }
  else {
    output.innerText = 'Vibration is not supported on this device.';
  }
}

/**
 * Sets a badge on a document or application, to act as a 
 * notification that state has changed without displaying 
 * a more distracting notification.
 * https://developer.mozilla.org/en-US/docs/Web/API/Badging_API
 */
function handleBadgingAPI() {
  console.log('Navigator:', navigator);
  if ('setAppBadge' in navigator || 'setClientBadge' in navigator) {

    // Create the helper elements
    const buttonSetAppBadge = document.createElement('button');
    output.appendChild(buttonSetAppBadge);
    buttonSetAppBadge.innerText = 'Set App Badge';

    const buttonClearAppBadge = document.createElement('button');
    output.appendChild(buttonClearAppBadge);
    buttonClearAppBadge.innerText = 'Clear App Badge';

    const message = document.createElement('div');
    message.innerText = '';
    output.appendChild(message);

    // Set App Badge
    buttonSetAppBadge.addEventListener('click', () => {

      /**
       * Sets a badge on the icon associated with this app.
       * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/setAppBadge
       * 
       */
      navigator.setAppBadge(12)
        .then(() => {
          message.innerText = 'Badge set to the app.';
        });
    });

    // Clear App Badge
    buttonClearAppBadge.addEventListener('click', () => {

      /**
       * Clears the badge on the icon associated with this app.
       * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clearAppBadge
       */
      navigator.clearAppBadge()
        .then(() => {
          message.innerText = 'Badge cleared from the app.';
        });
    });

  }
  else {
    output.innerText = 'Badge API not available on this device.';
  }
}

/**
 * The visibilitychange event is fired at the document when the
 * contents of its tab have become visible or have been hidden.
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event 
 */
function handlePageVisibility() {
  let leftTime;

  output.innerHTML = `
    Page visibility set.<br>
    Please, don't leave me!
  `;

  /**
   * Returns the visibility of the document
   */
  console.log('State:', document.visibilityState);

  /**
   * Event fired at the document when the contents of its tab
   * have become visible or have been hidden.
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
   */
  document.addEventListener("visibilitychange", function () {
    console.log('State:', document.visibilityState);

    if (document.visibilityState === 'hidden') {

      // Register when the user left
      leftTime = new Date();

      // Display a notification
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          navigator.serviceWorker.ready
            .then((registration) => {
              registration.showNotification('Come back, please!!!', {
                body: "Don't leave me here alone.",
                icon: '/images/logo.png'
              });
            });
        }
      });
    }
    else {
      const now = new Date();
      const timeAway = (now.getTime() - leftTime.getTime()) / 1000;
      output.innerHTML = `
        Welcome back!!!<br>
        You were away for ${timeAway.toFixed(0)} seconds.
      `;
    }
  });
}

/**
 * Provides a means to detect the user's idle status, active, 
 * idle, and locked, specifically, and to be notified of changes 
 * to idle status.
 * https://developer.mozilla.org/en-US/docs/Web/API/Idle_Detection_API
 */
function handleIdleDetectionAPI() {

  if ('IdleDetector' in window) {
    console.log('IdleDetector:', IdleDetector);

    // Create the helper elements
    const buttonPermission = document.createElement('button');
    output.appendChild(buttonPermission);
    buttonPermission.innerText = 'Request Permission';

    const buttonDetection = document.createElement('button');
    output.appendChild(buttonDetection);
    buttonDetection.innerText = 'Start Listening';

    const message = document.createElement('div');
    message.innerText = '';
    output.appendChild(message);

    const buttonClock = document.createElement('button');
    output.appendChild(buttonClock);
    buttonClock.innerText = 'Clock';

    // Requests for permission
    buttonPermission.addEventListener('click', () => {

      /**
       * Returns a Promise that resolves with a string when 
       * the user has chosen whether to grant the origin access 
       * to their idle state.
       * https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector/requestPermission 
       */
      IdleDetector.requestPermission()
        .then((permission) => {
          message.innerText = 'Permission: ' + permission;
        });
    });

    // Starts the detection
    buttonDetection.addEventListener('click', () => {

      // Creates a new IdleDetector object.
      const idleDetector = new IdleDetector();
      console.log('idleDetector', idleDetector);

      /**
       * Called when the value of userState or screenState has changed.
       * https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector#events
       */
      idleDetector.addEventListener('change', () => {
        console.log('Idle changed:', idleDetector);

        /**
         * Returns a string indicating whether the users has interacted
         * with either the screen or the device since the call to start().
         * https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector/userState
         */
        const userState = idleDetector.userState;

        /**
         * Returns a string indicating whether the screen is locked.
         * https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector/screenState
         */
        const screenState = idleDetector.screenState;

        message.innerHTML += `
          <div>Idle change: user <b>${userState}</b>, screen <b>${screenState}</b>.</div>
        `;
      });

      /**
       * Returns a Promise that resolves when the detector starts
       * listening for changes in the user's idle state.
       * This method takes an optional 'options' object with 
       * the 'threshold' in milliseconds where inactivity should
       * be reported (minimum of 1 minute).
       * https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector/start
       */
      idleDetector.start({
        threshold: 60000
      })
        .then(() => {
          console.log('Idle detection started.');
          buttonDetection.disabled = true;
        });
    });

    // Helper button to count elapsed seconds.
    // It has no relation to the IdleDetector object.
    buttonClock.addEventListener('click', () => {
      let seconds = 0;
      buttonClock.innerText = 'Counting';

      setInterval(() => {
        seconds++;
        buttonClock.innerText = seconds + ' seconds';
      }, 1000);
    });

  }
  else {
    output.innerText = 'IdleDetector not supported on this device.';
  }
}

/**
 * The Screen Wake Lock API provides a way to prevent devices from dimming
 * or locking the screen when an application needs to keep running.
 * https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 */
function handleScreenWakeLockAPI() {
  console.log('Navigator:', navigator);
  if ('wakeLock' in navigator) {
    console.log('Navigator wakeLock:', navigator.wakeLock);

    /**
     * The request() method returns a Promise that resolves with a
     * WakeLockSentinel object, which allows control over screen
     * dimming and locking.
     * https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request
     */
    navigator.wakeLock.request('screen')
      .then((sentinel) => {
        console.log('WakeLockSentinel:', sentinel);

        output.innerHTML = `
          <div>Wake Lock is active!</div>
        `;

        // Create a button to release the lock.
        const button = document.createElement('button');
        button.innerText = 'Release screen';
        output.append(button);

        button.addEventListener('click', () => {

          /**
           * Releases the WakeLockSentinel.
           * https://developer.mozilla.org/en-US/docs/Web/API/WakeLockSentinel/release
           */
          sentinel.release()
            .then(() => {
              sentinel = null;
              output.innerHTML = `
                Wake Lock deactivated.<br>
                The screen was released!
              `;
            });
        });

      });
  }
  else {
    output.innerText = 'Screen Wake Lock API not supported on this device.';
  }
}

/**
 * Allows the user to provide their location to web
 * applications if they so desire.
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
function handleGeolocationAPI() {
  console.log('Navigator:', navigator);
  if ('geolocation' in navigator) {
    console.log('Geolocation:', navigator.geolocation);

    // Create the helper elements
    const buttonCurrentPosition = document.createElement('button');
    output.appendChild(buttonCurrentPosition);
    buttonCurrentPosition.innerText = 'Current Position';

    const buttonWatchPosition = document.createElement('button');
    output.appendChild(buttonWatchPosition);
    buttonWatchPosition.innerText = 'Watch Position';

    const message = document.createElement('div');
    message.innerText = '';
    output.appendChild(message);

    // Get current position
    buttonCurrentPosition.addEventListener('click', () => {

      /**
       * Retrieves the device's current location.
       * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
       */
      navigator.geolocation.getCurrentPosition(

        // On Success callback
        (position) => {
          console.log('Current Position:', position);

          message.innerHTML = `
            <strong>Current Position:</strong>
            <br>Latitude: ${position.coords.latitude}
            <br>Longitude: ${position.coords.longitude}
            <br>More or less ${position.coords.accuracy} meters.
          `;
        },

        // On Error callback
        (error) => {
          console.log('Current Position Error:', error);
          message.innerText = 'Geolocation failed to get the current position.';
        }

      );
    });

    // Watch position change
    buttonWatchPosition.addEventListener('click', () => {
      buttonCurrentPosition.disabled = true;
      buttonWatchPosition.disabled = true;

      /**
       * Registers a handler function that will be called 
       * automatically each time the position of the device changes.
       * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
       */
      navigator.geolocation.watchPosition(

        // On Success callback
        (position) => {
          console.log('Watching Position:', position);

          message.innerHTML = `
            <strong>Watching Position:</strong>
            <br>Latitude: ${position.coords.latitude}
            <br>Longitude: ${position.coords.longitude}
            <br>More or less ${position.coords.accuracy} meters.
          `;
        },

        // On Error callback
        (error) => {
          console.log('Watch Position Error:', error);
          message.innerText = 'Geolocation failed to watch position.';
        }

      );
    });

  }
  else {
    output.innerText = 'Geolocation API not available on this device.';
  }
}

/**
 * Provides a consistent way to query the status of API
 * permissions attributed to the current context.
 * https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API 
 */
function handlePermissionsAPI() {
  console.log('Navigator:', navigator);
  if ('permissions' in navigator) {
    console.log('Permissions:', navigator.permissions);

    // Create the helper elements
    const select = document.createElement('select');
    output.appendChild(select);

    let option = document.createElement("option");
    option.value = '';
    option.text = '- Select -';
    select.appendChild(option);

    const values = ["geolocation", "notifications", "push", "midi", "camera", "microphone", "background-fetch", "background-sync", "persistent-storage", "ambient-light-sensor", "accelerometer", "gyroscope", "magnetometer", "screen-wake-lock", "nfc", "display-capture", "accessibility-events", "clipboard-read", "clipboard-write", "payment-handler", "idle-detection", "periodic-background-sync", "system-wake-lock", "storage-access", "window-placement", "local-fonts"];
    for (const val of values) {
      const option = document.createElement("option");
      option.value = val;
      option.text = val;
      select.appendChild(option);
    }

    const message = document.createElement('div');
    message.innerText = 'Select a permission above.';
    output.appendChild(message);

    // Query permissions
    select.addEventListener('change', () => {
      const selectedOption = select.value;

      /**
       * Returns the state of a user permission.
       * https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query
       */
      navigator.permissions.query({
        name: selectedOption,
        userVisibleOnly: true // Only necessary for the Push API
      })
        .then(function (permissionStatus) {
          console.log('Status:', permissionStatus);

          message.innerHTML = `
            State for <b>${permissionStatus.name || selectedOption}</b>: ${permissionStatus.state}
          `;

          if (permissionStatus.state === 'granted') {
            // The app is allowed to use the API
          }

          /**
           * Fires whenever the PermissionStatus.state property changes.
           * https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/change_event
           */
          permissionStatus.addEventListener('change', function () {
            message.innerHTML += `
              <div>Changed state for <b>${this.name || selectedOption}</b>: ${this.state}</div>
            `;
          });
        });
    });

  }
  else {
    output.innerText = 'Permission API not available on this device.';
  }
}

/**
 * Provides on each reading the acceleration applied to the device along all three axes.
 * To use this sensor, the user must grant permission to the 'accelerometer'.
 * https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer
 */
async function handleAccelerometer() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('Accelerometer' in window)) {
    output.innerText = 'Accelerometer not available on this device.';
    return;
  }
  console.log('Accelerometer:', Accelerometer);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the accelerometer permission (using await)
  const accelerometerPermission = await navigator.permissions.query({
    name: 'accelerometer'
  });
  if (accelerometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the accelerometer sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let accelerometer;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new Accelerometer object.
     * https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer/Accelerometer
     */
    accelerometer = new Accelerometer({
      referenceFrame: 'device' // Either 'device' or 'screen'
    });
    console.log('accelerometer:', accelerometer);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    accelerometer.addEventListener('error', event => {
      message.innerText = 'Accelerometer failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    accelerometer.addEventListener('reading', () => {
      const axisX = accelerometer.x.toFixed(2);
      const axisY = accelerometer.y.toFixed(2);
      const axisZ = accelerometer.z.toFixed(2);

      message.innerHTML = `
        <div>Acceleration along the:</div>
        <ul>
          <li>X-axis is <b>${axisX}</b> m/s<sup>2</sup></li>
          <li>Y-axis is <b>${axisY}</b> m/s<sup>2</sup></li>
          <li>Z-axis is <b>${axisZ}</b> m/s<sup>2</sup></li>
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'Accelerometer error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      accelerometer.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      accelerometer.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Provides on each reading the acceleration applied to the device along all
 * three axes, but without the contribution of gravity.
 * To use this sensor, the user must grant permission to the 'accelerometer'.
 * https://developer.mozilla.org/en-US/docs/Web/API/LinearAccelerationSensor
 */
async function handleLinearAccelerationSensor() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('LinearAccelerationSensor' in window)) {
    output.innerText = 'LinearAccelerationSensor not available on this device.';
    return;
  }
  console.log('LinearAccelerationSensor:', LinearAccelerationSensor);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the accelerometer permission (using await)
  const accelerometerPermission = await navigator.permissions.query({
    name: 'accelerometer'
  });
  if (accelerometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the accelerometer sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let linearAcceleration;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new LinearAccelerationSensor object.
     * https://developer.mozilla.org/en-US/docs/Web/API/LinearAccelerationSensor/LinearAccelerationSensor
     */
    linearAcceleration = new LinearAccelerationSensor({
      referenceFrame: 'device' // Either 'device' or 'screen'
    });
    console.log('linearAcceleration:', linearAcceleration);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    linearAcceleration.addEventListener('error', event => {
      message.innerText = 'LinearAccelerationSensor failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    linearAcceleration.addEventListener('reading', () => {
      const axisX = linearAcceleration.x.toFixed(2);
      const axisY = linearAcceleration.y.toFixed(2);
      const axisZ = linearAcceleration.z.toFixed(2);

      message.innerHTML = `
        <div>Linear acceleration along the:</div>
        <ul>
          <li>X-axis is <b>${axisX}</b> m/s<sup>2</sup></li>
          <li>Y-axis is <b>${axisY}</b> m/s<sup>2</sup></li>
          <li>Z-axis is <b>${axisZ}</b> m/s<sup>2</sup></li>
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'LinearAccelerationSensor error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      linearAcceleration.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      linearAcceleration.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Provides on each reading the angular velocity of the device along all three axes.
 * To use this sensor, the user must grant permission to the 'gyroscope' device sensor.
 * https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope
 */
async function handleGyroscope() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('Gyroscope' in window)) {
    output.innerText = 'Gyroscope not available on this device.';
    return;
  }
  console.log('Gyroscope:', Gyroscope);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the gyroscope permission (using await)
  const gyroscopePermission = await navigator.permissions.query({
    name: 'gyroscope'
  });
  if (gyroscopePermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the gyroscope sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let gyroscope;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new Gyroscope object.
     * https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope/Gyroscope
     */
    gyroscope = new Gyroscope({
      referenceFrame: 'device' // Either 'device' or 'screen'
    });
    console.log('gyroscope:', gyroscope);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    gyroscope.addEventListener('error', event => {
      message.innerText = 'Gyroscope failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    gyroscope.addEventListener('reading', () => {
      const axisX = gyroscope.x.toFixed(2);
      const axisY = gyroscope.y.toFixed(2);
      const axisZ = gyroscope.z.toFixed(2);

      message.innerHTML = `
        <div>Angular velocity along the:</div>
        <ul>
          <li>X-axis is <b>${axisX}</b> rad/s</li>
          <li>Y-axis is <b>${axisY}</b> rad/s</li>
          <li>Z-axis is <b>${axisZ}</b> rad/s</li>
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'Gyroscope error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      gyroscope.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      gyroscope.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Provides on each reading the gravity applied to the device along all three axes.
 * To use this sensor, the user must grant permission to the 'accelerometer' device sensor.
 * https://developer.mozilla.org/en-US/docs/Web/API/GravitySensor
 */
async function handleGravitySensor() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('GravitySensor' in window)) {
    output.innerText = 'GravitySensor not available on this device.';
    return;
  }
  console.log('GravitySensor:', GravitySensor);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the accelerometer permission (using await)
  const accelerometerPermission = await navigator.permissions.query({
    name: 'accelerometer'
  });
  if (accelerometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the accelerometer sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let gravity;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new GravitySensor object.
     * https://developer.mozilla.org/en-US/docs/Web/API/GravitySensor/GravitySensor
     */
    gravity = new GravitySensor();
    console.log('gravity:', gravity);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    gravity.addEventListener('error', event => {
      message.innerText = 'GravitySensor failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    gravity.addEventListener('reading', () => {
      const axisX = gravity.x.toFixed(2);
      const axisY = gravity.y.toFixed(2);
      const axisZ = gravity.z.toFixed(2);

      message.innerHTML = `
        <div>Gravity along the:</div>
        <ul>
          <li>X-axis is <b>${axisX}</b> m/s<sup>2</sup></li>
          <li>Y-axis is <b>${axisY}</b> m/s<sup>2</sup></li>
          <li>Z-axis is <b>${axisZ}</b> m/s<sup>2</sup></li>
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'GravitySensor error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      gravity.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      gravity.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Provides information about the magnetic field as detected by the device's primary magnetometer sensor.
 * To use this sensor, the user must grant permission to the 'magnetometer' device sensor.
 * https://developer.mozilla.org/en-US/docs/Web/API/Magnetometer
 * Note: this is an experimental feature and it not enabled by default.
 */
async function handleMagnetometer() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('Magnetometer' in window)) {
    output.innerText = 'Magnetometer not available on this device.';
    return;
  }
  console.log('Magnetometer:', Magnetometer);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the magnetometer permission (using await)
  const magnetometerPermission = await navigator.permissions.query({
    name: 'magnetometer'
  });
  if (magnetometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the magnetometer sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let magnetometer;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new Magnetometer object.
     * https://developer.mozilla.org/en-US/docs/Web/API/Magnetometer/Magnetometer
     */
    magnetometer = new Magnetometer({
      referenceFrame: 'device' // Either 'device' or 'screen'
    });
    console.log('magnetometer:', magnetometer);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    magnetometer.addEventListener('error', event => {
      message.innerText = 'Magnetometer failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    magnetometer.addEventListener('reading', () => {
      const axisX = magnetometer.x.toFixed(2);
      const axisY = magnetometer.y.toFixed(2);
      const axisZ = magnetometer.z.toFixed(2);

      message.innerHTML = `
        <div>Magnetic field along the:</div>
        <ul>
          <li>X-axis is <b>${axisX}</b></li>
          <li>Y-axis is <b>${axisY}</b></li>
          <li>Z-axis is <b>${axisZ}</b></li>
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'Magnetometer error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      magnetometer.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      magnetometer.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Provides information about the current light level or illuminance of the ambient light around the hosting device.
 * To use this sensor, the user must grant permission to the 'ambient-light-sensor' device sensor.
 * https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor
 * Note: this is an experimental feature and it not enabled by default.
 */
async function handleAmbientLightSensor() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('AmbientLightSensor' in window)) {
    output.innerText = 'AmbientLightSensor not available on this device.';
    return;
  }
  console.log('AmbientLightSensor:', AmbientLightSensor);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the ambient-light-sensor permission (using await)
  const ambientLightPermission = await navigator.permissions.query({
    name: 'ambient-light-sensor'
  });
  if (ambientLightPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the ambient light sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let ambientLight;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new AmbientLightSensor object.
     * https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor/AmbientLightSensor
     */
    ambientLight = new AmbientLightSensor();
    console.log('ambientLight:', ambientLight);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    ambientLight.addEventListener('error', event => {
      message.innerText = 'AmbientLightSensor failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    ambientLight.addEventListener('reading', () => {
      message.innerHTML = `
        <div>Current light level: ${sensor.illuminance}</div>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'AmbientLightSensor error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      ambientLight.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      ambientLight.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Describes the device's physical orientation in relation to the Earth's reference coordinate system.
 * To use this sensor, the user must grant permission to the 'accelerometer', 'gyroscope', and 'magnetometer' 
 */
async function handleAbsoluteOrientationSensor() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('AbsoluteOrientationSensor' in window)) {
    output.innerText = 'AbsoluteOrientationSensor not available on this device.';
    return;
  }
  console.log('AbsoluteOrientationSensor:', AbsoluteOrientationSensor);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the accelerometer permission (using await)
  const accelerometerPermission = await navigator.permissions.query({
    name: 'accelerometer'
  });
  if (accelerometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the accelerometer sensor.';
    return;
  }

  // Validate the gyroscope permission (using await)
  const gyroscopePermission = await navigator.permissions.query({
    name: 'gyroscope'
  });
  if (gyroscopePermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the gyroscope sensor.';
    return;
  }

  // Validate the magnetometer permission (using await)
  const magnetometerPermission = await navigator.permissions.query({
    name: 'magnetometer'
  });
  if (magnetometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the magnetometer sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let absoluteOrientation;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new AbsoluteOrientationSensor object.
     * https://developer.mozilla.org/en-US/docs/Web/API/AbsoluteOrientationSensor/AbsoluteOrientationSensor
     */
    absoluteOrientation = new AbsoluteOrientationSensor({
      referenceFrame: 'device' // Either 'device' or 'screen'
    });
    console.log('absoluteOrientation:', absoluteOrientation);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    absoluteOrientation.addEventListener('error', event => {
      message.innerText = 'AbsoluteOrientationSensor failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    absoluteOrientation.addEventListener('reading', () => {
      let orientation = '';
      absoluteOrientation.quaternion.forEach((value) => {
        orientation += `<li>${value.toFixed(15)}</li>`;
      });

      message.innerHTML = `
        <div>Absolute orientation: </div>
        <ul>
          ${orientation}
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'AbsoluteOrientationSensor error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      absoluteOrientation.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      absoluteOrientation.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}

/**
 * Describes the device's physical orientation without regard to the Earth's reference coordinate system.
 * To use this sensor, the user must grant permission to the 'accelerometer', and 'gyroscope'.
 */
async function handleRelativeOrientationSensor() {
  console.log('Window:', window);

  // Validates the sensor API
  if (!('RelativeOrientationSensor' in window)) {
    output.innerText = 'RelativeOrientationSensor not available on this device.';
    return;
  }
  console.log('RelativeOrientationSensor:', RelativeOrientationSensor);

  // Validates the Permission API
  if (!('permissions' in navigator)) {
    output.innerText = 'Permission API not available on this device.';
    return;
  }

  // Validate the accelerometer permission (using await)
  const accelerometerPermission = await navigator.permissions.query({
    name: 'accelerometer'
  });
  if (accelerometerPermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the accelerometer sensor.';
    return;
  }

  // Validate the gyroscope permission (using await)
  const gyroscopePermission = await navigator.permissions.query({
    name: 'gyroscope'
  });
  if (gyroscopePermission.state !== 'granted') {
    output.innerText = 'You are not autorized to use the gyroscope sensor.';
    return;
  }

  // Create the helper elements
  const buttonStart = document.createElement('button');
  buttonStart.innerText = 'Start';
  buttonStart.disabled = true;
  output.appendChild(buttonStart);

  const buttonStop = document.createElement('button');
  buttonStop.innerText = 'Stop';
  buttonStop.disabled = true;
  output.appendChild(buttonStop);

  const message = document.createElement('div');
  message.innerText = '';
  output.appendChild(message);

  // Declare the sensor variable
  let relativeOrientation;

  /**
   * Checking for thrown errors when instantiating a sensor object.
   * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
   */
  try {

    /**
     * Creates a new RelativeOrientationSensor object.
     * https://developer.mozilla.org/en-US/docs/Web/API/RelativeOrientationSensor/RelativeOrientationSensor
     */
    relativeOrientation = new RelativeOrientationSensor({
      referenceFrame: 'device' // Either 'device' or 'screen'
    });
    console.log('relativeOrientation:', relativeOrientation);

    /**
     * Listening for errors thrown during its use.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs#defensive_programming
     */
    relativeOrientation.addEventListener('error', event => {
      message.innerText = 'RelativeOrientationSensor failed: ' + event.error;
      buttonStart.disabled = false;
      buttonStop.disabled = true;
    });

    /**
     * The reading event is fired when a new reading is available on a sensor.
     * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/reading_event
     */
    relativeOrientation.addEventListener('reading', () => {
      let orientation = '';
      relativeOrientation.quaternion.forEach((value) => {
        orientation += `<li>${value.toFixed(15)}</li>`;
      });

      message.innerHTML = `
        <div>Relative orientation: </div>
        <ul>
          ${orientation}
        </ul>
      `;
    });

    // Enable the start button
    buttonStart.disabled = false;

  } catch (error) {
    message.innerText = 'RelativeOrientationSensor error: ' + error;
  }

  // Start the sensor
  buttonStart.addEventListener('click', () => {
    try {

      /**
       * The start method activates one of the sensors based on Sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/start
       */
      relativeOrientation.start();

      buttonStart.disabled = true;
      buttonStop.disabled = false;
    } catch (error) {
      message.innerText = 'It was not possible to start the sensor: ' + error;
    }
  });

  // Stop the sensor
  buttonStop.addEventListener('click', () => {
    try {

      /**
       * The stop method deactivates the current sensor.
       * https://developer.mozilla.org/en-US/docs/Web/API/Sensor/stop
       */
      relativeOrientation.stop();

      buttonStart.disabled = false;
      buttonStop.disabled = true;
      message.innerHTML += "<div>Sensor stopped!</div>";
    } catch (error) {
      message.innerText = 'It was not possible to stop the sensor: ' + error;
    }
  });
}