import { Vector3 } from "three";
import { lineCircleIntersection } from "./collision";

test('line circle no inter 1', () => {
    var p1 = new Vector3(-2, 2);
    var p2 = new Vector3(2, 2);
    var center = new Vector3(0, 0);
    var intersections = lineCircleIntersection(p1, p2, center, 1);
    expect(intersections).toEqual([]);
})
