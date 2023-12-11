let container = document.querySelector(".container");
let failSound = document.querySelector(".fail")
let successSound = document.querySelector(".success")
let restartBtn = document.querySelector(".restart-game")
let cards = []; 
let cardNumOne , cardNumTwo ; 
let isFlipped = false;

fetch("./db/db.json") // Fetch data from JSON file
    .then((res) => res.json()) 
    .then((data) => {
    cards = [...data, ...data]; 
    shuffleCards();
    generateCards(); 
    });

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function generateCards() {
    cards.forEach((card) => {
    const item = document.createElement("div"); // Create a new DOM element
    item.classList.add("card"); 
    item.setAttribute("data-name" , card.name)
    item.innerHTML = `
    <div class="front">
        <img class="card-img" src="${card.image}" />
    </div>
    <div class="back"></div>
    `;
    container.appendChild(item); 
    item.addEventListener("click", flipCard)
    });
}

function flipCard() {
    if (isFlipped) return; // Ignore click if already flipped
    if(this === cardNumOne)return;
    this.classList.add("flipped");
        if (!cardNumOne) {
    cardNumOne = this;
    return;
    }     
    cardNumTwo = this;
    isFlipped = true
    startGame();// Reset flipped state if clicked on the same card
    }

function startGame() {
    let isMatch = cardNumOne.dataset.name === cardNumTwo.dataset.name;
    isMatch ? handleMatch() : handleMisMatch();
    }

function handleMatch() {
    cardNumOne.removeEventListener("click", flipCard);
    cardNumTwo.removeEventListener("click", flipCard);
    startAgin()
    successSound.play()
}

function handleMisMatch() {
      // Remove any visual indication of the cards being previously clicked
    setTimeout(() => {
    cardNumOne.classList.remove("flipped");
    cardNumTwo.classList.remove("flipped");
    startAgin()
    failSound.play()
    }, 1000); // Delay unflipping cards for visual effect
    }


function startAgin() {
    cardNumOne = null;
        cardNumTwo = null;
        isFlipped = false;
    }
    
    restartBtn.addEventListener("click", ()=>{
    container.innerHTML=""
    startAgin()
    shuffleCards()
    generateCards()
    })