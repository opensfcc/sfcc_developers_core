const Decimal =  function(value){
    this.value = value;
};

Decimal.prototype.toString = function() {
    return this.value.toString();
}

module.exports = Decimal;
