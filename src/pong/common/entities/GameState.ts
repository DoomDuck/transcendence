import { type IEntity, type IPositionSpeedSettable, isPositionSpeedSettable } from ".";
import { type Physics } from "../physics";

export class GameState {
    positionSpeedSettables: IPositionSpeedSettable[] = [];
    constructor(private physics: Physics, private entities: IEntity[]) {
        for (let entity of entities) {
            if (isPositionSpeedSettable(entity))
                this.positionSpeedSettables.push(entity);
        }
    }

    update(elapsed: number) {
        if (this.physics.apply)
            this.physics.apply(elapsed);
        for (let entity of this.entities) {
            entity.update(elapsed);
        }
        this.physics.resolve();
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        for (let entity of this.entities) {
            entity.reset();
        }
        for (let entity of this.positionSpeedSettables) {
            entity.setPositionSpeed(ballX, ballY, ballSpeedX, ballSpeedY);
        }
    }
}

