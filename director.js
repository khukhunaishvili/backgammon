let game = new Game();
// localStorage
let gamePosition = getPlayerDataFromLocalStorage();
onLoad(gamePosition);

function onLoad(gamePosition) {
    if (gamePosition.length > 0) {
        loadLocalStorage(gamePosition[0]);
        gameDisplayOn();
    } else {
        game.generateAndPlaceCheckers();
        gameDisplayOn();
    }
}
function getPlayerDataFromLocalStorage() {
    const nardiJSON = localStorage.getItem('GamePosition');
    try {
        return nardiJSON ? JSON.parse(nardiJSON) : [];
    } catch (err) {
        return [];
    };
};
function loadLocalStorage(lStorage) {
    game.gameStatus = lStorage.gameStatus;
    game.player1 = lStorage.player1;
    game.player2 = lStorage.player2;
    game.status = lStorage.status;
    game.dice = lStorage.dice;
    game.dice1 = lStorage.dice1;
    game.dice2 = lStorage.dice2;
    game.whoMakesMove = lStorage.whoMakesMove;
    game.triangles = lStorage.triangles;
    game.hostageZone = lStorage.hostageZone;
    game.winZone = lStorage.winZone;
    game.possibleMoveAt = lStorage.possibleMoveAt;
    game.possibleMoveAndKillAt = lStorage.possibleMoveAndKillAt;
    game.possibleFinish = lStorage.possibleFinish;
    game.checkerPosition = lStorage.checkerPosition;
    game.matchResultsHistory = lStorage.matchResultsHistory
}
function saveGameToLocalStorage() {
    localStorage.removeItem("GamePosition");
    gamePosition = [];
    gamePosition.push({
        gameStatus: game.gameStatus,
        player1: game.player1,
        player2: game.player2,
        status: game.status,
        dice: game.dice,
        dice1: game.dice1,
        dice2: game.dice2,
        whoMakesMove: game.whoMakesMove,
        triangles: game.triangles,
        hostageZone: game.hostageZone,
        winZone: game.winZone,
        possibleMoveAt: game.possibleMoveAt,
        possibleMoveAndKillAt: game.possibleMoveAndKillAt,
        possibleFinish: game.possibleFinish,
        checkerPosition: game.checkerPosition,
        matchResultsHistory: game.matchResultsHistory
    })
    localStorage.setItem('GamePosition', JSON.stringify(gamePosition));
}

