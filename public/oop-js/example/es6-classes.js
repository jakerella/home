
class Dog extends Animal {
    constructor(name, age) {
    
        super(age); /* Call parent method of same name */
    
        if (name) { this.name = name; }
    }

    /* Note the shorthand function definition */
    speak() { return this.name + " says woof"; }
    
    getAge() { return (super() * 7); }


    /* Getters & Setters are actually in ES5! */
    get name() { return this._name; }

    set name(value) { this._name = value; }
}

/* for data members, we still have to do this... */
Dog.prototype._name = "Bubbles";

