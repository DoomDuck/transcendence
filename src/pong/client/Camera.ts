import * as THREE from 'three'
import { GSettings } from '../common/constants';

export class Camera extends THREE.OrthographicCamera {
    constructor() {
        super();
        this.left = GSettings.SCREEN_LEFT;
        this.right = GSettings.SCREEN_RIGHT;
        this.top = GSettings.SCREEN_TOP;
        this.bottom = GSettings.SCREEN_BOTTOM;
        this.near = 0;
        this.far = 1000;
        this.position.z = 10;
        this.updateProjectionMatrix();
    }
}
