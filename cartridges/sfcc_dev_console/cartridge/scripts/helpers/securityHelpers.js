'use strict';

var Response = require('dw/system/Response');

/**
 * Adds security headers to the response
 */
function addSecurityHeaders() {
    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');
    response.setHttpHeader(Response.X_XSS_PROTECTION, '1; mode=block');
    response.setHttpHeader(Response.REFERRER_POLICY, 'origin');
    response.setHttpHeader(Response.X_FRAME_OPTIONS, 'SAMEORIGIN');
}

module.exports = {
    addSecurityHeaders: addSecurityHeaders
}
