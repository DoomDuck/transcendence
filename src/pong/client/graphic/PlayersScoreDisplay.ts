import * as THREE from 'three';
import { Vector3 } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GSettings, PLAYER1, PLAYER2, PlayerID } from '../../common/constants';

/**
 * Purely graphic component of ClientPlayersScore
 */
class Score {
    value: number;
    div: HTMLDivElement;
    threeObject: CSS2DObject;
    position: Vector3;

    constructor(playerId: PlayerID) {
        this.value = 0;
        this.div = document.getElementById(`p${playerId + 1}-score`) as HTMLDivElement;
        this.div.textContent = '0';

        this.threeObject = new CSS2DObject(this.div);
        const direction = playerId == PLAYER1 ? -1 : 1;
        this.position = this.threeObject.position;
        this.position.set(
            GSettings.SCORE_X * direction,
            GSettings.SCORE_Y,
            -1
        );
    }

    increment() {
        this.div.textContent = `${++this.value}`;
    }

    reset() {
        this.div.textContent = '0';
    }
}

/**
 * Display both players score
 */
export class PlayersScoreDisplay {
    player1Score: Score;
    player2Score: Score;
    group: THREE.Group;

    constructor() {
        this.player1Score = new Score(PLAYER1);
        this.player2Score = new Score(PLAYER2);
        this.group = new THREE.Group();
        this.group.add(this.player1Score.threeObject);
        this.group.add(this.player2Score.threeObject);
    }

    handleGoal(playerId: PlayerID) {
        if (playerId == PLAYER1)
            this.player1Score.increment();
        else
            this.player2Score.increment();
    }

    reset() {
        this.player1Score.reset();
        this.player2Score.reset();
    }
}
