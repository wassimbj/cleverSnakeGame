const gameBody = document.getElementById('gameBody')
gameStateSpan = document.getElementById('gameState')
gameLevelSpan = document.getElementById('gameLevel')
startPos = 0
endPos = 5 // 6x6 grid as it starts from 0
gameState = {
   status: 'aiming',
   level: 1
}
foodIcon = "🍎"
obsatcleIcon = "🔥"
eatIcon = "✅";
let movePos = [0, 0]

// levels by level
const levels = {
   1: {
      '[1,2]': true,
      // [`[${endPos},0]`]: true
   },
   2: {
      [`[${endPos},0]`]: true,
      '[3,4]': true
   },
   3: {
      '[1,2]': true,
      [`[${endPos},0]`]: true,
      '[3,4]': true
   }
}

const isAnObstacle = (pos) => {
   return levels[gameState.level][`[${pos}]`]
}

const buildGame = () => {
   for (let i = 0; i < endPos + 1; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < endPos + 1; j++) {
         const aim = document.createElement('img');
         aim.src = "./images/aim.svg"
         aim.classList.add('absolute', 'aim', 'top-0', 'left-0', 'w-full', `${i == 0 && j == 0 ? 'opacity-100' : 'opacity-0'}`)


         const td = document.createElement('td')
         td.classList.add('p-5', 'relative', 'bg-gray-500')

         // food
         const food = document.createElement("span");
         // put some obsatcles
         if (isAnObstacle([i, j])) {
            food.textContent = obsatcleIcon
            td.setAttribute("data-blocked", true)
         } else {
            food.textContent = foodIcon
            td.setAttribute("data-blocked", false)
            td.setAttribute("data-eaten", false)
         }
         food.classList.add("food")
         td.append(food)

         td.append(aim)
         td.setAttribute('data-pos', [i, j])
         tr.append(td)
      }
      gameBody.append(tr)
   }
}

const resetGame = () => {
   movePos = [0, 0]
   gameState.status = "aiming"
   gameBody.innerHTML = "";
   gameStateSpan.textContent = "🎯 Press Space or Enter to start"
   buildGame()
}
// init the game
resetGame()


const nextLevel = () => {
   if(gameState.level + 1 > Object.keys(levels).length){
      alert("We only have 3 levels for now, come back later for more levels");
      return;
   }
   gameState.level = Math.min(gameState.level + 1, Object.keys(levels).length)
   gameLevelSpan.textContent = `Level ${gameState.level}`
   resetGame()
}

const toggleAimDisplay = (show) => {
   document.querySelector(`td[data-pos='${movePos}']`).querySelector("img").style.opacity = show ? 1 : 0
}

const snakeFace = document.createElement("img");
snakeFace.src = "./images/snake.png";
snakeFace.classList.add('absolute', 'aim', 'top-0', 'left-0', 'w-full', 'snakeFace')

const didWin = () => {
   // user wins when he eats all the food except the levels ofc
   return document.querySelectorAll(".food[data-eaten='true']").length == Math.pow(endPos + 1, 2) - Object.keys(levels[gameState.level]).length;
}

const eatFood = (key, from, to) => {
   if (key === "ArrowRight") {
      // mark the TDs i moved throght as blocked
      for (let i = from[1]; i <= to[1]; i++) {
         let td = document.querySelector(`td[data-pos='${[from[0], i]}']`)
         let food = td.querySelector(".food")
         food.textContent = eatIcon;
         food.setAttribute("data-eaten", true)
         td.setAttribute("data-blocked", true)
      }

   }
   if (key === "ArrowLeft") {
      // mark the TDs i moved throght as blocked
      for (let i = from[1]; i >= to[1]; i--) {
         let td = document.querySelector(`td[data-pos='${[from[0], i]}']`)
         let food = td.querySelector(".food")
         food.textContent = eatIcon;
         food.setAttribute("data-eaten", true)
         td.setAttribute("data-blocked", true)
      }
      // move left
   }
   if (key === "ArrowUp") {
      // mark the TDs i moved throght as blocked
      for (let i = from[0]; i >= to[0]; i--) {
         let td = document.querySelector(`td[data-pos='${[i, from[1]]}']`)
         let food = td.querySelector(".food")
         food.textContent = eatIcon;
         food.setAttribute("data-eaten", true)
         td.setAttribute("data-blocked", true)
      }
      // move up
   }
   if (key === "ArrowDown") {
      // mark the TDs i moved throght as blocked
      for (let i = from[0]; i <= to[0]; i++) {
         let td = document.querySelector(`td[data-pos='${[i, from[1]]}']`)
         let food = td.querySelector(".food")
         food.textContent = eatIcon;
         food.setAttribute("data-eaten", true)
         td.setAttribute("data-blocked", true)
      }
      // move down
   }
}

