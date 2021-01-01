const Collection = function() {};
Collection.prototype.remove = function(obj) {};
Collection.prototype.size = function() {};
Collection.prototype.isEmpty = function(){};

module.exports = Collection;

/**
 * Supplements an existing JavaScript array with Demandware collection methods.
 * This is useful when you have a unit test where the method you're testing
 * expects a Demandware collection.
 */
module.exports.createFromArray = function(arr) {
	arr.size = function() {
		return arr.length;
	};

	arr.remove = function(obj) {
		arr.splice(arr.indexOf(obj), 1);
	};

	return arr;
};
