import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square"
//         onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

//Functional Component.
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  // handleClick(i) {
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  createSquare() {
    let board = [];
    let row = 3;

    for(let i = 1, j = 0; i <= row; i++) {
      const squares = [];
      for (; j < 3 * i; j++) {
        squares.push(<span key={j}>{this.renderSquare(j)}</span>);
        console.log('squares', j, squares);
      }
      board.push(<div key={i} className="board-row">{squares}</div>)
      console.log('board', i, board);
    }
    return board;
  }

  renderSquare(i) {
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }
  render() {
    return (
      <div>
        {this.createSquare()}
      </div>

    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
          squares: Array(9).fill(null),
          currentLocation: '',
          currentStep: 0,
        }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    //const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentLocation: calculatePosition(i),
        currentStep: history.length,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {

      const desc = move ?
        'Go to Move #' + move :
        'Go to game start';

      const currentStep = (move === this.state.stepNumber) ? 'boldmove' : '';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <span className={currentStep}>{`${desc} ${step.currentLocation}`}</span>
          </button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] &&  squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculatePosition(position) {
  const locations = {
    0: ' (0,0)',
    1: ' (0,1)',
    2: ' (0,2)',
    3: ' (1,0)',
    4: ' (1,1)',
    5: ' (1,2)',
    6: ' (2,0)',
    7: ' (2,1)',
    8: ' (2,2)'
  }
  return locations[position];
}

registerServiceWorker();
