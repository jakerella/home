
## Build a Distributed Caching Layer with Express for APIs and Microservices

_This article was first posted on the [Lunch Badger blog](https://www.lunchbadger.com/distributed-caching-layer-express-apis-microservices/). Check them out if you're working with APIs in Node.js!_

Separating your API code into microservices has [far reaching benefits](https://dzone.com/articles/benefits-amp-examples-of-microservices-architectur), but you probably already knew that, that's why you're here! So now that you've decided to shift to microservices you have some problems to solve. One of those is that splitting up your service areas can make it difficult to access much needed data at the correct time. If you're building them in Node.js, you don't have memory sharing to rely on either (and really, you don't want it).

We need some way to efficiently and easily access temporary data across services. This is a caching mechanism: one service creates some data and another service _might_ need it later. That data will need to be accessed very quickly in the other service at some point in the future.

This is where Redis shines!

### What is Redis?

[Redis](https://redis.io/) is an open source data store that focuses on simple data structures with high availability and efficiency. All data is stored in-memory to provide that performance (although you can add persistent storage as well).

Since Node is already highly efficient at basic network I/O, adding in Redis for data caching makes a lot of sense. We'll be using the [Node redis package](https://github.com/NodeRedis/node_redis) from npm (`npm install redis`), but there are other client libraries, including [hiredis](https://github.com/redis/hiredis-node) which only really helps when you get to much larger scales or use more complex structures and queries. Don't forget to either [download and run Redis](https://redis.io/download) on your development machine, or use a SaaS offering. (I'll be using a local install for this blog post, thus using `127.0.0.1:6379` for my host.)

### A Simple Storefront

Let's look at a relatively common microservice implementation and the problem we might encounter with it. We run a simple shopping website for badger-related paraphernalia. The back end for the site is written in Node.js and Express, and we want to split the inventory out from the checkout process. This would allow us to give access to our inventory to any other API consumer, but limit our checkout process to our own site. Again, the benefits of this split are much greater than just this, but perhaps that's our primary motivation.

The issue here is that as a user is shopping on our site they are hitting the `Inventory` service to add items to their shopping cart, but once they are done and want to check out we need to access that cart from the `Checkout` service. We need a way to access that data in two places, but that data is temporary... that is, we don't need to persist it indefinitely. For example, if our site were to crash and people "lost" the items in their cart, that wouldn't be the end of the world. Especially if they haven't even logged in yet!

Our solution will allow access to this cache across services using a Redis store with the cart items keyed off of the user's unique session token (also a temporary piece of data).

#### Step One: Express Middleware

Our first step will be to create a piece of middleware that can sit in between our Authentication (which I am not showing in this blog post) and our business logic routes (which I will only be showing briefly). This is really the work horse of the entire process, it will check for an existing shopping cart of items based on the current user's token and add that data to the request for use in our routes (or any later middleware). Abstracting this code out of our other microservices and into a distributed caching layer is key.

Redis has a [few different data types](https://redis.io/topics/data-types-intro) (not that many), but none of them are "deep". That is to say, you can have a list of things (think `Array` in JS), but not a list of objects... it will just be a list of strings! For this reason, we'll need to "stringify" our cart items before adding them to Redis, and we'll need to "parse" the data when pulling it back out. Since we need to store an array of items, each with multiple properties (item ID and quantity), I've chosen to use [simple Redis strings](https://redis.io/topics/data-types-intro#redis-strings). While sets and lists are okay, they don't provide us better querying in this case.

Our first step would be to install the Node Redis package: `npm install redis`
Now we can connect to our Redis server and then use the Node Redis library in our middleware.

> Note that we are assuming you have a user management system, possibly in a gateway layer. This would need to provide a user's session token in the `Request` object which we can then access from our API endpoint routes. The `req.userToken` property used in the code below would need to come from some other middleware.

```javascript
const router = require('express').Router();

// First we create the connection to the Redis server...
// You will want to change the host and port to match your server!
const redis = require('redis').createClient('127.0.0.1', 6379);

router.use((req, res, next) => {

    if (!req.userToken) {
        // Without a user token, there is no need to retrieve a cart!
        return next();
    }

    // This command says: GET the string located at the given KEY,
    // where the KEY is the user's token concatenated with "_cart"
    // For example, the data might look like this in Redis:
    //    "bdbac6db6d5654acb67aab96367be5_cart": "[ { ... }, { ... } ]"
    redis.get(req.userToken + '_cart', (err, cart) => {
        if (err) { return next(err); }

        // The "cart" here will be: "[ { ... }, { ... } ]" so we need to parse it,
        // then we can add it to the request object for use in later middleware or routes.
        // If there is no cart, we'll create an empty one on the request.
        req.cart = JSON.parse(cart) || [];
        next();
    });

});

module.exports = router;
```

#### Step Two: The Inventory Service

The `Inventory` service is up next. I'm not going to discuss how to actually build this service, but rather, we're going to talk about how to add our cart items to the Redis store within the API endpoint that handles adding an item. This really doesn't require any special Express code, just some lines in our service's route.

```javascript
const router = require('express').Router();
const redis = require('redis').createClient('127.0.0.1', 6379);

// Here is our route to add an item to our cart...
router.post('/Cart/Item', (req, res, next) => {

    // TODO: any code to audit incoming data, etc

    // Let's see if the item is already in the cart and increment the quantity if so...
    let itemFound = false;
    req.cart.forEach(item => {
      if (item.id === req.body.item.id) {
        item.quantity++;
        itemFound = true;
      }
    });

    // If the item was NOT found, add it!
    if (!itemFound) {
        req.cart.push({ id: req.body.item.id, quantity: 1 });
    }

    // We now simply SET the data back in the store, overriding the previous value...
    redis.set(req.userToken + '_cart', JSON.stringify(req.cart), (err, reply) => {
        if (err) { return next(err); }
        res.status(201).json({ message: reply, cart: req.cart });
    });
});

module.exports = router;
```

> I've used some cool new ES6 features in here. If you're not familiar, check out this cool [ES6 cheat sheet](http://es6-features.org/#Constants)!

#### Step Three: The Checkout Service

We're through the difficult part! At this point, all we need to do is grab the cart in the `Checkout` service and use it!

```javascript
const router = require('express').Router();
const redis = require('redis').createClient('127.0.0.1', 6379);

// Here is our route to check out...
router.patch('/Cart/checkout', (req, res, next) => {

    // If we don't have a cart, or it's empty, then we don't need to checkout...
    if (!req.cart || !req.cart.length) {
        let err = new Error('There are no items in your cart!');
        err.status = 400;
        return next(err);
    }

    // TODO: Now we do our normal checkout process, following whatever business logic you have!
    //       (Note: you would need to create this `processOrder` function yourself!)
    processOrder(req.cart, req.body.payment, err => {
        if (err) { return next(err); };

        // AFTER YOU'RE DONE checking out, we probably want to clear out the user's cart:
        redis.set(req.userToken + '_cart', '[]', (err, reply) => {
            if (err) { return next(err); }
            res.status(200).json({ message: 'Thanks for shopping with us!' });
        });
    });
});

module.exports = router;
```

### Wrapping Up

That's it! We've now created a mechanism to access important, if temporary, data across microservices using Express middleware. We've pushed that logic into a separate, distributed caching layer using Redis - making it highly scalable and reusable.

So what's next you ask? Well, we might want to abstract that Redis connection logic elsewhere, mostly because we'd probably want to [secure our Redis store](https://redis.io/topics/security) and possibly add some other configuration options. Additionally, while callbacks work, I'd prefer to use Promises. The Node Redis library does _not_ implement them by default, but you can easily [shoehorn Promises in with a library like Bluebird](https://github.com/NodeRedis/node_redis#promises)!

{{July 30, 2017}}

@@ development, node, javascript
