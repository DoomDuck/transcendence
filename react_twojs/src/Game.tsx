import React from 'react';
import Two from 'two.js';
import { Circle } from 'two.js/src/shapes/circle';

export default class Game extends React.Component {
  divRef: React.RefObject<HTMLDivElement>;
  two: Two | null;
  ball: Circle | null;
  // const [two, setTwo] = React.useState<Two>({} as Two);
  // const [graphicElements, setGraphicElements] = React.useState({})

  constructor(props: any) {
    super(props);
    this.divRef = React.createRef();
    this.two = null;
    this.ball = null;
    this.resize = this.resize.bind(this);
    // this.state = {
    //   dots: [],
    // }
  }

  // componentWillMount() {
  //   var two = new Two({
  //     type: Two.Types.canvas,
  //     // fullscreen: true,
  //     fitted: true,
  //     autostart: true,
  //   });
  //   this.two = two;
  // }


  // useEffect(() => {
  //   const canvasDOM = document.getElementById("game-surface") as HTMLElement;
  //   setTwo(
  //     new Two({fullscreen: true, domElement: canvasDOM})
  //   );
  // }, []);

  componentDidMount() {
    var two = new Two({
      // type: Two.Types.canvas,
      // fullscreen: true,
      fitted: true,
      autostart: true,
    });
    this.two = two;
    // var two = this.two as Two;
    const div = this.divRef.current as HTMLDivElement;
    two.width = div.clientWidth;
    two.height = div.clientHeight;
    two.appendTo(div)
    // two.bind('resize', this.resize)
    //   .trigger('resize')
    //   .update()
    // this.setState({
    //   right: two.width,
    //   bottom: two.height,
    // })

    console.log(`two.width = ${two.width}, two.height = ${two.height}`)
    console.log(`div.width = ${div.clientWidth}, div.height = ${div.clientHeight}`)
    // var two = new Two({fullscreen: true, domElement: div});
    var dots = [];
    for (var i = 0; i < 11; i++) {
      for (var j = 0; j < 11; j++) {
        var dot = two.makeCircle(i * two.width / 10, j * two.height / 10, 10);
        dot.fill = 'black';
        dots.push(dot);
        two.add(dot);
      }
    }
    this.setState({
      dots: dots,
    });
    this.ball = two.makeCircle(two.width / 2, two.height / 2, 50);
    var ball = this.ball as Circle;
    ball.fill = 'red';
    two.add(ball);
    // this.setState({
    //   // two,
    //   graphicElements: [
    //     ball,
    //   ],
    // });
    // two.bind('update', () => {})
  }

  componentDidUpdate() {
    this.two?.update();
  }

  // useEffect(() => {
  //   // const ball = new Two.Circle(two.width / 2, two.height / 2, 50);
  //   const ball = two.makeCircle(two.width / 2, two.height / 2, 50);
  //   setGraphicElements({
  //     ball: ball,
  //   });
  //   // two.add(ball);
  // }, [two]);

  resize() {
    // this.setState({
    //   right: this.two?.width,
    //   bottom: this.two?.height
    // });

  }

  render() {
    return (
      <div
        id="game-surface"
        ref={this.divRef}
      />
    );
  }
}
// export default function Game() {
//   const [two, setTwo] = React.useState<Two>({} as Two);
//   const [graphicElements, setGraphicElements] = React.useState({})

//   useEffect(() => {
//     const canvasDOM = document.getElementById("game-surface") as HTMLElement;
//     setTwo(
//       new Two({fullscreen: true, domElement: canvasDOM})
//     );
//   }, [])

//   useEffect(() => {
//     // const ball = new Two.Circle(two.width / 2, two.height / 2, 50);
//     const ball = two.makeCircle(two.width / 2, two.height / 2, 50);
//     ball.fill = 'red';
//     setGraphicElements({
//       ball: ball,
//     });
//     // two.add(ball);
//   }, [two]);

//   return <canvas id="game-surface"></canvas>;
// }
