// JS Finite State Machine
// 
// A simple finite state machine library for code flow and transition control.
// 
// Copyright (c)2011 Jo Hund, ClearCove Software Inc.
// Based originally on FSM by Anthony Blackshaw <ant@getme.co.uk> (www.getme.co.uk) Copyright (c)2008


// Initializes a new state machine.
// Usage: var fsm = new FSM("initial", { d1: "foo", d2: "bar" });
// 
// param [String] initial_state the initial state of the state machine
// param [Object, optional] data data specific to this state machine. Is available as this.data in
//   callbacks
function FSM(initial_state, data) {
    this.state_transitions = {};
    this.state_transitions_from_any_state = {};
    this.default_transition = null;
    this.current_state = initial_state;
    this.data = data;
};


// Specify a "specific" transition for given events and current_states.
// 
// param [String, Array<String>] events the event(s) that trigger the transition.
// param [String, Array<String>] current_states the state(s) that respond to the given event
// param [Function, null] callback the callback will be called before the transition happens
// param [String] next_state the state after the transition
FSM.prototype.add_transition = function(events, current_states, callback, next_state) {
  if(typeof(events) === 'string') { events = [events] }
  if(typeof(current_states) === 'string') { current_states = [current_states] }
  for (var i = 0; i < events.length; i++) {
    for (var j = 0; j < current_states.length; j++) {
      this.state_transitions[ [events[i], current_states[i]] ] = [callback, next_state];
    }
  }
};


// Specify a "from any state" transition. This is applied if no specific transition is
// found for the current_state and event given
// 
// param [String, Array<String>] events the event(s) that trigger the transition.
// param [Function, null] callback the callback will be called before the transition happens
// param [String] next_state the state after the transition
FSM.prototype.add_transition_from_any_state = function(events, callback, next_state) {
  if(typeof(events) === 'string') { events = [events] }
  for (var i = 0; i < events.length; i++) {
    this.state_transitions_from_any_state[ events[i] ] = [callback, next_state];
  }
};


// Specify a "default" transition. This is applied if no other matching transition is
// found for the current_state and given event
// 
// param [Function, null] callback the callback(s) will be called before the transition happens
// param [String] next_state the state after the transition
FSM.prototype.set_default_transition = function(callback, next_state) {
  this.default_transition = [callback, next_state];
};


// Get the transition for the current_state and event given.
// Based on the current state and the event given, the state machine applies the first matching
// transition in the following order:
// * "specific" (for given current_state and event)
// * "from any state" (for given event)
// * "default" (if no matching transitions are found by now)
//
// param [String] event the event
// param [String] state the state
FSM.prototype.get_transition = function(event, state) {
  var r;
  if (r = this.state_transitions[[event, state]]) {
    return r;
  } else if (r = this.state_transitions_from_any_state[event]) {
    return r;
  } else if (r = this.default_transition) {
    return r;
  } else {
    throw Error(
    "Transition is undefined: (" + event + ", " + state + ")"
    );
  };
};


// Send an event to the state machine to trigger a transition.
// 
// param [String] event the event to send to the state machine
// param [Object, optional] event_data data specific for this event. Available as event_data in
//   callback
FSM.prototype.send = function(event, event_data) {
  var result = this.get_transition(event, this.current_state);
  this.action = result[0]; // get the callback
  if (this.action) {
    this.action.call(this, event_data); // call callback in state_machine context
  }
  this.current_state = result[1]; // set new state
};
