// JS Finite State Machine
//
// A simple finite state machine library for code flow and transition control.
//
// https://github.com/jhund/js-finite-state-machine
// Copyright (c)2011 Jo Hund, ClearCove Software Inc.
// Based originally on FSM by Anthony Blackshaw <ant@getme.co.uk> (www.getme.co.uk) Copyright (c)2008


// Initializes a new state machine.
// Usage: var fsm = new FSM("initial", { d1: "foo", d2: "bar" });
//
// param [String] initialState the initial state of the state machine
// param [Object, optional] data data specific to this state machine. Is available as this.data in
//   callbacks
function FSM(initialState, data) {
    this.stateTransitions = {};
    this.stateTransitionsFromAnyState = {};
    this.defaultTransition = null;
    this.currentState = initialState;
    this.data = data;
    this.debug = true; // set to true to turn on console output for debugging (see function "sendEvent")
};


// Specify a "specific" transition for given events and currentStates.
//
// param [String, Array<String>] events the event(s) that trigger the transition.
// param [String, Array<String>] currentStates the state(s) that respond to the given event
// param [Function, null] callback the callback will be called before the transition happens
// param [String] nextState the state after the transition
FSM.prototype.addTransition = function(events, currentStates, callback, nextState) {
  if(typeof(events) === 'string') { events = [events]; }
  if(typeof(currentStates) === 'string') { currentStates = [currentStates]; }
  for (var i = 0; i < events.length; i++) {
    for (var j = 0; j < currentStates.length; j++) {
      if (!nextState) { nextState = currentStates[j]; } // stay in state if no nextState given
      this.stateTransitions[ [events[i], currentStates[j]] ] = [callback, nextState];
    }
  }
};


// Specify a "from any state" transition. This is applied if no specific transition is
// found for the currentState and event given
//
// param [String, Array<String>] events the event(s) that trigger the transition.
// param [Function, null] callback the callback will be called before the transition happens
// param [String] nextState the state after the transition
FSM.prototype.addTransitionFromAnyState = function(events, callback, nextState) {
  if(typeof(events) === 'string') { events = [events]; }
  for (var i = 0; i < events.length; i++) {
    this.stateTransitionsFromAnyState[ events[i] ] = [callback, nextState];
  }
};


// Specify a "default" transition. This is applied if no other matching transition is
// found for the currentState and given event
//
// param [Function, null] callback the callback(s) will be called before the transition happens
// param [String] nextState the state after the transition
FSM.prototype.setDefaultTransition = function(callback, nextState) {
  this.defaultTransition = [callback, nextState];
};


// Get the transition for the currentState and event given.
// Based on the current state and the event given, the state machine applies the first matching
// transition in the following order:
// * "specific" (for given currentState and event)
// * "from any state" (for given event)
// * "default" (if no matching transitions are found by now)
//
// param [String] event the event
// param [String] state the state
// return [Transition] the matching transition. [Callback, NextState]
FSM.prototype.getTransition = function(event, state) {
  var r;
  r = this.stateTransitions[[event, state]] || // first try "specific"
      this.stateTransitionsFromAnyState[event] || // then try "from any state"
      this.defaultTransition // lastly try default transition
  if (r) {
    // return [callback, newState] tuple. Stay in currentState if no nextState given
    return [r[0], r[1] || this.currentState]
  } else {
    throw Error("Transition is undefined: (" + event + ", " + state + ")");
  }
};


// Send an event to the state machine to trigger a transition.
//
// param [String] event the event to send to the state machine
// param [Object, optional] eventData data specific for this event. Available as eventData in
//   callback
FSM.prototype.sendEvent = function(event, eventData) {
  var result = this.getTransition(event, this.currentState),
      currentState = this.currentState,
      newState,
      callback,
      debugMsg;
  newState = result[1];
  callback = result[0];

  if (this.debug && window.console && window.console.log) {
    debugMsg = [];
    if (this.data.name) {
      debugMsg.push(this.data.name + ': ');
    } else {
      debugMsg.push('FSM: ');
    }
    debugMsg.push(event + ': ');
    debugMsg.push(currentState + ' -> ' + newState);
    if (eventData) { debugMsg.push('; with event data'); }
    if (callback) { debugMsg.push('; with callback'); }
    window.console.log(debugMsg.join(''));
  };

  this.currentState = newState;
  this.action = callback;
  if (callback) {
    callback.call(this, eventData); // call callback in state_machine context
  }

};
