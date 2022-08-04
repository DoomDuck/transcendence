import { GSettings } from "../constants";

type Timeout = ReturnType<typeof setInterval>;

/**
 * Spawner is used by the context that spawns
 * gravitons and portals: ClientGameContextOffline
 * and ServerGameContext (resp. for offline and online version)
 * The purpose is to enable for both the ability to spawn using
 * the same rules
 */
export class Spawner {
  intervalHandles: [Timeout | null, Timeout | null] = [null, null];
  constructor(
    public spawnGraviton: () => void,
    public spawnPortal: () => void
  ) {}

  startSpawning(delay: number = 0) {
    if (this.intervalHandles[0] !== null || this.intervalHandles[1] !== null) {
      this.stopSpawning();
      // throw new Error("Tried to start spawner twice");
    }
    setTimeout(() => {
      this.intervalHandles[0] = setInterval(
        this.spawnGraviton,
        GSettings.GRAVITON_SPAWN_INTERVAL
      );
      this.spawnGraviton();
    }, GSettings.GRAVITON_SPAWN_DELAY + delay);
    setTimeout(() => {
      this.intervalHandles[1] = setInterval(
        this.spawnPortal,
        GSettings.PORTAL_SPAWN_INTERVAL
      );
      this.spawnPortal();
    }, GSettings.PORTAL_SPAWN_DELAY + delay);
  }

  stopSpawning() {
    for (let i = 0; i < 2; i++) {
      if (this.intervalHandles[i] !== null) {
        clearInterval(this.intervalHandles[i] as Timeout);
        this.intervalHandles[i] = null;
      }
    }
  }
}
