
## Using Express Middleware to Transform Data

_This article was first posted on the [Lunch Badger blog](https://www.lunchbadger.com/expressjs-middleware-transform-data/). Check them out if you're working with APIs in Node.js!_

Let's imagine a system where you have a few different microservices in your external facing API, each one able to operate independently. Good start! Now we want to allow requests into those microservices from multiple clients - not just our own website. One of the issues you might quickly run into in this scenario is that many clients will want data returned to them in different formats (XML versus JSON, for example). In fact, those clients may also want to _send_ you data in different formats. So what's the solution?

What you _don't_ want to do is re-implement a data transformation layer in each microservice. Instead, we should centralize this behavior. In fact, this is one of the most common operations (or "policies") that an API gateway can be used for. This article will focus on implementing this transformation layer using a simple piece of Express middleware. If you're not familiar, middleware sits between the core network request handler (inside Express) and your API routes (typically a "termination" endpoint). You can have multiple different pieces of middleware allowing you to have any number of "policies" in place to execute prior to your, or even after, your business logic.

### Request Data Transformation

Our first task will be to allow request bodies with different formats. These can be easy to implement: we simply look at the `Content-Type` header value and parse the data appropriately. The real key though, is to then _transform_ that data into the format our API microservices prefer.

> Note that I am using two separate libraries to help in this endeavor: [`body-parser`](https://github.com/expressjs/body-parser) and [`xml2json`](https://github.com/buglabs/node-xml2json) - you will need to install both of these before implementing this solution.

Let's start with our setup. The code below simply creates our Express app and adds some pre-built middleware from the body parser.

```javascript
const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: () => true }));
```

This should look familiar to you. The body parser middleware is a staple of Express development. In our example above we ask the body parser to do some work for us on _every request_ with the `use()` function on our `app` object. We specify that the work to be done is to parse our request body. Notice that we do this twice... well, not really. The body parser middleware is smart enough to know that if it finds JSON body content during the second-to-last line above, then it doesn't need to do the "raw" body parsing in the last line. In other words, the body parser "short circuits" once it matches a content type.

So then why do we need the `bodyParser.raw()` line at all? This is in case the client hits our API with a _different_ kind of data. That might be XML, or it might be something else entirely! The `raw()` middleware allows us to be flexible in our gateway to add content types in the future. Today we'll only be handling XML data.

Now we're ready to do the actual XML to JSON transformation. Don't forget to require the `xml2json` library at the top of your script! (`const parser = require('xml2json`).

```javascript
// ... everything we have above goes here ...

app.use((req, res, next) => {
    if (/\/xml$/.test(req.headers['content-type'])) {
        req.body = parser.toJson(req.body.toString(), { object: true });
    }
    next();
});
```

That's it! This middleware will run for ALL method types and look at the `content-type` header. If the header _ends in_ `/xml` (that's the regular expression on the second line), then our middleware will take that "raw" body data (which is actually a [`Buffer`](https://nodejs.org/api/buffer.html), by the way) and ask the `xml2json` library to convert the XML string to a JSON string. It then converts the JSON to an actual JavaScript object and we replace the request body (`req.body`) with that object. This is essentially what `bodyParser.json()` does if the `content-type` is "application/json".

The last line just tells Express we're ready to go onto the `next()` piece of middleware. Your last step would be to transform the data further. Inside our transformation middleware above you can do anything else to the data before it reaches the endpoint (your microservice). You could sanitize data, add or remove properties, or simply rename things for consistency across versions!

### Response Data Transformation

Handling incoming requests is a fairly straightforward process, and we could even just use core Express code versus the libraries above. However, they do make things much easier. Transforming the response data requires a bit more work, and as such I highly recommend using a library for this. There is a good one called ["express mung"](https://github.com/richardschneider/express-mung) which allows you to do just this.

We'll have to do this in two steps, but first, be sure you install and then `require` the `express-mung` package. The first step is to add the middleware below _above any routes_. If you're putting this in a gateway layer, that means _before_ your code to pass on requests to their endpoints. This might seem counter intuitive since we would want our route to process before this response transformation, but that's exactly how things will happen. The reason we need to do this before your routes is because we have to hook into the `Response` object's Stream of data to prevent it from being sent back to the client until our "munging" is complete.

```javascript
app.use(mung.json((body, req, res) => {
    if (/\.xml$/.test(req.url)) {
        return parser.toXml(body);
    }
}));
```

The code you see above looks at the URL of the _request_ to see if it _ended_ in ".xml". If so, then the response body is converted from its default JSON value into XML and returned (this is how the `express-mung` library works, a little bit of an anti-pattern for Node).

For example, if the client requested `/api/Widget` then they would receive the typical JSON data. However, if they requested `/api/Widget.xml` that same JSON data would be converted to XML before being sent back!

But we're missing a key ingredient here, we also need to change the `Content-Type` header of the response! This must be done in a separate piece of "munging" middleware:

```javascript
app.use(mung.headers((req, res) => {
    if (/\.xml$/.test(req.url)) {
        res.set('Content-Type', 'text/xml');
    }
}));
```

All done! Of course, we could add a lot of other code in our response transformation. You could add additional data, or sanitize data according to some security policy.

### How does this fit into a gateway?

Using Express as a gateway allows you to make use of middleware like we have above at a layer _above_ your microservices. The point being that you do not need to duplicate these efforts in each API microservice! Your gateway would execute these pieces of middleware, and then pass on the request to it's final destination. Once your microservice is done processing the request, it comes back through your gateway to allow you to do response transformation.

{{June 29, 2017}}

@@ development, node, javascript, http
