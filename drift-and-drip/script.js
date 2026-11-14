/* ===== EDIT THESE FOR YOUR SHOP ===== */
const SHOP={phone:"15550100000",addr:"ARC Divino Compound, Bago Aplaya, Davao City. Free Wi-Fi, laptops welcome until 3 pm.",cur:"$",
hours:[["Sunday",8,16],["Monday",6.5,19],["Tuesday",6.5,19],["Wednesday",6.5,19],["Thursday",6.5,19],["Friday",6.5,20],["Saturday",7,21]],
stampsNeeded:8,fee:2,radius:10,geo:[7.0446,125.5323],place:"ARC Divino Compound, Bago Aplaya, Davao City"};
const MENU=[
{n:"Hand-poured V60",c:"Brews",p:4.5,d:"Our rotating single origin, poured slowly by hand."},
{n:"Chemex for Two",c:"Brews",p:8,d:"A shareable carafe with a soft, tea-like finish."},
{n:"Cold Drip 12h",c:"Brews",p:5.5,d:"Dripped overnight. Smooth, low acid, very awake."},
{n:"Flat White",c:"Espresso",p:4,d:"Double ristretto and velvety milk."},
{n:"Cortado",c:"Espresso",p:3.5,d:"Equal parts espresso and warm milk."},
{n:"Honey Oat Latte",c:"Espresso",p:5,d:"Local honey, oat milk, pinch of sea salt."},
{n:"Brown Butter Cookie",c:"Bites",p:3,d:"Chewy middle, crisp edge, baked each morning."},
{n:"Banana Toast",c:"Bites",p:4.5,d:"Sourdough, whipped ricotta, caramelised banana."},
{n:"Cheese Croissant",c:"Bites",p:4,d:"Laminated in-house, gone by noon."}];
/* ==================================== */
const $=s=>document.querySelector(s),money=n=>SHOP.cur+n.toFixed(2);
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cat="Brews",cart={},stamps=store.get("dd_stamps",0),q="",favs=store.get("dd_favs",[]),promo=false,mode="Pickup",prof=store.get("dd_prof",null),form={nm:"",nt:""},navs=0;
/* marquee */

$("#yr").textContent=new Date().getFullYear();$("#addr").textContent=SHOP.addr;
$("#call").href="https://wa.me/"+SHOP.phone;
/* hours + open now */
const fh=h=>{const H=Math.floor(h),m=Math.round((h-H)*60);return(H%12||12)+(m?":"+String(m).padStart(2,"0"):"")+(H<12?" am":" pm")};
function hours(){const now=new Date(),d=now.getDay(),t=now.getHours()+now.getMinutes()/60;
  $("#hours").innerHTML=SHOP.hours.map((h,i)=>`<li class="${i===d?"today":""}"><span>${h[0]}</span><span>${fh(h[1])} – ${fh(h[2])}</span></li>`).join("");
  const [,o,c]=SHOP.hours[d],open=t>=o&&t<c,p=$("#open");p.classList.toggle("open",open);
  p.textContent=open?"Open · until "+fh(c):"Closed · opens "+fh(t<o?o:SHOP.hours[(d+1)%7][1])}