/// create Nardi Desk
function createTriangles(id, side) {
    let triangle = document.createElement('div');
    triangle.id = `triangle-${id}`;
    if (side == 'up') {
        triangle.classList.add('triangle-up');
    } else triangle.classList.add('triangle-down');
    return triangle;
}
function createNardiTables() {
    let tables = [];
    for (let index = 1; index < 5; index++) {
        let table = document.createElement('div');
        table.id = `table-${index}`;
        if (index < 3) {
            table.classList.add('table-down');
        } else table.classList.add('table-up');
        tables.push(table);
    }
    for (let index = 5; index > -1; index--) {
        const element = createTriangles(index);
        tables[0].appendChild(element);
    }
    for (let index = 11; index > 5; index--) {
        const element = createTriangles(index);
        tables[1].appendChild(element);
    }
    for (let index = 12; index < 18; index++) {
        const element = createTriangles(index, 'up');
        tables[2].appendChild(element);
    }
    for (let index = 18; index < 24; index++) {
        const element = createTriangles(index, 'up');
        tables[3].appendChild(element);
    }
    return {
        table1: tables[0],
        table2: tables[1],
        table3: tables[2],
        table4: tables[3]
    };
}
function createNardiDeskHalfs() {
    tables = createNardiTables();
    let half1 = document.createElement('div');
    let half2 = document.createElement('div');
    half1.id = 'half-1';
    half2.id = 'half-2';
    half1.classList.add('half1');
    half2.classList.add('half2');
    half1.appendChild(tables.table2);
    half1.appendChild(tables.table1);
    half2.appendChild(tables.table3);
    half2.appendChild(tables.table4);
    return {
        half1: half1,
        half2: half2
    };
}
function displayNardiDesk() {
    let halfs = createNardiDeskHalfs();
    let nardiDesk = document.querySelector('#nardi-desk');
    nardiDesk.appendChild(halfs.half2);
    nardiDesk.appendChild(halfs.half1);
}
// clear chechers
function clearAllCheckers() {
    for (let index = 0; index < 24; index++) {
        document.querySelector(`#triangle-${index}`).innerHTML = '';
    }
    document.querySelector(`#hostage-zone`).innerHTML = '';
    document.querySelector(`#win-zone-1`).innerHTML = '';
    document.querySelector(`#win-zone-2`).innerHTML = '';
}
// show Checkers
function displayCheckers() {
    clearAllCheckers();
    // show hostaged checkers
    for (let index = 0; index < 2; index++) {
        let hostagedChecker = Object.values(game.hostageZone)[index];
        Object.keys(hostagedChecker).forEach(checker => {
            let label = document.createElement('label');
            label.classList.add('checkbox-label');
            let checkbox = document.createElement('input');
            checkbox.setAttribute("type", "checkbox");
            let span = document.createElement('span');
            let br = document.createElement('br')
            if (hostagedChecker[checker][0][1] == game.player1) {
                span.classList.add('checkmark1');
                checkbox.id = 'player1id' + hostagedChecker[checker][0][0];
                checkbox.classList.add('player1');
                label.appendChild(checkbox);
                label.appendChild(br);
                label.appendChild(span);
                document.querySelector(`#hostage-zone`).appendChild(label);
            } else if (hostagedChecker[checker][0][1] == game.player2) {
                span.classList.add('checkmark2');
                checkbox.id = 'player2id' + hostagedChecker[checker][0][0];
                checkbox.classList.add('player2');
                label.appendChild(checkbox);
                label.appendChild(br);
                label.appendChild(span);
                document.querySelector(`#hostage-zone`).appendChild(label);
            }
        })
    }
    // show finished checkers
    for (let index = 0; index < 2; index++) {
        let finishedChecker = Object.values(game.winZone)[index];
        Object.keys(finishedChecker).forEach(checker => {
            let label = document.createElement('label');
            label.classList.add('checkbox-label');
            let checkbox = document.createElement('input');
            checkbox.setAttribute("type", "checkbox");
            let span = document.createElement('span');
            let br = document.createElement('br')
            if (finishedChecker[checker][0][1] == game.player1) {
                span.classList.add('checkmark1');
                checkbox.id = 'player1id' + finishedChecker[checker][0][0];
                checkbox.classList.add('player1');
                label.appendChild(checkbox);
                label.appendChild(br);
                label.appendChild(span);
                document.querySelector(`#win-zone-1`).appendChild(label);
            } else if (finishedChecker[checker][0][1] == game.player2) {
                span.classList.add('checkmark2');
                checkbox.id = 'player2id' + finishedChecker[checker][0][0];
                checkbox.classList.add('player2');
                label.appendChild(checkbox);
                label.appendChild(br);
                label.appendChild(span);
                document.querySelector(`#win-zone-2`).appendChild(label);
            }
        })
    }
    // show checkers who are playing om desk
    for (let index = 0; index < 24; index++) {
        let triangles = Object.values(game.triangles)[index];
        Object.keys(triangles).forEach(checker => {
            let label = document.createElement('label');
            label.classList.add('checkbox-label');
            let checkbox = document.createElement('input');
            checkbox.setAttribute("type", "checkbox");
            let span = document.createElement('span');
            let br = document.createElement('br')
            if (triangles[checker][1] == game.player1) {
                span.classList.add('checkmark1');
                checkbox.id = 'player1id' + triangles[checker][0];
                checkbox.classList.add('player1');
                label.appendChild(checkbox);
                label.appendChild(br);
                label.appendChild(span);
                document.querySelector(`#triangle-${index}`).appendChild(label);
            } else if (triangles[checker][1] == game.player2) {
                span.classList.add('checkmark2');
                checkbox.id = 'player2id' + triangles[checker][0];
                checkbox.classList.add('player2');
                label.appendChild(checkbox);
                label.appendChild(br);
                label.appendChild(span);
                document.querySelector(`#triangle-${index}`).appendChild(label);
            }
        })
    }
    // if checked
    document.querySelectorAll('.player1, .player2').forEach(item => {
        item.addEventListener('change', e => {
            if (!e.target.checked) {
                game.resetCheckersPossibleMove();
                displayCheckers();
            } else {
                let checkerPosition = e.path[2].id;
                let who = e.target.className;
                game.generatePossibleLocationsToMove(checkerPosition, who);
                showPossibleMove();
                blockInactiveCheckers();
            }
        })
    })
    saveGameToLocalStorage();
}
// block checkers that shouldnt move
function blockInactiveCheckers() {
    let inactivePlayer;
    game.player1 == game.whoMakesMove ? inactivePlayer = game.player2 : inactivePlayer = game.player1;
    for (let index = 1; index < 16; index++) {
        document.querySelector(`#${inactivePlayer}id${index}`).disabled = true;
    }
}
// block all checkers except one that is checked
function disableAnotherChechers(id) {
    for (let index = 1; index < 16; index++) {
        document.querySelector(`#player1id${index}`).disabled = true;
        document.querySelector(`#player2id${index}`).disabled = true;
    }
    document.querySelector(`#${id}`).disabled = false;
}
// show possible move checboxes
function showPossibleMove() {
    let newLocations = game.possibleMoveAt.concat(game.possibleMoveAndKillAt, game.possibleFinish);
    showPossibleLocationsAndMove(newLocations)
    saveGameToLocalStorage();
}
// create possible move checkers and move
function showPossibleLocationsAndMove(newLocations) {
    let locations = [...new Set(newLocations)];
    let message = document.querySelector('#message-box');
    message.innerHTML = '';
    locations.forEach(location => {
        if (location < 0) {
            let finishCheckerMessage = document.createElement('span');
            finishCheckerMessage.innerHTML = 'Finish with dice: ';
            let finishDice = document.createElement('button');
            finishDice.innerHTML = `${game.checkerPosition - location}`;
            finishDice.addEventListener("click", e => {
                let moveChecker = game.moveChecker(location);
                displayCheckers();
                blockInactiveCheckers();
                updateProfile();
                !moveChecker.isNextMoveFree ? message.innerHTML = `${moveChecker.nextMoveBlockedReason}` : message.innerHTML = '';
            })
            message.appendChild(finishCheckerMessage);
            message.appendChild(finishDice);
            saveGameToLocalStorage();
        } else if (location > 23) {
            let finishCheckerMessage = document.createElement('span');
            finishCheckerMessage.innerHTML = 'Finish with dice: ';
            let finishDice = document.createElement('button');
            finishDice.innerHTML = `${location - game.checkerPosition}`;
            finishDice.addEventListener("click", e => {
                let moveChecker = game.moveChecker(location);
                displayCheckers();
                blockInactiveCheckers();
                updateProfile();
                !moveChecker.isNextMoveFree ? message.innerHTML = `${moveChecker.nextMoveBlockedReason}` : message.innerHTML = '';
            })
            message.appendChild(finishCheckerMessage);
            message.appendChild(finishDice);
            saveGameToLocalStorage();
        } else if (location >= 0 && location <= 23) {
            let newChecker = document.createElement('input');
            newChecker.setAttribute("type", "checkbox");
            newChecker.addEventListener("click", e => {
                let newLocation = parseInt(e.path[1].id.match(/\d+/)[0]);             
                let moveChecker = game.moveChecker(newLocation);
                displayCheckers();
                blockInactiveCheckers();
                updateProfile();
                !moveChecker.isNextMoveFree ? message.innerHTML = `${moveChecker.nextMoveBlockedReason}` : message.innerHTML = '';
            })
            document.querySelector(`#triangle-${location}`).appendChild(newChecker);
            saveGameToLocalStorage();
        }
    })
}

