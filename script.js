const gameBody = document.getElementById('gameBody')
startPos = 0;
endPos = 5;

const gameState = {
   status: 'aiming'
}

// build the game
for (let i = 0; i < endPos + 1; i++) {
   const tr = document.createElement('tr');
   for (let j = 0; j < endPos + 1; j++) {
      const aim = document.createElement('img');
      aim.src = "./images/aim.svg"
      aim.classList.add('absolute', 'aim', 'top-0', 'left-0', 'w-full', `${i == 0 && j == 0 ? 'opacity-100' : 'opacity-0'}`)

      const food = document.createElement("span");
      food.textContent = '🍎'
      food.classList.add("food")

      const td = document.createElement('td')
      td.classList.add('p-5', 'relative', 'bg-gray-500')
      td.append(food)
      td.append(aim)
      td.setAttribute("data-blocked", false)
      td.setAttribute('data-pos', [i, j])
      tr.append(td)
   }
   gameBody.append(tr)
}


const movePos = [0, 0]
const toggleAimDisplay = (show) => {
   document.querySelector(`td[data-pos='${movePos}']`).querySelector("img").style.opacity = show ? 1 : 0
}

const snakeFace = document.createElement("img");
snakeFace.src = "./images/snake.png";
snakeFace.classList.add('absolute', 'aim', 'top-0', 'left-0', 'w-full', 'snakeFace')

// const moveThrought = (key, from, to) => {

// }

const markAsBlocked = (key, from, to) => {
   if (key === "ArrowRight") {
      // mark the TDs i moved throght as blocked
      for (let i = from[1]; i <= to[1]; i++) {
         let td = document.querySelector(`td[data-pos='${[from[0], i]}']`)
         td.querySelector(".food").textContent = "✅";
         td.setAttribute("data-blocked", true)
      }

   }
   if (key === "ArrowLeft") {
      // mark the TDs i moved throght as blocked
      for (let i = from[1]; i >= to[1]; i--) {
         let td = document.querySelector(`td[data-pos='${[from[0], i]}']`)
         td.querySelector(".food").textContent = "✅";
         td.setAttribute("data-blocked", true)
      }
      // move left
   }
   if (key === "ArrowUp") {
      // mark the TDs i moved throght as blocked
      for (let i = from[0]; i >= to[0]; i--) {
         let td = document.querySelector(`td[data-pos='${[i, from[1]]}']`)
         td.querySelector(".food").textContent = "✅";
         td.setAttribute("data-blocked", true)
      }
      // move up
   }
   if (key === "ArrowDown") {
      // mark the TDs i moved throght as blocked
      for (let i = from[0]; i <= to[0]; i++) {
         let td = document.querySelector(`td[data-pos='${[i, from[1]]}']`)
         td.querySelector(".food").textContent = "✅";
         td.setAttribute("data-blocked", true)
      }
      // move down
   }
}

const move = (dir) => {
   if (dir === "ArrowRight") {
      // let mvTo = endPos
      // movePos[1] = endPos
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
      // movePos[1] = 0
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

document.addEventListener('keydown', function (event) {
   const key = event.code;
   // choosing the starting point
   if (gameState.status == "aiming") {
      toggleAimDisplay(false)
      if (key === "ArrowRight") {
         // move right
         movePos[1] = Math.min(movePos[1] + 1, endPos)
      }
      if (key === "ArrowLeft") {
         // left
         movePos[1] = Math.max(movePos[1] - 1, 0)
      }
      if (key === "ArrowUp") {
         // up
         movePos[0] = Math.max(movePos[0] - 1, 0)
      }
      if (key === "ArrowDown") {
         // down
         movePos[0] = Math.min(movePos[0] + 1, endPos)
      }
      toggleAimDisplay(true)
      if (key == "Space" || key == "Enter") {
         // select the starting point and update the game state to "playing"
         // console.log(movePos)

         toggleAimDisplay(false)
         gameState.status = "playing"
         document.querySelector(`td[data-pos='${movePos}']`).append(snakeFace);
      }
   } else {
      // we are playing steve
      // remove the current one and show the next move
      const currentTd = document.querySelector(`td[data-pos='${movePos}']`)
      currentTd.querySelector(".snakeFace").remove()

      const from = [...movePos]
      move(key)
      markAsBlocked(key, from, movePos)
      // console.log(from, movePos)
      /* right: [1, 2] [1, 5] */
      /* left: [1, 5] [1, 0] */
      /* up: [3, 2] [0, 2] */
      /* bottom: [3, 2] [5, 2] */
      document.querySelector(`td[data-pos='${movePos}']`).append(snakeFace);
   }



});
