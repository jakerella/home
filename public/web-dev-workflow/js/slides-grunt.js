var slides = [
    "<div class=\"slide slide-93 master-vertical\">\n<div class=\"slide-wrapper \">\n\t<div class=\"vertical-center-block\">\n\t<div class=\"slide-headers\">\n\t\n\t<h1>Task automation with Grunt</h1><br />\n\t\n\t\n\t</div>\n\n\t<div class=\"slide-content\">\n\t\t<!-- slide-content -->\n\n\n\n<!-- /slide-content -->\n\t</div>\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">93</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-94 master-vertical\">\n<div class=\"slide-wrapper \">\n\t<div class=\"vertical-center-block\">\n\t<div class=\"slide-headers\">\n\t\n\t<h1>What is Grunt?</h1><br />\n\t\n\t\n\t</div>\n\n\t<div class=\"slide-content\">\n\t\t<!-- slide-content -->\n\n<p><br /></p>\n<!-- /slide-content -->\n\t</div>\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">94</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-95 master-vertical\">\n<div class=\"slide-wrapper \">\n\t<div class=\"vertical-center-block\">\n\t<div class=\"slide-headers\">\n\t\n\t<h1>What is Grunt?</h1><br />\n\t\n\t\n\t</div>\n\n\t<div class=\"slide-content\">\n\t\t<!-- slide-content -->\n\n<p>Grunt is a task runner.</p>\n<!-- /slide-content -->\n\t</div>\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">95</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-96 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Why should I care?</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<ul>\n<li>Frontend projects are becoming increasingly more complex<ul>\n<li>Combination and minification of CSS and JS</li>\n<li>Pre-processing</li>\n<li>Scaffolding (generating project structure)</li>\n</ul>\n</li>\n<li>Backend projects<ul>\n<li>Database tasks</li>\n<li>Code maintenance</li>\n<li>Testing</li>\n</ul>\n</li>\n</ul>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">96</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-97 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>So you use any of these?</h1>\n\n\n\n<div class=\"slide-content\">\n\t<div class=\"slide-columns columns-2\">\n\n<div class=\"column column-1\">\n<!-- slide-content -->\n\n<ul>\n<li>CSS</li>\n<li>SCSS/Sass</li>\n<li>Images</li>\n<li>Less</li>\n<li>HAML</li>\n</ul>\n\n</div>\n\n<div class=\"column column-2\">\n<ul>\n<li>JavaScript</li>\n<li>CoffeeScript</li>\n<li>JSHint</li>\n<li>Unit Tests</li>\n</ul>\n<!-- /slide-content -->\n</div>\n\n</div>\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">97</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-98 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>What does it <em>do</em> exactly?</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<ul>\n<li>Grunt doesn’t actually provide all the previously mentioned functionality</li>\n<li>It is a <em>framework</em> that provides utilities and structure for running tasks</li>\n<li>Grunt’s extreme popularity and usefulness is due to its plugin community</li>\n<li>The Grunt website currently lists over 2,700 plugins</li>\n</ul>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">98</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-99 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Installing Grunt</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>Grunt is a Node module, so first, install  Node…</p>\n<ol>\n<li><p><a href=\"http://nodejs.org/download/\" target=\"_blank\">Install Node.js</a></p>\n</li>\n<li><p>Use <code>npm</code> to globally install <code>grunt</code> command line tool:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"cm-def\">$ npm</span> install grunt-cli <span class=\"cm-attribute\">-g</span></pre>\n</li>\n</ol>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">99</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-100 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Create a Node package</h1>\n\n\n<h2>Wait, what?</h2>\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>Because Grunt runs as a Node module, we need to configure a simple Node package.</p>\n<p>We do this by creating a simple <code>package.json</code> file in the <em>root of our project</em>.</p>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">100</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-101 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Create a Node package</h1>\n\n\n<h2>The <code>package.json</code> file</h2>\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>~/myproject/package.json</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">{\n    <span class=\"cm-string cm-property\">\"name\"</span>: <span class=\"cm-string\">\"my-project\"</span>,\n    <span class=\"cm-string cm-property\">\"version\"</span>: <span class=\"cm-string\">\"0.0.1\"</span>,\n    <span class=\"cm-comment\">// ...</span>\n    <span class=\"cm-string cm-property\">\"dependencies\"</span>: {\n        \n    },\n    \n    <span class=\"cm-string cm-property\">\"devDependencies\"</span>: {\n        \n    }\n}</pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">101</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-102 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Installing Grunt</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p><br />Setp 3: Add <code>grunt</code> as a project dependency in our <code>package.json</code> file. </p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\">{</span>\n    <span class=\"dim-line\"><span class=\"cm-string cm-property\">\"name\"</span>: <span class=\"cm-string\">\"my-project\"</span>,</span>\n    <span class=\"dim-line\"><span class=\"cm-comment\">// ...</span></span>\n    <span class=\"dim-line\"></span>\n    <span class=\"cm-string cm-property\">\"devDependencies\"</span>: {\n        <span class=\"cm-string cm-property\">\"grunt\"</span>: <span class=\"cm-string\">\"0.4.4\"</span>,\n    }\n<span class=\"dim-line\">}</span></pre>\n\n\n<p>Now install all project dependencies</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ npm</span> install</pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">102</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-103 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Grunt</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>The Grunt config file is a <strong>Node module</strong> and should be called <code>Gruntfile.js</code> (although it can be all lowercase as well).</p>\n<p>~/myproject/Gruntfile.js<br /><pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {\n    \n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"helloWorld\"</span>, <span class=\"cm-string\">\"Say hello\"</span>, <span class=\"cm-keyword\">function</span>() {\n        <span class=\"cm-variable\">grunt</span>.<span class=\"cm-property\">log</span>.<span class=\"cm-property\">write</span>( <span class=\"cm-string\">\"Hello World!\"</span> );\n    });\n    \n};</pre></p>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">103</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-104 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Grunt</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>The Grunt config file is a <strong>Node module</strong> and should be called <code>Gruntfile.js</code> (although it can be all lowercase as well).</p>\n<p>~/myproject/Gruntfile.js<br /><pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {\n    \n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"helloWorld\"</span>, <span class=\"cm-string\">\"Say hello\"</span>, <span class=\"cm-keyword\">function</span>() {\n        <span class=\"cm-variable\">grunt</span>.<span class=\"cm-property\">log</span>.<span class=\"cm-property\">write</span>( <span class=\"cm-string\">\"Hello World!\"</span> );\n    });\n    \n};</pre></p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> helloWorld\nRunning <span class=\"cm-string\">\"helloWorld\"</span> task\nHello World!\nDone, without errors.</pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">104</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-105 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Running commands</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<ul>\n<li>Execute tasks using the <code>grunt</code> command inside your project directory</li>\n</ul>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> [taskname][:target]</pre>\n<ul>\n<li>To view all available tasks:</li>\n</ul>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> <span class=\"cm-attribute\">--help</span></pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">105</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-106 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>The <code>default</code> task</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>We can set the default task to be run if none is specified…</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {</span>\n    <span class=\"dim-line\"></span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"helloWorld\"</span>, <span class=\"cm-string\">\"Say hello\"</span>, <span class=\"cm-keyword\">function</span>() {</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">grunt</span>.<span class=\"cm-property\">log</span>.<span class=\"cm-property\">write</span>( <span class=\"cm-string\">\"Hello World!\"</span> );</span>\n    <span class=\"dim-line\">});</span>\n    <span class=\"dim-line\"></span>\n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"default\"</span>, [ <span class=\"cm-string\">\"helloWorld\"</span> ] );\n<span class=\"dim-line\">};</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">106</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-107 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>The <code>default</code> task</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>We can set the default task to be run if none is specified…</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {</span>\n    <span class=\"dim-line\"></span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"helloWorld\"</span>, <span class=\"cm-string\">\"Say hello\"</span>, <span class=\"cm-keyword\">function</span>() {</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">grunt</span>.<span class=\"cm-property\">log</span>.<span class=\"cm-property\">write</span>( <span class=\"cm-string\">\"Hello World!\"</span> );</span>\n    <span class=\"dim-line\">});</span>\n    <span class=\"dim-line\"></span>\n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"default\"</span>, [ <span class=\"cm-string\">\"helloWorld\"</span> ] );\n<span class=\"dim-line\">};</span></pre>\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span>\nRunning <span class=\"cm-string\">\"helloWorld\"</span> task\nHello World\nDone, without errors.</pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">107</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-108 master-vertical\">\n<div class=\"slide-wrapper \">\n\t<div class=\"vertical-center-block\">\n\t<div class=\"slide-headers\">\n\t\n\t<h1>Configuring Grunt</h1><br />\n\t\n\t\n\t<h2>Adding 3rd party tasks</h2><br />\n\t\n\t</div>\n\n\t<div class=\"slide-content\">\n\t\t<!-- slide-content -->\n\n\n\n<!-- /slide-content -->\n\t</div>\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">108</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-109 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Grunt</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<ul>\n<li><code>grunt.initConfig()</code> accepts an object that specifies configuration for all tasks</li>\n<li>Tasks can have multiple <em>targets</em></li>\n<li>The configuration object also supports custom keys and values</li>\n</ul>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {\n\n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({\n        <span class=\"cm-property\">src_directory</span>: <span class=\"cm-string\">\"src/\"</span>\n    });\n    \n};</pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">109</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-110 master-vertical\">\n<div class=\"slide-wrapper \">\n\t<div class=\"vertical-center-block\">\n\t<div class=\"slide-headers\">\n\t\n\t<h1>Using a Plugin</h1><br />\n\t\n\t\n\t<h2>grunt-contrib-concat</h2><br />\n\t\n\t</div>\n\n\t<div class=\"slide-content\">\n\t\t<!-- slide-content -->\n\n\n\n<!-- /slide-content -->\n\t</div>\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">110</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-111 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Installing plugins</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>Add module to <code>package.json</code></p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"cm-string\">\"devDependencies\"</span>: {\n    <span class=\"cm-string cm-property\">\"grunt\"</span>: <span class=\"cm-string\">\"0.4.4\"</span>,\n    <span class=\"cm-string cm-property\">\"grunt-contrib-concat\"</span>: <span class=\"cm-string\">\"0.4.0\"</span>\n}</pre>\n<p>Then install any new packages:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ npm</span> install</pre>\n<p><em><strong>OR</strong></em></p>\n<p>Do both in one step:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ npm</span> install <span class=\"cm-attribute\">--save</span><span class=\"cm-attribute\">-dev</span> grunt-contrib-concat</pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">111</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-112 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Plugins</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>Load the plugin in your <code>Gruntfile.js</code>:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {</span>\n<span class=\"dim-line\"></span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({</span>\n<span class=\"dim-line\"></span>\n    <span class=\"dim-line\">});</span>\n<span class=\"dim-line\"></span>\n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">loadNpmTasks</span>( <span class=\"cm-string\">\"grunt-contrib-concat\"</span> );\n    <span class=\"dim-line\"></span>\n<span class=\"dim-line\">};</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">112</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-113 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Plugins</h1>\n\n\n<h2>Tasks, targets, options, and data</h2>\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {</span>\n<span class=\"dim-line\"></span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({</span>\n        <span class=\"cm-variable\">task</span>: {\n            <span class=\"cm-variable\">options</span>: {\n                <span class=\"cm-variable\">name</span>: <span class=\"cm-string\">\"value\"</span>\n            },\n            <span class=\"cm-variable\">target</span>: {\n                <span class=\"cm-variable\">options</span>: {\n                    <span class=\"cm-variable\">name</span>: <span class=\"cm-string\">\"alternate-value\"</span>\n                },\n                <span class=\"cm-variable\">data</span>: <span class=\"cm-string\">\"value\"</span>\n            }\n        }\n    <span class=\"dim-line\">});</span>\n    <span class=\"dim-line\"></span>\n<span class=\"dim-line\">};</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">113</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-114 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Plugins</h1>\n\n\n<h2>Adding the <code>concat</code> task and target</h2>\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {</span>\n<span class=\"dim-line\"></span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({</span>\n        <span class=\"cm-variable\">concat</span>: {\n            <span class=\"cm-variable\">libs</span>: {\n                <span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/models/**/*.js\"</span>, <span class=\"cm-string\">\"src/js/viewModels/**/*.js\"</span> ],\n                <span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/scripts.js\"</span>\n            },\n        }\n    <span class=\"dim-line\">});</span>\n<span class=\"dim-line\"></span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">loadNpmTasks</span>( <span class=\"cm-string\">\"grunt-contrib-concat\"</span> );</span>\n    <span class=\"dim-line\"></span>\n<span class=\"dim-line\">};</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">114</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-115 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Configuring Plugins</h1>\n\n\n<h2>Adding a second target</h2>\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({</span>\n    <span class=\"dim-line\"><span class=\"cm-variable\">concat</span>: {</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">libs</span>: {</span>\n            <span class=\"dim-line\"><span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/models/**/*.js\"</span>, <span class=\"cm-string\">\"src/js/viewModels/**/*.js\"</span> ],</span>\n            <span class=\"dim-line\"><span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/scripts.js\"</span></span>\n        <span class=\"dim-line\">},</span>\n        <span class=\"dim-line\"></span>\n        <span class=\"cm-variable\">vendor</span>: {\n            <span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/vendor/*.js\"</span> ],\n            <span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/vendor.js\"</span>\n        }\n    <span class=\"dim-line\">}</span>\n<span class=\"dim-line\">});</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">115</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-116 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Running Different Targets</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>Running the <code>concat</code> task will execute <strong>all targets</strong>:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> concat</pre>\n<p>Specify a single task using the <code>task:target</code> syntax:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> concat:libs</pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">116</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-117 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Running Different Targets</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>Running the <code>concat</code> task will execute <strong>all targets</strong>:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> concat</pre>\n<p>Specify a single task using the <code>task:target</code> syntax:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> concat:libs</pre>\n<p><br />The same rules apply when composing tasks in <code>Gruntfile.js</code>:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"> <span class=\"cm-comment\">// Executes both targets</span>\n<span class=\"cm-variable\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"build\"</span>, [ <span class=\"cm-string\">\"concat\"</span> ] );\n\n<span class=\"cm-comment\">// Executes just the \"libs\" target</span>\n<span class=\"cm-variable\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"build\"</span>, [ <span class=\"cm-string\">\"concat:libs\"</span> ] );</pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">117</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-118 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Adding Options</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>The <code>options</code> object can be applied to all targets in a task:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">concat</span>: {</span>\n    <span class=\"cm-variable\">options</span>: {\n        <span class=\"cm-variable\">separator</span>: <span class=\"cm-string\">\";\"</span>,\n        <span class=\"cm-variable\">stripBanners</span>: <span class=\"cm-atom\">true</span>\n    },\n    <span class=\"dim-line\"><span class=\"cm-variable\">libs</span>: {</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/models/**/*.js\"</span>, <span class=\"cm-string\">\"src/js/viewModels/**/*.js\"</span> ],</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/scripts.js\"</span></span>\n    <span class=\"dim-line\">},</span>\n    <span class=\"dim-line\"><span class=\"cm-variable\">vendor</span>: {</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/vendor/*.js\"</span> ],</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/vendor.js\"</span></span>\n    <span class=\"dim-line\">}</span>\n<span class=\"dim-line\">}</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">118</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-119 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Adding Options</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p>The <code>options</code> object can be applied to all targets in a task:</p>\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">concat</span>: {</span>\n    <span class=\"cm-variable\">options</span>: {\n        <span class=\"cm-variable\">separator</span>: <span class=\"cm-string\">\";\"</span>,\n        <span class=\"cm-variable\">stripBanners</span>: <span class=\"cm-atom\">true</span>\n    },\n    <span class=\"dim-line\"><span class=\"cm-variable\">libs</span>: {</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/models/**/*.js\"</span>, <span class=\"cm-string\">\"src/js/viewModels/**/*.js\"</span> ],</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/scripts.js\"</span></span>\n    <span class=\"dim-line\">},</span>\n    <span class=\"dim-line\"><span class=\"cm-variable\">vendor</span>: {</span>\n        <span class=\"cm-variable\">options</span>: {\n            <span class=\"cm-variable\">stripBanners</span>: <span class=\"cm-atom\">false</span>\n        },\n        <span class=\"dim-line\"><span class=\"cm-variable\">src</span>: [ <span class=\"cm-string\">\"src/js/vendor/*.js\"</span> ],</span>\n        <span class=\"dim-line\"><span class=\"cm-variable\">dest</span>: <span class=\"cm-string\">\"lib/js/vendor.js\"</span></span>\n    <span class=\"dim-line\">}</span>\n<span class=\"dim-line\">}</span></pre>\n\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">119</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-120 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Putting it all together</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable\">module</span>.<span class=\"cm-property\">exports</span> = <span class=\"cm-keyword\">function</span>( <span class=\"cm-def\">grunt</span> ) {</span>\n    <span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({</span>\n        <span class=\"cm-variable\">concat</span>: {\n            <span class=\"cm-variable\">libs</span>: {\n            <span class=\"dim-line\">},</span>\n            <span class=\"cm-variable\">vendor</span>: {\n            <span class=\"dim-line\">}</span>\n        }\n    <span class=\"dim-line\">});</span>\n<span class=\"dim-line\"></span>\n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"build\"</span>, [ <span class=\"cm-string\">\"concat:libs\"</span>, <span class=\"cm-string\">\"concat:vendor\"</span> ]);\n    <span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"default\"</span>, [ <span class=\"cm-string\">\"build\"</span> ] );\n<span class=\"dim-line\">};</span></pre>\n\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">120</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-121 master-content\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Putting it all together</h1>\n\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\"><span class=\"dim-line\"><span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">initConfig</span>({</span>\n    <span class=\"cm-variable\">concat</span>: {\n        <span class=\"cm-variable\">libs</span>: {\n        <span class=\"dim-line\">},</span>\n        <span class=\"cm-variable\">vendor</span>: {\n        <span class=\"dim-line\">}</span>\n    <span class=\"dim-line\">}</span>\n<span class=\"dim-line\">});</span>\n<span class=\"dim-line\"></span>\n<span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"build\"</span>, [ <span class=\"cm-string\">\"concat:libs\"</span>, <span class=\"cm-string\">\"concat:vendor\"</span> ]);\n<span class=\"cm-variable-2\">grunt</span>.<span class=\"cm-property\">registerTask</span>( <span class=\"cm-string\">\"default\"</span>, [ <span class=\"cm-string\">\"build\"</span> ] );</pre>\n\n\n<pre class=\"CodeMirror CodeMirror-pre-rendered cm-s-blackboard\">~/myproject<span class=\"cm-def\">$ grunt</span> concat\n~/myproject<span class=\"cm-def\">$ grunt</span> build\n~/myproject<span class=\"cm-def\">$ grunt</span></pre>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">121</span>\n\n\t</footer>\n</div>\n\n</div>",
	"<div class=\"slide slide-122 master-content-alt\">\n<div class=\"slide-wrapper \">\n\t\n<h1>Lab #1</h1>\n\n\n<h2>Git and Grunt</h2>\n\n\n<div class=\"slide-content\">\n\t<!-- slide-content -->\n\n<p><em>(All instructions are in the <a href=\"https://github.com/jakerella/training-labs-webdevworkflow/blob/master/LABS.md\" target=\"_blank\">LABS.md</a> file!)</em></p>\n<ol>\n<li><em>Get familiar with <code>git</code></em><ul>\n<li>Clone <a href=\"https://github.com/jakerella/training-labs-webdevworkflow\" target=\"_blank\">the project</a> from Github</li>\n<li>Make some changes, stage, commit, check status, etc</li>\n</ul>\n</li>\n<li><em>Setting up Grunt</em><ul>\n<li>Set up the Node package.json &amp; install dependencies</li>\n<li>Configure Grunt with a copy task</li>\n<li>Commit your changes!</li>\n</ul>\n</li>\n</ol>\n<!-- /slide-content -->\n</div>\n\t<footer>\n\t\t<span class=\"presentation-title\">Web Developer's Workflow</span>\n<span class=\"presentation-pagination\">122</span>\n\n\t</footer>\n</div>\n\n</div>"
];