// Unbeatable Tic Tac Toe using Minimax with Alpha-Beta pruning
// Compile: g++ -std=c++17 tictactoe.cpp -o tictactoe
// Run:     ./tictactoe   (Windows: tictactoe.exe)

#include <iostream>
#include <algorithm>
#include <limits>
using namespace std;

const int WINS[8][3] = {
    {0,1,2},{3,4,5},{6,7,8},   // rows
    {0,3,6},{1,4,7},{2,5,8},   // columns
    {0,4,8},{2,4,6}            // diagonals
};

char board[9];
char human, ai;
long long nodes;               // positions checked in the last search

// Returns 'X' or 'O' if that player has won, 'D' for a draw, ' ' if the game is still on.
char getResult() {
    for (auto &w : WINS) {
        if (board[w[0]] != ' ' && board[w[0]] == board[w[1]] && board[w[0]] == board[w[2]])
            return board[w[0]];
    }
    for (int i = 0; i < 9; i++)
        if (board[i] == ' ') return ' ';
    return 'D';
}

// Score is from the computer's point of view.
// Faster wins score higher and slower losses score higher.
int minimax(int depth, bool isMax, int alpha, int beta) {
    nodes++;
    char r = getResult();
    if (r == ai)    return 10 - depth;
    if (r == human) return depth - 10;
    if (r == 'D')   return 0;

    if (isMax) {
        int best = numeric_limits<int>::min();
        for (int i = 0; i < 9; i++) {
            if (board[i] != ' ') continue;
            board[i] = ai;
            best = max(best, minimax(depth + 1, false, alpha, beta));
            board[i] = ' ';
            alpha = max(alpha, best);
            if (beta <= alpha) break;      // alpha-beta cut-off
        }
        return best;
    } else {
        int best = numeric_limits<int>::max();
        for (int i = 0; i < 9; i++) {
            if (board[i] != ' ') continue;
            board[i] = human;
            best = min(best, minimax(depth + 1, true, alpha, beta));
            board[i] = ' ';
            beta = min(beta, best);
            if (beta <= alpha) break;
        }
        return best;
    }
}

int bestMove() {
    nodes = 0;
    int best = numeric_limits<int>::min(), move = -1;
    for (int i = 0; i < 9; i++) {
        if (board[i] != ' ') continue;
        board[i] = ai;
        int score = minimax(1, false, numeric_limits<int>::min(), numeric_limits<int>::max());
        board[i] = ' ';
        if (score > best) { best = score; move = i; }
    }
    return move;
}

void printBoard() {
    cout << "\n";
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 3; c++) {
            int i = r * 3 + c;
            // show the cell number (1-9) when empty so the player knows what to type
            cout << " " << (board[i] == ' ' ? char('1' + i) : board[i]) << " ";
            if (c < 2) cout << "|";
        }
        cout << "\n";
        if (r < 2) cout << "---+---+---\n";
    }
    cout << "\n";
}

int readMove() {
    int cell;
    while (true) {
        cout << "Your move (1-9): ";
        if (!(cin >> cell)) {
            if (cin.eof()) exit(0);
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        } else if (cell >= 1 && cell <= 9 && board[cell - 1] == ' ') {
            return cell - 1;
        }
        cout << "Pick an empty cell between 1 and 9.\n";
    }
}

void playGame() {
    fill(board, board + 9, ' ');

    char choice;
    do {
        cout << "Play as X (first) or O (second)? ";
        if (!(cin >> choice)) exit(0);
        choice = toupper(choice);
    } while (choice != 'X' && choice != 'O');

    human = choice;
    ai = (human == 'X') ? 'O' : 'X';

    bool humanTurn = (human == 'X');   // X always moves first

    while (getResult() == ' ') {
        printBoard();
        if (humanTurn) {
            board[readMove()] = human;
        } else {
            int m = bestMove();
            board[m] = ai;
            cout << "Computer plays " << (m + 1) << " (checked " << nodes << " positions)\n";
        }
        humanTurn = !humanTurn;
    }

    printBoard();
    char r = getResult();
    if (r == 'D')        cout << "It's a draw!\n";
    else if (r == human) cout << "You win!\n";
    else                 cout << "Computer wins!\n";
}

int main() {
    cout << "=== Unbeatable Tic Tac Toe (Minimax) ===\n";
    char again;
    do {
        playGame();
        cout << "\nPlay again? (y/n): ";
        cin >> again;
    } while (again == 'y' || again == 'Y');
    cout << "Thanks for playing!\n";
    return 0;
}
