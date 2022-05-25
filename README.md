![Logo](https://sfccdevops.s3.amazonaws.com/logo-128.png "Logo")

SFCC Developers Core - SFCC Cartridge
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

## Cartridges

[![Dev Console](https://img.shields.io/badge/Dev_Console-EEEEEE.svg?logo=Salesforce&style=for-the-badge)](./cartridges/sfcc_dev_console/) [![Dev Tools](https://img.shields.io/badge/Dev_Tools-EEEEEE.svg?logo=Salesforce&style=for-the-badge)](./cartridges/sfcc_dev_tools/)

- [X] **[Dev Console](./cartridges/sfcc_dev_console/)** - Execute Server Side JavaScript in your Storefront
- [X] **[Dev Tools](./cartridges/sfcc_dev_tools/)** - Developer Tools for Debugging your Storefront

Installation
---

[![Download](https://img.shields.io/badge/Download-blue.svg?logo=github&style=for-the-badge)](https://github.com/sfccdevops/sfcc_developers_core/releases/latest)

1. Unzip and Rename the folder to `sfcc_developers_core`
2. Move `sfcc_developers_core` into the root of your SFCC Project
3. Add `sfcc_developers_core` to project or global `.gitignore`
4. Add `sfcc_dev_console` & `sfcc_dev_tools` to Business Manager Storefront `Cartridges` Path
5. Review Usage Instructions in each Cartridges README.md

Contributing
---

> Interested in making this tool better?  Fork this Repository and we'll gladly accept Pull Requests.

#### Developer Setup:

```bash
git clone https://github.com/sfccdevops/sfcc_developers_core.git
cd sfcc_developers_core
npm install
npm run dev # one time build for development
npm run watch # watch for changes and build for development
npm run build # one time build for production
```

Once you have something you would like to share, check out our Contribution Guide.

[![Contribution Guide](https://img.shields.io/badge/Contribution_Guide-EEEEEE.svg?logo=github&logoColor=black&style=for-the-badge)](https://github.com/sfccdevops/sfcc_developers_core/blob/develop/.github/CONTRIBUTING.md)

Disclaimer
---

> The trademarks and product names of Salesforce®, including the mark Salesforce®, are the property of Salesforce.com. SFCC DevOps is not affiliated with Salesforce.com, nor does Salesforce.com sponsor or endorse the SFCC DevOps products or website. The use of the Salesforce® trademark on this project does not indicate an endorsement, recommendation, or business relationship between Salesforce.com and SFCC DevOps.
