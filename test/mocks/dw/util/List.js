const _super = require('./Collection');

const List = function (items) {
    this.items = items || [];
};
List.prototype = new _super;
List.prototype.addAt = function () { };
List.prototype.concat = function () { };
List.prototype.fill = function () { };
List.prototype.get = function () { };
List.prototype.indexOf = function () { };
List.prototype.join = function () { };
List.prototype.lastIndexOf = function () { };
List.prototype.pop = function () { };
List.prototype.push = function () { };
List.prototype.removeAt = function () { };
List.prototype.replaceAll = function () { };
List.prototype.reverse = function () { };
List.prototype.rotate = function () { };
List.prototype.set = function () { };
List.prototype.shift = function () { };
List.prototype.shuffle = function () { };
List.prototype.size = function () { };
List.prototype.slice = function () { };
List.prototype.sort = function () { };
List.prototype.subList = function () { };
List.prototype.swap = function () { };
List.prototype.unshift = function () { };
List.prototype.toArray = function() {
    return this.items;
}
List.prototype.iterator = function() {
    return this;
}
List.prototype.hasNext = function() {
    return this.items.length > 0;
}
List.prototype.next = function() {
    return this.items.shift();
}

module.exports = List;
exports.EMPTY_LIST = function () { };
