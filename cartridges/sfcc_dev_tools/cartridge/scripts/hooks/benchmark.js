"use strict";

/**
 * Hook executed for SFRA-only
 * Registers SFRA route
 * @param route
 */
function registerRoute(route) {
    route.on('route:Start', function onRouteStartHandler(req, res) {
        var path = req.path.split('/');
        var controller = path.pop();
        var type = req.includeRequest ? 'remote-include' : 'route';
        var name = (res.viewData) ? res.viewData.action + '|' + res.viewData.queryString : controller;

        if (dw.system.HookMgr.hasHook('sfcc.util.devtools')) {
            dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'start', {
                name: name.replace(/\|$/, ''),
                type: type,
                start: new Date().getTime()
            });
        }
    });

    route.on('route:Redirect', function onRouteRedirectHandler() {
        // Redirect logic here
    });

    route.on('route:Step', function onRouteStepHandler() {
        // Step logic here
    });

    route.on('route:Complete', function onRouteCompleteHandler(req, res) {
        var path = req.path.split('/');
        var controller = path.pop();
        var name = (res.viewData) ? res.viewData.action + '|' + res.viewData.queryString : controller;

        if (dw.system.HookMgr.hasHook('sfcc.util.devtools')) {
            dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'stop', name.replace(/\|$/, ''));
        }
    });

    route.on('route:BeforeComplete', function onRouteBeforeCompleteHandler(req, res) {
        var path = req.path.split('/');
        var controller = path.pop();
        var name = (res.viewData) ? res.viewData.action + '|' + res.viewData.queryString : controller;

        if (dw.system.HookMgr.hasHook('sfcc.util.devtools')) {
            dw.system.HookMgr.callHook('sfcc.util.devtools', 'benchmark', 'stop', name.replace(/\|$/, ''));
        }
    });
}

/* Module Exports */
exports.registerRoute = registerRoute;
