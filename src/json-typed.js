'use strict'

class JsonTyped 
{
  static stringifyTyped(value) 
  {
    var typedReplacer = (key, value) => {
      if (key !== '__value' && value && value['constructor'] && value.constructor.name && ['Object', 'Array', 'String', 'Number', 'Boolean'].indexOf(value.constructor.name) === -1) {
        return {__name: value.constructor.name, __value: value};
      }
      return value;
    }
    value = typedReplacer(null, value);

    return JSON.stringify(value, typedReplacer);
  }

  static parseTyped(text, types) 
  {
    var typesByName = {};
    if (Array.isArray(types) && types.length) {
      types.forEach(function(type){
        if (typeof type === 'object' && type['type'] && type['reviver']) {
          typesByName[type['type'].name] = type;
        } else {
          typesByName[type.name] = {
            type: type, 
            reviver: (origValue) => {
              var typedValue = new type;
              Object.keys(origValue).forEach((valueKey) => {
                typedValue[valueKey] = origValue[valueKey];
              });
              return typedValue;
            }
          }
        };
      });
    }

    var typedReviver = (key, value) => {
      if (value) {
        var contructorName = value['__name'];
        var origValue = value['__value'];
        if (contructorName) {
          if (typesByName[contructorName]) {
            var type = typesByName[contructorName]['type'];
            var reviver = typesByName[contructorName]['reviver'];
            if (reviver) {
              var typedValue = reviver(origValue);
            } 
            return typedValue;
          } 
          return origValue;
        } else {
          // Revive Date strings
          if (typeof value === 'string') {
            var dateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/i;
            if (dateRegex.test(value)) {
              return new Date(value);
            }
          }
        }
      }
      return value;
    }

    var result = JSON.parse(text, typedReviver);
    result = typedReviver(null, result);
    return result;
  }
}

module.exports = JsonTyped;
