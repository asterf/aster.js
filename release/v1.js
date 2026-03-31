globalThis.d=document;
globalThis.$=query=>d.querySelector(query);
globalThis.HTMLElement.prototype.rm=function(){return this.remove()};
globalThis.parseHTML=function(html) {
  const len = html.length;
  const VOIDS = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 };
  const ENTS = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  let i = 0;
  const root = { tag: 'root', attrs: {}, children: [] };
  const stack = [root];
  let current = root;
  const decode = (s) => {
    if (s.indexOf('&') === -1) return s;
    return s.replace(/&([^;]+);/g, (_, e) => ENTS[e] || _);
  };
  while (i < len) {
    const startIdx = i;
    if (html.charCodeAt(i) === 60) {
      if (html.charCodeAt(i + 1) === 47) {
        i = html.indexOf('>', i + 2) + 1;
        stack.shift();
        current = stack[0];
        continue;
      }
      i++;
      let s = i;
      while (i < len) {
        const c = html.charCodeAt(i);
        if (c <= 32 || c === 47 || c === 62) break;
        i++;
      }
      const tag = html.slice(s, i).toLowerCase();
      const el = { tag, attrs: {}, children: [] };
      while (i < len) {
        let c = html.charCodeAt(i);
        if (c === 62 || c === 47) break;
        if (c <= 32) { i++; continue; }
        let ks = i;
        while (i < len) {
          c = html.charCodeAt(i);
          if (c === 61 || c <= 32 || c === 62) break;
          i++;
        }
        const key = html.slice(ks, i);
        if (html.charCodeAt(i) === 61) {
          i++;
          const q = html.charCodeAt(i);
          if (q === 34 || q === 39) {
            i++;
            let vs = i;
            i = html.indexOf(q === 34 ? '"' : "'", i);
            el.attrs[key] = decode(html.slice(vs, i));
            i++;
          } else {
            let vs = i;
            while (i < len && html.charCodeAt(i) > 32 && html.charCodeAt(i) !== 62) i++;
            el.attrs[key] = decode(html.slice(vs, i));
          }
        } else {
          el.attrs[key] = true;
        }
      }
      const isVoid = VOIDS[tag] || html.charCodeAt(i) === 47;
      i = html.indexOf('>', i) + 1;
      current.children.push(el);
      if (!isVoid) {
        stack.unshift(el);
        current = el;
      }
    } else {
      let s = i;
      i = html.indexOf('<', i);
      if (i === -1) i = len;
      const txt = html.slice(s, i).trim();
      if (txt) current.children.push({ type: 'text', value: decode(txt) });
    }
  }
  return root.children;
};
globalThis.HTMLElement.prototype.add=function(html){
	if ( html instanceof HTMLElement ) {
		this.appendChild(html);
	} else if ( typeof html === "string" ) {
		html = globalThis.parseHTML(html);
		this.appendChild(html);
	}
	return html;
}
