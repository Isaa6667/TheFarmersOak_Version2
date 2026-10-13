(function(){var b=document.querySelector(".burger"),n=document.getElementById("nav");
b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
var y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
var f=document.getElementById("cf");if(f){var s=document.getElementById("fs"),btn=f.querySelector("button");
f.addEventListener("submit",function(e){e.preventDefault();btn.disabled=true;s.textContent="Sending…";
fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(f)))})
.then(function(r){return r.json().then(function(d){if(!r.ok||!d.ok)throw 0})}).then(function(){f.reset();s.textContent="Thank you, your message has been sent. We will reply as soon as we can."})
.catch(function(){s.innerHTML='Sorry, that did not send. Please email us at <a href="mailto:TheFarmersOak@outlook.com">TheFarmersOak@outlook.com</a>.'}).finally(function(){btn.disabled=false})})}})();(function(){var h=document.querySelector(".hero");if(!h)return;var s=h.querySelectorAll(".slide"),d=h.querySelectorAll(".dots button"),i=0,t;
function go(n){s[i].classList.remove("on");d[i].removeAttribute("aria-current");i=(n+s.length)%s.length;s[i].classList.add("on");d[i].setAttribute("aria-current","true")}
h.querySelector(".prev").onclick=function(){go(i-1)};h.querySelector(".next").onclick=function(){go(i+1)};d.forEach(function(b,n){b.onclick=function(){go(n)}});
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){t=setInterval(function(){go(i+1)},7000);h.addEventListener("mouseenter",function(){clearInterval(t)});h.addEventListener("focusin",function(){clearInterval(t)})}})();
