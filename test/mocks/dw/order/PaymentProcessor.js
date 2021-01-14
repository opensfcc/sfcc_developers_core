var _super = require('../object/ExtensibleObject');

var PaymentProcessor = function(){};

PaymentProcessor.prototype = new _super();

PaymentProcessor.prototype.getID = function(){};
PaymentProcessor.prototype.getPreferenceValue = function(){};
PaymentProcessor.prototype.ID=null;
PaymentProcessor.prototype.preferenceValue=null;

module.exports = PaymentProcessor;
