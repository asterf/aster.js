globalThis.d=document;
globalThis.$=q=>d.querySelector(q);
globalThis.HTMLElement.prototype.$=function(q){return this.querySelector(q)};
globalThis.HTMLElement.prototype.rm=function(){return this.remove()};
globalThis.parseHTML=function(html){
  const len=html.length,VOIDS={area:1,base:1,br:1,col:1,embed:1,hr:1,img:1,input:1,link:1,meta:1,param:1,source:1,track:1,wbr:1},ENTS={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"},fragment=d.createDocumentFragment();
  let i=0;
  const stack=[{fragment}],decode=s=>s.indexOf('&')===-1?s:s.replace(/&([^;]+);/g,(_,e)=>ENTS[e]||_);
  let current=stack[0];
  while(i<len){
    if(html.charCodeAt(i)===60){
      if(html.charCodeAt(i+1)===47){
        i=html.indexOf('>',i+2)+1;
        stack.shift();
        current=stack[0];
        continue;
      }
      i++;
      let s=i;
      while(i<len){
        const c=html.charCodeAt(i);
        if(c<=32||c===47||c===62)break;
        i++;
      }
      const tag=html.slice(s,i).toLowerCase(),el=d.createElement(tag);
      while(i<len){
        let c=html.charCodeAt(i);
        if(c===62||c===47)break;
        if(c<=32){i++;continue;}
        let ks=i;
        while(i<len){
          c=html.charCodeAt(i);
          if(c===61||c<=32||c===62)break;
          i++;
        }
        const key=html.slice(ks,i);
        if(html.charCodeAt(i)===61){
          i++;
          const q=html.charCodeAt(i);
          if(q===34||q===39){
            i++;let vs=i;i=html.indexOf(q===34?'"':"'",i);
            el.setAttribute(key,decode(html.slice(vs,i)));
            i++;
          }else{
            let vs=i;
            while(i<len&&html.charCodeAt(i)>32&&html.charCodeAt(i)!==62)i++;
            el.setAttribute(key,decode(html.slice(vs,i)));
          }
        }else{el.setAttribute(key,'');}
      }
      const isVoid=VOIDS[tag]||html.charCodeAt(i)===47;
      i=html.indexOf('>',i)+1;
      (current.fragment||current).appendChild(el);
      if(!isVoid){stack.unshift(el);current=el;}
    }else{
      let s=i;i=html.indexOf('<',i);
      if(i===-1)i=len;
      const txt=decode(html.slice(s,i).trim());
      if(txt)(current.fragment||current).appendChild(d.createTextNode(txt));
    }
  }
  const nodes=fragment.childNodes;
  return nodes.length===1?nodes[0]:Array.from(nodes);
};
globalThis.HTMLElement.prototype.add=function(html){
  const node=typeof html==="string"?globalThis.parseHTML(html):html;
  if(Array.isArray(node))this.append(...node);
  else this.append(node);
  return node;
};
globalThis.HTMLElement.prototype.event=function(type,func,...arg){
  this.addEventListener(type,func,...arg);
  return func
}
