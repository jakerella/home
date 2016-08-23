
## Building an Amazon Alexa Skill with Node.js

<img src='/images/echo.png' alt='Amazon Echo ' class='left' style='width:13em; padding-top:0;'>

Building an [Amazon Echo](https://www.amazon.com/Amazon-Echo-Bluetooth-Speaker-with-WiFi-Alexa/dp/B00X4WHP5E) (Alexa) skill is extremely simple, if a bit cumbersome. If you're not familiar, the Echo is an always-on voice interface for your home that allows developers to extend its functionality with "skills". These skills get the benefit of Amazon's full speech analysis engine and they work through a simple JSON web API. In this post I'll will show you how we can use Node.js to write the skill ([a small web app](https://github.com/jakerella/alexa-forecaster)) and what else we need to do to get up and running. You [don't need to own an Echo](https://echosim.io) to write a skill... although they sure are fun to play with!

You might first be asking what's the difference between the "Echo" and "Alexa" - "Echo" refers to the device, but "Alexa" is the name given to the voice interface software itself. This manifests in the keyword that an end user must say in order to trigger the device to take any action. For example, you can ask Alexa facts about our world. While the device is on, simply utter the phrase:

> **Alexa, what's the population of the United States?**

The device (in the "Alexa" voice) will respond with:

> **The population of the United States is about 324 million.**

### High-Level Overview

> TODO: exec summary and jump nav

### Custom Skills

Alexa ships with a number of [built in abilities](https://www.amazon.com/gp/help/customer/display.html?nodeId=201619490) such as replying with fact answers, converting measurements, adding to your shopping list, giving you the weather, and even controlling certain home automation devices like the Philips Hue light bulbs. Of course, these built in abilities aren't going to cover everything you want to do with a voice interface, which is why they quickly opened up a platform for writing custom "skills" for Alexa which can be published and installed by the end users.

All of these custom skills are invoked with a particular keyword (or multiple words) in addition to the user saying "Alexa" in order to identify the request as being for that skill. For example, you can install the "Bartender" skill from the Alexa app on your phone (or on the web) which allows you to say something like:

> Alexa, ask the **bartender** how to make a whiskey old fashioned.

Notice the word "bartender" in bold above, that's because it is the "invocation" name of the skill - the thing users must say in order to get Alexa to perform that skill.

I mentioned that the skill is "installed" earlier, but to be clear: none of these skills are actually "installed" on your Echo device. They are simply added to your account. In fact, very little processing is actually done on the Echo device itself, almost all of the work is done on Amazon's servers (and our own). Here is a simple breakdown of the workflow:

<div style='text-align: center;'>
    <img src='/images/speech.png' style='width: 6em; vertical-align: middle;'> &raquo;
    <img src='/images/echo.png' style='width: 6em; vertical-align: middle;'> &raquo;
    <img src='/images/alexa-logo.png' style='width: 6em; vertical-align: middle;'> &raquo;
    <img src='/images/cloud-host.png' style='width: 6em; vertical-align: middle;'> &raquo;
    <img src='/images/alexa-logo.png' style='width: 6em; vertical-align: middle;'> &raquo;
    <img src='/images/echo.png' style='width: 6em; vertical-align: middle;'> &raquo;
    <img src='/images/speaker.gif' style='width: 6em; vertical-align: middle;'>
</div>

1. The user speaks a phrase, beginning with "Alexa" which the Echo hears
1. The audio is sent to Amazon's servers for processing
1. An Alexa skill request is sent to your server for business logic processing
1. Your server responds with a JSON payload including text to speak
1. Amazon's server sends your text back to the device for voice output

### Defining the Skill

Before we can use our skill, we must create it in the [Amazon Developer Portal](https://developer.amazon.com/edw/home.html#/skills/list). As mentioned previously, our skills are _not_ installed on the Echo, but rather simply added to your Amazon profile. As such, using our custom skills doesn't require us to be in "development" mode on our Echo or anything. You simply add your skill to your developer account on the portal and you're done!

> You may want to define the skill in the developer portal first because it can help you [define your voice interface](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface). This can, in turn, inform how to build your Node application.

So what do we need to do to define our skill on the portal? Not much! Let's look at each piece:

#### 1. Specify an "Invocation Name"

<img src='/images/alexa-logo.png' class='left' style='width:8em; margin-top:-1em;'>

The "invocation name" of your skill is what end users will say, along with "Alexa", to hit your web application. You should take great care in selecting it! That said, Amazon has many rules for what this can be. You should [read the documentation on selecting an invocation name](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill) carefully. In general, they should be two words (or one if it's your brand name) with no articles, Alexa launch words, or connectors (like "the", "a", "ask", "echo", or "from").

Once you've selected a name, head over to the [developer portal](https://developer.amazon.com/edw/home.html#/skills/list) and create your skill, plugging in your chosen name... and hope it isn't taken!

#### 2. Define Expected "Intents" and "Slots"

An "intent" is basically what it says: something the end user "intends" to do. For example, you can define a "Forecast" intent which gets weather for a given date. Intents have a name and any number of "slots" which represent the data required for that intent to work properly - in our case the "date" for the weather forecast.

You'll need to input this configuration into the developer portal, but I'd also recommend checking it into your source control system along with your code. We'll have to use those intents and slots in our code anyway. Here's a simple configuration for our skill:

```javascript
{
  "intents": [
    {
      "intent": "AMAZON.CancelIntent"
    },
    {
      "intent": "Forecast",
      "slots": [
        { "name": "Day", "type": "AMAZON.DATE" }
      ]
    }
  ]
}
```

In the configuration above you can see that I've included one of Amazon's [built-in intents](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/implementing-the-built-in-intents) which means you don't have to define a voice interface for it. That makes allowing a user to "cancel" their action much easier. There are other built-in intents for things like allowing the user to say "Yes" and "No" (in a variety of ways), ask for "Help", and more.

Our own intent has a name of "Forecast" and one "slot" defined named "Day" which is of type "AMAZON.DATE" - one of the [built-in slot types](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#h2_speech_input). (There's also `AMAZON.TIME`, `AMAZON.NUMBER`, and a few other helpful ones.) What's neat about the `AMAZON.DATE` slot type is that the end user can say "today", "tomorrow", "Friday", "next Tuesday", or others and Amazon will - through its speech analysis software - derive the actual date in YYYYY-MM-DD format which it sends to our server.

> ##### Custom Slots
> You can create [custom slot types](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#h2_custom_syntax) as well, but your mileage may vary when using these. They are best when your input data has a well-defined, **finite value list**. For example, a list of acceptable colors. Creating an open-ended speech slot is tricky and will not produce reliably predictable behavior.

#### 3. Provide Sample Utterances

<img src='/images/speech.png' class='right' style='width:12em; margin-top:-2em;'>

The last step in defining your skill is to provide a [list of sample utterances](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#h2_sample_utterances) to flesh out the voice interaction model for Amazon's speech analysis engine. This is required because a voice interface does not allow for the strictness that a visual interface does. On a web site you have input boxes with validation logic that can inform a user in real time what they need to fix. With a voice interface we have to wait until they are finished speaking to do any validations and ask the user for better information.

Take our simple forecasting skill for example, we want our users to ask for the weather on a given day. But how exactly will they speak that request? Here are some options:

* what's the weather for tomorrow
* what is the forecast for next Tuesday
* how's the weather gonna be today

Even with just those three examples we can see how different our users might interact with our skill. Because of this, we need to define our voice interface with examples of what the user might say. The "sample utterances" should be specified with one entry per line, beginning with the intent name and including any named slots in {curly braces}:

```
Forecast  what's the weather for {Day}
Forecast  what is the forecast for {Day}
Forecast  how's the weather gonna be {Day}
.....
...
..
```

Those dots don't mean you should include dots... they are a series of ellipses... you need to include **a lot** more samples than that. It isn't uncommon for skills to have hundreds of sample utterances per intent, especially if there are multiple slots.

<img src='/images/cloud-host.png' class='center' style='width:11em;'>

### Creating Your Skill

In this section we'll discuss building our web application for the skill. Technically speaking, this is just a plain old Node.js server. You can [host/deploy this anywhere you like](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service), and it can do whatever you want. The only real restrictions are that it must accept POST requests over HTTPS and respond with very specifically organized JSON. If you plan to get your skill certified for publication then you must also verify requests (read about that a bit later).

#### Setting Up the Project

<img src='/images/nodejs.png' class='right' style='width:15em; background-color:#444; border-radius:10px; margin-left:1em;'>

To ease our development (at least for this demo app), we'll use [Express](https://expressjs.com) for our framework. This makes it very easy to handle POST requests and JSON payloads (both in and out). Don't forget to [create a `package.json` file](http://stackoverflow.com/documentation/node.js/1515/package-json/10979/exploring-package-json#t=201608221507574352176) with `npm init` and [add your dependencies](http://stackoverflow.com/documentation/node.js/482/npm/1588/installing-packages#t=201608221507520220164) (`express` and `body-parser`). After that, let's create an entry point for our Node application called `app.js`:

```javascript
let express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());
app.post('/forecast', function(req, res) {
    // We'll fill this out later!
    res.json({ hello: 'world' });
});
app.listen(3000);
```

Notice that our basic file here pulls in (`require`s) Express and the body parser and then creates the Express application and adds the body parser middleware to parse the request as JSON. Our one and only route is for any `POST` request to the `/forecast` endpoint which currently responds with a simple JSON string: `{ "hello": "world" }` (Express will do the JSON stringifying for us).

#### Verifying Requests

Our next step is an annoying one, but necessary if you plan to certify your skill and publish it. In order to pass certification, your application (skill) must [verify that each and every request actually came from Amazon and is valid](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service#verifying-that-the-request-was-sent-by-alexa). This process is not short:

1. Check the `SignatureCertChainUrl` header for validity.
1. Retrieve the certificate file from the `SignatureCertChainUrl` header URL.
1. Check the certificate file for validity (PEM-encoded X.509).
1. Extract the public key from certificate file.
1. Decode the encrypted `Signature` header (it's base64 encoded).
1. Use the public key to decrypt the signature and retrieve a hash.
1. Compare the hash in the signature to a SHA-1 hash of entire **raw** request body.
1. Check the timestamp of request and reject it if older than 150 seconds.

<p style='font-size:4em; text-align:center; margin:0.2em 0;'>ಠ_ಠ</p>

Or you can use this awesome library: https://github.com/mreinstein/alexa-verifier

So, presuming you want to use Mike Reinstein's Alexa verification library you'll need to do four things: `npm install --save alexa-verifier` is the first. The next step is to get the raw body from the request, and finally add a piece of Express middleware before our `/forecast` route. In your `app.js` file you can add this code (replacing our `bodyParser.json()` line):

```javascript
app.use(bodyParser.json({
    verify: function getRawBody(req, res, buf) {
        req.rawBody = buf.toString();
    }
}));
```

This tells the body parser to give you access to the raw request Buffer object after processing, which we can then add as a string property value to our request object. This makes it accessible in the next step: create a function (a piece of middleware) to call Mike's library:

```javascript
let alexaVerifier = require('alexa-verifier'); // at the top of our file

function requestVerifier(req, res, next) {
    alexaVerifier(
        req.headers.signaturecertchainurl,
        req.headers.signature,
        req.rawBody,
        function verificationCallback(err) {
            if (err) {
                res.status(401).json({ message: 'Verification Failure', error: err });
            } else {
                next();
            }
        }
    );
}
```

The function above simply passes our request information to Mike's library and waits for a result. If there is _no error_ in the `verificationCallback` we provide then we call `next()` which tells Express that we can process the route. So how do we use this piece of middleware? Easy! Simply replace our previous route definition with one added argument:

```javascript
app.post('/forecast', requestVerifier, function(req, res) {
    // We'll fill this out later!
    res.json({ hello: 'world' });
});
```

Now **all requests going to the `/forecast`** POST route will be verified first.

#### Request JSON Format

You might recall that our Node application will be accepting JSON in the request body and giving back JSON in the response. Express (and the body parser) makes this easy to handle, all we have to do is inspect the object coming in and perform any business logic. The request body will have three pieces, only two of which we really care about: `session`, `request`, and `version`:

```javascript
{
    "session": { ... },
    "request": { ... },
    "version": "1.0"
}
```

Note that the "version" above is the version of the Alexa API we're using. The ["session" object](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#session-object) will look something like this:

```javascript
"session": {
    "sessionId": "SessionId.6a4789.....",
    "application": { "applicationId": "amzn1.ask.skill.2ec93....." },
    "attributes": { /* Any persisted session data... */ },
    "user": { "userId": "amzn1.ask.account.AFP3ZWK564FDOQ6....." },
    "new": true
}
```

The "attributes" in the session will contain any data we specify in the response that should persist from one request to another within a single Alexa interaction. For example, if the user asks for information about Beijing, we might respond by asking what fact that want to know. We would expect the user to then tell us "population" perhaps. We need to hold onto the city they were asking about, and that happens via the session "attributes". You can [read more about the session object](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#session-object) on the Alexa developer documentation.

The "request" object within the HTTP request body is probably what we care more about. It contains some meta information about the request and the intent, along with the slot values. What you might find surprising here is that Amazon **does not send the full text** of the speech. In order to support the "intent" of the end user, Amazon performs an analysis of the speech and derives the named intent from the speech as well as the values for any slots:

```javascript
"request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.ba6dbc3f.....",
    "locale": "en-US",
    "timestamp": "2016-08-14T20:15:27Z",
    "intent": {
        "name": "Weather",
        "slots": {
            "Day": { "name": "Day", "value": "2016-08-18" }
        }
    }
}
```

Again, note that you will not have access to the raw text the user spoke. This is why the definition of the voice interface on Amazon's developer portal is so important!

> ##### Request Types
> You may have noticed that the "request" object has a "type" property. That will have one of three values, each of which your application should handle!! Those are:
> * "LaunchRequest" - sent if a user says something like: "Alexa, start the forecaster"
> * "IntentRequest" - our main logic, we'll see to handle that soon
> * "SessionEndedRequest" - sent when the user ends a session manually, or there is an error

#### Response JSON Format

Just as our request body comes in as JSON, our response body goes out as JSON. [The format is very straight forward](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#response-format), with only three top-level properties, and not too many variations within those.

```javascript
{
  "version": "1.0",
  "sessionAttributes": { /* Any data you want to persist... */ },
  "response": { /* What Alexa should do... */ }
}
```

The first property ("version") is pretty obvious, but just to reiterate, that's the version of the Alexa API, _not_ your application/skill version. This should be "1.0" for now. The second property are the "sessionAttributes" which is exactly what you expect if you read the section on the request format: it's the data you want to persist from one voice input to the next. Our example earlier was if the user had asked for information about "Beijing": you might respond with "What do you want to know?" and the user could say: "population". In this case, you would want to hold onto the city while the conversation is ongoing... that's what we use the session attributes for.

Obviously our main focus is on the "response" property of the JSON we return. You can see below that this object has four possible sub-properties, but only one of those is required: "shouldEndSession". That property is a boolean which indicates if the conversation is over with the end user. Note that if this is `true`, any "sessionAttributes" will be cleared out.

```javascript
"response": {
  "shouldEndSession": true,
    "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>Tomorrow it could be <break time=\"1s\"/> nasty.</speak>"
    },
    "card": { /* OPTIONAL */ },
    "reprompt": { /* OPTIONAL */ }
}
```

<img src='/images/speaker.gif' class='center' style='width:10em;'>

#### Speaking Back

As you might expect, our main focus here is to produce the output speech that Alexa will say to the end user in response to their query. For that we use the "outputSpeech" property of the response! This can come in two types: "PlainText" or "<abbr title='Speech Synthesis Markup Language'>SSML</abbr>". I've chosen [Speech Synthesis Markup Language (<abbr title='Speech Synthesis Markup Language'>SSML</abbr>)](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference) above (and I do in my own code) because it allows for better handling of _how_ Alexa should speak my output. As you can see above, I'm able to insert a brief pause in the outgoing audio. I can also specify phonetic pronunciation, short audio clips, and more.

I'm not going to cover [cards](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/providing-home-cards-for-the-amazon-alexa-app) or reprompts in this post, but they are pretty simple as well. You can read more about them on the documentation linked at the beginning of the response format section.

#### Handling Requests and Intents

Now that we know what format our data is coming in, and what format we need to send back, all we have to do is detect what type of request we have, what the intent is, and produce our desired JSON! This just comes down to code organization and flow so I won't go too much into it, but here's how you might start in your `/forecast` route handler:

```javascript
app.post('/forecast', requestVerifier, function(req, res) {
  if (req.body.request.type === 'LaunchRequest') {
    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Hmm <break time=\"1s\"/> What day do you want to know about?</speak>"
        }
      }
    });
  }
  // ...
});
```

Notice that above we check the "type" of the request first, handling a "LaunchRequest" a little different than the others. Next we might [handle the "SessionEndedRequest"](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#sessionendedrequest), which is also unique:

```javascript
app.post('/forecast', requestVerifier, function(req, res) {
  if (req.body.request.type === 'LaunchRequest') { /* ... */ }
  else if (req.body.request.type === 'SessionEndedRequest') {
    // Per the documentation, we do NOT send ANY response... I know, awkward.
    console.log('Session ended', req.body.request.reason);
  }
  // ...
});
```

Lastly, we handle our own IntentRequests. A single skill can have many different Intents, so you will probably want to look at the name of the intent before proceeding. Of course, don't forget to validate that you have all the data ("slots") that you need as well!

```javascript
app.post('/forecast', requestVerifier, function(req, res) {
  if (req.body.request.type === 'LaunchRequest') { /* ... */ }
  else if (req.body.request.type === 'SessionEndedRequest') { /* ... */ }
  else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'Forecast') {

    if (!req.body.request.intent.slots.Day ||
        !req.body.request.intent.slots.Day.value) {
      // Handle this error by producing a response like:
      // "Hmm, what day do you want to know the forecast for?"
    }
    let day = new Date(req.body.request.intent.slots.Day.value);

    // Do your business logic to get weather data here!
    // Then send a JSON response...

    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Looks like a great day!</speak>"
        }
      }
    });
  }
});
```

### Testing Out Your Skillz

<img src='/images/echo.png' alt='Amazon Echo' class='right' style='width:15em;'>

Now that we've defined our skill on [Amazon's developer portal](https://developer.amazon.com/edw/home.html#/skills/list) and built our Node.js application we're ready to try it out! Make sure that you've deployed your Node app somewhere ([Heroku maybe?](https://devcenter.heroku.com/articles/getting-started-with-nodejs)) and that you've specified that URL for your skill in the developer portal. You should now be able to invoke your skill and use it from your own Echo device!

Of course, if you don't have an echo device (or aren't working from a place where you can easily interact with it, or just don't want to...) you can test your skill a few other ways. First, you should probably [write some unit tests](https://www.youtube.com/watch?v=u2XCdkL4bWI) for your code. You will most likely want to bypass the verification step (middleware) in your development or testing environment, but otherwise this would work just like any other web app in Node.

Next, you can test individual requests to your app from Amazon itself. Head over to the developer portal and into your new skill; then click on the "Test" option in the left sidebar. This page has the "Voice Simulator" where you can put in some <abbr title='Speech Synthesis Markup Language'>SSML</abbr> and hear how Alexa would say it; and the "Service Simulator" where you can have Amazon send your server requests based on what a user might say.

The Service Simulator is great for seeing _exactly_ what JSON will get sent to your server and what JSON your server gives back in response. I typically do this, then snag that JSON and reuse it in my automated tests later.

The last tool I'll point out is <Echosim.io>. This site is basically a full online replica of an Amazon Echo device, connected to _**your**_ Amazon account (so your skill is "installed"), and will emulate all of the input and output speech functionality. I highly encourage using this to test your skill in the final steps before you submit it for certification.

---

### Wrapping Things Up and Caveats

Thanks for reading all the way to the bottom! ( Or for skipping down here to see how things turned out. ;) ) Now that we've got something up and running, you may want to [get your skill certified](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/publishing-an-alexa-skill) in order for other end users to add it to their Echo! Currently, [you _cannot_ charge for skills](https://forums.developer.amazon.com/articles/2782/how-do-i-monetize-my-alexa-skill.html), but of course, you could require a user to have a "premium" account with your service/site/etc.

The last two caveats are just about some limitations of the Alexa platform. First, there is no way to have Alexa speak to the end user without an active request. In other words, you can't have Alexa inform the user when the weather forecast changes. (This is more broadly known as "server push", which is something we - the community - think Alexa is moving toward, but no guarantees.)

Second, there is no easy way to accept arbitrarily formatted input. For example, if you wanted to allow the user to add reminders that your server would email out at specific dates and times it would be easy to get the date (and time) for the reminder, but the text of it would be difficult. The custom slots discussed earlier are the best way to do something like this, but if you recall, those work best with a finite list of possible values (like a list of colors).

If you want to have the "reminder" text you would need to add many, many more entries to your possible slot values. Amazon will do some inference from these defined values, so it is not a concrete list, but that inference is not very broadly applied. [Custom slots can have a maximum of 50,000 values defined](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#h2_custom_syntax) - across _**all**_ slots in total - but even then you might not be able to cover _anything_ a user could say. Because of this, "free text" slots are not really viable currently.

#### Do I have to write my skill in Node?

You most certainly _do not_ have to write your skill in Node. So long as your application supports POST requests over HTTPS and can process and respond with JSON, you're good to go! In fact, many people are writing skills on Amazon's on platform: [Lamda](https://aws.amazon.com/lambda/). One of the benefits here is that you do not need to verify the incoming HTTP requests because Amazon trusts its own servers!

#### Can I see your demo skill?

If you're curious to see the [simple forecasting demo skill](https://github.com/jakerella/alexa-forecaster), check it out on GitHub! It is _not_ considered complete, but feel free to fork it and hack away!

{{August 23, 2016}}

@@ development, javascript, node, iot
