![Logo](https://sfccdevops.s3.amazonaws.com/logo-128.png "Logo")

SFCC Dev Tools Cartridge
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

![Screenshot](https://sfccdevops.s3.amazonaws.com/sfcc-devtools-drawer.gif "Screenshot")

## Features

- [X] Server Side Debugging in ISML, JS & DS Files
- [X] Client Side Rendering of Debug Output in Dev Tools Console
- [X] Interactive Drawer with Console for Debugging and Testing Live Code
- [X] Safety Measures to prevent running in Production Environments
- [X] No Site Preferences or Misc Imports Required

Installation
---

1. [Install Cartridge](../../README.md#installation)
2. Add `sfcc_dev_tools` to Business Manager Storefront `Cartridges` Path
3. Add the [Dev Tools Drawer](#dev-tools-drawer) and/or [Dev Tools Console](#dev-tools-console) to your Storefront

#### SFRA

> You do not need to do any extra setup for SFRA.  Our cartridge takes advantage of the `app.template.afterFooter` template hook baked into SFRA.

#### Site Genesis

> To render the Dev Tools on Site Genesis, stick this code snippet in an ISML template near the footer of your website as close to the closing `</body>` tag as possible.

```html
<isif condition="${dw.system.HookMgr.hasHook('sfcc.util.devtools')}">
    <isscript>
        dw.system.HookMgr.callHook('sfcc.util.devtools', 'render');
    </isscript>
</isif>
```

Usage
---

> **PRO TIP:** Make sure to use the `hasHook` conditional logic shown in the examples if there is a chance your debug code could end up on another instance that might not have the `sfcc_dev_tools` cartridge installed.

#### Debug in ISML Files

> If you are in an ISML file, you can use something like this.

```html
<isif condition="${dw.system.HookMgr.hasHook('sfcc.util.devtools')}">
    <isscript>
    dw.system.HookMgr.callHook('sfcc.util.devtools', 'log', {
        someObject: someValue,
        anotherObject: anotherValue
    });
    </isscript>
</isif>
```

#### Debug in JS or DS Files

```javascript
if (dw.system.HookMgr.hasHook('sfcc.util.devtools')) {
    dw.system.HookMgr.callHook('sfcc.util.devtools', 'log', {
        someObject: someValue,
        anotherObject: anotherValue
    });
}
```

#### Debug Options

> We support the following Log Types: `debug`, `error`, `info`, `log` & `warn`

```javascript
dw.system.HookMgr.callHook('sfcc.util.devtools', 'debug', someObject);
dw.system.HookMgr.callHook('sfcc.util.devtools', 'error', someObject);
dw.system.HookMgr.callHook('sfcc.util.devtools', 'info', someObject);
dw.system.HookMgr.callHook('sfcc.util.devtools', 'log', someObject);
dw.system.HookMgr.callHook('sfcc.util.devtools', 'warn', someObject);
```
