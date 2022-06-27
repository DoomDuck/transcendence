import { type IEntity, type IPositionSpeedSettable, isPositionSpeedSettable, Ball } from ".";
import { type Physics } from "../physics";

export class GameState {
    positionSpeedSettables: IPositionSpeedSettable[] = [];
    constructor(public physics: Physics, public entities: IEntity[]) {
        for (let entity of entities) {
            if (isPositionSpeedSettable(entity))
                this.positionSpeedSettables.push(entity);
        }
        if (isPositionSpeedSettable(physics))
            this.positionSpeedSettables.push(physics);
    }

    update(elapsed: number) {
        if (this.physics.apply)
            this.physics.apply(elapsed);
        for (let entity of this.entities) {
            entity.update(elapsed);
            // if (entity instanceof Ball) {
            //     console.log('position:', entity.position);
            //     console.log('speed:', entity.speed);
            // }
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

