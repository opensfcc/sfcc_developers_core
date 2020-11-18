'use strict';

var serialize = require('./serialize');

var requestID = !empty(request.requestID) ? request.requestID.toString() : 'default';

/**
 * Placeholder to store Server Side Debugger Messages
 */
session.custom.RVW_Debugger = session.custom.RVW_Debugger || {
    requests: {}
};

// Store Current Request Data
session.custom.RVW_Debugger.currentRequestID = requestID;
session.custom.RVW_Debugger.currentRequestURL = request.httpURL.toString();
session.custom.RVW_Debugger.currentTimeStamp = new Date().getTime();

// Check if this is a New Request ( all requests on page load will use same `requestID` )
if (!session.custom.RVW_Debugger.requests.hasOwnProperty(requestID)) {
    // Create Debugger for Request
    session.custom.RVW_Debugger.requests[requestID] = {
        requestURL: request.httpURL.toString(),
        timestamp: new Date().getTime(),
        messages: {
            debug: [],
            error: [],
            fatal: [],
            info: [],
            log: [],
            warn: []
        }
    };
}

var filterMessages = function(requestID, type) {
    var messages = [];

    for (var req in session.custom.RVW_Debugger.requests) {
        var cur = session.custom.RVW_Debugger.requests[req];
        // Delete Old Debug Requests
        if (cur.messages[type].length > 0) {
            messages = messages.concat(cur.messages[type]);
        }
    }

    return messages;
}

/**
 * Generate Stack Trace for Better Debugging
 * @returns {Object} trace
 */
var stackTrace = function() {
    var trace = {
        fileName: null,
        lineNumber: null,
        stack: null,
    };

    try {
        throw new Error('');
    }
    catch (error) {
        trace.stack = error.stack || null;
    }

    if (trace.stack) {
        trace.stack = trace.stack.split('\n').map(function (line) { return line.trim(); });
        trace.stack = trace.stack.splice(trace.stack[0] == 'Error' ? 3 : 2);
        trace.stack.pop();

        // Get First File from Stack
        var lastStack = trace.stack[0].split(' ')
        var fileDetails = lastStack[1];
        var lineNumber = fileDetails.split(':').pop()
        var fileName = fileDetails.replace(':' + lineNumber, '')

        trace.fileName = fileName;
        trace.lineNumber = parseInt(lineNumber);
        trace.ide = 'http://localhost:60606/target=/' + fileName;
    }

    return trace;
}

/**
 * Add Messages to Debugger
 * @param {String} method
 * @param {Object} messages
 * @param {Object} trace
 */
var addMessages = function (method, messages, trace) {
    for (i in messages) {
        trace.message = serialize(messages[i]);
        session.custom.RVW_Debugger.requests[requestID].messages[method].push(trace);
    }
};

/**
 * Add Debug Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'debug', myObject);
 */
function debug() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('debug', messages, stackTrace());
    } catch (err) {
        session.custom.RVW_Debugger.requests[requestID].messages.fatal.push(trace);
    }
}

/**
 * Add Error Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'error', myObject);
 */
function error() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('error', messages, stackTrace());
    } catch (err) {
        session.custom.RVW_Debugger.requests[requestID].messages.fatal.push(trace);
    }
}

/**
 * Add Info Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'info', myObject);
 */
function info() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('info', messages, stackTrace());
    } catch (err) {
        session.custom.RVW_Debugger.requests[requestID].messages.fatal.push(trace);
    }
}

/**
 * Add Log Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'log', myObject);
 */
function log() {

    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('log', messages, stackTrace());
    } catch (err) {
        session.custom.RVW_Debugger.requests[requestID].messages.fatal.push(trace);
    }
}

/**
 * Add Warn Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'warn', myObject);
 */
function warn() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('warn', messages, stackTrace());
    } catch (err) {
        session.custom.RVW_Debugger.requests[requestID].messages.fatal.push(trace);
    }
}

/**
 * Renders Console Output to Browser
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'console');
 */
function console() {
    // Clear Old Messages
    prune();

    var ISML = require('dw/template/ISML');
    ISML.renderTemplate('rvw/devtools/console', {
        Debugger: session.custom.RVW_Debugger.requests[requestID].messages
    });
}

/**
 * Renders Debug Drawer in Browser
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'drawer');
 */
function drawer() {
    // Clear Old Messages
    prune();

    var ISML = require('dw/template/ISML');

    // Get Basket Info
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();

    // Get Preferences
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();
    var preferences = Site.getCurrent().getPreferences();

    ISML.renderTemplate('rvw/devtools/drawer', {
        Debugger: getDebugger(),
        basket: serialize(basket),
        preferences: serialize(preferences),
        session: serialize(session),
        site: serialize(currentSite)
    });
}

/**
 * Clear Debugger
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'clear');
 */
function clear() {
    session.custom.RVW_Debugger = null;
}

/**
 * Prune Old Messages
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'prune');
 */
function prune() {
    var now = new Date().getTime();
    var expires = 60000; // 60 seconds

    for (var req in session.custom.RVW_Debugger.requests) {
        var cur = session.custom.RVW_Debugger.requests[req];
        // Delete Old Debug Requests
        if (now - cur.timestamp > expires) {
            delete session.custom.RVW_Debugger.requests[req];
        }

        // Delete Empty Debug Requests
        if (cur.messages.debug.length === 0 && cur.messages.error.length === 0 && cur.messages.fatal.length === 0 && cur.messages.info.length === 0 && cur.messages.log.length === 0 && cur.messages.warn.length === 0) {
            delete session.custom.RVW_Debugger.requests[req];
        }
    }
}

/**
 * Get Debugger
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'getDebugger');
 */
function getDebugger() {
    var req = session.custom.RVW_Debugger.requests;
    var sorted = {};

    // Reorganize Requests for Newest is on top
    Object.keys(req).sort(function(a, b){
        return req[b].timestamp - req[a].timestamp;
    })
    .forEach(function(key) {
        sorted[key] = req[key];
    });

    // Update Requests to use Custom Sort
    session.custom.RVW_Debugger.requests = sorted;

    return session.custom.RVW_Debugger;
}

exports.getDebugger = getDebugger;
exports.console = console;
exports.debug = debug;
exports.drawer = drawer;
exports.error = error;
exports.info = info;
exports.log = log;
exports.warn = warn;
exports.clear = clear;
exports.prune = prune;
