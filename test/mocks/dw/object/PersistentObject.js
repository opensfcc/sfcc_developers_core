const PersistentObject = function(){};

PersistentObject.prototype.getLastModified = function(){};
PersistentObject.prototype.getCreationDate = function(){};
PersistentObject.prototype.__id = function(){};
PersistentObject.prototype.getUUID = function(){};
PersistentObject.prototype.lastModified=null;
PersistentObject.prototype.creationDate=null;
PersistentObject.prototype.UUID=null;

module.exports = PersistentObject;
