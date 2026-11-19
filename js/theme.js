(() => {
 "use strict";
 const KEY="fery90game-theme",root=document.documentElement;
 const valid=t=>t==="light"||t==="dark";
 let saved=null;try{saved=localStorage.getItem(KEY)}catch(_){}
 const system=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
 function apply(theme){
  const selected=valid(theme)?theme:"dark";
  root.dataset.theme=selected;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute("content",selected==="light"?"#f7fff9":"#08070d");
  const button=document.querySelector(".theme-toggle");
  if(button){
   const light=selected==="light";
   button.innerHTML='<span class="theme-toggle-icon" aria-hidden="true">'+(light?"☀️":"🌙")+'</span><span>'+(light?"تم روشن":"تم تاریک")+'</span>';
   button.setAttribute("aria-label",light?"تغییر به تم تاریک":"تغییر به تم روشن");
   button.setAttribute("aria-pressed",String(light));
   button.title=light?"تغییر به تم تاریک":"تغییر به تم روشن";
  }
 }
 apply(valid(saved)?saved:system);
 function mount(){
  if(document.querySelector(".theme-toggle")){apply(root.dataset.theme);return;}
  const host=document.querySelector(".header-inner,.products-header-inner,.about-header-inner,.about-header,.topbar,.pong-header-inner,.pong-header");
  if(!host)return;
  const button=document.createElement("button");
  button.type="button";button.className="theme-toggle";button.dataset.themeControl="true";
  button.addEventListener("click",()=>{
   const next=root.dataset.theme==="light"?"dark":"light";
   try{localStorage.setItem(KEY,next)}catch(_){}
   apply(next);
  });
  host.appendChild(button);apply(root.dataset.theme);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
 if(window.matchMedia){
  const media=window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener?.("change",event=>{
   let preference=null;try{preference=localStorage.getItem(KEY)}catch(_){}
   if(!valid(preference))apply(event.matches?"light":"dark");
  });
 }
})();