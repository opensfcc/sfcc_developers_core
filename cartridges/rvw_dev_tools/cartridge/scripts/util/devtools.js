'use strict';

var serialize = require('./serialize');

var requestID = !empty(request.requestID) ? request.requestID.toString() : null;
var isAJAX = (request.httpParameterMap.format.stringValue === 'ajax');
var defaultMessages = {
    debug: [],
    error: [],
    fatal: [],
    info: [],
    log: [],
    warn: []
};

// Placeholder to store Server Side Debugger Messages
session.custom.RVW_Debugger = session.custom.RVW_Debugger || defaultMessages;

// If this is not AJAX, and this is a brand new request ID, reset debugger
if (!isAJAX && !empty(requestID) && !empty(session.custom.RVW_Debugger.requestID) && session.custom.RVW_Debugger.requestID !== requestID) {
    session.custom.RVW_Debugger = defaultMessages;
}

// Track Current Debug Request Session ID
session.custom.RVW_Debugger.requestID = requestID;

/**
 * Generate Stack Trace for Better Debugging
 * @returns {Object} trace
 */
var stackTrace = function() {
    var trace = {
        fileName: null,
        lineNumber: null,
        requestID: requestID,
        requestType: (isAJAX) ? 'ajax' : 'http',
        requestURL: request.httpURL.toString(),
        stack: null,
        timestamp: new Date().getTime()
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
        session.custom.RVW_Debugger[method].push(trace);
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
        session.custom.RVW_Debugger.fatal.push(trace);
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
        session.custom.RVW_Debugger.fatal.push(trace);
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
        session.custom.RVW_Debugger.fatal.push(trace);
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
        session.custom.RVW_Debugger.fatal.push(trace);
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
        session.custom.RVW_Debugger.fatal.push(trace);
    }
}

/**
 * Renders Console Output to Browser
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'console');
 */
function console() {
    var ISML = require('dw/template/ISML');
    ISML.renderTemplate('rvw/devtools/console', {
        Debugger: session.custom.RVW_Debugger
    });
}

/**
 * Renders Debug Drawer in Browser
 * @example: dw.system.HookMgr.callHook('rvw.util.devtools', 'drawer');
 */
function drawer() {
    var ISML = require('dw/template/ISML');

    // Get Basket Info
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();

    // Get Preferences
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();
    var preferences = Site.getCurrent().getPreferences();

    ISML.renderTemplate('rvw/devtools/drawer', {
        Debugger: session.custom.RVW_Debugger,
        basket: serialize(basket),
        preferences: serialize(preferences),
        session: serialize(session),
        site: serialize(currentSite)
    });
}

// Export Functions
exports.debug = debug;
exports.error = error;
exports.info = info;
exports.log = log;
exports.warn = warn;

// Export Templates
exports.console = console;
exports.drawer = drawer;
