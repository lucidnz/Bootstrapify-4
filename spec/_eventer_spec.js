/* jslint node: true */
/* global describe, it, expect */

var Eventer = require('../src/js/_eventer.js');

describe('Eventer', function () {
  
  it('turns a class into an eventing object', function (){
    var Moose = function () {
      new Eventer(this);
    };
    var moose = new Moose();
    
    expect(typeof moose.on).toBe('function');
    expect(typeof moose.off).toBe('function');
    expect(typeof moose.trigger).toBe('function');
  });
  
  it('does eventy stuff', function () {
    var monkey = '';
    var Moose = function () {
      new Eventer(this);
    };
    Moose.prototype.trigger_roar = function () {
      args = ['hello moose'];
      this.trigger('roar', args);
    };
    var moose = new Moose();
    
    moose.on('roar', function(str){
      monkey = str;
    });
    
    spyOn(moose, 'trigger').and.callThrough();
    
    moose.trigger_roar();
    
    expect(moose.trigger).toHaveBeenCalled();
    expect(monkey).toBe('hello moose');
  });
  
});