![Logo](https://red-van-workshop.s3.us-east-1.amazonaws.com/logo.png "Logo")

SFCC Dev Console Cartridge
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

[![Demo Video](https://red-van-workshop.s3.us-east-1.amazonaws.com/video-still.png)](https://vimeo.com/474835586/007c173136 "Demo Video")

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

> If you are not using SFRA, or not using Site Genesis with Controllers Support you will additionally need to install the SFRA `modules` in the root of your project.  You may need to [request permission](https://quip.com/av0SAqpXEAaW) from Salesforce to access to the `SalesforceCommerceCloud` GitHub Organization.

[![Download Modules](https://img.shields.io/badge/SFRA_Modules-EEEEEE.svg?logo=Salesforce&style=for-the-badge)](https://github.com/SalesforceCommerceCloud/storefront-reference-architecture/tree/master/cartridges/modules)

**NOTE:** Make sure to add `modules` to project or global `.gitignore` if you needed to add it

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
