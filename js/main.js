(function(){var b=document.querySelector(".burger"),n=document.getElementById("nav");
b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
var y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
var f=document.getElementById("cf");if(f){var s=document.getElementById("fs");f.addEventListener("submit",function(e){
var a=f.getAttribute("action");if(f._gotcha&&f._gotcha.value){e.preventDefault();return}
if(a.indexOf("[")===0){e.preventDefault();var d=new FormData(f);
location.href="mailto:TheFarmersOak@outlook.com?subject="+encodeURIComponent("Website enquiry: "+d.get("topic"))+"&body="+encodeURIComponent(d.get("message")+"\n\n"+d.get("name")+"\n"+d.get("email")+"\n"+d.get("phone"));
s.textContent="Opening your email app…";return}
e.preventDefault();s.textContent="Sending…";fetch(a,{method:"POST",body:new FormData(f),headers:{Accept:"application/json"}}).then(function(r){if(!r.ok)throw 0;f.reset();s.textContent="Thank you. We will reply as soon as we can."}).catch(function(){s.textContent="Sorry, that did not send. Please phone or email us instead."})})}})();(function(){var h=document.querySelector(".hero");if(!h)return;var s=h.querySelectorAll(".slide"),d=h.querySelectorAll(".dots button"),i=0,t;
function go(n){s[i].classList.remove("on");d[i].removeAttribute("aria-current");i=(n+s.length)%s.length;s[i].classList.add("on");d[i].setAttribute("aria-current","true")}
h.querySelector(".prev").onclick=function(){go(i-1)};h.querySelector(".next").onclick=function(){go(i+1)};d.forEach(function(b,n){b.onclick=function(){go(n)}});
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){t=setInterval(function(){go(i+1)},7000);h.addEventListener("mouseenter",function(){clearInterval(t)});h.addEventListener("focusin",function(){clearInterval(t)})}})();