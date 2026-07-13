const frases = [

"Alguns sentimentos merecem mais do que palavras...",

"...merecem ser eternizados."

];

const intro = document.getElementById("intro");

const texto = document.getElementById("introText");

const museum = document.getElementById("museum");

const audioToggle = document.getElementById("audioToggle");

let etapa = 0;

mostrarFrase();

function mostrarFrase(){

texto.style.opacity=0;

setTimeout(()=>{

texto.innerHTML=frases[etapa];

texto.style.opacity=1;

},700);

setTimeout(()=>{

texto.style.opacity=0;

etapa++;

if(etapa<frases.length){

mostrarFrase();

}else{

intro.style.opacity=0;

setTimeout(()=>{

intro.style.display="none";

museum.style.display="block";

audioToggle.style.display="flex";

animarContador(contarVisita());

},1500);

}

},3500);

}

// ================================
// CONTADOR DE VISITAS (real, salvo no navegador)
// ================================

function contarVisita(){

let total = parseInt(localStorage.getItem("museuVisitas") || "0", 10);

total += 1;

localStorage.setItem("museuVisitas", total);

return total;

}

function animarContador(alvo){

const contador = document.getElementById("counter");

const passos = Math.min(alvo, 30) || 1;
const incremento = alvo/passos;
const duracaoPasso = 1200/passos;

let atual = 0;

const intervalo = setInterval(()=>{

atual += incremento;

if(atual >= alvo){

atual = alvo;

clearInterval(intervalo);

}

contador.innerHTML = Math.round(atual).toString().padStart(6,"0");

}, duracaoPasso);

}

const startButton = document.getElementById("startButton");

const room1 = document.getElementById("room1");

startButton.addEventListener("click",()=>{

document.querySelector(".museumContent").style.opacity="0";

document.querySelector(".museumContent").style.transform="scale(.92)";

document.querySelector(".museumContent").style.transition="1s";

document.querySelector(".museumContent").style.pointerEvents="none";

setTimeout(()=>{

room1.classList.add("active");

},900);

tentarTocarMusica();

});

// ================================
// NAVEGAÇÃO ENTRE AS SALAS (avançar e voltar)
// ================================

const nextButtons = document.querySelectorAll(".nextButton");

nextButtons.forEach((botao)=>{

botao.addEventListener("click",()=>{

const salaAtual = botao.closest(".room");
const proximaId = botao.dataset.next;
const proximaSala = document.getElementById(proximaId);

salaAtual.classList.remove("active");

setTimeout(()=>{

proximaSala.classList.add("active");

},900);

});

});

const prevButtons = document.querySelectorAll(".prevButton");

prevButtons.forEach((botao)=>{

botao.addEventListener("click",()=>{

const salaAtual = botao.closest(".room");
const destinoId = botao.dataset.prev;

salaAtual.classList.remove("active");

setTimeout(()=>{

if(destinoId === "museum"){

const mc = document.querySelector(".museumContent");

mc.style.transition = "1s";

mc.style.opacity = "1";

mc.style.transform = "none";

mc.style.pointerEvents = "auto";

}else{

document.getElementById(destinoId).classList.add("active");

}

},900);

});

});

// ================================
// TEMPO JUNTOS (SALA FINAL)
// ================================

function calcularTempoJuntos(){

const inicio = new Date(2025,11,13); // 13 de dezembro de 2025
const hoje = new Date();

const diffMs = hoje - inicio;
const diffDias = Math.floor(diffMs/(1000*60*60*24));

let diffMeses = (hoje.getFullYear()-inicio.getFullYear())*12 + (hoje.getMonth()-inicio.getMonth());
if(hoje.getDate() < inicio.getDate()){

diffMeses--;

}

const elemento = document.getElementById("diasJuntos");

if(elemento){

elemento.innerHTML = diffDias + " dias &middot; " + diffMeses + " meses juntos";

}

}

calcularTempoJuntos();

// ================================
// MÚSICA DE FUNDO
// ================================
const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 0.35;

function tentarTocarMusica() {
    bgMusic.play().catch(() => {});
}

// Tenta tocar automaticamente
tentarTocarMusica();

// Se o navegador bloquear, toca no primeiro clique do usuário
document.addEventListener("click", function iniciarMusica() {
    tentarTocarMusica();
    document.removeEventListener("click", iniciarMusica);
});

// ================================
// CARROSSEL (SALA 7)
// ================================

const carouselImgs = document.querySelectorAll("#room7 .carouselImg");

const carouselDots = document.querySelectorAll("#room7 .dot");

let carouselIndex = 0;

let carouselAutoplay = null;

function mostrarSlide(indice){

carouselIndex = (indice + carouselImgs.length) % carouselImgs.length;

carouselImgs.forEach((img)=>img.classList.remove("active"));

carouselDots.forEach((dot)=>dot.classList.remove("active"));

carouselImgs[carouselIndex].classList.add("active");

carouselDots[carouselIndex].classList.add("active");

}

function reiniciarAutoplay(){

if(carouselAutoplay) clearInterval(carouselAutoplay);

carouselAutoplay = setInterval(()=>{

mostrarSlide(carouselIndex+1);

},3800);

}

document.querySelector("#room7 .carouselArrow.prev").addEventListener("click",()=>{

mostrarSlide(carouselIndex-1);

reiniciarAutoplay();

});

document.querySelector("#room7 .carouselArrow.next").addEventListener("click",()=>{

mostrarSlide(carouselIndex+1);

reiniciarAutoplay();

});

carouselDots.forEach((dot,indice)=>{

dot.addEventListener("click",()=>{

mostrarSlide(indice);

reiniciarAutoplay();

});

});

reiniciarAutoplay();

// ================================
// AUTO-ESCALA: conteudo sempre cabe na tela, sem scroll
// ================================

// Agrupa o conteudo de cada sala (exceto o spotlight) dentro de um
// wrapper .roomInner, que sera reduzido de escala quando necessario.

document.querySelectorAll(".room").forEach((room)=>{

const inner = document.createElement("div");
inner.className = "roomInner";

Array.from(room.children).forEach((filho)=>{

if(!filho.classList.contains("spotlight")){

inner.appendChild(filho);

}

});

room.appendChild(inner);

});

function ajustarEscalas(){

document.querySelectorAll(".room").forEach((room)=>{

const inner = room.querySelector(".roomInner");

if(!inner) return;

inner.style.transform = "scale(1)";

const estilo = getComputedStyle(room);

const padV = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
const padH = parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight);

const alturaDisponivel = room.clientHeight - padV;
const larguraDisponivel = room.clientWidth - padH;

const alturaConteudo = inner.scrollHeight;
const larguraConteudo = inner.scrollWidth;

const escala = Math.min(1, alturaDisponivel/alturaConteudo, larguraDisponivel/larguraConteudo);

inner.style.transform = "scale(" + escala + ")";

});

}

window.addEventListener("load", ajustarEscalas);

window.addEventListener("resize", ajustarEscalas);

// Recalcula tambem apos as fontes carregarem (podem mudar a altura do texto)

if(document.fonts && document.fonts.ready){

document.fonts.ready.then(ajustarEscalas);

}

setTimeout(ajustarEscalas, 600);
