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

**NOTE:** The Debugging Console is not built for Native SFCC Messages, but specific to custom debuggers you add in your own code as outlined below.

Installation
---

1. [Install Cartridge](../../README.md#installation)
2. Add `sfcc_dev_tools` to Storefront `Cartridges` Path
3. Add the Dev Tools to your Storefront using either SFRA or Site Genesis instructions below

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

Benchmarks
---

> Benchmarks help calculate the Server-Side timing of custom events. By default, this cartridge adds timing for route and remote includes. You can easily add your own custom benchmarks using the following hooks:

#### Start Custom Benchmark

To start timing a benchmark, place the following code at the very beginning of your custom server-side script ( change `My Benchmark` to whatever you want to call the benchmark ).

```javascript
dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'start', 'My Benchmark');
```

#### Stop Custom Benchmark

The stop timing a benchmark, just use the `stop` parameter and the same benchmark name.

```javascript
dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'stop', 'My Benchmark');
```

#### Advanced Benchmarks

Alternatively, you can pass over an object instead of a String that contains the following properties:

- [X] `name`: Name used to Start & Stop Benchmark _( required )_
- [X] `parent`: If you are nesting benchmarks, provide the Parent Benchmark name _[ default: `null` ]_
- [X] `type`: Optional property to define the type of benchmark, which can be any value _[ default: `'custom'` ]_

```javascript
dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'start', {
    name: 'Nested Benchmark',
    parent: 'My Benchmark',
    type: 'custom-type'
});
```

Then you can stop the benchmark by referencing its `name`:

```javascript
dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'stop', 'Nested Benchmark');
```

**IMPORTANT**: The benchmark `name` should be unique in order to prevent starting & stopping existing benchmarks.

#### Screenshots

Access the Benchmark from the new Toolbar Menu Option.

![toolbar](https://sfcc-devtools.s3.amazonaws.com/benchmark-toolbar.png "toolbar")

Then your benchmarks will be listed in the new Benchmark Panel.

![drawer](https://sfcc-devtools.s3.amazonaws.com/benchmark-drawer.png "drawer")
