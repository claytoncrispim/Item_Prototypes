/**
 * Item 1.0
 * 
 *
 * 
 * 31/04/2024 
 * 
 * Source: Inheritance and the prototype chain  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
 * 
 */


/** Inheriting properties
 * 
*/

const o = {
    a: 1,
    b: 2,
  // __proto__ sets the [[Prototype]]. It's specified here
  // as another object literal.
  __proto__:{
    b: 3,
    c: 4,
  },    
};

console.log(o);

// o.[[Prototype]] has properties b and c.
// o.[[Prototype]].[[Prototype]] is Object.prototype (we will explain
// what that means later).
// Finally, o.[[Prototype]].[[Prototype]].[[Prototype]] is null.
// This is the end of the prototype chain, as null,
// by definition, has no [[Prototype]].
// Thus, the full prototype chain looks like:
// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> Object.prototype ---> null

console.log(o.a); // 1
// Is there an 'a' own property on o? Yes, and its value is 1.

console.log(o.b); // 2
// Is there a 'b' own property on o? Yes, and its value is 2.
// The prototype also has a 'b' property, but it's not visited.
// This is called Property Shadowing

console.log(o.c); // 4
// Is there a 'c' own property on o? No, check its prototype.
// Is there a 'c' own property on o.[[Prototype]]? Yes, its value is 4.

console.log(o.d); // undefined
// Is there a 'd' own property on o? No, check its prototype.
// Is there a 'd' own property on o.[[Prototype]]? No, check its prototype.
// o.[[Prototype]].[[Prototype]] is Object.prototype and
// there is no 'd' property by default, check its prototype.
// o.[[Prototype]].[[Prototype]].[[Prototype]] is null, stop searching,
// no property found, return undefined.



const ob = {
    a: 1,
    b: 2,
    // __proto__ sets the [[Prototype]]. It's specified here
    // as another object literal.
    __proto__: {
      b: 3,
      c: 4,
      __proto__: {
        d: 5,
      },
    },
  };
  
// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> { d: 5 } ---> Object.prototype ---> null
  
console.log(ob.d); // 5


/**
 * Inheriting "methods"
 * 
 * JavaScript does not have "methods" in the form that class-based languages define them. 
 * In JavaScript, any function can be added to an object in the form of a property. 
 * An inherited function acts just as any other property, including property shadowing 
 * as shown above (in this case, a form of method overriding).
 * 
 * When an inherited function is executed, the value of 'this' points to the inheriting object, 
 * not to the prototype object where the function is an own property.
 */

const parent = {
  value: 2,
  method() {
    return this.value + 1;
  },
};

console.log(parent.method()); // 3
// When calling parent.method in this case, 'this' refers to parent

// child is an object that inherits from parent
const child = {
  __proto__: parent,
};
console.log(child.method()); // 3
// When child.method is called, 'this' refers to child.
// So when child inherits the method of parent,
// The property 'value' is sought on child. However, since child
// doesn't have an own property called 'value', the property is
// found on the [[Prototype]], which is parent.value.

child.value = 4; // assign the value 4 to the property 'value' on child.
// This shadows the 'value' property on parent.
// The child object now looks like:
// { value: 4, __proto__: { value: 2, method: [Function] } }
console.log(child.method()); // 5
// Since child now has the 'value' property, 'this.value' means
// child.value instead


/**
 * Constructors
 * 
 */

const boxPrototype = {
  getValue() {
    return this.value;
  },
};

const boxes = [
  { value: 1, __proto__: boxPrototype },
  { value: 2, __proto__: boxPrototype },
  { value: 3, __proto__: boxPrototype },
];
console.log(typeof(boxes), boxes);

//This way, all boxes' getValue method will refer to the same function, lowering memory usage.
//However, manually binding the __proto__ for every object creation is still very inconvenient. 
//This is when we would use a constructor function, which automatically sets the [[Prototype]] 
// for every object manufactured. Constructors are functions called with 'new'.

// A constructor function
class BoxOne {
  constructor(value) {
    this.value = value;
  }
  // Properties all boxes created from the Box() constructor
  // will have
  getValue() {
    return this.value;
  }
}


