![Logo](https://red-van-workshop.s3.us-east-1.amazonaws.com/logo.png "Logo")

SFCC Dev Console Cartridge
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

![Screenshot](https://red-van-workshop.s3.us-east-1.amazonaws.com/rvw-devtools-demo.gif "Screenshot")

## Features

- [X] Execute Server Side JavaScript on your Sandbox in your favorite browser
- [X] No Site Preferences or Misc Imports Required, just drop in and go
- [X] Safety Measures to prevent running in Production Environments

Installation
---

[![Download Cartridge](https://img.shields.io/badge/Download_Cartridge-blue.svg?logo=github&style=for-the-badge)](https://github.com/redvanworkshop/rvw_dev_console/releases/latest)

1. Download Latest Release
2. Unzip and Rename the folder to `rvw_dev_tools`
3. Move `rvw_dev_tools` into the root of your SFCC Project
4. Add `rvw_dev_tools` to project or global `.gitignore`
5. Add `rvw_dev_tools` to Business Manager Storefront `Cartridges` Path

> If you are not using SFRA, or not using Site Genesis with Controllers Support you will additionally need to install the SFRA `modules` in the root of your project.  You may need to [request permission](https://quip.com/av0SAqpXEAaW) from Salesforce to access to the `SalesforceCommerceCloud` GitHub Organization.

[![Download Modules](https://img.shields.io/badge/SFRA_Modules-EEEEEE.svg?logo=Salesforce&style=for-the-badge)](https://github.com/SalesforceCommerceCloud/storefront-reference-architecture/tree/master/cartridges/modules)

**NOTE:** Make sure to add `modules` to project or global `.gitignore` if you needed to add it

Stub Files
---

> Have some code you run pretty regularly during development? You can create custom stub files that you can access any time.

1. Create new file in `./rvw_dev_console/cartridge/scripts/stubs/` with a `.stub` extension
2. Paste the code you want in that file
3. Edit the `list.txt` to include the new file you just created
4. Run `npm run build` in `./rvw_dev_console`
5. Reload the Dev Console and click the Gear Icon in the Top Left Corner

Contributing
---

> Interested in making this tool better?  Fork this Repository and we'll gladly accept Pull Requests.

#### Developer Setup:

```bash
git clone https://github.com/redvanworkshop/rvw_dev_console.git
cd rvw_dev_console
npm install
npm run dev # one time build for development
npm run watch # watch for changes and build for development
npm run build # one time build for production
```

Once you have something you would like to share, check out our Contribution Guide.

[![Download Modules](https://img.shields.io/badge/Contribution_Guide-EEEEEE.svg?logo=github&logoColor=black&style=for-the-badge)](https://github.com/SalesforceCommerceCloud/storefront-reference-architecture/tree/master/cartridges/modules)

Disclaimer
---

> The trademarks and product names of Salesforce®, including the mark Salesforce®, are the property of Salesforce.com. Red Van Workshop is not affiliated with Salesforce.com, nor does Salesforce.com sponsor or endorse the Red Van Workshop products or website. The use of the Salesforce® trademark on this project does not indicate an endorsement, recommendation, or business relationship between Salesforce.com and Red Van Workshop.
