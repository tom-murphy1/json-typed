'strict'
var JsonTyped = require('./src/json-typed.js');

class MyTypeA{}
class MyTypeB{}
class MyTypeC{}

var value = new MyTypeA;
value.b = new MyTypeB;
value.b.value = 'foo';
value.b.date = new Date;
value.b.c = new MyTypeC;
value.b.c.value = 'bar';

var stringifyed = JsonTyped.stringifyTyped(value);
var parsed = JsonTyped.parseTyped(stringifyed, [MyTypeA, MyTypeB, Date, {
  type: MyTypeC,
  reviver: () => {return new MyTypeC}
}])

console.log(stringifyed);
console.log(parsed);

module.exports = JsonTyped;
