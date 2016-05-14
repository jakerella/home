## Two-Factor Authentication with LoopBack

> This entry was [originally posted](https://strongloop.com/strongblog/two-factor-authentication-with-loopback/) on the StrongBlog (by me). Nothing changed, just adding it to my personal site. :) That said, you should [check out StrongLoop](http://strongloop.com/get-started/) if you're interested in building APIs in Node!

<a href='http://confoo.ca/en' class='right'><img src='http://strongloop.com/wp-content/uploads/2015/02/confoo.gif' alt='Confoo logo'></a> Before I get into the code and walk you through it, I wanted to talk about my motivation for this post. I recently spoke at the [Confoo developer conference](http://confoo.ca) in Montreal. If you haven't been, it's a whirlwind of [new technologies](http://confoo.ca/en/2015/session/the-future-is-now-javascript-es6-and-traceur), [complex data theories](http://confoo.ca/en/2015/session/tracking-your-data-cross-the-fourth-dimension), [useful soft skills](http://confoo.ca/en/2015/session/confessions-of-a-remote-worker), and [solid, practical information](http://confoo.ca/en/2015/session/a-rebasing-workflow-for-git) for technologists of all sorts and levels. I've had the pleasure of attending (and speaking) the last two years and I always find an abundance of good information and good networking opportunities. This year was the first time that StrongLoop has had a presence, but given the contacts made with both users of [LoopBack](http://loopback.io) and new potential partners like [Riak](http://basho.com/riak/) and [Nexmo](http://nexmo.com), I hope we are able to go back next year.

> _What's LoopBack? It's an open source framework for quickly building APIs in Node and getting them connected to data._

Based on the frequency of sessions surrounding it and conversations in the hallways, I can confidently tell you that the big story was APIs. From code frameworks to authentication to monitoring, everyone is moving in that direction. Indeed, the popularity of StrongLooper Al Tsang's [presentation at Node Summit](http://www.slideshare.net/altsang/node-the-integration-fabric-of-the-future) has shown that momentum in the Node.js community and beyond. And Node is built well for just such a task.

## What about authentication?

<img src='http://strongloop.com/wp-content/uploads/2014/04/api_security.png' alt='Lock' class='right' style='width:20%; margin-top:-1em; padding-top:0;'> LoopBack already has [authentication and authorization](http://docs.strongloop.com/display/public/LB/Authentication%2C+authorization%2C+and+permissions) baked in. There is a base `User` class that you can use directly or extend to suit your needs. Each model in LoopBack can also have a rich set of access control rules built in using the existing user roles. I'm not going to talk in depth about these mechanisms, but you can read more at the link above. Instead, I want to focus on some insights from one of the sessions at Confoo: [Chris Cornutt's "Beginner's Guide to Alternative Authorization"](http://confoo.ca/en/2015/session/the-beginner-s-guide-to-alternative-authorization).

You can review the [slides from his talk on his SpeakerDeck page](https://speakerdeck.com/ccornutt/the-beginners-guide-to-alternative-authentication), but let me give you the TL;DR version: There are **a lot** of different authentication mechanisms, and all of them have their own nuances, benefits, and issues. This session was just an overview of a lot of those mechanisms, but it got me thinking about the authentication built into LoopBack and how a developer might make that more secure using something like a multi-factor process.

So, without further ado, let's see how we can extend the existing LoopBack User login system to use two-factor authentication with a time-based, sms-delivered code.

## Time Based and SMS

<img src='http://strongloop.com/wp-content/uploads/2013/07/sl_graphics__08.png' alt='mobile device' class='right' style='width:15%; padding-top:0;'> There are certainly many enhanced authentication mechanisms, as Chris' presentation demonstrates, but we need to focus on something widely applicable to web applications and something we can build in one blog post! With the abundance of SMS APIs out there, sending a time-based code should be simple. Why time-based? Well, we want the user to only be able to use this code as they're logging in, so we want it to be useless after an appropriate amount of time (maybe 60 seconds?).

The basic login process will change from a simple email and password form entry to a 2.5 step process:

1. User requests a two-factor code...
  * The user will enter their email and password, which will be verified.
  * The system will send a unique code to their mobile device.
2. The user must enter that code into the UI to complete the "log in" process.

## Ok, I'm sold… How do I implement it?

First, spin up a [new LoopBack project](http://strongloop.com/get-started/) (you'll need to have the StrongLoop controller installed: `npm install -g strongloop`):

```bash
~$ slc loopback
```

Follow the prompts to create your application, then [create a new model](http://docs.strongloop.com/display/public/LB/Creating+models) which extends the `User` class - I called mine "Employee". Inside our new Employee model we'll create two new [remote methods](http://docs.strongloop.com/display/public/LB/Extend+your+API) for our 2(.5) step process. I'm going to skip straight to the methods themselves, but you can read about how to create them at the link in the last sentence.

Here is our function for requesting a new two-factor, time-limited code. Note that it does 3 basic things: find the user, check their password, and send them a code. **I've left out a bunch of error handling**, but you can see it in the [example repository](https://github.com/jakerella/loopback-example-two-factor/blob/master/common/models/employee.js). We're also using the [speakeasy library](https://github.com/markbao/speakeasy) to generate our tokens, so we'll require that first (be sure to install it as a dependency: `npm install --save speakeasy`).

```js
var speakeasy = require('speakeasy');

module.exports = function(Employee) {

  Employee.requestCode = function(credentials, fn) {
    this.findOne({where: { email: credentials.email }}, function(err, user) {
      user.hasPassword(credentials.password, function(err, isMatch) {
        if (isMatch) {
          // Note that you'll want to change the secret to something a lot more secure!
          var code = speakeasy.totp({key: 'APP_SECRET' + credentials.email});
          console.log('Two factor code for ' + credentials.email + ': ' + code);

          // [TODO] hook into your favorite SMS API and send your user their code!

          fn(null, now);
        } else {
          var err = new Error('Sorry, but that email and password do not match!');
          err.statusCode = 401;
          err.code = 'LOGIN_FAILED';
          return fn(err);
        }
      });
    });
  };
};
```

Once the user has been sent their time-limited verification code they will need an endpoint to submit it to in order to complete the login process. Keep in mind that this code expires quickly (30 seconds is the default for speakeasy), so our UI should be ready to accept the code right away (no fumbling through multiple pages!).

Again, in the example below **I have left out a lot of audits** for brevity in this blog post. Be sure to audit everything!

```js
Employee.loginWithCode = function(credentials, fn) {
  var err = new Error('Sorry, but that verification code does not work!');
  err.statusCode = 401;
  err.code = 'LOGIN_FAILED';

  this.findOne({ where: { email: credentials.email } }, function(err, user) {
    // And don't forget to match this secret to the one in requestCode()
    var code = speakeasy.totp({key: 'APP_SECRET' + credentials.email});

    if (code !== credentials.twofactor) {
      return fn(err);
    }

    // Everything looks good, so now we can create the access token, which
    // is used for all future API calls to authenticate the user.
    user.createAccessToken(86400, function(err, token) {
      if (err) return fn(err);
      token.__data.user = user;
      fn(err, token);
    });
  });
};
```

Great! We're almost done with the server side of things. All we need to do is make those two new remote methods publicly available, otherwise you would have to be logged in to log in. :)

Open the generated "/common/models/employee.json" file and update the "acls" object to allow access from "$everyone" for both methods:

```js
"acls": [
  {
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "ALLOW",
    "property": "requestCode"
  },
  {
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "ALLOW",
    "property": "loginWithCode"
  }
]
```

## What about SMS integration?

You may have noticed that there is a "[TODO]" item in the `Employee.requestCode()` method to send that code via SMS to the user. I haven't included that code because it will require some integration and account set up on your part. That said, many of the SMS and voice API companies have very simple REST APIs of their own that you can hit. In fact, it might be as simple as this (if you were using [Nexmo](https://www.nexmo.com/)):

```js
var http = require('https');
https.get(
  'https://rest.nexmo.com' +
      '/sms/json?api_key=[YOUR_KEY]&amp;api_secret=[YOUR_SECRET]' +
      '&amp;from=[YOUR_NUMBER]&amp;to=[USER_MOBILE_#]' +
      '&amp;text=Your+verification+code+is+' + code,
  function() {
    res.on('data', function(data) {
      // all done! handle the data as you need to
    });
  }
).on('error', function() {
    // handle errors somewhow
});
```

> ### Push Notifications
>
> _While it's out of scope for this article, if SMS isn't your thing and you're already developing a native mobile application, you could also deliver the two-factor code using [LoopBack's push notification component](http://docs.strongloop.com/display/public/LB/Push+notifications)!_

That's it for the server! At this point you could execute `slc run` and go to [http://localhost:3000/explorer](http://localhost:3000/explorer) and see your new model and the custom remote methods. However, they aren't very interesting without seeing them in action. So let's build out a lightweight front end to see how everything fits together.

![LoopBack explorer showing new routes](http://strongloop.com/wp-content/uploads/2015/02/two-factor-explorer.png)

## A Lightweight Login Form

First, you need to follow the [instructions here](http://docs.strongloop.com/display/public/LB/Add+a+static+web+page) for adding a middleware configuration for serving static files from the "/client" directory; then we can add a new HTML file inside that directory. You can grab [the file from my example repository](https://github.com/jakerella/loopback-example-two-factor/blob/master/client/index.html), but here is the important part, the form:

```html
<form id='login' action='' method='POST'>
  <fieldset>
    <label>
      Email
      <input type='email' name='email' value='john@doe.com'>
    </label><br>
    <label>
      Password
      <input type='password' name='password' value='opensesame'>
    </label><br>
    <label>
      Verification Code
      <input type='text' name='code'>
    </label><br>

    <input type='submit' value='Request Code'>
  </fieldset>
</form>
```

![A basic two-factor login form](http://strongloop.com/wp-content/uploads/2015/02/two-factor-form.png)

Now we can add a `<script>` tag at the bottom for our UI code to call those endpoints. We'll use some simple Ajax calls and DOM manipulation to achieve our goal, but don't get caught up in the particulars, your UI may differ widely. This is more to demonstrate how to use the endpoints we just created!

When the user submits the form we'll check to see if they have a verification code yet, and if not, request one for them. Once they have a code we'll send the second API call to complete the login process.

**Note that the code below has been cut short for brevity!** You can see the actual, [full UI JavaScript code](https://github.com/jakerella/loopback-example-two-factor/blob/master/client/two-factor.js) in the example repository.

```js
document
  .getElementById('login')
  .addEventListener('submit', function(e) {
    var code = e.target.querySelector('[name=code]').value;
    if (code) {
      ajaxCall({
        url: '/api/Employees/requestCode',
        method: 'POST',
        data: { email: emailFromForm, password: passFromForm },
        headers: {'Content-Type': 'application/json' },
        success: function(data) {
          alert('Your code is has been sent by SMS!');
        }
      });

    } else {
      ajaxCall({
        url: '/api/Employees/loginWithCode',
        method: 'POST',
        data: { email: emailFromForm, twofactor: codeFromForm },
        headers: { 'Content-Type': 'application/json' },
        success: function(data) {

          alert('You have logged in!');

          // The access token will be in the data for use with future API calls!
          console.log(data.id);
        }
      });
    }
  });
```

## Show me the app!

You can access the [full example application code](https://github.com/jakerella/loopback-example-two-factor) on Github, just clone the repository (or download the code), execute `npm install` from a console to install all dependencies, then execute `slc run` to start the application! Head to [http://localhost:3000](http://localhost:3000) to see the application in action! You'll want to have the console up, since we don't have SMS integration hooked up yet, the verification code will simply print to the server console.

![The server console with the two-factor code prompt](http://strongloop.com/wp-content/uploads/2015/02/two-factor-code.png)

## They can't be all there is?!

That's really it! With just a couple of remote methods we can turn a fresh LoopBack application into a secure, two-factor authenticated system. Of course, it's important to know what the right authentication mechanism is for your application and users. Additionally, you'll want to add proper access controls to all of your API methods. Check out the [tutorial on StrongLoop's documentation site](http://docs.strongloop.com/display/public/LB/Tutorial%3A+access+control) for more information on setting that up!

{{March 10, 2015}}

@@ development, javascript, node, loopback, authentication
