var Drawer = (function() {
    var imgs = {
        'black': new Image(),
        'white': new Image()
    };
    imgs.black.src = 'img/black.png';
    imgs.white.src = 'img/white.png';

    function Drawer(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    Drawer.prototype.drawBoard = function() {
        var context = this.context;
        var canvas = this.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i <= 640; i += 40) { //绘制棋盘的线
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(640, i);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, 640);
            context.closePath();
            context.stroke();
        }
    }

    Drawer.prototype.drawChess = function(x, y, color) {
        this.context.drawImage(imgs[color], x * 40 + 20, y * 40 + 20);
    }
    return Drawer;
}());