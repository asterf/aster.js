const [d, $, $$] = [
  document,
  document.querySelector.bind(document),
  document.querySelectorAll.bind(document),
];
HTMLElement.prototype.$ = function (...arg) {
  return this.querySelector(...arg);
};
HTMLElement.prototype.$$ = function (...arg) {
  return this.querySelectorAll(...arg);
};
