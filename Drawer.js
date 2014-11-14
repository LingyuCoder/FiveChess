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
        var ctx = this.context;
        var canvas = this.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        for (var i = 0; i <= 640; i += 40) { //绘制棋盘的线
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(640, i);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 640);
            ctx.closePath();
            ctx.stroke();
        }
    }

    Drawer.prototype.drawChess = function(x, y, color) {
        this.context.drawImage(imgs[color], x * 40 + 20, y * 40 + 20);
    }
    return Drawer;
}());