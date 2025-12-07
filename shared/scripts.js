(function(window){
  window.onReady = function(cb){
    if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(cb,1);
    else document.addEventListener('DOMContentLoaded', cb);
  };
  window.el = function(id){ return document.getElementById(id); };
  window.q = function(sel, root=document){ return root.querySelector(sel); };
  window.waitFor = function(selector, timeout=7000){ return new Promise((resolve,reject)=>{ const start=Date.now(); function tick(){ const e=document.querySelector(selector); if(e) return resolve(e); if(Date.now()-start>timeout) return reject(new Error('timeout:'+selector)); requestAnimationFrame(tick);} tick(); }); };
  window.makeDownloadFile = function(name, text){ const b=new Blob([text],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href); };
  console.log('shared helpers ready');
})(window);
