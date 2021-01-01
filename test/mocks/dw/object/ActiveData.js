const _super = require('./ExtensibleObject');

const ActiveData = function(){};

ActiveData.prototype = new _super();

ActiveData.prototype.getCustom = function(){};
ActiveData.prototype.custom=null;

module.exports = ActiveData;
