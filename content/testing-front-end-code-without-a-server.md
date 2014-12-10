
## Testing Front End Code Without a Server

> _The existence of a server does not determine the success of your front end testing strategy._

That is the basis, a thesis almost, for the rest of this post. The fact is that of the few of you actually doing front end testing, most are doing so with the "help" of a testing server that provides data from some pre-filled database. This is wrong.

This may not sit well with any of you, but my guess is that if you're reading this post, then you are interested in making your front end testing better. So, let me repeat that point just to be clear: with few exceptions, using any pre-defined, pre-populated, pre-initialized server is not the best way to properly test your front end code.

<img src='/uploads/montoya.jpg' title='You keep using that server' style='float:left;'>
Now that you are sufficiently upset that I just doused the burning intensity that was your front end testing strategy, let me explain. Your front end code does not care what your server is doing. It _does_ care what data - and in what format that data - is returned to the various callback functions, but the data given to the handlers has very little to do with the actual HTTP call your JavaScript code makes. Your server is simply another dependency that needs to be mocked out by your test suite. There is a time and place for the front end and back end to work together, but unit tests on your JavaScript code is not it. Okay, I've harped at you enough, let's look at some of the reasons why you want to mock out your server for front end testing.

### Why would I want to mock out my server?

First of all, there's test atomicity. That is, we would like our tests to be completely contained and not affect any other test (or be affected by any other test). In order for that to happen we can't let test #1 alter the data that test #2 needs to consume. You may be saying to yourself, "but test #2 needs to run after test #1!" No, it doesn't... or at least it shouldn't. Let's put it another way, a bug in the code that test #1 is evaluating should not affect the assertions for the code test #2 is evaluating.

Here's an example that should highlight the issue: let's assume you have some code that allows a user to register for a new account, and then you have code that allows a user to log in with those new credentials. You may write two tests, one for registering a new account and one for logging in - this is good! However, if your test for logging in assumes that an account is created by the first test, then we have a problem. If the test for registration fails, so does the test for logging in. The fact is, the two actions are completely independent, and a bug in one of them does not indicate a bug in the other!

The ability to ensure test atomicity is vital, but there are other benefits as well, not requiring a live server can lower infrastructure costs, allow for easier cross-browser testing, and can even help identify issues in  your data API. Ultimately, what this really comes down to, however, is that a test should only include what is necessary to evaluate the source code it is intended for.

### I'm convinced, what now?

Welcome aboard. Now that you know why you want to do it, how exactly can you isolate your front end code and tests from your server? First, a caveat: _I am only going to address getting data back from a server API using asynchronous HTTP requests_. That said, there are other concerns, things like tight DOM coupling in what would otherwise be a "Controller", for example. If your server builds your HTML pages, then you need a strategy for testing your JavaScript code without that!

In order to understand how we mock out your server, we need to understand what an asynchronous HTTP request entails. I'm presuming that you're using some JavaScript library or framework. This could be jQuery, or Angular, or Ember, or Knockout, or ... you get the idea. The point is, all of these libraries create an interface to the underlying XMLHttpRequest object. Your code simply calls some library method ($.ajax(...) for example) and the library executes the request and (eventually) calls some handler method you provide. Because we already have a layer of abstraction on the underlying mechanism for the requests, all we need to do is substitute the use of the library's methods for a set of fake methods.

That might look something like this:

![Async-mock diagram](/uploads/async-mock.png)

Notice that we sidestep the entire XMLHttpRequest implementation as well as the library abstraction with our mock implementation.

### Surely someone has done this before...

Yes, these tools already exist, and stop calling me Shirley. There are, in fact, many such tools, some of which depend on the framework you use - either in your application code or your testing solution. Regardless of what implementation you go with, the general approach employed by most tools is the same. The developer sets up rules to match the URL, method, and parameters of a request and then provides a callback function which will evaluate the request and "respond" either a particular status code and response body.

I recently worked on a project in Angular, and so that solution is fresh in my mind. To implement this solution, you'll need to include the [angular mocks extension](https://github.com/angular/angular.js/tree/master/src/ngMock "ngMock") source with your test suite, create a test application to extend your "real" application, add a bit of configuration, and then specify which requests you want to handle. For example, if we wanted to handle all POST requests to the "/api/data/object" URL we would do this:

```javascript
var myTestApp = angular.module('myApp', ['myApp']);

myTestApp
  .config(function ($provide, $httpProvider) {
    // Here we tell Angular that instead of the "real" $httpBackend, we want it
    // to use our mock backend
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
  })
  .run(function ($httpBackend) {

     $httpBackend.whenPOST('/api/data/object')
       .respond(function (method, url, requestData, headers) {
         // Check the passed data...

         // Then return whatever you need to for this test.
         // Perhaps we want to test the failure scenario...
         return [
           400,                       // Status code
           'Please enter valid data', // Response body
           {},                        // Response headers
           'User Error'               // Status text
         ];

       });

  });
```

Note that when we implement this solution we are completely replacing our "server" and as such any request that cannot be completed by matching a URL to one in the code above will fail! This can actually be very helpful as it allows you to see what other requests your code is making and ensure that all of them are mocked out properly.

### But I don't use Angular!

Don't worry, there are solutions out there for many other frameworks and libraries. If you're using jQuery, you can use the [Mockjax](https://github.com/appendto/jquery-mockjax "jQuery ") plugin. For Jasmine testing specifically there is a [Jasmine ajax](https://github.com/pivotal/jasmine-ajax "jasmine ajax") library. And if you really need a cross-framework tool (or you only have custom code), you could use something like [Sinon](http://sinonjs.org/ "Sinon") (which also has really in depth dependency injection and spying tools).

The point here is that you have no excuse! There are many tools for ensuring that your front end code does not require a server just to test it. Take the time to isolate your JavaScript code and tests and future you will thank you greatly for it! As always, hit me up in the comments or on [Twitter](http://twitter.com/jakerella "Find me on Twitter") if I can help you in any way.

{{June 2, 2014}}

@@ javascript, testing, mocking, angular
