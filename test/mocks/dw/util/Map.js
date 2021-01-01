const Map = function () {
    this.object = {}
};

Map.prototype.put = function(key, value) {
    this.object[key] = value;
};

Map.prototype.get = function(key) {
    return this.object[key];
};

Map.prototype.keySet = function() {
    return {
        toArray: () => Object.keys(this.object)
    };
};

module.exports = Map;
