// JSX definitie
const jobs = <a href='marlon.be/nl-be/jobs/javascript-developer'>We're hiring!</a>;

// Vertaald door Babel:
var jobs = React.createElement(
  "a",
  { href: "marlon.be/nl-be/jobs/javascript-developer" },
  "We're hiring!"
);

// React.createElement geeft een Object terug:
console.log(jobs);
// {
//   type: "a",
//   key: null,
//   ref: null,
//   props: {
//      href: "marlon.be/nl-be/jobs/javascript-developer",
//      children: "We're hiring!"
//   },
//   _owner: null,
//   _store: {},
// }

// Conclusies:
// - 1e argument = DOM node type ('a')
// - 2e argument = alle props die je doorgeeft (href)
// - 3e argument = children ("We're hiring!")
// - children wordt uiteindelijk als prop toegevoegd aan het resulterend object
// - children kan dus in principe ook als prop gedefinieerd worden:

// Dus: 4 manieren om hetzelfde resultaat te krijgen:
ui = <div id="root">Hello world</div>;
ui = <div id="root" children="Hello world" />;
ui = React.createElement('div', {id: 'root', children: 'Hello world'});
ui = React.createElement('div', {id: 'root'}, 'Hello world');