const moveSnake = (dir) => {
   if (dir === "ArrowRight") {
      // move right until the first blocked
      for (let i = movePos[1] + 1; i < endPos + 1; i++) {
         movePos[1] = Math.min(endPos - 1, movePos[1])
         let td = document.querySelector(`td[data-pos='${[movePos[0], i]}']`)
         if (td.getAttribute("data-blocked") == "false") {
            movePos[1] += 1
         } else {
            break
         }
      }
   }
   if (dir === "ArrowLeft") {
      // move left until the first blocked
      for (let i = movePos[1] - 1; i >= 0; i--) {
         movePos[1] = Math.max(0, movePos[1])
         let td = document.querySelector(`td[data-pos='${[movePos[0], i]}']`)
         if (td.getAttribute("data-blocked") == "false") {
            movePos[1] -= 1
         } else {
            break
         }
      }
   }
   if (dir === "ArrowUp") {
      // move up until the first blocked
      for (let i = movePos[0] - 1; i >= 0; i--) {
         movePos[0] = Math.max(0, movePos[0])
         let td = document.querySelector(`td[data-pos='${[i, movePos[1]]}']`)
         if (td.getAttribute("data-blocked") == "false") {
            movePos[0] -= 1
         } else {
            break
         }
      }
   }
   if (dir === "ArrowDown") {
      // let mvTo = 0
      // stop at the first blocked
      for (let i = movePos[0] + 1; i < endPos + 1; i++) {
         movePos[0] = Math.min(endPos - 1, movePos[0])
         // console.log(i)
         let td = document.querySelector(`td[data-pos='${[i, movePos[1]]}']`)
         // console.log(td)
         if (td.getAttribute("data-blocked") == "false") {
            movePos[0] += 1
         } else {
            break
         }
      }
   }
}

const moveAim = (key) => {
   toggleAimDisplay(false)
   if (key === "ArrowRight") {
      // move right
      let mvTo = Math.min(movePos[1] + 1, endPos);
      if (document.querySelector(`td[data-pos='${[movePos[0], mvTo]}']`).getAttribute("data-blocked") == "true") {
         mvTo = movePos[1]
      }
      movePos[1] = mvTo
   }
   if (key === "ArrowLeft") {
      // left
      let mvTo = Math.max(movePos[1] - 1, 0);
      if (document.querySelector(`td[data-pos='${[movePos[0], mvTo]}']`).getAttribute("data-blocked") == "true") {
         mvTo = movePos[1]
      }
      movePos[1] = mvTo
   }
   if (key === "ArrowUp") {
      // up
      let mvTo = Math.max(movePos[0] - 1, 0);
      if (document.querySelector(`td[data-pos='${[mvTo, movePos[1]]}']`).getAttribute("data-blocked") == "true") {
         mvTo = movePos[0]
      }
      movePos[0] = mvTo
   }
   if (key === "ArrowDown") {
      // down
      let mvTo = Math.min(movePos[0] + 1, endPos);
      if (document.querySelector(`td[data-pos='${[mvTo, movePos[1]]}']`).getAttribute("data-blocked") == "true") {
         mvTo = movePos[0]
      }
      movePos[0] = mvTo
   }
   toggleAimDisplay(true)
}

document.addEventListener('keydown', function (event) {
   const key = event.code;
   // choosing the starting point
   if (gameState.status == "aiming") {
      moveAim(key)
      if (key == "Space" || key == "Enter") {
         // select the starting point and update the game state to "playing"
         toggleAimDisplay(false)
         gameState.status = "playing"
         gameStateSpan.textContent = "🐍 Now try to eat all the food, its tricky"
         document.querySelector(`td[data-pos='${movePos}']`).append(snakeFace);
      }
   } else {
      // we are playing steve
      // remove the snake face from the current position
      const currentTd = document.querySelector(`td[data-pos='${movePos}']`)
      currentTd.querySelector(".snakeFace").remove()

      const from = [...movePos] // copy of the prev move
      moveSnake(key)
      eatFood(key, from, movePos)

      // show it on the news position
      document.querySelector(`td[data-pos='${movePos}']`).append(snakeFace);

      if (didWin()) {
         nextLevel()
      }
   }



});
