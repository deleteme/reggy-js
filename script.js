/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
const regExpElement = document.querySelector('textarea[name=regexp]');
const testStringElement = document.querySelector('textarea[name=test-string]');
const previewElement = document.getElementById('preview');

const render = () => {
  const regexp = new RegExp(regExpElement.innerHTML.trim());
  console.log(regexp);
  const testString = testStringElement.innerHTML;
  const match = testString.match(regexp);
  console.log('match:', match);
  const index = regexp.search(testString);
  previewElement.innerHTML = match;
}

regExpElement.addEventListener('change', () => {
  render();
});
regExpElement.addEventListener('keyup', () => {
  render();
});
testStringElement.addEventListener('change', () => {
  render();
});
testStringElement.addEventListener('keyup', () => {
  render();
});

render();