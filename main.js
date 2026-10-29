// Номер для заказов в WhatsApp (заменить на номер магазина)
var WA = "79000000000";

// Цвета роз: кружок меняет фото и текст заказа
var ROSES = [
  {name:"красные", hex:"#C8102E", img:"img/r3.jpg"},
  {name:"розовые", hex:"#F4A6B8", img:"img/r1.jpg"},
  {name:"пионовидные", hex:"#E9B7A8", img:"img/r6.jpg"},
  {name:"микс", hex:"conic-gradient(#e33,#fc3,#3c6,#39f,#c3f,#e33)", img:"img/b5.jpg"}
];

var BOUQUETS = [
  {name:"Розовое облако", tag:"Розы", price:3900, img:"img/b4.jpg", text:"Пионовидные розы и эвкалипт в крафте."},
  {name:"Тюльпаны в вазе", tag:"Сезонные", price:1900, img:"img/b1.jpg", text:"15 розовых тюльпанов, ваза в подарок."},
  {name:"Сад", tag:"Авторские", price:5200, img:"img/b2.jpg", text:"Большой букет: розы, астранция, ягоды."},
  {name:"Пёстрые тюльпаны", tag:"Сезонные", price:2400, img:"img/b3.jpg", text:"Бело-красные тюльпаны, 25 штук."},
  {name:"11 роз", tag:"Розы", price:2900, text:"Выберите цвет - соберём в упаковке с лентой.", colors:ROSES},
  {name:"25 роз", tag:"Розы", price:5900, text:"Большой букет, цвет на выбор или микс.", colors:ROSES.slice(3).concat(ROSES.slice(0,3))}
];

var REVIEWS = [
  {name:"Анна", text:"Заказала маме на день рождения, прислали фото до отправки. Букет стоял почти две недели."},
  {name:"Дмитрий", text:"Нужно было срочно, привезли за полтора часа. Жена в восторге."},
  {name:"Екатерина", text:"Собрали букет под мой бюджет и угадали с цветами. Буду заказывать ещё."}
];

// В демо все кнопки «Заказать» ведут на портфолио. Для живого сайта вернуть строку с wa.me
function waLink(text){return "https://lestermun.ru"}
// function waLink(text){return "https://wa.me/"+WA+"?text="+encodeURIComponent(text)}
function money(n){return n.toLocaleString("ru-RU")+" ₽"}

// Каталог с фильтром
var grid=document.getElementById("grid"),chips=document.getElementById("chips");
var tags=["Все"].concat(BOUQUETS.map(function(b){return b.tag}).filter(function(t,i,a){return a.indexOf(t)===i}));
function renderGrid(tag){
  grid.innerHTML=BOUQUETS.filter(function(b){return tag==="Все"||b.tag===tag}).map(function(b){
    var i=BOUQUETS.indexOf(b),c=b.colors?b.colors[0]:null,title=c?b.name+", "+c.name:b.name;
    var sw=b.colors?'<div class="swatches">'+b.colors.map(function(x,j){return '<button class="sw'+(j?'':' on')+'" data-b="'+i+'" data-c="'+j+'" title="'+x.name+'" style="background:'+x.hex+'"></button>'}).join("")+'</div>':'';
    return '<article class="card glass reveal"><div class="card__img"><img src="'+(c?c.img:b.img)+'" alt="'+title+'" loading="lazy"></div>'+
      '<div class="card__body"><h3>'+title+'</h3><p>'+b.text+'</p>'+sw+'<div class="card__row"><span class="price">'+money(b.price)+'</span>'+
      '<a class="btn btn--sm" target="_blank" rel="noopener" href="'+waLink("Здравствуйте! Хочу заказать букет «"+title+"» за "+money(b.price))+'">Заказать</a></div></div></article>';
  }).join("");
  observe();
}
chips.innerHTML=tags.map(function(t,i){return '<button class="chip'+(i?'':' on')+'">'+t+'</button>'}).join("");
chips.addEventListener("click",function(e){
  if(e.target.tagName!=="BUTTON")return;
  [].forEach.call(chips.children,function(c){c.classList.toggle("on",c===e.target)});
  renderGrid(e.target.textContent);
});
renderGrid("Все");

// Выбор цвета роз
grid.addEventListener("click",function(e){
  var s=e.target.closest(".sw");if(!s)return;
  var b=BOUQUETS[+s.dataset.b],c=b.colors[+s.dataset.c],card=s.closest(".card"),title=b.name+", "+c.name;
  [].forEach.call(s.parentNode.children,function(x){x.classList.toggle("on",x===s)});
  card.querySelector("img").src=c.img;card.querySelector("img").alt=title;card.querySelector("h3").textContent=title;
  card.querySelector(".btn").href=waLink("Здравствуйте! Хочу заказать букет «"+title+"» за "+money(b.price));
});

document.getElementById("reviews-list").innerHTML=REVIEWS.map(function(r){
  return '<div class="review glass reveal"><div class="stars">★★★★★</div><p>'+r.text+'</p><b>'+r.name+'</b></div>';
}).join("");

// Кнопки «Заказать» без конкретного букета
[].forEach.call(document.querySelectorAll("[data-order]"),function(a){
  a.href=waLink(a.getAttribute("data-order"));a.target="_blank";a.rel="noopener";
});

// Появление при прокрутке
var io="IntersectionObserver" in window?new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}});
},{threshold:.12}):null;
function observe(){
  [].forEach.call(document.querySelectorAll(".reveal:not(.in)"),function(el){io?io.observe(el):el.classList.add("in")});
}
[].forEach.call(document.querySelectorAll(".step,.contact"),function(el){el.classList.add("reveal")});
observe();

// Летящие лепестки на фоне
(function(){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var c=document.getElementById("petals"),ctx=c.getContext("2d"),W,H,dpr=Math.min(window.devicePixelRatio||1,2);
  var colors=["255,190,80","255,160,60","255,225,150","255,255,255"];
  var count=window.innerWidth<600?14:26,petals=[];
  function resize(){W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr}
  function make(top){return{x:Math.random()*W,y:top?-20*dpr:Math.random()*H,s:(6+Math.random()*8)*dpr,
    vy:(.3+Math.random()*.6)*dpr,vx:(.2+Math.random()*.5)*dpr,a:Math.random()*6.28,va:.01+Math.random()*.02,
    sw:Math.random()*6.28,col:colors[Math.random()*colors.length|0],o:.5+Math.random()*.4}}
  resize();addEventListener("resize",resize);
  for(var i=0;i<count;i++)petals.push(make(false));
  function draw(){
    ctx.clearRect(0,0,W,H);
    petals.forEach(function(p,i){
      p.sw+=.02;p.a+=p.va;p.y+=p.vy;p.x+=p.vx+Math.sin(p.sw)*.6*dpr;
      if(p.y>H+20*dpr||p.x>W+20*dpr)petals[i]=make(true);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.scale(1,Math.abs(Math.cos(p.a))*.6+.4);
      ctx.fillStyle="rgba("+p.col+","+p.o+")";
      ctx.beginPath();ctx.moveTo(0,-p.s);ctx.quadraticCurveTo(p.s*.8,0,0,p.s);ctx.quadraticCurveTo(-p.s*.8,0,0,-p.s);ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
