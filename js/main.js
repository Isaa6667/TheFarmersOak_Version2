// ===== CONTACT FORM SETUP: paste your free Web3Forms access key between the quotes below =====
var FORM_KEY="b77b66c0-fea6-4e77-a859-02f705b0f06b";
// ===================================================================================
(function(){var b=document.querySelector(".burger"),n=document.getElementById("nav");
b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
var y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
var f=document.getElementById("cf");if(f){var s=document.getElementById("fs"),btn=f.querySelector("button");
f.addEventListener("submit",function(e){e.preventDefault();var d=Object.fromEntries(new FormData(f)),w=!!FORM_KEY;
if(d.website){f.reset();return}
if(w){d.access_key=FORM_KEY;d.subject="New website enquiry: The Farmers Oak";d.from_name="The Farmers Oak website"}
btn.disabled=true;s.textContent="Sending…";
fetch(w?"https://api.web3forms.com/submit":"/api/contact",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)})
.then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok||!(j.ok||j.success)){console.error("Contact form error",r.status,j);throw 0}})}).then(function(){f.reset();s.textContent="Thank you, your message has been sent. We will reply as soon as we can."})
.catch(function(){s.innerHTML='Sorry, that did not send. Please email us at <a href="mailto:TheFarmersOak@outlook.com">TheFarmersOak@outlook.com</a>.'}).finally(function(){btn.disabled=false})})}})();(function(){var h=document.querySelector(".hero");if(!h)return;var s=h.querySelectorAll(".slide"),d=h.querySelectorAll(".dots button"),i=0,t;
function go(n){s[i].classList.remove("on");d[i].removeAttribute("aria-current");i=(n+s.length)%s.length;s[i].classList.add("on");d[i].setAttribute("aria-current","true")}
h.querySelector(".prev").onclick=function(){go(i-1)};h.querySelector(".next").onclick=function(){go(i+1)};d.forEach(function(b,n){b.onclick=function(){go(n)}});
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){t=setInterval(function(){go(i+1)},7000);h.addEventListener("mouseenter",function(){clearInterval(t)});h.addEventListener("focusin",function(){clearInterval(t)})}})();
