# Unbeatable Tic Tac Toe (Minimax)

A tic tac toe game where the computer cannot be beaten. It uses the **minimax algorithm with alpha-beta pruning** to search every possible future of the game and always pick the best move. The best a human can do is a draw.

This repo has two versions of the same game:

| Version | Folder | Tech |
|---|---|---|
| Website | `web/` | HTML, CSS, JavaScript |
| Console | `cpp/` | C++17 |

## How it works

- The board is searched recursively. Every finished game gets a score from the computer's point of view:
  - computer wins: `10 - depth`
  - human wins: `depth - 10`
  - draw: `0`
- Using `depth` in the score makes the computer win as fast as possible and lose as slowly as possible.
- The computer's turn maximises the score, the human's turn minimises it.
- **Alpha-beta pruning** skips branches that cannot change the final decision. On an empty board this cuts the search from about 550,000 positions to a few thousand.

## Run the website

Open `web/index.html` in any browser. No build step or server needed.

Features: play as X or O, scoreboard, positions checked and time taken for each computer move, and a toggle to switch alpha-beta pruning on or off so you can compare.

## Run the C++ version

```bash
cd cpp
g++ -std=c++17 tictactoe.cpp -o tictactoe
./tictactoe        # Windows: tictactoe.exe
```

Choose X or O, then type a cell number from 1 to 9 to place your mark.

## Project structure

```
.
├── README.md
├── web/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── cpp/
    └── tictactoe.cpp
```
