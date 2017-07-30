'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonTyped = function () {
  function JsonTyped() {
    _classCallCheck(this, JsonTyped);
  }

  _createClass(JsonTyped, null, [{
    key: 'stringifyTyped',
    value: function stringifyTyped(value) {
      var typedReplacer = function typedReplacer(key, value) {
        if (key !== '__value' && value && value['constructor'] && value.constructor.name && ['Object', 'Array', 'String', 'Number', 'Boolean'].indexOf(value.constructor.name) === -1) {
          return { __name: value.constructor.name, __value: value };
        }
        return value;
      };
      value = typedReplacer(null, value);

      return JSON.stringify(value, typedReplacer);
    }
  }, {
    key: 'parseTyped',
    value: function parseTyped(text, types) {
      var typesByName = {};
      if (Array.isArray(types) && types.length) {
        types.forEach(function (type) {
          if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type['type'] && type['reviver']) {
            typesByName[type['type'].name] = type;
          } else {
            typesByName[type.name] = {
              type: type,
              reviver: function reviver(origValue) {
                var typedValue = new type();
                Object.keys(origValue).forEach(function (valueKey) {
                  typedValue[valueKey] = origValue[valueKey];
                });
                return typedValue;
              }
            };
          };
        });
      }

      var typedReviver = function typedReviver(key, value) {
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
      };

      var result = JSON.parse(text, typedReviver);
      result = typedReviver(null, result);
      return result;
    }
  }]);

  return JsonTyped;
}();

module.exports = JsonTyped;