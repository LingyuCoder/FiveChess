var FiveChess = (function() {
    var CHESSES = {
        'none': 0,
        'black': 1,
        'white': 2
    };

    var DIRS = [
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1]
        ],
        [
            [1, 1],
            [-1, -1]
        ],
        [
            [1, -1],
            [-1, 1]
        ]
    ];

    function FiveChess() {
        var board = [];
        for (var i = 16; i--;) {
            board[i] = [];
            for (var j = 16; j--;) {
                board[i][j] = CHESSES['none'];
            }
        }
        this.board = board;
        this.state = 'black';
    }

    FiveChess.prototype.hasChess = function(x, y) {
        return this.board[x][y] !== CHESSES['none'];
    }

    FiveChess.prototype.drop = function(x, y) {
        var board = this.board;
        var state = this.state;
        if (state === 'end') {
            throw new Error('Game ended');
        }
        if (this.hasChess(x, y)) {
            throw new Error('Chess can not be drop here');
        }
        board[x][y] = CHESSES[state];
        if (this.judge(x, y, state)) {
            this.state = 'end';
            return state;
        } else {
            this.state = state === 'black' ? 'white' : 'black';
            return false;
        }
    }

    FiveChess.prototype.judge = function(x, y, color) {
        var board = this.board;
        var count;
        var i, j;
        var curX, curY;
        var curDir;
        for (i = DIRS.length; i--;) {
            count = 1;
            curDir = DIRS[i];
            for (j = 2; j--;) {
                curX = x + curDir[j][0];
                curY = y + curDir[j][1];
                while (board[curX] && board[curY] && board[curX][curY] === CHESSES[color]) {
                    curX += curDir[j][0];
                    curY += curDir[j][1];
                    count++;
                }
            }
            if (count >= 5) {
                return true;
            }
        }
        return false;
    };

    FiveChess.prototype.AI = function() {
        var board = this.board;
        var state = this.state;
        var maxX = 0;
        var maxY = 0;
        var maxWeight = 0;
        var i, j, cur;
        for (i = 15; i--;) {
            for (j = 15; j--;) {
                if (board[i][j] !== CHESSES['none']) {
                    continue;
                }
                cur = this.computeWeight(i, j, state);
                if (cur > maxWeight) {
                    maxWeight = cur;
                    maxX = i;
                    maxY = j;
                }
            }
        }
        return {
            x: maxX,
            y: maxY
        };
    }

    FiveChess.prototype.computeWeight = function(x, y, color) {
        var weight = 14 - (Math.abs(x - 7) + Math.abs(y - 7));
        var pointInfo = {};
        var enermyColor = color === 'black' ? 'white' : 'black';

        for (var i = DIRS.length; i--;) {
            pointInfo = this.putDirect(x, y, color, DIRS[i]);
            weight += this.weightStatus(pointInfo.count, pointInfo.sides, true);
            pointInfo = this.putDirect(x, y, enermyColor, DIRS[i]);
            weight += this.weightStatus(pointInfo.count, pointInfo.sides, false);
        }
        return weight;
    };

    FiveChess.prototype.putDirect = function(x, y, color, dir) {
        var curX, curY;
        var count = 1;
        var sides = [false, false];
        var board = this.board;
        var j;
        for (j = 2; j--;) {
            curX = x + dir[j][0];
            curY = y + dir[j][1];
            while (board[curX] && board[curY]) {
                if (board[curX][curY] === CHESSES[color]) {
                    curX += dir[j][0];
                    curY += dir[j][1];
                    count++;
                } else if (board[curX][curY] === CHESSES['none']) {
                    sides[j] = true;
                    break;
                } else {
                    break;
                }
            }
        }
        return {
            "count": count,
            "sides": sides
        };
    }

    FiveChess.prototype.weightStatus = function(count, sides, isAI) {
        var weight = 0;
        var both = sides[0] && sides[1];
        var single = sides[0] || sides[1];
        switch (count) {
            case 1:
                if (both) {
                    weight = isAI ? 15 : 10;
                }
                break;
            case 2:
                if (both) {
                    weight = isAI ? 100 : 50;
                } else if (single) {
                    weight = isAI ? 10 : 5;
                }
                break;
            case 3:
                if (both) {
                    weight = isAI ? 500 : 200;
                } else if (single) {
                    weight = isAI ? 30 : 20;
                }
                break;
            case 4:
                if (both) {
                    weight = isAI ? 5000 : 2000;
                } else if (single) {
                    weight = isAI ? 400 : 100;
                }
                break;
            case 5:
                weight = isAI ? 100000 : 10000;
                break;
            default:
                weight = isAI ? 500000 : 250000;
                break;
        }
        return weight;
    }

    return FiveChess;
}());