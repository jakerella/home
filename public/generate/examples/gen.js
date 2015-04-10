'use strict';

    
// Example of a basic generator yielding two values and returning a third

function* foo() {
    console.log('Inside foo');
    
    yield 'a';
    
    console.log('Back inside foo');
    
    yield { 'b': 2 };
    
    return 'c';
}

var gen = foo();

var one = gen.next();
console.log( one );
// { value: 'a', done: false }

console.log('Outside foo');

var two = gen.next();
console.log( two );
// { value: { b: 2 }, done: false }

var three = gen.next();
console.log( three );
// { value: 'c', done: true }


// Example of using a generator as in Iterable in a for..of loop
for ( var value of foo() ) {
    console.log( value );
    
    // a
    // { b: 2 }
}



// Example of generators calling generators (delegation)

function* alphabet() {
    yield 'a';
    yield 'b';
    
    return 'c';
}

function* numbers() {
    yield 1;
    yield 2;
    
    var letter = yield* alphabet();
    yield letter;
    
    yield 3;
}

var result = [];

for ( var value of numbers() ) {
    result.push( value );
}

console.log( result );
// [ 1, 2, 'a', 'b', 'c', 3 ]



// Example using a generator to allow interruption of a longer mathematical calculation

function* getFibonacciSequence(count) {
    var x = 0, y = 0, next = 1;
    
    for ( var i=0 ; i < count; ++i ) {
        yield next;
        
        x = y;
        y = next;
        
        next = x + y;
    }
}

var fib = [];

for ( var next of getFibonacciSequence( 10 ) ) {
    fib.push( next );
}

console.log( fib );
// [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]



// Example using `yield` as an expression

function* yieldExpression(y) {
    var x = y * ( yield 'multiplier' );
    
    return x * x;
}

var gen = yieldExpression( 5 );

var type = gen.next();

console.log( type );
// { value: 'multiplier', done: false }

if (type.value === 'multiplier') {
    console.log( gen.next( 2 ) );
    // { value: 100, done: true }
}



// Example passing values into a generator

function* tellFortune() {
    var sign = yield 'Tell me your sign.';
    
    switch (sign) {
        case 'aries':
            yield 'You are awesome.';
            break;
        // ...
        case 'leo':
            yield 'You will tell a bad joke.';
            break;
        // ...
        default:
            yield 'No fortune for you.';
    }
}

var seer = tellFortune();
seer.next();

var fortune = seer.next('leo').value;
console.log( 'My fortune:', fortune );

// The other yield(s) in the switch will NOT affect the "done" property...
console.log( seer.next() );

