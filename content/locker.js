class safeLock {
  static #lockingElements = [];
  /**
   *
   * @param {Boolean|number} lock
   * @param  {...HTMLElement} elements
   * @returns number
   * using return number to first arg when unlock the elements
   * @example
   * const unlock = locker(true, element1, element2)
   * setTimeout(()=>{
   *   locker(unlock);
   * },1000)
   * @returns number|undefined
   * returns undefined when removed the lock.
   */
  static locker(lock, ...elements) {
    let index = null;
    let isLock = lock;
    if (typeof lock === "number" && lock >= 0) {
      if (safeLock.#lockingElements?.[lock]) {
        elements = safeLock.#lockingElements[lock];
        safeLock.#lockingElements[lock] = null;
      } else {
        elements = [];
      }
      isLock = false;
    } else if (typeof lock === "boolean" && lock) {
      index = safeLock.#lockingElements.push(elements) - 1;
    }
    for (let element of elements) {
      element?.classList?.toggle?.("lock", isLock);
      isLock
        ? element?.setAttribute?.("disabled", true)
        : element?.removeAttribute?.("disabled");
    }
    return index;
  }
};
