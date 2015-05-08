/* jslint node: true */
/* global describe, it, expect */

var fs = require('fs');
var cheerio = require('cheerio');
var DataModel = require('../src/js/_data_model.js');

describe('DataModel', function () {
  
  beforeEach(function () {
    var fixture = fs.readFileSync('./spec/fixtures/my_fixture.html');
    $ = cheerio.load(fixture);
  });
  
  it('takes a string as an id', function () {
    var my_model = new DataModel('my model');
    
    expect(my_model.id).toBe('my model');
  });
  
  it('takes an object of properties that contain a value and element selector to bind to', function () {
    var my_model = new DataModel('my model', {
      my_property: {
        value: 'my value',
        selector: '[data-my-property]'
      },
      my_property_2: {
        value: null,
        selector: '[data-my-property-2]'
      }
    });
    
    expect($('#my-fixture').html()).toBe('some complex content here');
    console.log($('#my-fixture').html());
    
    
/*
    expect(my_model.id).toBe('my model');
    
    expect(my_model.my_property).toBe('my value');
    expect(my_model.my_property_selector).toBe('[data-my-property]');
    
    expect(my_model.my_property_2).toBe(null);
    expect(my_model.my_property_selector).toBe('[data-my-property]');
*/
    
  });
  
});