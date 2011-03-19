# JS Finite State Machine

I love state machines. Just built a fairly complex form with a number of view states. After a short search, I was surprised that I didn't find a simple JS State Machine that worked for what I needed.

Well, here it is. It's based on xxx. I fixed some bugs and polished it a bit, changed some method names, the constructor....

The code is as it would be compiled by coffeescript.

Usage:

    var form_state = new FSM("initial", { name: "form" });
    
    form_state.add_transition(
      "activate",
      "initial",
      function() { console.log(this.data.name + " entering active state (" + event_data + ")"); },
      "active"
    );
    form_state.add_transition(
      "deactivate",
      ["initial", "active"],
      function() { console.log(this.data.name + " entering inactive state (" + event_data + ")"); },
      "inactive"
    );
    
    form_state.current_state; // => "initial"
    form_state.send("activate", 42); // => console: "form entering active state (42)"
    form_state.current_state; // => "active"
    form_state.send("deactivate", "foo"); // => console: "form entering inactive state ("foo")"
    form_state.current_state; // => "inactive"


JS Finite State Machine is Copyright (c) 2011 by Jo Hund, ClearCove Software Inc.
JS Finite State Machine is licensed under the MIT license.
