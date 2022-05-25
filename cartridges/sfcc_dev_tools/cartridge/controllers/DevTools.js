'use strict';

/**
 * Controller to handle AJAX Calls from Dev Tools Drawer
 *
 * @module controllers/DevTools
 */

var serialize = require('../scripts/util/serialize');

function AfterFooter() {
    const System = require('dw/system/System');
    const Response = require('dw/system/Response');

    if (request.httpMethod !== 'GET' || System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        return;
    }

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');

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

    // Get Dev Tools Cache
    var cache = dw.system.CacheMgr.getCache('DevToolsCache');

    ISML.renderTemplate('sfcc/devtools', {
        Debugger: {
            basket: serialize(basket),
            geolocation: serialize(location),
            messages: {
                debug: cache.get('debug'),
                error: cache.get('error'),
                fatal: cache.get('fatal'),
                info: cache.get('info'),
                log: cache.get('log'),
                warn: cache.get('warn')
            },
            preferences: serialize(preferences),
            session: serialize(session),
            site: serialize(currentSite)
        }
    });
}

/**
 * Fetch Server Data for Dev Drawer
 */
function GetData() {
    if (request.httpMethod !== 'GET') {
        return sendJSON({
            error: true,
            message: 'Method Not Allowed'
        }, 405);
    }

    const System = require('dw/system/System');
    const Response = require('dw/system/Response');

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');

    const location = request.getGeolocation();

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        sendJSON({
            error: true,
            message: 'Not available on production instance!'
        }, 403);

        return;
    }

    // Get Basket Info
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();

    // Get Preferences
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();
    var preferences = Site.getCurrent().getPreferences();

    // Get Dev Tools Cache
    var cache = dw.system.CacheMgr.getCache('DevToolsCache');

    // Send Content then Clear Logs
    sendJSON({
        basket: serialize(basket),
        geolocation: serialize(location),
        messages: {
            debug: cache.get('debug'),
            error: cache.get('error'),
            fatal: cache.get('fatal'),
            info: cache.get('info'),
            log: cache.get('log'),
            warn: cache.get('warn')
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
