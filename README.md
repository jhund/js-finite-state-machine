JS Finite State Machine
====

This library implements a simple Javascript Finite State Machine. I use it e.g. to manage a fairly
complex HTML form with a number of view states.


Features
----

* 3 types of transitions: "specific", "from any state", "default"
* transition callbacks
* event/context specific data (passed to transition callback)
* debug mode
* no runtime dependencies
* works great with jQuery, etc.
* complete unit test coverage (using qunit)


Example
----

This [finite state machine](http://en.wikipedia.org/wiki/Finite-state_machine) implements a simple
stop watch that can be powered on/off, reset, started and stopped.

    // Initialize FSM with initial state and instance specific data
    var fsm = new FSM("Power Off", { name: "Jo's Stop Watch", display: "blank" });


    // "specific" transitions

    // API: fsm.addTransition(events, currentStates, callback, nextState)

    // This is a transitional state. As soon as fsm enters "Power On", it sends itself the
    // "Press Reset Button" event and transitions to the "Reset state"
    fsm.addTransition(
      "Press Power Button",
      "Power Off",
      function() { this.sendEvent("Press Reset Button"); },
      "Power On"
    );
    // This transition handles the same event for two different current states
    fsm.addTransition(
      "Press Reset Button",
      ["Power On", "Stopped"],
      function() { this.data.display = "00:00:00"; },
      "Reset"
    );
    fsm.addTransition(
      "Press Start/Stop Button",
      ["Reset", "Stopped"],
      function(){ this.data.display = "00:01:RR"; },
      "Running"
    );
    fsm.addTransition(
      "Press Start/Stop Button",
      "Running",
      function(){ this.data.display = "00:03:34"; },
      "Stopped"
    );


    // "from any state" transitions

    // We already specified a transition for "Press Power Button" event on "Power Off" current
    // state above. This specification here handles the same event for all other current states.
    fsm.addTransitionFromAnyState(
      "Press Power Button",
      function() { this.data.display = "blank"; },
      "Power Off"
    );
    // Handles two different events on any state. We specify these only to avoid the
    // "Transition is undefined" error.
    // Don't provide next state, so that nothing changes (loopback)
    fsm.addTransitionFromAnyState(
      ["Press Start/Stop Button", "Press Reset Button"],
      null
    );

Once the fsm is initialized, you can start using it:

    fsm.sendEvent("Press Power Button"); // Power it on
    fsm.currentState // "Reset"
    fsm.data.display // "00:00:00"

    fsm.sendEvent("Press Start/Stop Button"); // Start timer
    fsm.currentState // "Running"
    fsm.data.display // "00:01:RR"

    fsm.sendEvent("Press Start/Stop Button"); // Stop timer
    fsm.currentState // "Stopped"
    fsm.data.display // "00:03:34"

    fsm.sendEvent("Press Start/Stop Button"); // Restart timer
    fsm.currentState // "Running"
    fsm.data.display // "00:01:RR"

    fsm.sendEvent("Press Start/Stop Button"); // Stop timer
    fsm.currentState // "Stopped"
    fsm.data.display // "00:03:34"

    fsm.sendEvent("Press Reset Button"); // Reset timer
    fsm.currentState // "Reset"
    fsm.data.display // "00:00:00"

    fsm.sendEvent("Press Power Button"); // Power it off
    fsm.currentState // "Power Off"
    fsm.data.display // "blank"


How To Use It
----

1. Include the "js-finite-state-machine.js" library in your HTML page.
2. Initialize as many state machines as you need.
3. Send events to the state machine, e.g. based on user actions (via event observers).
4. Let the state machine handle your view states: Show and hide form elements, reset elements, etc.


Concepts
----

* FSM: a [finite state machine](http://en.wikipedia.org/wiki/Finite-state_machine). You can have
  multiple FMSs at the same time. Just instantiate each one with var f = new FSM(...).
* State: The FSM is in one state at a time. You get it via f.currentState as string.
* Event: You can send an event to your FSM to trigger a state transition: f.sendEvent("Event Name"). If
  you have specified a transition for the given event and current state, the FSM will perform a
  successful transition. Otherwise it will throw a "Transition is undefined" error.
* Transition: Given a currentState and an event, your FSM will transition according to the
  specified transitions.
* Callback: For each transition, you can specify a callback that is executed during a transition
  (after currentState was changed to new state).
* Current State: The state before a transition.
* New State: The state after a transition.
* Initial State: The FSM's start state when it comes into existence.


Types of transitions
----

There are three types of transitions:

1. "specific" - for specific currentStates and events
2. "from any state" - for specific events, applicable to any currentState
3. "default" - one transition that is applied if no matching "specific" or "from any state"
   transitions are found

When you send an event to the FSM, it tries to find a matching transition. It looks in the following
order:

1. "specific"
2. "from any state"
3. "default"

And it will apply the first transition it finds. If it cannot find a matching transition, it throws
a "Transition is undefined" error.


JS Finite State Machine is Copyright (c) 2011 by Jo Hund, ClearCove Software Inc.
JS Finite State Machine is licensed under the MIT license.
