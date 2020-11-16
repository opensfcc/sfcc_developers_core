![Logo](https://red-van-workshop.s3.us-east-1.amazonaws.com/logo.png "Logo")

Dev Console
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

[![Play Demo Video](https://red-van-workshop.s3.us-east-1.amazonaws.com/dc-video-still.png)](https://vimeo.com/476962367/5c830f9227 "Play Demo Video")

## Features

- [X] Execute Server Side JavaScript on your Sandbox in your favorite browser
- [X] No Site Preferences or Misc Imports Required, just drop in and go
- [X] Safety Measures to prevent running in Production Environments

Installation
---

1. [Install `rvw_developers_core` Cartridge](../../README.md)
2. Add `rvw_dev_console` to Business Manager Storefront `Cartridges` Path
3. Once installed, you can access the Dev Console on your sandbox at `/on/demandware.store/YOUR_SITE_ID/default/Console-Show` ( change `YOUR_SITE_ID` to your Site ID, e.g. `Sites-Site` ).

**TROUBLESHOOTING:** Getting an error loading the console? You may need to temporarily switch Code Versions, then switch back to trigger the update in Business Manager.

Sandbox Security
---

> Our `rvw_dev_console` cartridge will allow anyone with access to your sandbox to be able to run code.

If you wish to lock down your sandbox, SFCC already provides a solution to protect it.

1. Head over to `Administration > Sites > Manage Sites`
2. Select your Site Name under `Storefront Sites`
3. Click the `Site Status` tab
4. Set `Select the Site Status` to `Online (Protected)`
5. Enter a `Password` and click `Apply`

Once this is set up, anytime you login to your storefront from a new browser, you will need to enter the username `storefront` and the password you just created. Your login info will be saved as long as you do not clear your browser's cookies. The Chrome plugin [Demandware with Ease](https://chrome.google.com/webstore/detail/demandware-with-ease/ffhabonelknmejmdnekedmijlhebpcio) provides the ability to automatically login with a Storefront Password.
