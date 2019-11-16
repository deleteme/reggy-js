import { render, html } from 'https://cdn.jsdelivr.net/npm/lit-html@1.1.2';
const regExpElement = document.querySelector("textarea[name=regexp]");
const testStringElement = document.querySelector("textarea[name=test-string]");
const previewElement = document.getElementById("preview");

const render1 = () => {
  try {
    const regexp = new RegExp(regExpElement.value.trim());
    console.log(regexp);
    const testString = testStringElement.value;
    const match = testString.match(regexp);
    console.log("match:", match);
    if (match) {
      const formatted = testString.replace(
        [...new Set(match)],
        `<span class='match'>$&</span>`
      );

      previewElement.innerHTML = formatted;
    } else {
      previewElement.innerHTML = testString;
    }
    document.body.classList.toggle("has-error", false);
  } catch (error) {
    document.body.classList.toggle("has-error", true);
    previewElement.innerHTML = `<span class="syntax-error">${error}</span>`;
  }
};

[regExpElement, testStringElement].forEach(element => {
  ["change", "keyup", "keydown"].forEach(type => {
    element.addEventListener(type, render1);
  });
});

render1();