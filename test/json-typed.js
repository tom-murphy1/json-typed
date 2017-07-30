'strict'
var should = require('should');
var JsonTyped = require('../src/json-typed');

describe('JsonTyped', function (){
  describe('stringifyTyped()', function (){
    it('should serialise object constructor names', function (){
      class MyTypeA{}
      var stringifyed = JsonTyped.stringifyTyped(new MyTypeA);
      should(stringifyed).eql('{"__name":"MyTypeA","__value":{}}');
    });
    it('should serialise object values', function (){
      class MyTypeA{}
      var a = new MyTypeA;
      a.name = 'Kevin';
      var stringifyed = JsonTyped.stringifyTyped(a);
      should(stringifyed).eql('{"__name":"MyTypeA","__value":{"name":"Kevin"}}');
    });
    it('should serialise nested object constructor names', function (){
      class MyTypeA{}
      class MyTypeB{}
      
      var a = new MyTypeA;
      a.b = new MyTypeB;
      
      var stringifyed = JsonTyped.stringifyTyped(a);
      should(stringifyed).eql('{"__name":"MyTypeA","__value":{"b":{"__name":"MyTypeB","__value":{}}}}');
    });
    it('should serialise nested object values', function (){
      class MyTypeA{}
      class MyTypeB{}
      
      var a = new MyTypeA;
      a.b = new MyTypeB;
      a.b.name = 'Kevin';
      
      var stringifyed = JsonTyped.stringifyTyped(a);
      should(stringifyed).eql('{"__name":"MyTypeA","__value":{"b":{"__name":"MyTypeB","__value":{"name":"Kevin"}}}}');
    });
  });
  describe('parseTyped()', function (){
    it('should restore object constructors', function (){
      class MyTypeA{}
      var stringifyed = JsonTyped.stringifyTyped(new MyTypeA);
      var parsed = JsonTyped.parseTyped(stringifyed, [MyTypeA]);
      should(MyTypeA).eql(parsed.constructor);
    });
    it('should restore object with values', function (){
      class MyTypeA{}
      var a = new MyTypeA; 
      a.name = 'Kevin';

      var stringifyed = JsonTyped.stringifyTyped(a);
      var parsed = JsonTyped.parseTyped(stringifyed, [MyTypeA]);

      should('Kevin').eql(parsed.name);
    });
    it('should restore nested object constructors', function (){
      class MyTypeA{}
      class MyTypeB{}
      
      var a = new MyTypeA;
      a.b = new MyTypeB;
      
      var stringifyed = JsonTyped.stringifyTyped(a);
      var parsed = JsonTyped.parseTyped(stringifyed, [MyTypeA, MyTypeB]);
      should(parsed.constructor).eql(MyTypeA);
      should(parsed.b.constructor).eql(MyTypeB);
    });
    it('should restore nested with values', function (){
      class MyTypeA{}
      class MyTypeB{}
      
      var a = new MyTypeA;
      a.b = new MyTypeB;
      a.b.name = 'Kevin';
      
      var stringifyed = JsonTyped.stringifyTyped(a);
      var parsed = JsonTyped.parseTyped(stringifyed, [MyTypeA, MyTypeB]);
      should(parsed.b.name).eql('Kevin');
    });
  });
});
