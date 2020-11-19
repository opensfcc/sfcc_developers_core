'use strict';

/**
 * Controller to handle AJAX Calls from Dev Tools Drawer
 *
 * @module controllers/DevTools
 */

var serialize = require('../scripts/util/serialize');

/**
 * Fetch Data for Dev Drawer
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

    const timestamp = request.getHttpParameterMap().get('timestamp').getDoubleValue(0);
    const isConsole = request.getHttpParameterMap().get('console').getBooleanValue(false);

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

    var messages = session.custom.RVW_Debugger;

    if (timestamp !== 0) {
        messages = {
            debug: [],
            error: [],
            fatal: [],
            info: [],
            log: [],
            warn: []
        };

        session.custom.RVW_Debugger.debug.forEach(function(msg){
            if (msg.timestamp >= timestamp) {
                messages.debug.push(msg)
            }
        });

        session.custom.RVW_Debugger.error.forEach(function(msg){
            if (msg.timestamp >= timestamp) {
                messages.error.push(msg)
            }
        });

        session.custom.RVW_Debugger.fatal.forEach(function(msg){
            if (msg.timestamp >= timestamp) {
                messages.fatal.push(msg)
            }
        });

        session.custom.RVW_Debugger.info.forEach(function(msg){
            if (msg.timestamp >= timestamp) {
                messages.info.push(msg)
            }
        });

        session.custom.RVW_Debugger.log.forEach(function(msg){
            if (msg.timestamp >= timestamp) {
                messages.log.push(msg)
            }
        });

        session.custom.RVW_Debugger.warn.forEach(function(msg){
            if (msg.timestamp >= timestamp) {
                messages.warn.push(msg)
            }
        });
    }

    // Send Content then Clear Logs
    if (isConsole) {
        sendJSON({
            messages: messages,
            timestamp: new Date().getTime()
        });
    } else {
        sendJSON({
            basket: serialize(basket),
            messages: messages,
            preferences: serialize(preferences),
            session: serialize(session),
            site: serialize(currentSite),
            timestamp: new Date().getTime()
        })
    }
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

module.exports.GetData = GetData;
module.exports.GetData.public = true;
