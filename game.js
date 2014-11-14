(function() {
    var fiveChess;
    var canvas = document.getElementById('canvas');
    var drawer = new Drawer(canvas);

    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: (x - bbox.left) * (canvas.width / bbox.width),
            y: (y - bbox.top) * (canvas.height / bbox.height)
        };
    }

    function start() {
        fiveChess = new FiveChess();
        drawer.drawBoard();
    }
    canvas.onclick = function(e) {
        if (!fiveChess || fiveChess.state === 'end') {
            return;
        }
        var loc = windowToCanvas(e.clientX, e.clientY);
        var x = parseInt((loc.x - 20) / 40);
        var y = parseInt((loc.y - 20) / 40);
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
                return;
            }
            AI = fiveChess.AI();
            drawer.drawChess(AI.x, AI.y, fiveChess.state);
            result = fiveChess.drop(AI.x, AI.y);
            if (result) {
                alert(result + ' win');
                fiveChess = void 0;
                return;
            }
        } catch (e) {
            alert(e.message);
        }
    };

    document.getElementById('start').onclick = start;

    start();
}());