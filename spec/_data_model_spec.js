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
    var my_model = new DataModel('my_model');
    
    expect(my_model.id).toBe('my_model');
  });
  
  it('takes an object of properties that contain a value and element selector to bind to', function () {
    var my_model = new DataModel('my_model', {
      my_property: '[data-my-property]',
      my_property_2: '[data-my-property-2]',
      my_property_3: '[data-my-property-3]'
    });
    
    my_model.my_property = 'my value';
    my_model.my_property_3 = 'my value 3';
    
    expect(my_model.my_property).toBe('my value');
    expect(my_model.my_property_selector).toBe('[data-my-property]');
    expect(my_model.my_property_2).toBe(undefined);
    expect(my_model.my_property_2_selector).toBe('[data-my-property-2]');
    
    expect($('[data-my-property]').html()).toBe('my value');
    expect($('[data-my-property-3]').val()).toBe('my value 3');
  });
  
});