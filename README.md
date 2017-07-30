# json-typed
Wraps JSON to provide serialization and restoration with original object prototypes

```javascript
// Basic usage
var serialisedString = JsonTyped.stringifyTyped(object);
var restoredObjectTree = JsonTyped.parseTyped(serialisedString, [ConstructorA, ConstructorB]);
```

```javascript
var JsonTyped = require('json-typed');

class Address{}
var myAddress = new Address();
myAddress.city = 'Liverpool';
myAddress.country = 'UK';

var serialisedString = JsonTyped.stringifyTyped(myAddress);
var restoredObject = JsonTyped.parseTyped(serialisedString, [Address]);
```

```javascript
// This example shows the use of custom reviver function
var JsonTyped = require('json-typed');

class Address
{
  constructor(address)
  {
    this.address = address;
  }
}

var myAddress = new Address({
  city: 'Liverpool',
  country: 'UK'
});

var serialisedString = JsonTyped.stringifyTyped(myAddress);
var restoredObject = JsonTyped.parseTyped(serialisedString, [
  {
    type: Address,
    reviver: (data) => new Address(data.address)
  }
]);
```