function gameDisplayOn() {
    displayNardiDesk()
    displayCheckers()
    updateProfile();
    blockInactiveCheckers();
}

document.querySelector('#roll-dice').addEventListener('click', e => {
    e.target.disabled = true;
    game.rollDice();
    updateProfile();
    saveGameToLocalStorage();
})

document.querySelector('#restart').addEventListener('click', e => {
    localStorage.removeItem("GamePosition");
    location.reload();
})

function updateProfile() {
    let profile = document.querySelector('#profile');
    profile.innerHTML = '';
    let profile1 = document.createElement('div');
    let profile2 = document.createElement('div');
    let name1 = document.createElement('span');
    let name2 = document.createElement('span');
    name1.innerHTML = `${game.player1}`;
    name2.innerHTML = `${game.player2}`;
    name1.style.color = '#fd3908';
    name2.style.color = '#ffd31d';
    name1.style.fontWeight = 'bold';
    name2.style.fontWeight = 'bold';
    profile1.appendChild(name1);
    profile2.appendChild(name2);
    if (game.dice.length > 0) {
        game.dice.forEach(diceValue => {
            let diceDisplay = document.createElement('button');
            diceDisplay.style.backgroundColor = 'rgb(148, 148, 148)';
            diceDisplay.style.color = 'azure';
            diceDisplay.innerHTML = diceValue;
            if (game.whoMakesMove == game.player1) {
                profile1.appendChild(diceDisplay);
            } else profile2.appendChild(diceDisplay);
        })
    } else document.querySelector('#roll-dice').disabled = false;
    profile.appendChild(profile1);
    profile.appendChild(profile2);
}





