
## A (Re)Introduction to Express.js Routes

_This article was first posted on the [Lunch Badger blog](https://www.lunchbadger.com/a-reintroduction-to-express-js-routing/). Check them out if you're working with APIs in Node.js!_

If you've written anything in Node.js the chances are you've used [Express and its routing system](http://expressjs.com/en/guide/routing.html). In this article I'd like to (re)introduce you to the built-in Router that really is the core of Express itself. We'll talk about the basic idea of routing, but then dig into some more advanced concepts like pattern and regex routes and advanced URL parameter handling.

If we think of our APIs like an office building, the routes act like the signs on the doors: they tell you what business you're about to enter. Behind those routes is the business logic of our endpoints (the individual offices). Without proper signs (routes), our code would have to handle _any_ request in one giant endpoint. Think of this like having an office building that is just one giant facility that does _everything_ - how difficult would it be to find the service you actually wanted?

Of course, you might want a lock on that door (authentication) and maybe a surveillance camera (logging). Our analogy breaks down a little here, because we don't really want authentication and logging to be re-implemented by each endpoint (each office). Instead, we want our security and other functionality to be centralized and policy-based using an API gateway.

### Routing in Express 4 versus 3

If you have a significantly old Express application then chances are it uses the old routing mechanism of simply adding individual routes to the Express app/server object directly. Luckily for us, Express 4 added the ability to extract these routes to their own object and then `require` that router and mount it to a base URL path. This makes abstracting routing logic easier, but the team also added some great features to centralize URL parameter handling. We'll be using this new routing system exclusively in this article, although a number of the concepts could still apply to Express 3.x.

#### Basic Route Specification

Let's start off with a simple Express route handler:

```javascript
let express = require('express');
let app = express();

app.get('/api/Widgets', (request, response, next) => {
    // Business logic goes in here...
    // then we send something in the response, maybe some JSON!
    response.json({ widgets: [ { id: 1, name: 'foo' }, { id: 2, name: 'bar' } ] });
    // Note that we DO NOT all next() unless we want another route to also fire (usually we do not).
});

app.listen(3000);
```

This simple Express application specifies that the server should be listening on port 3000 for any `GET` requests to the path: `/api/Widgets`. When an incoming request matches the given HTTP method and URL path, this router function will execute! Note that this is _just like any other [Express middleware](http://expressjs.com/en/guide/writing-middleware.html)_. In other words, it will fire in the order the middleware was added, and it will receive three arguments: a `Request` object, a `Response` object, and the `next` middleware to execute (this is a function). You can read more about this arguments in the [Express documentation](http://expressjs.com/en/4x/api.html). (Note that I will be leaving off the `next` argument when it is not needed.)

#### Converting to Express 4.0

As I mentioned earlier, while this works, it doesn't scale. Before Express 4 developers had to come up with clever ways to abstract their route logic from the server initialization you see above. In 4.0 Express added a new object - [the `Router`](http://expressjs.com/en/4x/api.html#router) - which allows us to do just that, and more! Here is the same application, but across two files:

```javascript
// Inside your router file (I called mine `widget-routes.js`  (name is irrelevant))...
let express = require('express');
let router = express.Router();

router.get('/', (request, response) => {
    response.json({ widgets: [ { id: 1, name: 'foo' }, { id: 2, name: 'bar' } ] });
});

module.exports = router;
```


```javascript
// Inside your main Express app file...
let express = require('express');
let app = express();

// NOTE: We call `app.use()` here, NOT `app.get()`
app.use('/api/Widgets', require('./widget-routes'));

app.listen(3000);
```

You'll notice that in our router file we basically do exactly what we did before, except that we attach the `GET` handler to our `router` object, not our Express application itself. Then inside our primary Express application file we "mount" the entire router onto the `/api/Widgets` base URL path. Why put this in the Express app file and not the router? Because this allows us to centralize our URL endpoints there rather than spread them across many router modules. The paths inside the router modules combine with the app mounting to form the same URL path we had before: "/api/Widgets".

### Endpoint Methods and Paths

Now that we can centralize the routes for a single resource into their own module easily, it's time to expand the resource's abilities. You may be familiar with specifying other HTTP methods for a single URL path (resource) with `router.post()`, `router.patch()`, etc. However, this would still require us to repeat ourselves by specifying the URL path for this resource multiple times. We can remedy this by using the `router.route()` method:

```javascript
router.route('/')
    .get((request, response) => {
        // Retrieve all Widgets...
        response.json({ widgets: [ { id: 1, name: 'foo' }, { id: 2, name: 'bar' } ] });
    })
    .post((request, response) => {
        // Create a new Widget...
        response.json({ widget: { id: 4453, name: 'new one' } });
    })
    .delete((request, response) => {
        // Delete all Widgets...
        response.json({ message: 'You deleted all the widgets!' });
    });
```

Each of these routes is mounted to the _same URL path_ ("/api/Widgets"), but they can each do their own business logic! Of course, some of your endpoints will need a resource identifier, typically in the URL path itself. This is called a URL parameter, and is easily specified, but will require its own route:

```javascript
router.route('/:id')
    .get((request, response) => {
        // Retrieve a single Widget...
        response.json({ id: request.params.id, name: 'foo' });
    })
    .patch((request, response) => {
        // Update this Widget...
        response.json({ id: request.params.id, name: 'new one' });
    })
    .delete((request, response) => {
        // Delete just this Widget...
        response.json({ id: request.params.id, name: 'foo' });
    });
```

Notice that the UR parameter here is part of the path. We might make a request to: `/api/Widgets/5678` for example. The path inside the router module _combines_ with the path in the application file to form the final URL path to match.

#### Resource-Specific Middleware

We'll dive into URL parameters in a bit, but first I want to show one other feature of the externalized `Router` object: route-specific middleware. Since our route file does not have access to the Express application (this is intentional), we need a way to mount a piece of middleware onto the URL path for this router that is not an endpoint. For example, we might want to log out requests coming into `/api/Widgets`, but not those going to `/api/Foobars`. This is easily done inside the router with `router.all()`:

```javascript
router.all('*', (request, response, next) => {
    console.log('Incoming request to Widgets endpoint:', request.url);
    next();
});
```

We would place the code above _before our route handlers_ inside our router module. That would allow this code to run before _any_ Widget handler, but not before other endpoint handlers. The asterisk (`*`) in the path argument here simply states that it should match _any_ URL path... but remember, it's still mounted on the `/api/Widgets` path inside our application module!

#### Advanced Path Matching

Specifying the path for a route in Express does not have to be static. There are two alternatives here: simple string patterns and regular expressions. Let's look at the simple patterns first.

##### String Patterns

The path can contain four different simple patterns to make it variable without resorting to full regular expressions:

* the question mark (`?`) for optional pieces;
* the plus sign (`+`) for repeating characters;
* the asterisk (`*`) for a wildcard slot (one or more characters); and
* parenthesis to group characters (to be used with the `?` or `+` patterns).

In our example we might want to allow the API endpoint for Widgets to support the plural or singular form. We can change our path specification in the application file to support this, making the "s" character optional with a `?` at the end;

```javascript
app.use('/api/Widgets?', require('./widget-routes'));  // Matches "/api/Widget" or "/api/Widgets"
```

The parentheses allow us to group characters together and _then_ use another pattern. For example, if we wanted to support plural and singular forms for an endpoint that doesn't simply add an s. In the example below, if we only used the `?` then we would support "/api/Fishe" and "/api/Fishes", but what we _want_ to support is "/api/Fish" and "/api/Fishes". So instead we first group the "es" in the path then make it optional.

```javascript
app.use('/api/Fish(es)?', require('./widget-routes'));  // Matches "/api/Fish" or "/api/Fishes"
```

We could also support common misspellings, for example, repeated characters. The path below would allow for any number of "o" characters at the end:

```javascript
app.use('/api/bo+', require('./scary-routes'));  // Matches "/api/bo", "/api/booo", "/api/booooooo", etc
```

The wildcard pattern may seem useful initially, but in my opinion, it is too lenient, and I would encourage developers to use a proper regular expression instead. Here is an example that might seem like a good use case: a path that allows for any username inserted into the URL path in order to then add that user to my friends list:

```javascript
// in our app module...
app.use('/api/Friends', require('./friends-routes'));

// then in our "/Friends" route module...
router.get('/add/*', () => { /* ... */ });
```

The issue here is that there is absolutely **no restriction on characters that can be used**. That means the route above matches "/api/Friends/add/jordan", but it also matches "/api/Friends/add//". (See the extra slash at the end?) The fact is, this one is probably going to bite you in the end. The best solution in this particular case will be to use a URL parameter, something we'll get more into shortly, but you can also use full regular expressions for your route paths!

##### Regular Expression Paths

If you have more complicated URL paths, then I would recommend using a regular expression (regex) versus a string. It will enable you to be much more specific about what you want to match in order to handle a given endpoint. There a few notes here though:

* When using regex within a router that has a mounting point _outside_ the router module, **do not** prefix the regex with the start-of-line character (`^`)!
* In general, it is encouraged to use the end-of-line character (`$`) at the end of the path in your router modules, otherwise the route will match your path plus any other random characters!
* You can mix and match strings and regex. For example, the mounting path could be a string (`"/api/Widgets"`) and you could use regex in your route module!
* Don't forget to escape those URL slashes!
* In most cases your URLs are going to be case-insensitive, but you might run into issues depending on your OS, gateway, etc.

Here is an example of a regular expression supporting multiple different iterations of essentially the same thing. This will allows us to support many different forms for the same endpoint logic.

```javascript
// matches "/api/doc", "/api/docs", or "/api/documentation"
app.get(/^\/api\/doc(s|umentation)$/, (request, response) => {
    response.render( 'docs' );
});
```

This is great, but in my opinion, the best use of regular expressions in Express is for URL parameters. Let's take a close look at those now.

#### Diving into URL Parameters

We all know what a parameter is: input into a function. URL parameters are the same idea: input into an API endpoint that come in through the URL path. Note that **query params and URL params are _not_ the same**! Query parameters appear in a URL _after_ the path (and a `?`) while URL parameters are actually _in the path itself_.

Every piece of middleware in Express has access to the [`Request` object](http://expressjs.com/en/4x/api.html#req) and on that object you will find both the query parameters mentioned earlier (`req.query`) and the URL parameters as `req.params`. These two properties of the `Request` are simple objects with key/value pairs for the various properties. Let's see a simple example.

Let's assume we have a route defined like the one below:

```javascript
// In a "Book" router...
router.get('/:id/:pagenum', (request, response) => {
    response.json({ params: request.params, query: request.query });
});

// In our app module...
app.use('/api/Books', require('./book-routes.js'));
```

If we were to hit the API endpoint below, then we would get two URL params and two query params, all of which would be echoed back to us:

```
http://yourdomain.com/api/Books/b452c88a34d3305b26ea89c1/34?readaloud=true&skip=1
```

```javascript
{
    "params": {
        "id": "b452c88a34d3305b26ea89c1",
        "pagenum": "34"
    },
    "query": {
        "readaloud": "true",
        "skip": "1"
    }
}
```

Note that our URL had "b452c88a34d3305b26ea89c1" where we used `:id` in our route definition and "34" where we had `:pagenum`. Express will extract those form the URL path _after_ matching it to our route handler and then place those two values (and their keys/names) in the `request.params` object. The query params are not specified in the route URL path, but are extracted as well as you can see above.

> Note: parameter values will **always be strings**.

In many cases, URL params are separated with slashes like our "id" and "pagenum" above, but they don't have to be! **Parameter names can only be letters, numbers, and underscores.** As such, any _other_ character acts as a parameter separator. In the example below we see how we can use the hyphen (`-`) to separate two parameters for use in our URL _without_ using slashes between them:

```javascript
router.get('/:id/highlight/:from-:to', (request, response) => {
    // your business logic here...
});
```

If we hit this API at: `/api/Books/b452c88a34d3305b26ea89c1/highlight/34-88` then we would get three URL params on the `Request`: `{ id: "b452c88a34d3305b26ea89c1", from: "34", to: "88" }`. This allows us to create very complex and dynamic URL matchers! But we have to be careful, the route above would _also match_ this path: `/api/Books/foo/highlight/nope-nope` and then our params would be: `{ id: "foo", from: "nope", to: "nope" }`! Obviously this is not desirable! For this reason, we can attach a regular expression to any URL param to validate it.

##### Validating URL Parameters

For our "Book" id above we might want to ensure it matches our databases primary key format. In this example that's a MongoDB ObjectID (a hash) which has 0-9 and a-e characters. We can tweak our path definition in the route handler to **only match when the params are in the correct format**:

```javascript
router.get('/:id([0-9a-e]{24})/highlight/:from(\\d+)-:to(\\d+)', (request, response) => {
    // your business logic here...
});
```

Now that we've specified a regular expression (in parentheses) after `:id` our URL path will only match when the "id" value is correctly formatted. Notice that we were able to use the appropriate character class and quantifier to get both the allowed content and its length specified.

You may also notice that we added a small regular expression to our `:from` and `:to` URL params to limit them to digits only (and 1 or more): `\d+`, _however_, notice that we have an extra slash in there! We have to escape the slash itself because it is inside a string. Otherwise JavaScript will attempt to use the slash to escape the "d" character - not helpful.

##### URL Params in Regular Expression Paths

If you are using a full regular expression path for your route definition then you cannot use named URL params. In other words, you can't use the `:id` style syntax. Why not? Because in a regular expression those characters have specific meaning! Instead, when using a regular expression path definition, Express will place **each matching parenthetical regex group in an enumerated param** on the `Request` object. Let's see an example:

```javascript
router.get(/\/([0-9a-e]{24})\/highlights?\/(\d+)\-(\d+)$/, (request, response) => {
    console.log( request.params[0] ); // "b452c88a34d3305b26ea89c1"
    console.log( request.params[1] ); // "34"
    console.log( request.params[2] ); // "88"
    // Your business logic here...
});
```

When we hit our same API endpoint now (`/api/Books/b452c88a34d3305b26ea89c1/highlight/34-88`) we still get all three values, but since they can't have names (like `:id`, `:from`, and `:to` before) Express will enumerate them on the `Request.params` object. As you scan see above, we get three numeric keys (0, 1, and 2) with the three matching URL parameter values.

##### Custom Handling for Specific URL Parameters

Many times in the course of developing an API endpoint's business logic we end up repeating basic functionality. In the example we have above with Books we would almost always want the actual `Book` data object inside our route handler. Since we would presumably have more than one handler for Books, we would need to repeat this functionality in each handler. Express provides a simple way to deal with this common situation.

Inside our route module for `Books` we can specify how to handle the `id` URL parameter specifically. This would _only apply to this router_, thus we could use a different piece of functionality for "id" params in other router modules. In our case, we want to take the "id" value provided and get the actual `Book` object. We will use Express' [`Router.param()`](http://expressjs.com/en/4x/api.html#router.param) function:

```javascript
router.param('id', (request, response, next, id) => {
    // `Book` here is some database model object you had have to define elsewhere...
    Book.findById(id)
        .then((book) => {
            if (!book) {
                let err = new Error('Unable to find that Book');
                err.status = 404;
                next(err);
            }
            request.book = book;
            next();
        })
        .catch(next);
});

router.get('/:id([0-9a-e]{24})/highlight/:from(\\d+)-:to(\\d+)', (request, response) => {
    console.log(request.book);  // { id: "b452c88a34d3305b26ea89c1", title: "Eloquent JavaScript", ... }

    // Your business logic here...
});
```

There are a couple of notes about this example. First, you cannot use a full regular expression for your route path to use this function since you would not have a parameter name! Second, notice that if we don't find a Book with that "id" it means the value matched our format, but was not found in the database, thus we set a `404` status code on the `Error` object. By calling `next(err)` with our `Error` we will prevent Express from entering our route handler at all.

So long as things go according to plan, **any route definition using `:id`** will now have access to `request.book` in its handler function without having to do any extra work!

### Wrapping Up

In case you haven't noticed, route handling in Express 4+ has been improved dramatically. In fact, a lot of these features are helpful in defining functionality outside of your API microservices entirely: they are helpful when creating API gateways! These features, along with Node's efficiency really makes it an ideal solution for scalable API microservices.

Take a look at the [Express documentation on routing](http://expressjs.com/en/guide/routing.html), but I encourage you to also create a tiny sample application to try out these features!

{{July 16, 2017}}

@@ development, node, javascript
