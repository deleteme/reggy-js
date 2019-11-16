/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
const regExpElement = document.querySelector("textarea[name=regexp]");
const testStringElement = document.querySelector("textarea[name=test-string]");
const previewElement = document.getElementById("preview");

const render = () => {
  console.log("regexp str", regExpElement.value.trim());
  try {
    const regexp = new RegExp(regExpElement.value.trim());
    console.log(regexp);
    const testString = testStringElement.value;
    const match = testString.match(regexp);
    console.log("match:", match);
    if (match) {
      const index = testString.search(match);

      console.log(index);

      let output = "";
      for (let count = match.length, i = 0; i < count; i++) {
        const fragment = match[i];
        testString.replace(fragment, `<span class='match'>${fragment}</span>`);
      }

      const formatted = testString.replace(
        match,
        `<span class='match'>$&</span>`
      );

      console.log(formatted);
      previewElement.innerHTML = formatted;
    } else {
      previewElement.innerHTML = testString;
    }
    document.body.classList.toggle("has-error", false);
  } catch (error) {
    document.body.classList.toggle("has-error", true);
    previewElement.innerHTML = error;
  }
};

[regExpElement, testStringElement].forEach(element => {
  ["change", "keyup", "keydown"].forEach(type => {
    element.addEventListener(type, render);
  });
});

render();
