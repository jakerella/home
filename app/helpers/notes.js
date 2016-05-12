
var path = require('path'),
    jade = require('jade');

module.exports = function(site) {

    return function process(req, res) {
        console.log(req.params.bin);
        res.end(jade.renderFile(path.join(site.templateDir, 'notes.jade'), { bin: req.params.bin }));
    };

};
