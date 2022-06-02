"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersScore = void 0;
const THREE = require("three");
const CSS2DRenderer_1 = require("three/examples/jsm/renderers/CSS2DRenderer");
const common_1 = require("../common");
class Score {
    constructor(playerId) {
        this.value = 0;
        this.div = document.createElement('div');
        this.div.textContent = '0';
        this.div.className = 'player-score';
        this.threeObject = new CSS2DRenderer_1.CSS2DObject(this.div);
        const direction = playerId == common_1.PLAYER1 ? -1 : 1;
        this.position = this.threeObject.position;
        this.position.set(common_1.GSettings.SCORE_X * direction, common_1.GSettings.SCORE_Y, -1);
    }
    increment() {
        this.div.textContent = `${++this.value}`;
    }
    reset() {
        this.div.textContent = '0';
    }
}
class PlayersScore {
    constructor() {
        this.player1Score = new Score(common_1.PLAYER1);
        this.player2Score = new Score(common_1.PLAYER2);
        this.group = new THREE.Group();
        this.group.add(this.player1Score.threeObject);
        this.group.add(this.player2Score.threeObject);
    }
    handleGoal(playerId) {
        if (playerId == common_1.PLAYER1)
            this.player1Score.increment();
        else
            this.player2Score.increment();
    }
    reset() {
        this.player1Score.reset();
        this.player2Score.reset();
    }
}
exports.PlayersScore = PlayersScore;
//# sourceMappingURL=PlayersScore.js.map