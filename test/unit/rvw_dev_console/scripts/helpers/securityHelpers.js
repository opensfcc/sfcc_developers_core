'use strict';

const expect = require('chai').expect;

require('app-module-path').addPath(process.cwd() + '/cartridges');
require('app-module-path').addPath(process.cwd() + '/test/mocks');

describe('Security Helpers', () => {
    const SecurityHelpers = require('rvw_dev_console/cartridge/scripts/helpers/securityHelpers');
    const Response = require('dw/system/Response');

    before(() => {
        global.response = new Response();
        SecurityHelpers.addSecurityHeaders();
    })

    it('Should set security headers.', () => {
        expect(response.containsHttpHeader(Response.CONTENT_SECURITY_POLICY)).to.be.true;
        expect(response.containsHttpHeader(Response.X_CONTENT_TYPE_OPTIONS)).to.be.true;
        expect(response.containsHttpHeader(Response.X_XSS_PROTECTION)).to.be.true;
        expect(response.containsHttpHeader(Response.REFERRER_POLICY)).to.be.true;
        expect(response.containsHttpHeader(Response.X_FRAME_OPTIONS)).to.be.true;
    });

    it('Should have a correct Content Security Policy header.', () => {
        expect(response.getHttpHeader(Response.CONTENT_SECURITY_POLICY)).to.be.equal('frame-ancestors \'self\'');
    });

    it('Should have a correct Content Type Options header.', () => {
        expect(response.getHttpHeader(Response.X_CONTENT_TYPE_OPTIONS)).to.be.equal('nosniff');
    });

    it('Should have a correct XSS Protection header.', () => {
        expect(response.getHttpHeader(Response.X_XSS_PROTECTION)).to.be.equal('1; mode=block');
    });

    it('Should have a correct Referrer Policy header.', () => {
        expect(response.getHttpHeader(Response.REFERRER_POLICY)).to.be.equal('origin');
    });

    it('Should have a correct Frame Options header.', () => {
        expect(response.getHttpHeader(Response.X_FRAME_OPTIONS)).to.be.equal('SAMEORIGIN');
    });
});
