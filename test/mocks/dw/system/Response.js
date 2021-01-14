var Response = function() {
  this.headers = Object();
};

Response.prototype.setHttpHeader = function(header, value) {
    this.headers[header] = value;
};
Response.prototype.containsHttpHeader = function(header) {
    return this.headers[header] !== null && this.headers[header] !== undefined;
};
Response.prototype.getHttpHeader = function(header) { // TESTING FUNCTION
    return this.headers[header];
}
Response.prototype.addHttpCookie = function() {};
Response.prototype.redirect = function() {};
Response.prototype.getWriter = function() {
    return Response.prototype.writer;
};
Response.prototype.setContentType = function(contentType) {
    Response.prototype.CONTENT_TYPE = contentType;
};
Response.prototype.CONTENT_TYPE = '';
Response.CONTENT_SECURITY_POLICY = 'CONTENT_SECURITY_POLICY';
Response.X_CONTENT_TYPE_OPTIONS = 'X_CONTENT_TYPE_OPTIONS';
Response.X_XSS_PROTECTION = 'X_XSS_PROTECTION';
Response.REFERRER_POLICY = 'REFERRER_POLICY';
Response.X_FRAME_OPTIONS = 'X_FRAME_OPTIONS';

module.exports = Response;