hours();
/* menu */
function tabs(){$("#tabs").innerHTML=["Brews","Espresso","Bites","Favorites"].map(c=>`<button class="tab" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join("");
  $("#tabs").querySelectorAll("button").forEach(b=>b.onclick=()=>{cat=b.dataset.c;tabs();list()})}
function list(){$("#list").innerHTML=MENU.map((i,x)=>({i,x})).filter(o=>(cat==="Favorites"?favs.includes(o.i.n):o.i.c===cat)&&o.i.n.toLowerCase().includes(q)).map(({i,x},k)=>`<article class="item" style="animation-delay:${k*90}ms"><h3>${i.n}</h3><p>${i.d}</p><div class="row"><span class="price">${money(i.p)}</span><span><button class="heart" data-n="${i.n}" aria-pressed="${favs.includes(i.n)}" aria-label="Favorite ${i.n}">${favs.includes(i.n)?"♥":"♡"}</button><button class="add" data-x="${x}" aria-label="Add ${i.n}">Add</button></span></div></article>`).join("");
  $("#list").querySelectorAll(".add").forEach(b=>b.onclick=()=>{if(!prof){const x=b;profile(()=>{shut();x.click()});return}const n=MENU[b.dataset.x].n;cart[n]=(cart[n]||0)+1;count();b.textContent="Added";setTimeout(()=>b.textContent="Add",900)});
  $("#list").querySelectorAll(".heart").forEach(b=>b.onclick=()=>{const n=b.dataset.n;favs=favs.includes(n)?favs.filter(x=>x!==n):[...favs,n];store.set("dd_favs",favs);list()});
  if(!$("#list").children.length)$("#list").innerHTML=`<p class="sub">Nothing here. Tap ♡ on a drink to save it, or try another search.</p>`}
tabs();list();$("#q").oninput=()=>{q=$("#q").value.toLowerCase();list()};
/* stamps */
function drawStamps(){$("#st").innerHTML=Array.from({length:SHOP.stampsNeeded},(_, i)=>`<div class="st ${i<stamps?"on":""}">${i<stamps?"☕":""}</div>`).join("");
  $("#stmsg").textContent=stamps>=SHOP.stampsNeeded?"Card full. Show this screen at the counter for a free drink.":(SHOP.stampsNeeded-stamps)+" more to a free drink."}
drawStamps();
/* cart */
const sub=()=>Object.entries(cart).reduce((s,[n,q])=>s+q*MENU.find(i=>i.n===n).p,0),disc=()=>promo?sub()*.1:0,fee=()=>mode==="Delivery"?SHOP.fee:0,total=()=>sub()-disc()+fee();
const count=()=>{$("#cnt").textContent=Object.values(cart).reduce((a,b)=>a+b,0)};
function slots(){const o=[],t=new Date();t.setMinutes(Math.ceil((t.getMinutes()+15)/15)*15,0,0);for(let i=0;i<8;i++){o.push(t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}));t.setMinutes(t.getMinutes()+15)}return o}
function drawer(){const ent=Object.entries(cart);
  $("#dv").innerHTML=ent.length?`<h2>Your order</h2>${ent.map(([n,q])=>`<div class="line"><b>${n}</b><button class="q" data-n="${n}" data-d="-1" aria-label="Remove one ${n}">−</button><span>${q}</span><button class="q" data-n="${n}" data-d="1" aria-label="Add one ${n}">+</button><span class="price">${money(q*MENU.find(i=>i.n===n).p)}</span></div>`).join("")}
  ${disc()?`<div class="line"><b>Promo DRIP10</b><span>−${money(disc())}</span></div>`:""}${fee()?`<div class="line"><b>Delivery fee</b><span>${money(fee())}</span></div>`:""}
  <div class="tot"><span>Total</span><span>${money(total())}</span></div>
  <div class="f"><label>Pickup or delivery<select id="md"><option ${mode==="Pickup"?"selected":""}>Pickup</option><option ${mode==="Delivery"?"selected":""}>Delivery</option></select></label>
  <label>Promo code<input id="pc" value="${promo?"DRIP10":""}" placeholder="Try DRIP10 for 10% off"></label>
  <label>Your name<input id="nm" autocomplete="name" value="${form.nm}" required></label>
  ${mode==="Delivery"?`<label>Delivery address and phone<textarea id="ad" rows="2" placeholder="Street, landmark">${prof?prof.address:""}</textarea></label>`:""}
  <label>${mode==="Delivery"?"Deliver at":"Pickup time"}<select id="tm">${slots().map(s=>`<option>${s}</option>`).join("")}</select></label>
  <label>Note (optional)<textarea id="nt" rows="2" placeholder="Oat milk, extra hot…">${form.nt}</textarea></label>
  <p class="err" id="er" role="alert"></p><button class="btn" id="place">Place order by message</button>
  <p class="sub" style="font-size:.95rem;margin:0">This opens a chat with the shop with your order filled in. Pay at pickup.</p></div>`
  :`<h2>Your order</h2><p class="sub">Nothing here yet. Add something from the menu.</p>`;
  $("#dv").querySelectorAll(".q").forEach(b=>b.onclick=()=>{const n=b.dataset.n;cart[n]+=+b.dataset.d;if(cart[n]<1)delete cart[n];count();drawer()});
  const sv=()=>{form.nm=$("#nm").value;form.nt=$("#nt").value};
  const md=$("#md");if(md){md.onchange=()=>{sv();mode=md.value;drawer()};$("#pc").onchange=()=>{sv();promo=$("#pc").value.trim().toUpperCase()==="DRIP10";drawer()}}
  const pl=$("#place");if(pl)pl.onclick=place}
function place(){const nm=$("#nm").value.trim();if(!nm){$("#er").textContent="Add your name so we can call your order.";$("#nm").focus();return}
  if(mode==="Delivery"&&!prof.geo){$("#er").textContent="Tap the 👤 icon and press Use my current location so the rider can find you.";return}
  if(mode==="Delivery"&&km(SHOP.geo[0],SHOP.geo[1],prof.geo[0],prof.geo[1])>SHOP.radius){$("#er").textContent="Sorry, delivery only covers "+SHOP.radius+" km from the shop. Choose Pickup.";return}
  if(mode==="Delivery"&&!$("#ad").value.trim()){$("#er").textContent="Add your delivery address.";$("#ad").focus();return}
  const id=String(Math.floor(100+Math.random()*900)),tm=$("#tm").value,nt=$("#nt").value.trim();
  const lines=Object.entries(cart).map(([n,q])=>q+"× "+n).join("\n");
  const msg=`Order #${id} for ${nm}\nContact: ${prof.phone} / ${prof.email}\n${mode}: ${tm}${mode==="Delivery"?"\nAddress: "+$("#ad").value.trim()+"\nMap: "+gmap(prof.geo[0],prof.geo[1]):""}\n${lines}${promo?"\nPromo: DRIP10":""}\nTotal: ${money(total())}${nt?"\nNote: "+nt:""}`;
  window.open("https://wa.me/"+SHOP.phone+"?text="+encodeURIComponent(msg),"_blank","noopener");
  stamps=Math.min(SHOP.stampsNeeded,stamps+1);store.set("dd_stamps",stamps);drawStamps();
  $("#dv").innerHTML=`<div class="done"><div class="big">#${id}</div><h2>Order sent, ${nm.split(" ")[0]}.</h2><p class="sub" style="margin:0 auto 1.5rem">${mode} at ${tm}. If the chat didn’t open, send us this order number on the shop’s phone.</p><button class="btn" id="ok">Back to menu</button></div>`;
  cart={};promo=false;mode="Pickup";form={nm:prof.name,nt:""};count();$("#ok").onclick=shut}
const scrim=$("#scrim"),dr=$("#drawer");
function openD(){if(!prof){profile(openD);return}drawer();dr.classList.add("on");scrim.classList.add("on");dr.setAttribute("aria-hidden","false");$("#close").focus()}
function shut(){dr.classList.remove("on");scrim.classList.remove("on");dr.setAttribute("aria-hidden","true");$("#cartBtn").focus()}
$("#cartBtn").onclick=openD;$("#close").onclick=shut;scrim.onclick=shut;addEventListener("keydown",e=>{if(e.key==="Escape")shut()});
/* scroll level + theme */
addEventListener("scroll",()=>{const h=document.documentElement;$("#lv").style.height=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+"%"},{passive:true});
$("#theme").onclick=()=>{const r=document.documentElement,d=matchMedia("(prefers-color-scheme: dark)").matches,c=r.dataset.theme||(d?"dark":"light");r.dataset.theme=c==="dark"?"light":"dark"};
/* map + customer details */
if(prof)form.nm=prof.name;
const gmap=(a,b)=>"https://www.google.com/maps/search/?api=1&query="+a+","+b;
const km=(a,b,c,d)=>{const r=Math.PI/180,x=(c-a)*r,y=(d-b)*r*Math.cos(a*r);return Math.sqrt(x*x+y*y)*6371};
function mapSVG(c){const[la,ln]=SHOP.geo;let x=200,y=120,ex="",cap="Simplified map. Tap Open in Google Maps for the exact route.";
  if(c){const d=km(la,ln,c[0],c[1]),s=Math.min(70,95/Math.max(d,.3));x=Math.max(25,Math.min(375,200+(c[1]-ln)*111.3*Math.cos(la*Math.PI/180)*s));y=Math.max(25,Math.min(215,120+(la-c[0])*111.3*s));
    cap=`You are ${d.toFixed(1)} km from the shop. ${d>SHOP.radius?"That is outside our "+SHOP.radius+" km delivery area, so choose pickup.":"You are inside our delivery area."}`;
    ex=`<line x1="200" y1="120" x2="${x}" y2="${y}" stroke="var(--ink)" stroke-width="3" stroke-dasharray="7 6"/><circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="var(--ink)" stroke-width="3"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="16">🏠</text>`}
  return `<svg viewBox="0 0 400 240" role="img" aria-label="Map of the shop${c?" and your location":""}"><rect width="400" height="240" fill="var(--card)"/><path d="M310 0H400V240H265C300 170 280 90 310 0Z" fill="#9CC3D5"/><text x="352" y="125" font-size="12" text-anchor="middle" fill="#2A1810">Davao Gulf</text><path d="M0 60H280M90 0V240M0 205L250 75M150 240V120H260" stroke="var(--line)" stroke-width="7" fill="none"/>${ex}<circle cx="200" cy="120" r="17" fill="var(--butter)" stroke="var(--ink)" stroke-width="3"/><text x="200" y="127" text-anchor="middle" font-size="18">☕</text><text x="200" y="153" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Drift &amp; Drip</text></svg><p class="sub">${cap}</p>`}
$("#map").innerHTML=mapSVG(null);
$("#gm").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(SHOP.place);
function profile(next){const p=prof||{};let pc=p.geo||null;
  dr.classList.add("on");scrim.classList.add("on");dr.setAttribute("aria-hidden","false");
  $("#dv").innerHTML=`<h2>Your details</h2><p class="sub">We need these before you order, so the rider knows exactly where to find you.</p><div class="f"><label>Full name<input id="pn" autocomplete="name" value="${p.name||""}"></label><label>Mobile number<input id="pp" type="tel" autocomplete="tel" value="${p.phone||""}" placeholder="09XX XXX XXXX"></label><label>Email<input id="pe" type="email" autocomplete="email" value="${p.email||""}"></label><label>Address and landmark<textarea id="pa" rows="3" placeholder="House no., street, barangay, landmark">${p.address||""}</textarea></label><button class="btn y" id="loc" type="button">Use my current location</button><p class="sub" id="ls" style="margin:0">${pc?"Location saved.":"Needed for delivery."}</p><div id="pm" class="mapbox">${mapSVG(pc)}</div><p class="err" id="pr" role="alert"></p><button class="btn" id="ps">Save details</button></div>`;
  $("#loc").onclick=()=>{const ls=$("#ls");ls.textContent="Finding you…";if(!navigator.geolocation){ls.textContent="Location isn’t available here. Type your address and landmark instead.";return}
    navigator.geolocation.getCurrentPosition(g=>{pc=[+g.coords.latitude.toFixed(5),+g.coords.longitude.toFixed(5)];ls.textContent="Location saved.";$("#pm").innerHTML=mapSVG(pc)},()=>{ls.textContent="Couldn’t get your location. Allow location access in your browser, or type your address and landmark."},{enableHighAccuracy:true,timeout:10000})};
  $("#ps").onclick=()=>{const nm=$("#pn").value.trim(),ph=$("#pp").value.trim(),em=$("#pe").value.trim(),ad=$("#pa").value.trim(),er=$("#pr");
    if(!nm)return er.textContent="Add your full name.";
    if(ph.replace(/\D/g,"").length<7)return er.textContent="Add a mobile number the rider can call.";
    if(!/^\S+@\S+\.\S+$/.test(em))return er.textContent="Add a valid email, like name@email.com.";
    if(!ad)return er.textContent="Add your address and a landmark.";
    prof={name:nm,phone:ph,email:em,address:ad,geo:pc};store.set("dd_prof",prof);form.nm=nm;next()}}
$("#acct").onclick=()=>profile(shut);
/* screens: each nav link opens its own view */
const VIEWS=["home","menu","stamps","visit"];
function route(){let v=location.hash.slice(1);if(!VIEWS.includes(v))v="home";
  document.querySelectorAll(".view").forEach(e=>e.classList.toggle("on",e.dataset.v===v));
  document.querySelectorAll("nav a").forEach(a=>a.toggleAttribute("aria-current",a.getAttribute("href")==="#"+v));
  scrollTo(0,0)}
addEventListener("hashchange",()=>{navs++;route()});route();
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>{if(navs>0)history.back();else location.hash="home"});
setInterval(hours,60000);
