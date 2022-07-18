import { GSettings } from '../../common/constants';
import { handleKeydownOffline, handleKeyupOffline, } from './keyboardInput';
import { GameProducedEvent } from '../../common/game/events';
import { delay } from '../../common/utils';
import { ClientGameManager } from './ClientGameManager';


export class ClientGameManagerOffline extends ClientGameManager {
    constructor() {
        super();

        window.addEventListener('keydown', (e: KeyboardEvent) => handleKeydownOffline(e, this.game.state), false);
        window.addEventListener('keyup', (e: KeyboardEvent) => handleKeyupOffline(e, this.game.state), false);

        GameProducedEvent.registerEvent("ballOut", (time: number, playerId: number) => {
            this.game.pause();
            this.renderer.startVictoryAnimationAsync()
                .then(() => this.game.reset(0, 0, (playerId == 0 ? -1: 1) * GSettings.BALL_INITIAL_SPEEDX, 0))
                .then(() => this.renderer.scorePanels.increment(playerId))
                .then(() => delay(500))
                .then(() => this.game.start());
        });

        // GameProducedEvent.registerEvent(GameEvent.)
    }
}