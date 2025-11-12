document.getElementById("start-btn").addEventListener("click", generateScratchCards);

function generateScratchCards() {
  const cardCount = parseInt(document.getElementById("card-count").value);

  if (cardCount <= 0 || cardCount > 26) {
    alert("Please choose a valid number of scratch cards (1-26).");
    return;
  }

  const container = document.getElementById("scratch-cards-container");
  container.innerHTML = ""; // Clear previous cards
  
  // Generate a shuffled array of letters
  const letters = generateShuffledLetters(cardCount);

  // Create scratch cards
  for (let i = 0; i < cardCount; i++) {
    const letter = letters[i];
    const card = createScratchCard(letter);
    container.appendChild(card);
  }
}

function generateShuffledLetters(cardCount) {
  let lettersArray = [];
  for (let i = 0; i < cardCount; i++) {
    lettersArray.push(String.fromCharCode(65 + i)); // ASCII 'A' + i
  }
  
  // Shuffle
  for (let i = lettersArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lettersArray[i], lettersArray[j]] = [lettersArray[j], lettersArray[i]];
  }

  return lettersArray;
}

function createScratchCard(letter) {
  const card = document.createElement("div");
  card.classList.add("scratch-card", "col-6", "col-md-3");

  const cardInner = document.createElement("div");
  cardInner.classList.add("scratch-card-inner");

  // Front
  const front = document.createElement("div");
  front.classList.add("scratch-card-front");

  const letterDiv = document.createElement("div");
  letterDiv.classList.add("code-letter");
  letterDiv.textContent = letter;

  const canvas = document.createElement("canvas");
  canvas.width = 170;
  canvas.height = 170;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ccc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const silverSurface = document.createElement("div");
  silverSurface.classList.add("silver-surface");

  front.appendChild(letterDiv);
  front.appendChild(silverSurface);
  front.appendChild(canvas);

  // Back
  const back = document.createElement("div");
  back.classList.add("scratch-card-back");
  const backText = document.createElement("p");
  backText.textContent = letter;
  back.appendChild(backText);

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(cardInner);
  
  // Flip
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  // Scratch logic
  let isScratching = false;

  silverSurface.addEventListener("mousedown", startScratching);
  silverSurface.addEventListener("mousemove", scratch);
  silverSurface.addEventListener("mouseup", endScratching);
  silverSurface.addEventListener("mouseleave", endScratching);

  function startScratching(event) {
    isScratching = true;
    scratch(event);
  }

  function scratch(event) {
    if (!isScratching) return;

    const surfaceRect = silverSurface.getBoundingClientRect();
    const scratchX = event.clientX - surfaceRect.left;
    const scratchY = event.clientY - surfaceRect.top;

    const scratchSize = 40;
    ctx.clearRect(
      scratchX - scratchSize / 2,
      scratchY - scratchSize / 2,
      scratchSize,
      scratchSize
    );

    // Reveal if enough scratched
    if (checkScratchedEnough()) {
      letterDiv.classList.add("revealed"); // ✅ use CSS class
      silverSurface.style.visibility = "hidden";
    }
  }

  function endScratching() {
    isScratching = false;
  }

  function checkScratchedEnough() {
    const scratchedArea = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let scratchedPixels = 0;

    for (let i = 0; i < scratchedArea.data.length; i += 4) {
      if (scratchedArea.data[i + 3] < 128) {
        scratchedPixels++;
      }
    }

    return scratchedPixels / (canvas.width * canvas.height) > 0.4;
  }

  return card;
}


// Create scratch cards
for (let i = 0; i < cardCount; i++) {
  const letter = letters[i];
  const card = createScratchCard(letter);

  // add staggered animation delay
  card.style.animationDelay = `${i * 1}s`;

  container.appendChild(card);
}


