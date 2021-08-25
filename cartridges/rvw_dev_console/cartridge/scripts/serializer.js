'use strict';

const storedUUIDs = new dw.util.HashSet();

/**
 * Main function that should be able to serialize any type of sfcc object
 *
 * @param original
 * @param maxDepth
 * @param depth
 * @param pojo
 * @returns {string|string|[]|*}
 */
function serialize (original, maxDepth, depth, pojo) {
    // Set Max Depth if not defined
    if (!maxDepth) {
        maxDepth = 3;
    }

    // Set Current depth if not defined
    if (!depth) {
        depth = 0;
    }

    // return if primitive
    if (isPrimitive(original)) {
        return original;
    }

    // Prevent the cyclic loop caused by e.g. a customer has a profile, and a profile has a customer - around and around we go
    if ('UUID' in original) {
        if (storedUUIDs.contains(original.UUID)) {
            return '{already returned}';
        }

        storedUUIDs.add(original.UUID, pojo || {});
    }

    if (depth > maxDepth) {
        if ('toString' in original) {
            return original.toString();
        }

        return '{max depth reached}';
    }

    // convert and return a collection
    if (original instanceof dw.util.Collection) {
        return serializeCollection(original, maxDepth, depth + 1);
    }

    // convert and return a map
    if (original instanceof dw.util.Map) {
        return serializeMap(original, depth + 1, maxDepth);
    }

    // return the toString for date
    if (original instanceof Date || original instanceof dw.util.Decimal) {
        return original.toString();
    }

    if (original instanceof XML) {
        return original.toXMLString();
    }

    if (original instanceof dw.util.List) {
        original = original.toArray();
    }

    if (Array.isArray(original)) {
        return original.map(function (entry) {
            return serialize(entry, maxDepth, depth, pojo || {});
        });
    }

    // what we have left is an object (hopefully)
    // convert and return the object
    return serializeObject(original, maxDepth, depth, pojo || {});
}

/**
 * Serializes a native SFCC object to a POJO
 *
 * @param object
 * @param maxDepth
 * @param depth
 * @param pojo
 * @returns {*}
 */
function serializeObject (object, maxDepth, depth, pojo) {
    for (let prop in object) {
        // have to do this because dw has some invalid properties on objects - very weird
        let k = null;

        try {
            k = object[prop];
        } catch (e) {
            continue;
        }

        if (typeof k === 'function') {
            continue;
        }

        /**
         * For some reason SFCC applies the custom properties on certain object types that
         * it really shouldn't, and when trying to process those custom fields, it blows up.
         * This helps is to get around that by skipping them under certain scenarios.
         */
        if (object instanceof dw.order.PaymentProcessor && prop === 'custom') {
            continue;
        }

        if (object instanceof dw.catalog.ProductActiveData && prop === 'custom') {
            continue;
        }

        pojo[prop] = serialize(k, maxDepth, depth + 1, {});
    }

    return pojo;
}

/**
 * Serializes a native SFCC collection into an array
 * @param collection
 * @param maxDepth
 * @param depth
 * @returns {[]}
 */
function serializeCollection (collection, maxDepth, depth) {
    var iterator = collection.iterator();
    var items = [];

    while (iterator.hasNext()) {
        var item = iterator.next();
        items.push(serialize(item, maxDepth, depth, {}));
    }

    return items;
}

/**
 * Serializes a native SFCC map into a pojo
 * @param {dw.util.Map} map
 * @param depth
 * @param maxDepth
 * @returns {string|*[]|*}
 */
function serializeMap (map, depth, maxDepth) {
    var obj = {};

    map.keySet().toArray().forEach(function (item) {
        obj[item] = map.get(item);
    });

    return serialize(obj, maxDepth, depth, {});
}

function isPrimitive (v) {
    return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null || typeof v === 'undefined';
}

module.exports = {
    serialize: serialize
};
