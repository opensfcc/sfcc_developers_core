![Logo](https://red-van-workshop.s3.us-east-1.amazonaws.com/logo.png "Logo")

SFCC Dev Tools Cartridge
===

> A Salesforce Commerce Cloud (Demandware) Cartridge for Developers.

![Screenshot](https://via.placeholder.com/720x430.png?text=ANIMATED+GIF "Screenshot")

## Features

- [X] Server Side Debugging in ISML, JS & DS Files
- [X] Client Side Rendering of Debug Output in Dev Tools Console
- [X] Interactive Drawer with Console for Debugging and Testing Live Code
- [X] Safety Measures to prevent running in Production Environments
- [X] No Site Preferences or Misc Imports Required

Installation
---

1. [Install Cartridge](../../README.md#installation)
2. Add `rvw_dev_tools` to Business Manager Storefront `Cartridges` Path
3. Add the [Dev Tools Drawer](#dev-tools-drawer) and/or [Dev Tools Console](#dev-tools-console) to your Storefront

> **NOTE:** We designed this cartridge so you can drop it in without having to do a lot of setup in Business Manager.  No Site Preferences or Imports are required.

> **PRO TIP:** Make sure to use the `hasHook` conditional logic shown in the examples if there is a chance your debug code could end up on another instance that might not have the `rvw_dev_tools` cartridge installed.

#### Dev Tools Drawer

![Screenshot](https://via.placeholder.com/720x430.png?text=SCREENSHOT "Screenshot")

> To render the Dev Tools Drawer, stick this code snippet in an ISML template near the footer of your website.

```html
<isif condition="${dw.system.HookMgr.hasHook('rvw.util.devtools')}">
    <isscript>
        dw.system.HookMgr.callHook('rvw.util.devtools', 'drawer');
    </isscript>
</isif>
```

#### Dev Tools Console

![Screenshot](https://red-van-workshop.s3.us-east-1.amazonaws.com/rvw-devtools-console.png "Screenshot")

> If you just want to see your debug output in your browsers Dev Tools Console and not render a Drawer, stick this code snippet in an ISML template near the footer of your website.

```html
<isif condition="${dw.system.HookMgr.hasHook('rvw.util.devtools')}">
    <isscript>
        dw.system.HookMgr.callHook('rvw.util.devtools', 'console');
    </isscript>
</isif>
```

Usage
---

#### Debug in ISML Files

> If you are in an ISML file, you can use something like this.

```html
<isif condition="${dw.system.HookMgr.hasHook('rvw.util.devtools')}">
    <isscript>
    dw.system.HookMgr.callHook('rvw.util.devtools', 'log', {
        someObject: someValue,
        anotherObject: anotherValue
    });
    </isscript>
</isif>
```

#### Debug in JS or DS Files

```javascript
if (dw.system.HookMgr.hasHook('rvw.util.devtools')) {
    dw.system.HookMgr.callHook('rvw.util.devtools', 'log', {
        someObject: someValue,
        anotherObject: anotherValue
    });
}
```

#### Debug Options

> We support the following Log Types: `debug`, `error`, `info`, `log` & `warn`

```javascript
dw.system.HookMgr.callHook('rvw.util.devtools', 'debug', someObject);
dw.system.HookMgr.callHook('rvw.util.devtools', 'error', someObject);
dw.system.HookMgr.callHook('rvw.util.devtools', 'info', someObject);
dw.system.HookMgr.callHook('rvw.util.devtools', 'log', someObject);
dw.system.HookMgr.callHook('rvw.util.devtools', 'warn', someObject);
```
