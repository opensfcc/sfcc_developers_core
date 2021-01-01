'use strict';

const expect = require('chai').expect;

require('app-module-path').addPath(process.cwd() + '/cartridges');
require('app-module-path').addPath(process.cwd() + '/test/mocks');

global.dw = {
    util: {
        HashSet: require('dw/util/HashSet'),
        Collection: require('dw/util/Collection'),
        Map: require('dw/util/Map'),
        Decimal: require('dw/util/Decimal'),
        List: require('dw/util/List')
    },
    order: {
        PaymentProcessor: require('dw/order/PaymentProcessor')
    },
    catalog: {
        ProductActiveData: require('dw/catalog/ProductActiveData')
    }
}

global.XML = function() {};

describe('Serializer', () => {
    const Serializer = require('rvw_dev_console/cartridge/scripts/serializer');

    it('Should serialize a simple object.', () => {
        var simpleObject = {
            key: 'value'
        };

        var result = Serializer.serialize(simpleObject);

        expect(result).to.deep.equal(simpleObject);
    });

    it('Should serialize a complex object untill the max depth.', () => {
        var complexObject = {
            level_1: {
                level_2: {
                    level_3: {
                        level_4: {
                            value: 'test level 4'
                        },
                        value: 'test level 3'
                    },
                    value: 'test level 2'
                },
                value: 'test level 1'
            }
        };

        var result = Serializer.serialize(complexObject, 3);

        // Set the level that is to deep to a string
        complexObject.level_1.level_2.level_3.level_4 =  complexObject.level_1.level_2.level_3.level_4.toString();

        expect(result).to.deep.equal(complexObject);
    });
});
