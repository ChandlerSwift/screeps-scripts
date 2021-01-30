fs = require("fs");

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'chandler+screeps@chandlerswift.com',
                token: fs.readFileSync(__dirname + '/.token', 'utf8').trim(),
                branch: 'default',
            },
            dist: {
                src: ['src/*.js'] // If we add a build step, this could be dist/
            }
        }
    });
}
