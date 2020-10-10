class Game {
    constructor() {
        this.gameStatus = 'set', // 'play'
            this.player1 = 'player1',
            this.player2 = 'player2',
            this.status = {
                player1: {
                    onDesk: true,
                    hostage: false,
                    finishing: false,
                    blocked: false
                },
                player2: {
                    onDesk: true,
                    hostage: false,
                    finishing: false,
                    blocked: false
                }
            }, // onBoard, blocked, finishing
            this.dice = [],
            this.dice1 = [],
            this.dice2 = [],
            this.whoMakesMove = this.player1, // player2
            this.triangles = {
                triangle0: [],
                triangle1: [],
                triangle2: [],
                triangle3: [],
                triangle4: [],
                triangle5: [],
                triangle6: [],
                triangle7: [],
                triangle8: [],
                triangle9: [],
                triangle10: [],
                triangle11: [],
                triangle12: [],
                triangle13: [],
                triangle14: [],
                triangle15: [],
                triangle16: [],
                triangle17: [],
                triangle18: [],
                triangle19: [],
                triangle20: [],
                triangle21: [],
                triangle22: [],
                triangle23: [],
            },
            this.hostageZone = {
                player1: [],
                player2: []
            },
            this.winZone = {
                player1: [],
                player2: []
            },
            this.possibleMoveAt = [],
            this.possibleMoveAndKillAt = [],
            this.possibleFinish = [],
            this.checkerPosition,
            this.matchResultsHistory = {
                player1: [],
                player2: []
            }
    }
    changeWhoMakesMove() {
        this.whoMakesMove == this.player1 ? this.whoMakesMove = this.player2 : this.whoMakesMove = this.player1;
        return this.whoMakesMove;
    }
    setStatus() {
        let status = {
            player1: {
                onDesk: this.isOnDesk(this.player1),
                hostage: this.checkHostaged(this.player1),
                finishing: this.checkFinishing().player1,
                blocked: this.checkBlocked().player1.blocked
            },
            player2: {
                onDesk: this.isOnDesk(this.player2),
                hostage: this.checkHostaged(this.player2),
                finishing: this.checkFinishing().player2,
                blocked: this.checkBlocked().player2.blocked
            }
        }
        this.status = status;
    }
    checkPossibleMove(index, player) {
        let result = {
            triangles: [],
            dice: []
        }
        let index1;
        let index2;
        let index3;
        let enemy;
        if (player == this.player1) {
            index2 = index;
            index1 = index - 6;
            enemy = this.player2;
            if (this.status.player1.finishing && index1 < 0) {
                index3 = index1;
                index1 = 0;
            } else if (index1 < 0) {
                index1 = 0;
            }
        } else if (player == this.player2) {
            index1 = index + 1;
            index2 = index1 + 6;
            enemy = this.player1;
            if (this.status.player2.finishing && index2 > 23) {
                index3 = index2;
                index2 = 24;
            } else if (index2 > 23) {
                index2 = 24;
            }
        }
        for (let i = index1; i < index2; i++) {
            const triangle = Object.values(this.triangles)[i];
            if (triangle.length == 0) {
                result.triangles.push(i);
                result.dice.push(Math.abs(i - index));
            } else if (triangle[0][1] == this.whoMakesMove) {
                result.triangles.push(i);
                result.dice.push(Math.abs(i - index));
            } else if (triangle.length == 1 && triangle[0][1] !== this.whoMakesMove) {
                result.triangles.push(i);
                result.dice.push(Math.abs(i - index));
            }
        }
        if (index3 < 0) {
            for (let i = index3; i < 0; i++) {
                result.triangles.push(i);
                result.dice.push(Math.abs(i - index));
            }
        }
        if (index3 > 23) {
            for (let i = index3; i > 23; i--) {
                result.triangles.push(i);
                result.dice.push(Math.abs(i - index));
            }
        }
        result.triangles = [...new Set(result.triangles)];
        result.dice = [...new Set(result.dice)];
        return result;
    }
    checkBlocked() {
        let result = {
            player1: {
                blocked: false,
                reason: ''
            },
            player2: {
                blocked: false,
                reason: ''
            }
        };
        if (this.whoMakesMove == this.player1) {
            // is in hostage and cant be released
            if (this.hostageZone.player1.length) {
                let diceThatCanReleaseChecker = this.checkPossibleMove(24, this.player1).dice;
                if (!diceThatCanReleaseChecker) {
                    result.player1.blocked = true;
                    result.player1.reason = `You cant release hostage, all the gates are taken by ${this.player2}`;
                } else if (this.dice.length) {
                    // check if can be move with dice that rolled
                    let match1 = 0;
                    this.dice.forEach(dice => {
                        diceThatCanReleaseChecker.forEach(possibleDice => {
                            possibleDice == dice ? match1++ : NaN;
                        })
                    })
                    if (!match1) {
                        result.player1.blocked = true;
                        result.player1.reason = `You cant make move with this dice`;
                    }
                }
            } else {
                let player1DiceValueToMove = [];
                // is alive but no dice can move him
                for (let index = 1; index < 24; index++) {
                    let triangle = Object.values(this.triangles)[index][0];
                    if (triangle) {
                        if (triangle[1] == this.player1) {
                            player1DiceValueToMove.push(this.checkPossibleMove(index, this.player1).dice);
                        }
                    }
                }
                if (!player1DiceValueToMove.length) {
                    result.player1.blocked = true;
                    result.player1.reason = `All the possible move is blocked`;
                } else if (this.dice.length) {
                    // check if can be move with dice that rolled
                    let match1 = 0;
                    this.dice.forEach(dice => {
                        player1DiceValueToMove.forEach(diceArray => {
                            diceArray.forEach(possibleDice => {
                                possibleDice == dice ? match1++ : NaN;
                            })
                        })
                    })
                    if (!match1) {
                        result.player1.blocked = true;
                        result.player1.reason = `You cant make move with this dice`;
                    }
                }
            }
        } else if (this.whoMakesMove == this.player2) {
            // is in hostage and cant be released
            if (this.hostageZone.player2.length) {
                let diceThatCanReleaseChecker = this.checkPossibleMove(-1, this.player2).dice;
                if (!diceThatCanReleaseChecker) {
                    result.player2.blocked = true;
                    result.player2.reason = `You cant release hostage, all the gates are taken by ${this.player1}`;
                } else if (this.dice.length) {
                    // check if can be move with dice that rolled
                    let match2 = 0;
                    this.dice.forEach(dice => {
                        diceThatCanReleaseChecker.forEach(possibleDice => {
                            possibleDice == dice ? match2++ : NaN;
                        })
                    })
                    if (!match2) {
                        result.player2.blocked = true;
                        result.player2.reason = `You cant make move with this dice`;
                    }
                }
            } else {
                let player2DiceValueToMove = [];
                // is alive but no dice can move him
                for (let index = 0; index < 24; index++) {
                    let triangle = Object.values(this.triangles)[index][0]; 
                    if (triangle) {
                        if (triangle[1] == this.player2) {
                            player2DiceValueToMove.push(this.checkPossibleMove(index, this.player2).dice);
                        }
                    }
                } 
                if (!player2DiceValueToMove.length) {
                    result.player2.blocked = true;
                    result.player2.reason = `All the possible move is blocked`;
                } else if (this.dice.length) {
                    // check if can be move with dice that rolled
                    let match2 = 0;
                    this.dice.forEach(dice => {
                        player2DiceValueToMove.forEach(diceArray => {
                            diceArray.forEach(possibleDice => {
                                possibleDice == dice ? match2++ : NaN;
                            })
                        })
                    })
                    if (!match2) {
                        result.player2.blocked = true;
                        result.player2.reason = `You cant make move with this dice`;
                    }
                }
            }
        }
        return result;
    }
    checkFinishing() {
        let result = {
            player1: false,
            player2: false
        };
        let player1CheckersInFinishZone = 0;
        for (let index = 0; index < 6; index++) {
            const finishTriangle = Object.values(this.triangles)[index];
            Object.values(finishTriangle).forEach(checker => {
                checker[1] == this.player1 ? player1CheckersInFinishZone++ : NaN;
            })
        }
        player1CheckersInFinishZone + this.winZone.player1.length == 15 ? result.player1 = true : result.player1 = false;
        let player2CheckersInFinishZone = 0;
        for (let index = 18; index < 24; index++) {
            const finishTriangle = Object.values(this.triangles)[index];
            Object.values(finishTriangle).forEach(checker => {
                checker[1] == this.player2 ? player2CheckersInFinishZone++ : NaN;
            })
        }
        player2CheckersInFinishZone + this.winZone.player2.length == 15 ? result.player2 = true : result.player2 = false;
        return result;
    }
    checkHostaged(who) {
        let result;
        if (who == this.player1) {
            this.hostageZone.player1.length ? result = true : result = false;
        } else if (who == this.player2) {
            this.hostageZone.player2.length ? result = true : result = false;
        }
        return result;
    }
    generateAndPlaceCheckers() {
        for (let index = 1; index < 6; index++) {
            this.triangles.triangle5.push([index, this.player1]);
            this.triangles.triangle18.push([index, this.player2]);
        }
        for (let index = 6; index < 9; index++) {
            this.triangles.triangle7.push([index, this.player1]);
            this.triangles.triangle16.push([index, this.player2]);
        }
        for (let index = 9; index < 14; index++) {
            this.triangles.triangle12.push([index, this.player1]);
            this.triangles.triangle11.push([index, this.player2]);
        }
        for (let index = 14; index < 16; index++) {
            this.triangles.triangle23.push([index, this.player1]);
            this.triangles.triangle0.push([index, this.player2]);
        }
    }
    rollDiceToCheckWhoStartsPlay(who) {
        this.dice = [];
        this.dice1 = [];
        this.dice2 = [];
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        if (who == this.player1) {
            if (dice1 == dice2) {
                this.dice1.push(dice1, dice1, dice1, dice1);
            } else this.dice1.push(dice1, dice2);
        } else if (who == this.player2) {
            if (dice1 == dice2) {
                this.dice2.push(dice1, dice1, dice1, dice1);
            } else this.dice2.push(dice1, dice2);
        } else return dice1;
    }
    rollDice() {
        this.dice = [];
        this.dice1 = [];
        this.dice2 = [];
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        dice1 == dice2 ? this.dice.push(dice1, dice1, dice1, dice1) : this.dice.push(dice1, dice2);
    }
    isOnDesk(who) {
        let result;
        if (who == this.player1) {
            this.hostageZone.player1.length > 0 ? result = false : result = true;
        } else if (who == this.player2) {
            this.hostageZone.player2.length > 0 ? result = false : result = true;
        }
        return result;
    }
    isFinishing(who) {
        let result;
        if (who = this.player1) {
            this.status.player1.finishing ? result = true : result = false;
        } else if (who = this.player2) {
            this.status.player2.finishing ? result = true : result = false;
        }
        return result;
    }
    isWinner() {
        let result = {
            winner: false
        }
        if (this.winZone.player1.length == 15) {
            result.winner = this.player1;
        } else if (this.winZone.player2.length == 15) {
            result.winner = this.player2;
        }
        return result;
    }
    resetCheckersPossibleMove() {
        this.possibleMoveAt = [];
        this.possibleMoveAndKillAt = [];
        this.possibleFinish = [];
        let empty;
        this.checkerPosition = empty;
    }
    generatePossibleLocationsToMove(checkerPosition, who) {
        // check if right person makes move
        if (who !== this.whoMakesMove) {
            throw new Error('Not your turn to move')
        }
        // check if game is over
        if (this.isWinner().winner) {
            throw new Error(`Game over. winner is ${this.isWinner}`);
        }
        // calculate possible new location
        if (checkerPosition == 'hostage-zone') {
            who == this.player1 ? checkerPosition = 24 : checkerPosition = -1;
        } else {
            checkerPosition = parseInt(checkerPosition.match(/\d+/)[0]);
        }
        game.resetCheckersPossibleMove();
        this.checkerPosition = checkerPosition;
        if (this.checkHostaged(this.whoMakesMove)) {
            let notMovingHostage = true;
            this.whoMakesMove == this.player1 && checkerPosition == 24 ? notMovingHostage = false : NaN;
            this.whoMakesMove == this.player2 && checkerPosition == -1 ? notMovingHostage = false : NaN;
            if (notMovingHostage) {
                throw new Error(`${this.whoMakesMove}, you have to release your checker from hostage`);
            } else {
                this.dice.forEach(diceValue => {
                    let moveAtIndex;
                    if (this.whoMakesMove == this.player1) {
                        moveAtIndex = 24 - diceValue;
                    } else if (this.whoMakesMove == this.player2) {
                        moveAtIndex = diceValue - 1;
                    }
                    let newTriangle = Object.values(this.triangles)[moveAtIndex];
                    if (newTriangle.length == 0) {
                        this.possibleMoveAt.push(moveAtIndex);
                    } else if (newTriangle[0][1] == this.whoMakesMove) {
                        this.possibleMoveAt.push(moveAtIndex);
                    } else if (newTriangle.length == 1 && newTriangle[0][1] !== this.whoMakesMove) {
                        this.possibleMoveAndKillAt.push(moveAtIndex);
                    }
                })
            }
        }
        // Player not in hostage move
        if (this.isOnDesk(this.whoMakesMove) || this.isFinishing(this.whoMakesMove)) {
            this.dice.forEach(diceValue => {
                let notCrossingLimit;
                let moveAtIndex;
                if (this.whoMakesMove == this.player1) {
                    moveAtIndex = this.checkerPosition - diceValue;
                    moveAtIndex >= 0 ? notCrossingLimit = true : notCrossingLimit = false;
                } else if (this.whoMakesMove == this.player2) {
                    moveAtIndex = this.checkerPosition + diceValue;
                    moveAtIndex <= 23 ? notCrossingLimit = true : notCrossingLimit = false;
                }
                if (notCrossingLimit) {
                    let newTriangle = Object.values(this.triangles)[moveAtIndex];
                    if (newTriangle.length == 0 || newTriangle[0][1] == this.whoMakesMove) {
                        this.possibleMoveAt.push(moveAtIndex);
                    } else if (newTriangle.length == 1 && newTriangle[0][1] !== this.whoMakesMove) {
                        this.possibleMoveAndKillAt.push(moveAtIndex);
                    }
                } else if (!notCrossingLimit && this.isFinishing(this.whoMakesMove)) {
                    this.possibleFinish.push(moveAtIndex);
                }
            })
        }
    }
    moveChecker(newPosition) {
        let result = {
            winner: this.isWinner(),
            isNextMoveFree: true,
            nextMoveBlockedReason: ""
        }
        if (this.possibleMoveAt.includes(newPosition)) {
            this.onlyMove(newPosition);
        } else if (this.possibleMoveAndKillAt.includes(newPosition)) {
            this.moveAndKill(newPosition);
        } else if (this.possibleFinish.includes(newPosition)) {
            this.moveToFinish(newPosition);
        }
        this.setStatus();
        // if player is blocked to move
        let isBlocked = this.checkBlocked();
        let nextMove;
        if (game.whoMakesMove == game.player1) {
            nextMove = isBlocked.player1;
        } else nextMove = isBlocked.player2;
        if (nextMove.blocked) {
            result.isNextMoveFree = false;
            result.nextMoveBlockedReason = `${this.whoMakesMove} cant make any move, ${this.changeWhoMakesMove()} roll the dice!`
            this.dice = [];
        } else return result;
        // in someone won
        this.isWinner ? this.updateMatchResultsHistory() : NaN;
        return result;
    }
    updateMatchResultsHistory() {
        let result1 = 0;
        let result2 = 0;
        this.player1 == this.isWinner ? result1 = 1 : result2 = 1;
        this.matchResultsHistory.player1.push(result1);
        this.matchResultsHistory.player1.push(result2);
    }
    moveAndKill(newPosition) {
        let killedChecker = Object.values(this.triangles)[newPosition].splice(0, 1);
        killedChecker[0][1] == this.player1 ? this.hostageZone.player1.push(killedChecker) : this.hostageZone.player2.push(killedChecker);
        this.onlyMove(newPosition)
    }
    onlyMove(newPosition) {
        let checkerToMove;
        if (this.checkHostaged(this.whoMakesMove)) {
            if (this.whoMakesMove == this.player1) {
                checkerToMove = Object.values(this.hostageZone)[0].splice(0, 1)[0][0];
            } else checkerToMove = Object.values(this.hostageZone)[1].splice(0, 1)[0][0];
        } else {
            checkerToMove = Object.values(this.triangles)[this.checkerPosition].splice(0, 1)[0];
        }
        Object.values(this.triangles)[newPosition].push(checkerToMove);
        this.useDice(newPosition);
    }
    moveToFinish(newPosition) {
        let checkerToMove = Object.values(this.triangles)[this.checkerPosition].splice(0, 1);
        if (this.whoMakesMove == this.player1) {
            this.winZone.player1.push(checkerToMove[0]);
        } else if (this.whoMakesMove == this.player2) {
            this.winZone.player2.push(checkerToMove[0]);
        }
        this.useDice(newPosition);
    }
    useDice(newPosition) {
        this.possibleMoveAt = [];
        this.possibleMoveAndKillAt = [];
        this.possibleFinish = [];
        let usedDice = Math.abs(newPosition - this.checkerPosition);
        let usedDiceIndex = this.dice.indexOf(usedDice);
        if (usedDiceIndex > -1) {
            this.dice.splice(usedDiceIndex, 1);
        }
        this.dice.length > 0 ? NaN : this.changeWhoMakesMove();
    }
    newGame() {
        this.whoMakesMove = this.isWinner().winner;
        this.checkerPosition = NaN;
    }
}