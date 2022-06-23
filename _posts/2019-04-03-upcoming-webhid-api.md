---
title: Upcoming WebHID API - access Bluetooth/USB HID devices in web applications
date: 2019-04-03 00:00:00 Z
categories:
- rwilliams
- Tech
author: rwilliams
layout: default_post
summary: The WebHID API will allow web applications to use human input/output devices
  connected via Bluetooth or USB. This post takes an early look at where it fits in,
  the possibilities enables, and how to use it.
---

Later on this year (2019), a host of new APIs are due to land in the Google Chrome (Chromium) browser. They form part of "[Project Fugu](https://blog.chromium.org/2018/11/our-commitment-to-more-capable-web.html)", an effort to [close the capability gap](https://developers.google.com/web/updates/capabilities) between web and native applications. The [WebHID API](https://wicg.github.io/webhid) for human interface devices is [one of these](https://bugs.chromium.org/p/chromium/issues/list?q=label:Proj-Fugu).

In this post, I'll be taking an early look at where it fits in, the possibilities it enables, and (fairly speculatively) how to use it.

Bear in mind that the API is not yet released, and the only information out there is the specification draft - so there may be some inaccuracies on my part.


## HID input/output on the web
Web applications can already make use of input from various HID devices such as mice, touchscreens, keyboards, and gamepads. Plain old UI events handle the former ones, while the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API) handles the latter. Those work at a high-level of abstraction (which can be limiting), and only cover a fraction of the different types of HID devices available. No output is possible.

Much lower down in terms of abstraction, we have [Web Bluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) and [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/USB). Working with devices at these low levels is hardly convenient. They also prohibit access to HID-class devices, so WebHID is the preferred and only way of doing so.

WebHID fits in the middle, between these two groups. Using the HID protocol allows standardised communication at a high level, while still giving full control of device inputs/outputs, and removes the need for device-specific drivers. HID devices that use the HID protocol (not all of them do) also describe themselves (available inputs, outputs) in terms of standard "usages", allowing application code to be written to work with a particular type of device rather than a specific model.

Until now, applications that needed this kind of hardware access would have needed some form of installed companion to facilitate it, such as a Chrome App or a trusted Silverlight plugin. Alternatively, they could go a step further and use Electron with its Node.js integration.


## Newly enabled possibilities
Web applications can now use many more HID devices, with deep integration, in a way that's frictionless for the user and reasonably straightforward to implement for entire types of similar devices. This will be an enhancement for some applications, while for others that absolutely require device access it may make the web a candidate platform.

To list some example devices from the HID spec: flight simulation controls, virtual reality controls, gamepads, joysticks, jog/shuttle wheels, LED indicators, buttons, sensors, telephony headsets, keypads, audio controls, digitizers, and alphanumeric/bitmap displays. There are many applications which could benefit from integration with these.

Note that devices which generate trusted input (e.g. keyboards, mice, security keys) will be considered protected usages and will not be accessible. More on security/permissioning later. Some specialist programmable keyboards/keypads can however be configured to expose themselves as different usages, thereby allowing them to be used.


## The new API: navigator.hid
The API will be available under `navigator.hid`.

At the time of writing, it's currently [in development](https://bugs.chromium.org/p/chromium/issues/detail?id=890096) in Chromium (Google Chrome). The labels indicate that it's targeted to be ready in version 75 (June) and released in version 78 (October). So you'll have to wait a while to even get a glimpse of it on the dev or canary channels.

It's worth noting that the [specification draft](https://wicg.github.io/webhid) is from the Web Platform Incubator Community Group (WICG); it's not a W3C standard and nor is it on the standards track to become one. So it's unlikely to appear in other browsers, at least for a while.


## Requesting user consent
Before an application can access a device, it must first seek (and be granted) consent from the user. This is done using the `navigator.hid.requestDevice()` method, which causes the browser to launch a chooser dialog similar to the one seen in WebUSB and Web Bluetooth. The method must be called within the context of an user gesture such as a mouse click.

It accepts an array of filters which can be used to constrain the devices shown in the chooser to only those the application can make use of. A device will be shown if it satisfies *any* of the filter objects. Each object may specify PCI IDs for a particular vendor or device, and/or HID usage-pages/usages. This allows a range of filtering options such as "any of these particular devices", "any gamepad by manufacturer A", or "any simulation control that has a throttle".

Here, I'm going to filter for any telephony device that has a hook switch usage (for answering/ending calls). The identifiers are from the [USB HID Usage Tables](https://www.usb.org/sites/default/files/documents/hut1_12v2.pdf) (page 69), which also apply for the Bluetooth HID profile since that's lightweight wrapper of the USB one.

~~~javascript
const consentButton = document.getElementById('consent-button');

const deviceFilters = [{ usagePage: 0x0b, usage: 0x20 }];

consentButton.addEventListener('click', async () => {
  let device;

  try {
    const devices = await navigator.hid.requestDevice({ filters: deviceFilters });
    device = devices[0];
  } catch (error) {
    console.warn('No device access granted', error);
    return;
  }
});
~~~

Once access is granted, a few other `navigator.hid` parts will start reporting about the device. It will be returned by the `getDevices()` method, allowing it to be used seamlessly without a consent prompt the next time the application is used. Events are also emitted for `connect` and `disconnect`, which the application should use to handle those scenarios appropriately and gracefully.


