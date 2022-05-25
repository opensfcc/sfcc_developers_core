'use strict';

var logger = require('dw/system/Logger').getLogger('DevTools');
var serialize = require('../util/serialize');

/**
 * Placeholder to store Server Side Debugger Messages
 */
var Debugger = {
    debug: [],
    error: [],
    fatal: [],
    info: [],
    log: [],
    warn: []
};

/**
 * Generate Stack Trace for Better Debugging
 * @returns {Object} trace
 */
var stackTrace = function() {
    var trace = {
        fileName: null,
        lineNumber: null,
        requestID: request.requestID,
        requestType: (request.httpParameterMap.format.stringValue === 'ajax') ? 'ajax' : 'http',
        requestURL: request.httpURL.toString(),
        stack: null,
        timestamp: new Date().getTime(),
        uid: 'id' + Math.random().toString(36).substring(9)
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
    for (var i in messages) {
        trace.message = serialize(messages[i]);
        Debugger[method].push(trace);
    }
};

/**
 * Add Debug Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('sfcc.util.devtools', 'debug', myObject);
 */
function debug() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('debug', messages, stackTrace());
        logger.debug(messages);
    } catch (err) {
        Debugger.fatal.push(err);
        logger.fatal(err);
    }
}

/**
 * Add Error Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('sfcc.util.devtools', 'error', myObject);
 */
function error() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('error', messages, stackTrace());
        logger.error(messages);
    } catch (err) {
        Debugger.fatal.push(err);
        logger.fatal(err);
    }
}

/**
 * Add Info Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('sfcc.util.devtools', 'info', myObject);
 */
function info() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('info', messages, stackTrace());
        logger.info(messages);
    } catch (err) {
        Debugger.fatal.push(err);
        logger.fatal(err);
    }
}

/**
 * Add Log Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('sfcc.util.devtools', 'log', myObject);
 */
function log() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('log', messages, stackTrace());
        logger.debug(messages);
    } catch (err) {
        Debugger.fatal.push(err);
        logger.fatal(err);
    }
}

/**
 * Add Warn Messages to Debugger Queue
 * @example: dw.system.HookMgr.callHook('sfcc.util.devtools', 'warn', myObject);
 */
function warn() {
    try {
        var messages = Array.prototype.slice.call(arguments, 0) || [];
        addMessages('warn', messages, stackTrace());
        logger.warn(messages);
    } catch (err) {
        Debugger.fatal.push(err);
        logger.fatal(err);
    }
}

/**
 * Support zero setup using `app.template.afterFooter` hook in SFRA
 */
function afterFooter() {
    // Get Cartridge Cache
    var cache = dw.system.CacheMgr.getCache('DevToolsCache');

    // Write log types to their own cache key ( 128KB max per key )
    cache.put('debug', Debugger.debug);
    cache.put('error', Debugger.error);
    cache.put('fatal', Debugger.fatal);
    cache.put('info', Debugger.info);
    cache.put('log', Debugger.log);
    cache.put('warn', Debugger.warn);

    // Render Remote Include to Prevent ISML Bug
    var velocity = require('dw/template/Velocity');
    velocity.render('$velocity.remoteInclude(\'DevTools-AfterFooter\')', {
        velocity: velocity
    });
}

/**
 * Support Dev Tool Rendering for SFSG Sites
 * @example: dw.system.HookMgr.callHook('sfcc.util.devtools', 'render');
 */
function render() {
    var ISML = require('dw/template/ISML');

    // Get Basket Info
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();

    // Get Preferences
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();
    var preferences = Site.getCurrent().getPreferences();

    // GeoLocation Data
    var location = request.getGeolocation() || {};

    ISML.renderTemplate('sfcc/devtools', {
        Debugger: {
            basket: serialize(basket),
            geolocation: serialize(location),
            messages: Debugger,
            preferences: serialize(preferences),
            session: serialize(session),
            site: serialize(currentSite)
        }
    });
}

// Export Functions
exports.debug = debug;
exports.error = error;
exports.info = info;
exports.log = log;
exports.warn = warn;

// Export Templates
exports.afterFooter = afterFooter;
exports.render = render;
