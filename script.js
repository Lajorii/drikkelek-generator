
let ready = document.getElementById('ready');
let structure = document.getElementById('structure');
let body = document.getElementById('body');
let info = document.getElementById('indexInfo');
let bubbles = document.getElementById('wrapper')
let glass = document.getElementById('emptyDrink')
let bigLogo = document.getElementById('bigLogo')
// let infoLight = document.getElementById('indexInfoLight')


ready.onclick = function () {
  glass.classList.add('drink')
  bigLogo.classList.add('mobileLiquid')

  // Gjør innholdet og boblene synlige umiddelbart uten timeout


  // Fjern klikkbarhet etter klikk for å hindre flere animasjoner
  ready.removeAttribute('href');
  ready.style.pointerEvents = 'none';

  setTimeout(() => {
    bubbles.style.display = 'block';
    
  }, 500)

  setTimeout(() =>{
ready.style.opacity = '0'
  }, 900)
  setTimeout(() => {
    info.style.opacity = '1'
    info.style.display = 'block';
    structure.classList.add('equallHeight')
    ready.style.display = 'none'

    // infoLight.style.display = 'block'
  }, 1000); // Tid for animasjonen å fullføre før info vises
};


