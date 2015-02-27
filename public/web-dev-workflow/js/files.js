var presentationFiles = [
	{
		"_id": "5390acf6838443ad47000060",
		"updatedAt": "2014-08-26T14:46:54.418Z",
		"url": "",
		"content": "grunt.initConfig({\n\t\n\t// ...\n\t\n\tuglify: {\n\t\t\n\t\toptions: {\n\t\t\t\n\t\t\tpreserveComments: false,\n\t\t\tpreserveCommenets: function(node, comment) {\n\t\t\t\treturn true;\n\t\t\t},\n\t\t\t\n\t\t\tbanner: \"/* Some license info... */\",\n\t\t\t\n\t\t\tenclose: {\n\t\t\t\t\"window.jQuery\": \"$\"\n\t\t\t},\n\t\t\t\n\t\t\twrap: \"myApp\",\n\t\t\texportAll: true,\n\t\t\t\n\t\t\tcompress: {\n\t\t\t\t\n\t\t\t\tglobal_defs: { \"DEBUG\": false },\n\t\t\t\tdead_code: true,\n\t\t\t\tdrop_console: true,\n\t\t\t\tdrop_debugger: true,\n\t\t\t\tunused: true,\n\t\t\t\tconditionals: true,\n\t\t\t\tjoin_vars: true,\n\t\t\t\tevaluate: true\n\t\t\t\t\n\t\t\t},\n\t\t\t\n\t\t\tmangle: true,\n\t\t\tmangle: {\n\t\t\t\t\n\t\t\t\ttoplevel: true,\n\t\t\t\texcept: [\"jQuery\"]\n\t\t\t\t\n\t\t\t},\n\t\t\t\n\t\t\tsourceMap: true,\n\t\t\tsourceMapName: \"build/app-code-source.map\",\n\t\t\tsourceMapIncludeSources: true\n\t\t\t\n\t\t},\n\t\t\n\t\tmyApp: {\n\t\t\t\n\t\t\toptions: {\n\t\t\t\tpreserveComments: \"all\",\n\t\t\t},\n\t\t\t\n\t\t\tfiles: {\n\t\t\t\t\"build/app-code.min.js\": [\"src/app.js\"]\n\t\t\t\t\"build/app-code.min.js\": [\"src/app.js\", \"src/module.js\"]\n\t\t\t\t\"build/app-code.min.js\": [\"src/**/*.js\"]\n\t\t\t}\n\t\t}\n\t\t\n\t}\n\t\n\t// ...\n\t\n});",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "Gruntfile.js"
	},
	{
		"_id": "539219b87cef8c8129000021",
		"updatedAt": "2014-08-26T14:46:54.418Z",
		"url": "",
		"content": "(function($) {\n}) // closing the function for syntax highlighting in example\n\n(function(exports, global) {\n    \n\tglobal[\"myApp\"] = exports;\n\t\n    var Person = function(data) {\n        this.first = data.firstName;\n        this.last = data.lastName;\n    };\n\tPerson.prototype.fullName = function() {\n        return this.first + \" \" + this.last;\n\t};\n\n\texports[\"Person\"] = Person;\n\t\n})( {}, function() { return this; }() );\n\n\n(function(){ // used for proper syntax highlight in this example\n\t\n})(window.jQuery);",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "enclose.js"
	},
	{
		"_id": "5395c0577cef8c812900005d",
		"updatedAt": "2014-08-26T14:46:54.418Z",
		"url": "",
		"content": "(function() {\n  \"use strict\";\n\n\tvar x = 0, y = 2;\n\t\n\tfunction add(val1, val2){\n\t\treturn val1 + val2;\n\t}\n\t\n\tvar z;\n\n\tfor (var i = 0; i < 2; i++){\n    \tz = add(y, x+i);\n\t}\n})();",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "jslint-strict.js"
	},
	{
		"_id": "5395c2577cef8c8129000065",
		"updatedAt": "2014-08-26T14:46:54.418Z",
		"url": "",
		"content": "$(function() {\n    var $body = $(\"body\");\n    var $widget = $(\"<div />\").widget();\n\n    function addWidget() {\n        var $elements = $(\"nav > li\");\n        class = \"open-class\";\n        // ...\n\t\t\n        if (button.id == \"home\") return;\n\t\t\n        for(var i = 0; i < $elements.length; i++) {\n            \n\t\t\tfunction openWidget() {\n                this.className += class;\n            }\n\n            $($elements[i]).on(\"click\", openWidget);\n\t\t\t\n        }\n    }\n\n    $(\"button\").on('click', addWidget);\n});\n",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "bad-lint.js"
	},
	{
		"_id": "5395cdd57cef8c812900006f",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "grunt.initConfig({\n\t\n\t// ...\n\t\n\tjshint: {\n\t\tmain: {\n\t\t\toptions: {\n\t\t\t\tjshintrc: \".jshintrc\",\n\t\t\t\tjshintignore: \".jshintignore\"\n\t\t\t},\n\t\t\tfiles: {\n\t\t\t\tsrc: [\"src/**/*.js\"]\n\t\t\t}\n\t\t}\n\t\t\n\t}\n\t\n\t// ...\n\t\n});",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "Gruntfile-jshint.js"
	},
	{
		"_id": "5395cfce7cef8c8129000072",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "{\n\t// ...\n\t\n\t\"optionname\": true,\n\t\n\t\"eqeqeq\": true,\n\t\"plusplus\": true,\n\t\"validthis\": true,\n\t\n\t\"nomen\": true,\n\t\"curly\": true,\n\t\"quotmark\": true,\n\t\n\t\"undef\": true,\n\t\"unused\": true,\n\t\n\t\"maxdepth\": 2,\n\t\"indent\": 4,\n\t\"trailing\": true,\n\t\"maxlen\": 140,\n\t\n\t\"browser\": true,\n\t\"globals\": {\n\t\t\"$\": true,\n\t\t\"jQuery\": true,\n\t\t\"require\": true\n\t},\n\t\n\t// ...\n}",
		"mimeType": "text/plain",
		"language": "application/json",
		"folder": false,
		"parent": null,
		"name": "jshintrc"
	},
	{
		"_id": "53972e097cef8c81290000ed",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "{\n  \"name\": \"myproject\",\n  \"version\": \"0.0.1\",\n  \n  // ...\n  \n  \"authors\": [\n    \"john <john@doe.com>\"\n  ],\n  \n  \"license\": \"MIT\",\n  \n  \"ignore\": [\n    \"**/.*\",\n    \"node_modules\",\n    \"bower_components\",\n\t// ...\n    \"test\",\n    \"tests\"\n  ],\n\t\n  \"dependencies\": {\n    \"jquery\": \"~2.1.1\"\n  }\n\n}",
		"mimeType": "text/plain",
		"language": "application/json",
		"folder": false,
		"parent": null,
		"name": "bower.json"
	},
	{
		"_id": "53974c9a7cef8c812900012b",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "{\n\t\"name\": \"my-project\",\n\t\"version\": \"0.0.1\",\n\t// ...\n\t\"dependencies\": {\n\t\t\n\t\t\n\t\t\n\t},\n\t\n\t\"devDependencies\": {\n\t\t\n\t\t\"grunt\": \"0.4.4\",\n\t\t\"grunt-contrib-concat\": \"0.4.x\",\n\t\t\"grunt-contrib-jshint\": \"~0.10.0\"\n\t\t\n\t}\n}",
		"mimeType": "text/plain",
		"language": "application/json",
		"folder": false,
		"parent": null,
		"name": "package.json"
	},
	{
		"_id": "539755157cef8c812900012d",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "module.exports = function( grunt ) {\n\n\tgrunt.initConfig({\n\t\tsrc_directory: \"src/\"\n\t\ttask: {\n\t\t\toptions: {\n\t\t\t\tname: \"value\"\n\t\t\t},\n\t\t\ttarget: {\n\t\t\t\toptions: {\n\t\t\t\t\tname: \"alternate-value\"\n\t\t\t\t},\n\t\t\t\tdata: \"value\"\n\t\t\t}\n\t\t}\n\t\t\n\t\tconcat: {\n\t\t\toptions: {\n\t\t\t\tseparator: \";\",\n\t\t\t\tstripBanners: true\n\t\t\t},\n\t\t\t\n\t\t\tlibs: {\n\t\t\t\tsrc: [ \"src/js/models/**/*.js\", \"src/js/viewModels/**/*.js\" ],\n\t\t\t\tdest: \"lib/js/scripts.js\"\n\t\t\t},\n\t\t\t\n\t\t\tvendor: {\n\t\t\t\toptions: {\n\t\t\t\t\tstripBanners: false\n\t\t\t\t},\n\t\t\t\tsrc: [ \"src/js/vendor/*.js\" ],\n\t\t\t\tdest: \"lib/js/vendor.js\"\n            }\n        }\n\n\t});\n\n\n\tgrunt.loadNpmTasks( \"grunt-contrib-concat\" );\n\n\t\n\tgrunt.registerTask( \"helloWorld\", \"Say hello\", function() {\n\t\tgrunt.log.write( \"Hello World!\" );\n\t});\n\t\n\n    grunt.registerTask( \"build\", [ \"concat:libs\", \"concat:vendor\" ]);\n\n\tgrunt.registerTask( \"default\", [ \"helloWorld\" ] );\n\tgrunt.registerTask( \"default\", [ \"build\" ] );\n\t\n};",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "gruntfile-generic.js"
	},
	{
		"_id": "5398ae557cef8c81290001b8",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "<!doctype html>\n<html>\n  <head>\n    <link rel=\"stylesheet\" href=\"lib/qunit-1.12.0.css\" />\n  </head>\n  \n  <body>\n    \n    <div id=\"qunit\"></div>   <!-- required! -->\n    <div id=\"qunit-fixture\">\n      <!-- HTML to be reset for each test -->\n    </div>\n\n    <script src=\"lib/qunit-1.12.0.js\"></script>\n    <script> // QUnit options (via QUnit.config...) </script>\n\n    <script src=\"path/to/source-code.js\"></script>\n\n    <script src=\"path/to/tests.js\"></script>\n\t  \n    <script>\n      QUnit.test(\"Hello True World\", function(assert) {\n        assert.ok(true, \"True is truthy.\");\n      });\n    </script>\n    \n  </body>\n</html>",
		"mimeType": "text/plain",
		"language": "text/html",
		"folder": false,
		"parent": null,
		"name": "qunit.html"
	},
	{
		"_id": "5399fceb7cef8c8129000214",
		"updatedAt": "2014-08-26T14:46:54.419Z",
		"url": "",
		"content": "QUnit.test(\"initialized test\", function(assert) {\n\tQUnit.expect(2);\n\n\tassert.equal(typeof $(\"input\").myPlugin, \"function\");\n\n\t$(\"input\").myPlugin({\n\t\tinitialized: function(data) {\n\t\t\t\n\t\t\t// do something with the data?\n\t\t\tassert.equal(data.name, \"myPlugin\");\n\t\t\t\n\t\t}\n\t});\n\n});\n\nQUnit.test(\"get the user\", function(assert) {\n\t\n\tQUnit.stop();\n\t\n\t$.getJSON(\"/api/user\", function(user) {\n\t\t\n\t\tassert.equal(user.name, \"Jordan\");\n\t\t\n\t\tQUnit.start();\n\t\n\t});\n\n});\n\nQUnit.asyncTest(\"get the user\", function() {\n\t\n\t$.getJSON(\"/api/user\", function(user) {\n\t\t\n\t\tassert.equal(user.name, \"Jordan\");\n\t\t\n\t\tQUnit.start();\n\t\n\t});\n\n});",
		"mimeType": "text/plain",
		"language": "text/javascript",
		"folder": false,
		"parent": null,
		"name": "tests.js"
	}
];