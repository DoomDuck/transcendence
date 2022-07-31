"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersScoreDisplay = void 0;
const THREE = require("three");
const CSS2DRenderer_1 = require("three/examples/jsm/renderers/CSS2DRenderer");
const constants_1 = require("../../common/constants");
class Score {
    constructor(playerId) {
        this.value = 0;
        this.div = document.getElementById(`p${playerId + 1}-score`);
        this.div.textContent = "0";
        this.threeObject = new CSS2DRenderer_1.CSS2DObject(this.div);
        const direction = playerId == constants_1.PLAYER1 ? -1 : 1;
        this.position = this.threeObject.position;
        this.position.set(constants_1.GSettings.SCORE_X * direction, constants_1.GSettings.SCORE_Y, -1);
    }
    increment() {
        this.div.textContent = `${++this.value}`;
    }
    reset() {
        this.div.textContent = "0";
    }
}
class PlayersScoreDisplay {
    constructor() {
        this.player1Score = new Score(constants_1.PLAYER1);
        this.player2Score = new Score(constants_1.PLAYER2);
        this.group = new THREE.Group();
        this.group.add(this.player1Score.threeObject);
        this.group.add(this.player2Score.threeObject);
    }
    handleGoal(playerId) {
        if (playerId == constants_1.PLAYER1)
            this.player1Score.increment();
        else
            this.player2Score.increment();
    }
    reset() {
        this.player1Score.reset();
        this.player2Score.reset();
    }
}
exports.PlayersScoreDisplay = PlayersScoreDisplay;
//# sourceMappingURL=PlayersScoreDisplay.js.map