![Logo](https://red-van-workshop.s3.us-east-1.amazonaws.com/logo.png "Logo")

RVW Developers Core - SFCC Cartridge
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

[![Play Demo Video](https://red-van-workshop.s3.us-east-1.amazonaws.com/dc-video-still.png)](https://vimeo.com/476962367/5c830f9227 "Play Demo Video")

## Features

- [X] Execute Server Side JavaScript on your Sandbox in your favorite browser
- [X] No Site Preferences or Misc Imports Required, just drop in and go
- [X] Safety Measures to prevent running in Production Environments

Installation
---

[![Download Cartridge](https://img.shields.io/badge/Download_Cartridge-blue.svg?logo=github&style=for-the-badge)](https://github.com/redvanworkshop/rvw_developers_core/releases/latest)

1. Download Latest Release
2. Unzip and Rename the folder to `rvw_developers_core`
3. Move `rvw_developers_core` into the root of your SFCC Project
4. Add `rvw_developers_core` to project or global `.gitignore`
5. Add `rvw_dev_console` to Business Manager Storefront `Cartridges` Path

Once installed, you can access the Dev Console on your sandbox at `/on/demandware.store/YOUR_SITE_ID/default/Console-Show` ( change `YOUR_SITE_ID` to your Site ID, e.g. `Sites-Site` ).

> If you are not using SFRA, or not using Site Genesis with Controllers Support you will additionally need to install the SFRA `modules` in the root of your project.  You may need to [request permission](https://quip.com/av0SAqpXEAaW) from Salesforce to access to the `SalesforceCommerceCloud` GitHub Organization.

[![Download Modules](https://img.shields.io/badge/SFRA_Modules-EEEEEE.svg?logo=Salesforce&style=for-the-badge)](https://github.com/SalesforceCommerceCloud/storefront-reference-architecture/tree/master/cartridges/modules)

**NOTE:** Make sure to add `modules` to project or global `.gitignore` if you needed to add it.

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

Contributing
---

> Interested in making this tool better?  Fork this Repository and we'll gladly accept Pull Requests.

#### Developer Setup:

```bash
git clone https://github.com/redvanworkshop/rvw_developers_core.git
cd rvw_developers_core
npm install
npm run dev # one time build for development
npm run watch # watch for changes and build for development
npm run build # one time build for production
```

Once you have something you would like to share, check out our Contribution Guide.

[![Contribution Guide](https://img.shields.io/badge/Contribution_Guide-EEEEEE.svg?logo=github&logoColor=black&style=for-the-badge)](https://github.com/redvanworkshop/rvw_developers_core/blob/develop/.github/CONTRIBUTING.md)

Disclaimer
---

> The trademarks and product names of Salesforce®, including the mark Salesforce®, are the property of Salesforce.com. Red Van Workshop is not affiliated with Salesforce.com, nor does Salesforce.com sponsor or endorse the Red Van Workshop products or website. The use of the Salesforce® trademark on this project does not indicate an endorsement, recommendation, or business relationship between Salesforce.com and Red Van Workshop.
