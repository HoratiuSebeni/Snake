let boardDimension = 0;
let headPositionX = 0;
let headPositionY = 0;
let tailPositionX = [];
let tailPositionY = [];
let actualPoints = 0;
let bestPoints = 0;
let gameLoose = 0;

function verifySelectedOption() {
    if (document.getElementById('tableDimension').value == "") {
        alert('Please select the dimension of the board game!');
    } else {
        boardDimension = document.getElementById('tableDimension').value;
        startGame();
    }
}

function startGame() {
    displaySection('startSection', 'none');
    displaySection('gameSection', '');
    generateBoard();
    generateSnake();
    generateFood();
    window.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        switch (e.key) {
            case "ArrowLeft":
                verifyMovement(headPositionX, (headPositionY - 1));
                break;
            case "ArrowUp":
                verifyMovement((headPositionX - 1), headPositionY);
                break;
            case "ArrowRight":
                verifyMovement(headPositionX, (headPositionY + 1));
                break;
            case "ArrowDown":
                verifyMovement((headPositionX + 1), headPositionY);
                break;
        }
    }, true);
}

function generateBoard() {
    for (let x = 0; x < boardDimension; ++x) {
        document.getElementById('gameBoard').innerHTML += `
        <tr id="row${x}"></tr>
        `;
        for(let y = 0; y < boardDimension; ++y) {
            document.getElementById('row'+x).innerHTML += `
            <td id="cell${x}+${y}" data-value="clear" class="clear">
            </td>
            `;
        }
    }
}

function generateSnake() {
    headPositionX = boardDimension / 2;
    headPositionY = boardDimension / 2;
    changeCell(headPositionX, headPositionY, 'headSnake');
    for (let i = 0; i < 3; ++i) {
        tailPositionX[i] = headPositionX;
        tailPositionY[i] = headPositionY - 3 + i;
        changeCell(tailPositionX[i], tailPositionY[i], 'bodySnake');
    }
    tailPositionX[3] = headPositionX;
    tailPositionY[3] = headPositionY;
}

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * boardDimension);
        y = Math.floor(Math.random() * boardDimension);
    } while (document.getElementById('cell' + x + '+' + y).dataset.value != 'clear');
    changeCell(x, y, 'food');
}

function changeCell(positionX, positionY, value) {
    document.getElementById('cell' + positionX + '+' + positionY).dataset.value = value;
    document.getElementById('cell' + positionX + '+' + positionY).className = value;
}

function displaySection(containerId, value) {
    document.getElementById(containerId).style.display= value;
}

function verifyMovement(positionX, positionY) {
    if (positionX == tailPositionX[tailPositionX.length - 2] && positionY == tailPositionY[tailPositionY.length - 2]) {
        return;
    }
    if (gameLoose == 0 && positionX >= 0 && positionX < boardDimension && positionY >= 0 && positionY < boardDimension && (document.getElementById('cell' + positionX + '+' + positionY).dataset.value == 'clear' || (positionX == tailPositionX[0] && positionY == tailPositionY[0]))) {
        changeCell(tailPositionX[0], tailPositionY[0], 'clear');
        for (let i = 0; i < (tailPositionX.length - 1); ++i) {
            tailPositionX[i] = tailPositionX[i + 1];
            tailPositionY[i] = tailPositionY[i + 1];
        }
        applyMovement(positionX, positionY);
        tailPositionX[tailPositionX.length - 1] = headPositionX;
        tailPositionY[tailPositionY.length - 1] = headPositionY;
    } else if (gameLoose == 0 && positionX >= 0 && positionX < boardDimension && positionY >= 0 && positionY < boardDimension && document.getElementById('cell' + positionX + '+' + positionY).dataset.value == 'food') {
        applyMovement(positionX, positionY);
        tailPositionX[tailPositionX.length] = headPositionX;
        tailPositionY[tailPositionY.length] = headPositionY;
        ++actualPoints;
        updatePoints('actualPoints', actualPoints);
        generateFood();
    } else {
        ++gameLoose;
        displaySection('gameOver', '');
    }
}

function applyMovement(positionX, positionY) {
    changeCell(headPositionX, headPositionY, 'bodySnake');
    headPositionX = positionX;
    headPositionY = positionY;
    changeCell(headPositionX, headPositionY, 'headSnake');
}

function updatePoints(containerId, value) {
    document.getElementById(containerId).innerHTML = value;
}

function changeDimension() {
    resetGame();
    displaySection('gameSection', 'none');
    displaySection('gameOver', 'none');
    bestPoints = 0;
    updatePoints('bestPoints', bestPoints);
    document.getElementById('tableDimension').value = "";
    displaySection('startSection', '');
}

function resetGame() {
    document.getElementById('gameBoard').innerHTML = ``;
    actualPoints = 0;
    updatePoints('actualPoints', actualPoints);
    gameLoose = 0;
    tailPositionX = [];
    tailPositionY = [];
}

function restartGame() {
    if (actualPoints > bestPoints) {
        bestPoints = actualPoints;
        updatePoints('bestPoints', bestPoints);
    }
    resetGame();
    displaySection('gameOver', 'none');
    startGame();
}