## Opening the device
The device is a resource that needs to be opened before it can be used:

~~~ javascript
await device.open();

// later on, when we're finished with it
await device.close();
~~~


## Listening for input
When a user performs some input on a device, it sends an "input report" using the HID protocol. These consist of a report identifier and data. A device will typically have many of these covering its various functions. To identify the one we're interested in, we need to make use of the report descriptors that are part of the device's own descriptor (its description of itself). They may be organised into a hierarchy of logical collections representing different parts of a device, but for simplicity here I'm going to assume that they're all in one of the device's top-level collections.

Here, I'm adding a listener for input reports, and determining if it's for the hook switch we previously required that the device had. We'll be able to detect when the user presses the button on their headset to answer/end a call.

~~~javascript
device.addEventListener('inputreport', event => {
  const collection = event.device.collections.find(candidate =>
    candidate.reportIds.includes(event.reportId)
  );

  if (collection.usagePage === 0x0b && collection.usage === 0x20) {
    // the report is for the hook switch
  }
});
~~~

Being a simple switch, there isn't much to be done to interpret the data. The usage tables document states that it's a single bit where `1` means "off hook", so we could probably read it straight out of the data `ArrayBuffer` without much trouble. It's not always going to be this simple though, so we'll use the collection's `getField()` utility method instead (I think it may use the report descriptors to do some conversion/interpretation work):

~~~javascript
const value = collection.getField(event.data, {
  reportId: event.reportId,
  fieldIndex: 0,
});
const offHook = value === 1;

console.log(`The device is now ${offHook ? 'off' : 'on'} the hook`);
~~~


## Sending output
Reports are also used to make the device emit some output; these are called "output reports". When we requested access to the device earlier, we didn't require a device to have any output capabilities. So as part of preparing to send an output report to the device, we'll need to include a check for such capability.

Here, I'm looking for a "ring" LED indicator which is one of the telephony usages under the LEDs usage page (page 63 in the usage tables document). We'll be able to activate/deactivate it as needed from our application.

~~~javascript
const ringButton = document.getElementById('ring-button');

const ringCollection = device.collections.find(candidate =>
  candidate.usagePage === 0x08 && candidate.usage === 0x18
);

if (ringCollection) {
  // device has a ring indicator
} else {
  ringButton.disabled = true;
}
~~~

The usage tables document (page 61) states that a value of `1` will turn it on, and `0` will turn it off. To determine the report ID that should be sent to control the indicator, I've assumed (possibly incorrectly) that the "ring" collection only has a single report - as I can't imagine it being any other way.

Here, I wire up the UI button to construct and send an output report to turn on the indicator. A similar helper to the one seen previously is used to construct the report's data.

~~~javascript
ringButton.addEventListener('click', () => {
  const reportId = ringCollection.outputReports[0].reportId;  // assume a single report

  const reportData = new Uint8Array(1);
  const value = 1;  // indicator "on" state
  ringCollection.setField(reportData, { reportId, fieldIndex: 0 }, value);

  device.sendReport(reportId, reportData);
});
~~~


## More complex reports
The reports' data in the above examples were single bits. Much more complex data can be transmitted, and the report descriptors allow the device to describe it in a way that application code can meaningfully interpret. These include arrays, ranges, units, and minimums and maximums for mapping logical values to physical-world values (e.g. a temperature, or an angle).


## Application developer's perspective
As we've seen, it's not the most straightforward experience for an application developer (although much better than low-level USB). The USB HID usage tables document needs to be consulted to understand what to send/receive, and I expect in the real world that quite a few devices deviate from this to various degrees up to defining their own completely custom usages (documented, or not). Acquiring more than a few real devices to test with and iron out any problems would be expensive and time-consuming.

I agree with the specification author that typical use would be via a library that encapsulates the underlying device-specific detail and provides a cleaner interface for developers. The most forward-looking of specialist HID device vendors (not only those of gadgets aimed at "makers") already provide libraries/SDKs for other platforms, so I expect they will do the same for WebHID. Where they don't, the open source community may in time fill the gap for popular devices.

Applications that need to work with a wide range of devices (some possibly unknown) may be better served by a generic library for a particular type of device. For example, a web telephony application would integrate with a "WebHID telephony" library for standards-compliant devices (e.g. headsets), rather than with many vendor/device-specific libraries. Such a library could be created by application developers, or again by the open source community (possibly contributed to by device vendors).

These abstraction libraries would make things easier, but it's perfectly possible for applications to directly use the WebHID API to integrate with the devices they need.


## Corrections
The API isn't yet available, the only documentation/examples I found was the specification draft, and I don't have a real device available. There may therefore be inaccuracies, and the code is unlikely to work as-is. If you spot anything significantly wrong or misleading, you could let me know (e.g. via Twitter, link in the sidebar) so I can fix it for the benefit of future readers.

Regardless, I hope this still serves as an useful early-bird introduction to this upcoming API.


## References
I've created a new (not-yet)-awesome list, [awesome-webhid](https://github.com/robatwilliams/awesome-webhid), containing various links around general HID and WebHID that I found useful. There's also a list of devices I think would be interesting to try.
