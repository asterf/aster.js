globalThis.d=document;
globalThis.$=query=>d.querySelector(query);
globalThis.HTMLElement.prototype.rm=function(){return this.remove()};
