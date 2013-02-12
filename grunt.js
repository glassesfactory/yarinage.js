module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffeelintOptions: {
      max_line_length : {
        "value": 120,
        "level" : "warn"
      }
    },
    coffeelint: {
      product: ['src/coffee/*.coffee']
    },
    coffee:{
      product:{
        src:'src/coffee/*.coffee', dest:'src/js/'
      },
      example:{
        src:'example/coffee/*.coffee', dest:'example/assets/js/'
      },
      test:{
        src:'test/spec/*.coffee', dest:'test/spec/'
      }
    },
    min: {
      yarinage: {
        src:['src/js/yarinage.js'],
        dest:'src/js/yarinage.min.js'
      }
    },
    reload: {
      port: 35729,
      proxy: {
          host: 'localhost'
      },
      liveReload: {}
    },
    watch: {
      product: {
        files: ['src/coffee/*.coffee'],
        tasks: 'coffeelint:product coffee:product min jasmine'
      },
      example: {
        files: ['example/coffee/*.coffee'],
        tasks: 'coffee:example'
      },
      test: {
        files: ['test/spec/*.coffee'],
        tasks: 'coffee:test jasmine'
      }
    },
    docco: {
      yarinage: {
        src: ['src/coffee/yarinage.coffee'],
        dest: 'docs/'
      }
    },
    jasmine : {
      src : ['test/lib/*.js', 'test/src/*.js'],
      specs : 'test/spec/*.js'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {
        jasmine : false,
        describe : false,
        beforeEach : false,
        expect : false,
        it : false,
        spyOn : false
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('default', 'coffeelint coffee min docco jasmine');
  grunt.registerTask('ci', 'coffeelint coffee jasmine');

};
