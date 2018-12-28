require("browser-env")();

require("../");

let createElement = require("ogle-tr-122b");
let test = require("ava");

let get = (el, key) => {
  for (let attr of el.attributes) {
    if (attr.specified && attr.name === key) {
      return attr.value;
    }
  }
};

test("Attr update.", t => {
  let one = createElement("div").setAttribute("class", "container-1");
  let two = createElement("div").setAttribute("class", "container-2");
  one.updateWith(two);
  t.deepEqual(get(one, "class"), "container-2");
});

test("Event update.", t => {
  let clickCount = 0;

  let handleClickOne = () => {
    clickCount++;
  };

  let handleClickTwo = () => {
    clickCount += 10;
  };

  let one = createElement("button").addEventListener("click", handleClickOne);
  let two = createElement("button").addEventListener("click", handleClickTwo);

  one.click();
  one.click();
  one.click();

  one.updateWith(two);

  one.click();
  one.click();
  one.click();

  t.deepEqual(clickCount, 33);
});

test("Children update.", t => {
  let clickCount = 0;

  let handleClickOne = () => {
    clickCount++;
  };

  let handleClickTwo = () => {
    clickCount += 10;
  };

  let one = createElement("div")
    .setAttribute("class", "container-1")
    .appendChild(
      createElement("button")
        .setAttribute("class", "button-1")
        .addEventListener("click", handleClickOne)
    );

  let two = createElement("div")
    .setAttribute("class", "container-2")
    .appendChild(
      createElement("button")
        .setAttribute("class", "button-2")
        .addEventListener("click", handleClickTwo)
    );

  one.firstChild.click();
  one.firstChild.click();
  one.firstChild.click();

  one.updateWith(two);

  one.firstChild.click();
  one.firstChild.click();
  one.firstChild.click();

  t.deepEqual(clickCount, 33);
  t.deepEqual(get(one, "class"), "container-2");
  t.deepEqual(get(one.firstChild, "class"), "button-2");
});
