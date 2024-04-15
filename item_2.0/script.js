function Item(name, value){
    this.name = name;
    this.value = value;
}

Item.prototype.getProps = function () {
    return this.name, this.value;
}
const item = new Item("Bill", 200);
console.log(item);

console.log(`Item is a`, typeof(Item), `and item is an`,typeof(item));

// Mutate Item.prototype after an instance has already been created

Item.prototype.getProps = function () {
    return this.value + 1;
}
console.log(item.getProps());

// * Implicit constructors of literals
const pto = {balance: 28.01};
console.log(Object.getPrototypeOf(pto) === Object.prototype); // true

// Jumped to line 248 on Item 1.0 script file
function Constructor() {}

const obj = new Constructor();

function Items() {};
function Bill() {};

Object.setPrototypeOf(Bill.prototype, Item.prototype);

const bill = new Bill();
console.log(bill); //Empty Object

class ItemsI {};
class Expenses extends ItemsI {};

const expense = new Expenses();
console.log(expense); //Empty Object

