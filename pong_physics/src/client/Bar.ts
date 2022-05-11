// import { Tween } from '@tweenjs/tween.js';
import * as THREE from 'three'
import { Vector3 } from 'three';
// import * as TWEEN from '@tweenjs/tween.js';
import { TWEEN, Tween } from 'three/examples/jsm/libs/tween.module.min'

const BUMP_SIZE = .2
const BUMP_DURATION = 500

export class Bar extends THREE.Mesh {
    width: number;
    height: number;
    bumpTween: Tween | null;
    // deltaPos: Vector3;
    constructor( width: number, height: number, x: number, y: number) {
        const geometry = new THREE.BoxGeometry(
            width, height
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        super(geometry, material)
        this.width = width;
        this.height = height;
        this.position.x = x;
        this.position.y = y;
        this.bumpTween = null;
        // this.deltaPos = new Vector3();
    }

    onBump() {
        if (this.bumpTween !== null)
            return;
        const objectiveX = this.position.x + BUMP_SIZE;
        const returnX = this.position.x;
        const firstTween = new TWEEN.Tween(this.position);
        firstTween.to({x: objectiveX}, BUMP_DURATION/2)
            .easing(TWEEN.Easing.Circular.Out);
        const secondTween = new TWEEN.Tween(this.position);
        secondTween.to({x: returnX}, BUMP_DURATION/2)
            .easing(TWEEN.Easing.Circular.In);
        this.bumpTween = firstTween;
        this.bumpTween.chain(secondTween);
        console.log('in bar onbump')
        this.bumpTween.start();
        this.bumpTween.onComplete(() => {
            this.bumpTween = null;
            console.log('end of bump');
        });
    }

    update(time: number) { //: boolean {
        // var didMove = (this.bumpTween !== null);
        // if (didMove)
            // this.deltaPos.copy(this.position).multiplyScalar(-1);
        TWEEN.update()
        // if (didMove)
            // this.deltaPos.add(this.position);
        // return didMove;
        // console.log(TWEEN.getAll())
    }
}
