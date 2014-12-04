## Two Weeks with Sencha Touch

Recently I spent a couple of weeks trying out a new (to me) mobile web application framework: [Sencha Touch](http://www.sencha.com/products/touch/) (version 2.1.0). I was building a little [event discovery tool](https://github.com/jakerella/eventsforme) mostly for the purposes of trying out the framework (although I also submitted the project to [Sencha's "HTML5 is Ready" contest](http://www.sencha.com/html5-is-ready)). In this post I'll outline some of the features of the framework, how to get up and running quickly, and some pitfalls to watch out for. This isn't intended to be a "quick start" guide per se - there are [many of those out there](https://www.google.com/search?q=getting+started+with+sencha+touch) if you need one - but rather a look back on what I found as a new user of the library.

The Sencha Touch version 2 (<acronym title='Sencha Touch 2'>ST2</acronym>) framework builds off of Sencha's other popular JavaScript product: [ExtJS](http://www.sencha.com/products/extjs), and in fact at it's core ST2 includes much of this "parent" library, which gives a lot of of power to your application. Sencha Touch was created for building high-end (read: enterprise) HTML5 mobile web applications versus their more simplistic cousins: "mobile compatible" web sites. Indeed, this framework includes everything you would need to create a cutting edge mobile web app - from great user interaction and experience handling (from widgets to great event support) to intricate data modeling and synchronization  That said, there is a caveat to having this kind of power: not all browsers will handle it. In fact, ST2 is only [targeted at webkit browsers](http://www.sencha.com/forum/showthread.php?120949-Sencha-Touch-WebKit-and-Firefox). This choice may seem controversial, but keep in mind that Safari and the native Android browser both use the webkit rendering engine, and many of the other mobile browsers do as well. But to those who are still concerned, maybe ST2 isn't the framework for you.

**UPDATE: Thanks to a comment by reader I see that Sencha Touch 2.2 (in beta currently) will [start supporting some other browsers](http://www.sencha.com/forum/announcement.php?f=92&a=36)! Great to hear, we'll have to wait and see how good that support is, but I'm hopeful!**

### Setting Up a New Project

While you can simply [download the framework](http://www.sencha.com/products/touch/download/) and copy it to your application folder, this isn't the easiest way to set started (and not the one they recommend). Sencha has created a companion product called [Sencha Cmd](http://www.sencha.com/products/sencha-cmd) which is a command line generator and builder for your apps. In fact, Sencha Cmd works with ExtJS projects as well, and can do lots of things for you. To create a new project, download the [Sencha Touch SDK](http://www.sencha.com/products/touch/download/) and put it somewhere outside of your project folder, then [install Sencha Cmd](http://www.sencha.com/products/sencha-cmd/download). FYI, while the commands may differ slightly on Windows versus Linux versus Mac, they should be pretty close to the same (my examples were run on Ubuntu). Once you have Sencha Cmd, you simply navigate to the directory that the SDK is located in and run this command:
1
    
sencha generate app --path /path/to/project/root

This will create a number of folders, copying the SDK files from that location into the project files, and create a default "app.js" file and a default view for you. There are some things in the app.js file (in the project root directory) that you will want to change, first of all, the "name" property, which will also be your namespace for other files. In these examples, I'll be using "MyApp".

As you may have guessed, this tool can create more than just an application structure, you can have it create new controllers, views, and models as well (in addition to many other things; try running "sencha help" for more info, or [read the documentation](http://docs.sencha.com/touch/2-1/#!/guide/command_app)). Below are a couple of other commands for creating a controller and model. Before you run any other Sencha Cmd commands you need to change your working directory to your project root directory (the path used above):

```bash
sencha generate controller --name Main
sencha generate model --name User --fields "id:int,name:string,createDate:date"
```

These boilerplate files are great starting points, and can quickly help you lay out your application from an organizational standpoint.

### Thank You Mr. Data

By now you may have realized that ST2 utilizes a Model-View-Controller (MVC) pattern - and in fact, it requires this structure fairly strictly in order to include various files as needed, and to build a production JavaScript file (I'll talk about that a bit later). As this isn't intended to be a complete guide, instead of going through and creating a mini application I'll just point you to some helpful resources at the end of this post.

One thing I will touch on is an extra data layer on top of its MVC models: "Stores". While this isn't exactly a direct comparison, you could think of a Model as the representation of a single data object and a Store as a collection of those objects. For example, you might have a "User" Model - a representation of a person using your system - and an "Administrators" Store which is a collection of User Models that all have a particular switch set (maybe an "is_admin" flag on the user table).

In order to truly understand Models and Stores, however, you need to understand what Sencha calls "Proxies". A Proxy in ST2 is the connection between some data and its representation in JavaScript. There are a few different types, but the ones you will probably be most interested in are "LocalStorage", "Ajax", "Memory", and maybe "JsonP". There are [other proxies](http://docs.sencha.com/touch/2-1/#!/api/Ext.data.proxy.Proxy) and you should look into them if you don't see what you need here. The way you use a Proxy is by attaching it to a Model or Store - essentially you are telling the framework where to get the data for that representation; so an "Ajax" Proxy will get data for the necessary object using an XMLHttpRequest through core JavaScript (or rather, through the ExtJS Ajax library). Below is an example of a simple User Model with an Ajax Proxy:

```js
Ext.define("MyApp.model.User", {
  ...
  config: {
    ...
    fields: [
      {name: "id", type: "string"},
      {name: "name", type: "string"},
      ...
    ],
    proxy: {
      type: "ajax",
      url : "data/user.php",
      reader: {
        type: "json",
        rootProperty: "results"
      }
    }
  }
});
```

When I request a specific User, ST2 will use the proxy above to find my record - that is, it will send an Ajax request to "data/user.php" with the record "id" as input. You can read more about that in the [Sencha proxy.Ajax documentation](http://docs.sencha.com/touch/2-1/#!/api/Ext.data.proxy.Ajax). Here's a simple example of getting a single User record:

```js
var UserModel = Ext.ModelManager.getModel('User');
 
// Uses the configured AjaxProxy to make a GET request to
// "/data/user.php" with "id" in the GET data
UserModel.load(13, {
  success: function(user) {
    // Now set some data on it and save the data back to the server...
    user.set("name", "Jordan");
    user.save({  // issues a POST to data/user.php with the user data
      success: function(records, operation) {
        console.log('The User was updated');
      },
      failure: function(operation) {
        // notify the user?
      }
    });
  }
});
```

### If I only had a brain...

The ST2 Controllers are the brains system of your application - they will handle incoming requests through routes, perform business logic, add and remove Views from the application, and handle any events that occur. If you want to continue the body analogy, the Views in your application would be the nervous system: capturing sensory input and passing it to the brain for processing through event triggers. In fact, the Sencha Touch framework nearly forces you to adhere to this separation of duty - almost to a fault - by not even giving access within a View to any of the Controllers or any other View that isn't an ancestor or descendant of itself.

The Views themselves are pretty intricate and quite complex. At first, you may have difficulty trying to figure out which one to use as there are so many, and what configuration options you should (or need) to set. Luckily the support on the [Sencha forums](http://www.sencha.com/forum/forumdisplay.php?89-Sencha-Touch-2.x-Forums) is pretty good, and there is at least some community on sites like [Stackoverflow](http://stackoverflow.com/questions/tagged/sencha-touch-2). That said, a lot of what I accomplished was by trial and error - and a lot of digging into the [API documentation](http://docs.sencha.com/touch/2-1/#!/api).

Below is a sample of a simple user Controller and a View for listing all Users. It should be noted that an ST2 app is set up to be single page by default, and as such navigation is almost exclusively handled through different [URL hashes](http://docs.sencha.com/touch/2-1/#!/guide/history_support). Because of this, all of the routes below are hashes on the end of the URL, versus full URL paths. Also, for efficiency, you'd really want to implement some paging logic and some handlers for when someone taps on a User.

```js
Ext.define('MyApp.controller.User', {
  extend: 'Ext.app.Controller',
  config: {
    id: 'usercontroller',
    routes: {
      // The blank string indicates no hash in the URL, so it's your
      // root (home) handler, and this line says that execution will
      // go to the method called "shoeHomePage" found in this class.
      '': 'showHomePage',
 
      // If someone goes to www.domain.com/#users we'll hit this route
      'users': 'showUserList',
 
      // Direct execution to the single user view, passing the ":id"
      // portion of the URL hash to the function as an argument
      'user/:id': {
        action: 'showUser',
        conditions: {
          ':eid': "[0-9]+" // This says the ":id" param must be an int
        }
      },
      ...
    }
  },
 
  showHomePage: function() {
    Ext.Viewport.add(
      // The object will be converted into an object of type: "Panel"
      {
        xtype: 'panel',
        html: '
This is the home page!
 
'
      }
    );
  },
 
  showUserList: function() {
    Ext.Viewport.add(
      {
        xtype: 'list',
 
        // The "itemTpl" is the template for each item in the store.
        // Since each item is a User Model we will have access to
        // the User properties defined above
        itemTpl: '
User {id} is named {name}
 
',
 
        // once loaded, all Store records will be visible in the list
        store: Ext.getStore("AllUsers").load()
      }
    );
  },
 
  showUser: function(userId) {
    // See code above for how to get a user by its "id" property,
    // then show your new view with that user's data
  }
 
});
```

### Ready to Deploy?

If you're ready to deploy your application, you may be thinking how terrible performance is going to be with all of the extra HTTP requests for each View class, Model, Controller, etc. But not to fear, Sencha Cmd comes with a builder for your application. In fact, it can build your application for multiple environments (dev vs test vs prod) with great JavaScript and CSS compression. One note I will give you, however, is to **_make sure you only have one class defined per file_** when you build an application, otherwise things simply will not work.

The first thing you need to do is define your build paths. Open up your "app.json" file in your project root, scroll down to (or search for) the "buildPaths" option. These define the directory that Sencha Cmd will store the final builds (the default settings may be fine for you). You may also want to include other directories in your build, you can do that with the "resources" setting (these would be things like images, server-side code, etc). You can also make Sencha Cmd ignore files in the production build with the "ignore" setting.

When you're ready, head to the command line and navigate to your project root. Then execute the following command, after which you can navigate to your build directory and simply FTP those files to the proper server (or, you know, check it into source control and have you're <acronym title='Continuous INtegration'>CI</acronym> server pick it up, do some testing, and deploy).
    
```bash
sencha app build {environment}
```

(Of course, you should replace {environment} with your desired environment.)

It should be noted that Sencha can actually build your app into a [native package for iOS or Android](http://docs.sencha.com/touch/2-1/#!/guide/native_packaging). I haven't personally tried this, and all it's going to do under the covers is use a web view, but it could be a game changer for some development shops. Let me know if you try it, I'm interested to see how difficult it is!

### What's the Catch?

I've really only scratched the surface of Sencha Touch in this post (and really, my experience with the framework itself is still pretty limited), but what I can tell you is that this framework - mostly because of its use, and the backing of, ExtJS - is very powerful. With that power comes a lot of complexity. I have been answering some questions on Stackoverflow lately about relatively simple things that people aren't able to figure out in ST2. My opinion is that they have trouble because there are so many different pieces to this framework that while the API documentation is good, there is simply to much to trudge through.

What makes matters worse is that the "guides" section of the Sencha documentation is really not great. There is example code in one guide that directly contradicts another; it's as if they copied the guides from an earlier version of the framework and only updated some of the guides. The support on the forums is good, but sometimes I'll search for an answer, see a potential solution in the search results, and click through only to find that the post is on a "premium" (paid) forum, and thus inaccessible to me - even though the product itself is free. This is very discouraging.

**_The Good_**

* Wonderful data models and synchronization support
* Great single-page support with routing
* Every kind of widget you could ever want (and then some)
* Great use of cutting edge HTML5 features
* Builder for multiple environments and good JS and CSS compression
* API documentation is solidly complete

**_The Not So Good_**

* Requires webkit rendering engine
* Complexity of some items is way too much
* "Guide" documentation is grossly inaccurate

**UPDATE: Thanks to a comment by reader I see that Sencha Touch 2.2 (in beta currently) will [start supporting some other browsers](http://www.sencha.com/forum/announcement.php?f=92&a=36)! Great to hear, we'll have to wait and see how good that support is, but I'm hopeful!**

My final recommendation is to give it a try, and if you're not too concerned with not supporting other browsers, this is a great candidate for that next mobile web application.

_Some resources for you..._

* [API Documentation](http://docs.sencha.com/touch/2-1/#!/api)
* [Forums](http://www.sencha.com/forum/forumdisplay.php?89-Sencha-Touch-2.x-Forums)
* [Sencha Touch 2 Questions on Stackoverflow](http://stackoverflow.com/questions/tagged/sencha-touch-2)


{{February 28, 2013}}

@@ javascript, framework, html5, mobile
