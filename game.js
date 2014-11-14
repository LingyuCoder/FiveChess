(function() {
    var fiveChess;
    var canvas = document.getElementById('canvas');
    var drawer = new Drawer(canvas);
    canvas.onclick = function(e) {
        if (!fiveChess || fiveChess.state === 'end') {
            return;
        }
        var x = parseInt((e.clientX - 20) / 40);
        var y = parseInt((e.clientY - 20) / 40);
        var result, AI;
        if (x >= 15 || x < 0 || y >= 15 || y < 0) {
            return;
        }
        if (fiveChess.hasChess(x, y)) {
            return;
        }
        try {
            drawer.drawChess(x, y, fiveChess.state);
            result = fiveChess.drop(x, y);
            if (result) {
                alert(result + ' win');
                fiveChess = void 0;
            }

            AI = fiveChess.AI();
            drawer.drawChess(AI.x, AI.y, fiveChess.state);
            result = fiveChess.drop(AI.x, AI.y);
            if (result) {
                alert(result + ' win');
                fiveChess = void 0;
            }
        } catch (e) {
            alert(e.message);
        }
    };

    document.getElementById('start').onclick = function() {
        fiveChess = new FiveChess();
        drawer.drawBoard();
    };
}());