"use strict";
document.addEventListener("DOMContentLoaded", () => {
 const menuButton=document.getElementById("mobileMenuButton");
 const navigation=document.getElementById("mainNavigation");
 const searchInput=document.getElementById("siteSearch");
 const searchButton=document.getElementById("searchButton");
 const searchHint=document.getElementById("searchHint");
 const searchResults=document.getElementById("globalSearchResults");
 const currentYear=document.getElementById("currentYear");
 if(currentYear) currentYear.textContent=new Date().getFullYear();
 if(menuButton && navigation){
  menuButton.addEventListener("click",()=>{const opened=navigation.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(opened));menuButton.setAttribute("aria-label",opened?"بستن منو":"باز کردن منو");});
  navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","باز کردن منو");}));
  window.addEventListener("resize",()=>{if(window.innerWidth>760){navigation.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","باز کردن منو");}});
 }
 if(!searchInput || !searchResults) return;
 const appScript=document.querySelector('script[src*="js/app.js"]');\n const rootUrl=new URL("../",appScript ? appScript.src : window.location.href);
 const pages=[
  {path:"pages/gaming.html",type:"بازی و گیمینگ",selectors:[".gaming-game-card",".gaming-category-card"]},
  {path:"pages/tools.html",type:"ابزار",selectors:[".tools-main-section",".tools-shortcut"]},
  {path:"pages/content.html",type:"ویدیو و محتوا",selectors:[".content-video-card"]},
  {path:"pages/products.html",type:"محصول",selectors:[".product-card"]},
  {path:"pages/about.html",type:"درباره سایت",selectors:[".about-feature-card"]}
 ];
 const normalize=value=>String(value||"").toLocaleLowerCase("fa").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u200c\u200e\u200f]/g," ").replace(/\s+/g," ").trim();
 let indexPromise;
 function addEntry(entries,element,page,type){
  const heading=element.querySelector("h1,h2,h3,h4,strong");
  const title=(heading?.textContent||element.textContent||"").trim().replace(/\s+/g," ");
  if(!title||title.length<2)return;
  const link=element.matches("a[href]")?element:element.querySelector("a[href]");
  let href=link?.getAttribute("href")||"";
  if(!href||href.startsWith("javascript:")){const targetId=element.id||element.closest("[id]")?.id;href=targetId?page.path+"#"+targetId:page.path;}
  else if(page.path==="pages/content.html")href=new URL("pages/content.html#content-library",rootUrl).href;\n  else href=new URL(href,new URL(page.path,rootUrl)).href;
  const description=(element.querySelector("p")?.textContent||"").trim().replace(/\s+/g," ").slice(0,150);
  entries.push({title:title.slice(0,100),description,type,href,searchText:normalize(element.textContent+" "+(element.dataset.search||""))});
 }
 function loadIndex(){
  if(indexPromise)return indexPromise;
  indexPromise=Promise.all(pages.map(async page=>{try{const response=await fetch(new URL(page.path,rootUrl));if(!response.ok)throw new Error("HTTP "+response.status);const doc=new DOMParser().parseFromString(await response.text(),"text/html");const entries=[];page.selectors.forEach(selector=>doc.querySelectorAll(selector).forEach(element=>addEntry(entries,element,page,page.type)));return entries;}catch(error){console.warn("Search index unavailable:",page.path,error);return [];}})).then(groups=>groups.flat());
  return indexPromise;
 }
 function resultCard(item){const link=document.createElement("a");link.className="global-search-result";link.href=item.href;const title=document.createElement("strong");title.textContent=item.title;const type=document.createElement("span");type.className="global-search-result-type";type.textContent=item.type;link.append(title,type);if(item.description){const p=document.createElement("p");p.textContent=item.description;link.append(p);}return link;}
 async function performSearch(scroll){
  const query=normalize(searchInput.value);searchResults.replaceChildren();
  if(!query){searchResults.hidden=true;searchHint.textContent="در تمام بخش‌های سایت جست‌وجو کن؛ بازی، ابزار، ویدیو و محصول.";return;}
  searchResults.hidden=false;searchHint.textContent="در حال جست‌وجو در بخش‌های سایت...";
  const entries=await loadIndex();if(!normalize(searchInput.value))return;
  const activeQuery=normalize(searchInput.value);\n  const matches=entries.filter(item=>item.searchText.includes(activeQuery)).slice(0,30);
  if(matches.length){matches.forEach(item=>searchResults.append(resultCard(item)));searchHint.textContent=matches.length+" نتیجه پیدا شد. برای ورود، روی نتیجه بزن.";}
  else{const empty=document.createElement("p");empty.className="global-search-empty";empty.textContent="نتیجه‌ای پیدا نشد؛ عبارت دیگری را امتحان کن.";searchResults.append(empty);searchHint.textContent="جست‌وجو در بازی‌ها، ابزارها، محتوا و محصولات انجام شد.";}
  if(scroll)searchResults.scrollIntoView({behavior:"smooth",block:"nearest"});
 }
 searchInput.addEventListener("input",()=>performSearch(false));
 searchInput.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();performSearch(true);}if(event.key==="Escape"){searchInput.value="";performSearch(false);}});
 if(searchButton)searchButton.addEventListener("click",()=>performSearch(true));
});