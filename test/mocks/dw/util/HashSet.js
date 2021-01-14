const HashSet = function () {
    this.contents = {};
};

HashSet.prototype.add = function(key, value) {
    this.contents[key] = value;
}

HashSet.prototype.contains = function(key) {
    return key in this.contents;
}

HashSet.prototype.EMPTY_SET = function(){};

module.exports = HashSet;
