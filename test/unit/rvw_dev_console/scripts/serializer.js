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

global.XML = function(value) {
    this.value = value;
};

global.XML.prototype.toXMLString = function() {
    return this.value;
}

describe('Serializer', () => {
    const Serializer = require('rvw_dev_console/cartridge/scripts/serializer');

    it('Should serialize a simple object.', () => {
        const simpleObject = {
            key: 'value'
        };

        const result = Serializer.serialize(simpleObject);

        expect(result).to.deep.equal(simpleObject);
    });

    it('Should serialize a complex object until the max depth.', () => {
        const complexObject = {
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

        const result = Serializer.serialize(complexObject, 3);

        expect(result).to.not.deep.equal(complexObject);
        expect(result.level_1.level_2.level_3.level_4).to
            .equal(complexObject.level_1.level_2.level_3.level_4.toString());
    });

    it('Should serialize a cyclic loop correctly.', () => {
        const cyclicalUUID = '1';

        const databaseObject = {
            UUID: cyclicalUUID,
            subObject: {
                UUID: '2',
                cyclicalObject: {
                    UUID: cyclicalUUID
                }
            }
        };

        const result = Serializer.serialize(databaseObject);

        expect(result).not.to.deep.equal(databaseObject);
        expect(result.subObject.cyclicalObject).to.equal('{already returned}');
    });

    it('Should serialize a Collection.', () => {
        const items = [1, 2, 3];
        const dwList = new dw.util.List([...items]);

        const result = Serializer.serialize(dwList);

        expect(result).to.deep.equal(items);
    });

    it('Should serialize a Map.', () => {
        const dwMap = new dw.util.Map();
        dwMap.put('1', 'test 1');
        dwMap.put('2', 'test 2');
        dwMap.put('3', 'test 3');

        const result = Serializer.serialize(dwMap);

        expect(result).to.deep.equal({
            1: 'test 1',
            2: 'test 2',
            3: 'test 3'
        });
    });

    it('Should serialize a Date.', () => {
        const date = new Date();

        const result = Serializer.serialize(date);

        expect(result).to.equal(date.toString());
    });

    it('Should serialize a Decimal.', () => {
        const decimal = new dw.util.Decimal(1.2);

        const result = Serializer.serialize(decimal);

        expect(result).to.equal(decimal.toString());
    });

    it('Should serialize an array.', () => {
        const array = [1, 2, 3];

        const result = Serializer.serialize(array);

        expect(result).to.deep.equal(array);
    });

    it('Should serialize XML.', () => {
        const xml = new XML('test');

        const result = Serializer.serialize(xml);

        expect(result).to.deep.equal('test');
    });
});
