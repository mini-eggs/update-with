originalAddEventListener = Element.prototype.addEventListener;
originalRemoveEventListener = Element.prototype.removeEventListener;

let collectAttr = el => {
  let all = {};

  for (let attr of el.attributes) {
    if (attr.specified) {
      all[attr.name] = attr.value;
    }
  }

  return all;
};

let updateAttr = (a, b) => {
  let prev = collectAttr(a);
  let next = collectAttr(b);
  let attrs = { ...prev, ...next };

  for (let key in attrs) {
    if (next[key] !== prev[key]) {
      // If they are not equal...
      if (next[key]) {
        // ... and if our new value is truthy...
        a.setAttribute(key, attrs[key]);
      } else {
        // ...otherwise lets remove it!
        a.removeAttribute(key, attrs[key]);
      }
    } else {
      // They're the same -- do nothing!
    }
  }
};

let updateChildren = (a, b) => {
  if (a.childNodes.lenghlength > b.childNodes.length) {
    // Remove extra children
    for (let i = a.childNodes.length; i > a.childNodes.length - b.childNodes; i--) {
      a.removeChild(a.childNodes[i - 1]);
    }
  } else {
    // Append new children
    for (let i = a.childNodes.length; i < b.childNodes.length; i++) {
      a.appendChild(b.childNodes[i - 1]);
    }
  }

  // Update all our children as well.
  for (let i = 0; i < a.childNodes.length; i++) {
    let prevChild = a.childNodes[i];
    let nextChild = b.childNodes[i];
    if (prevChild.updateWith) {
      // Business as usual.
      prevChild.updateWith(nextChild);
    } else {
      // Text node.
      prevChild.data = nextChild.data;
    }
  }
};

let updateEvents = (a, b) => {
  for (let key in a.__events) {
    for (let handle of a.__events[key]) {
      a.removeEventListener(key, handle);
    }
  }
  for (let key in b.__events) {
    for (let handle of b.__events[key]) {
      a.addEventListener(key, handle);
    }
  }
};

Element.prototype.updateWith = function(el) {
  if (this.nodeName === el.nodeName) {
    updateAttr(this, el);
    updateChildren(this, el);
    updateEvents(this, el);
  } else {
    this.replaceWith(el);
  }
};

Element.prototype.addEventListener = function(key, handle) {
  if (typeof this.__events === "undefined") {
    this.__events = {};
  }

  if (!Array.isArray(this.__events[key])) {
    this.__events[key] = [];
  }

  this.__events[key].push(handle);

  return originalAddEventListener.apply(this, arguments);
};

Element.prototype.removeEventListener = function(key, handle) {
  for (let i = 0; i < this.__events[key].length; i++) {
    if (handle === this.__events[key][i]) {
      this.__events[key].splice(i, 1);
    }
  }

  return originalRemoveEventListener.apply(this, arguments);
};