const boxesO = [new BoxOne(1), new BoxOne(2), new BoxOne(3)];
console.log("boxesO:", boxesO);

//The above constructor function can be rewritten in classes as:
class BoxTwo {
  constructor(value) {
    this.value = value;
  }

  // Methods are created on Box.prototype
  getValue() {
    return this.value;
  }
}

/**
 * Classes are syntax sugar over constructor functions, which means you can 
 * still manipulate Box.prototype to change the behavior of all instances. 
 * However, because classes are designed to be an abstraction over the 
 * underlying prototype mechanism, we will use the more-lightweight 
 * constructor function syntax for this tutorial to fully demonstrate 
 * how prototypes work.
 * 
 * Because Box.prototype references the same object 
 * as the [[Prototype]] of all instances, we can change the behavior of all 
 * instances by mutating Box.prototype.
 */

function Box(value) {
  this.value = value;
}

Box.prototype.getValue = function () {
  return this.value;
};
const box = new Box(1);

// Mutate Box.prototype after an instance has already been created
Box.prototype.getValue = function () {
  return this.value + 1;
};
console.log(box.getValue()); // 2


/**
 * Implicit constructors of literals
 * 
 * Some literal syntaxes in JavaScript create instances that implicitly set the [[Prototype]]. For example:
 * 
 */

// Object literals (without the `__proto__` key) automatically
// have `Object.prototype` as their `[[Prototype]]`
const object = { a: 1 };
console.log(Object.getPrototypeOf(object) === Object.prototype); // true

// Array literals automatically have `Array.prototype` as their `[[Prototype]]`
const array = [1, 2, 3];
console.log(Object.getPrototypeOf(array) === Array.prototype); // true

// RegExp literals automatically have `RegExp.prototype` as their `[[Prototype]]`
const regexp = /abc/;
console.log(Object.getPrototypeOf(regexp) === RegExp.prototype); // true

//We can "de-sugar" them into their constructor form.
const arrayA = new Array(1, 2, 3);
const regexpR = new RegExp("abc");

//It may be interesting to note that due to historical reasons, some built-in constructors' prototype property 
// are instances themselves. For example, Number.prototype is a number 0, Array.prototype is an empty array, 
// and RegExp.prototype is /(?:)/.
console.log(Number.prototype + 1); // 1
console.log(Array.prototype.map((x) => x + 1)); // []
console.log(String.prototype + "a"); // "a"
console.log(RegExp.prototype.source); // "(?:)"
console.log(Function.prototype()); // Function.prototype is a no-op function by itself (It returns 'undefined')

//However, this is not the case for user-defined constructors, nor for modern constructors like Map.
// Map.prototype.get(1); // Uncaught TypeError: get method called on incompatible Map.prototype


/**
 * Building longer inheritance chains
 * 
 * The Constructor.prototype property will become the [[Prototype]] of the constructor's instances, 
 * as-is — including Constructor.prototype's own [[Prototype]]. By default, Constructor.prototype is a plain 
 * object — that is, Object.getPrototypeOf(Constructor.prototype) === Object.prototype. The only exception is Object.prototype itself, 
 * whose [[Prototype]] is null — that is, Object.getPrototypeOf(Object.prototype) === null. 
 * Therefore, a typical constructor will build the following prototype chain: 
 */
function Constructor() {}

const obj = new Constructor();
// obj ---> Constructor.prototype ---> Object.prototype ---> null

//To build longer prototype chains, we can set the [[Prototype]] of Constructor.prototype via the Object.setPrototypeOf() function.
function Base() {}
function Derived() {}
// Set the `[[Prototype]]` of `Derived.prototype`
// to `Base.prototype`
Object.setPrototypeOf(Derived.prototype, Base.prototype);

const objO = new Derived();
// objO ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null

//In class terms, this is equivalent to using the 'extends' syntax.
class BaseB {}
class DerivedD extends BaseB {}

const objOb = new DerivedD();
// objOb ---> DerivedD.prototype ---> BaseB.prototype ---> Object.prototype ---> null



/**
 * Inspecting prototypes: a deeper dive
 */
