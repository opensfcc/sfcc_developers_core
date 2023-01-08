'use strict';

/**
 * Controller to handle AJAX Calls from Dev Tools Drawer
 *
 * @module controllers/DevTools
 */

var serialize = require('../scripts/util/serialize');

/**
 * Insert Dev Tools Drawer on Site
 */
function AfterFooter() {
    const System = require('dw/system/System');
    const Response = require('dw/system/Response');

    if (request.httpMethod !== 'GET' || System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        return;
    }

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');

    var ISML = require('dw/template/ISML');
    ISML.renderTemplate('sfcc/devtools');
}

/**
 * Fetch Server Data for Dev Drawer
 */
function GetData() {
    const System = require('dw/system/System');
    const Response = require('dw/system/Response');

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        sendJSON({
            error: true,
            message: 'Not available on production instance!'
        }, 403);

        return;
    }

    if (request.httpMethod !== 'GET') {
        return sendJSON({
            error: true,
            message: 'Method Not Allowed'
        }, 405);
    }

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');

    const location = request.getGeolocation();

    // Get Basket Info
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();

    // Get Preferences
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();
    var preferences = Site.getCurrent().getPreferences();

    // Get Dev Tools Cache
    var devToolsCache = dw.system.CacheMgr.getCache('DevToolsCache');
    var benchmarkCache = dw.system.CacheMgr.getCache('DevToolsBenchmarkCache');

    // Send Content then Clear Logs
    sendJSON({
        basket: serialize(basket),
        geolocation: serialize(location),
        benchmarks: benchmarkCache ? serialize(benchmarkCache.get('benchmarks')) : null,
        messages: {
            debug: devToolsCache ? devToolsCache.get('debug') : null,
            error: devToolsCache ? devToolsCache.get('error') : null,
            fatal: devToolsCache ? devToolsCache.get('fatal') : null,
            info: devToolsCache ? devToolsCache.get('info') : null,
            log: devToolsCache ? devToolsCache.get('log') : null,
            warn: devToolsCache ? devToolsCache.get('warn') : null
        },
        preferences: serialize(preferences),
        session: serialize(session),
        site: serialize(currentSite)
    })
}

/**
 * Helper to send a json response
 *
 * @param content
 * @param status
 */
function sendJSON(content, status) {
    response.setStatus(status || 200);
    response.setContentType('application/json');
    response.getWriter().print(JSON.stringify(content));
}

module.exports.AfterFooter = AfterFooter;
module.exports.AfterFooter.public = true;

module.exports.GetData = GetData;
module.exports.GetData.public = true;
