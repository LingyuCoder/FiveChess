(function() {

    function getRandomString() {
        return (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace(/\./g, '-');;
    }
    var fiveChess;
    var canvas = document.getElementById('canvas');
    var drawer = new Drawer(canvas);
    var isAI = true;
    var selfColor;
    var name = window.location.hash;
    if (!name) {
        name = getRandomString();
    } else {
        name = name.slice(1);
    }

    var peertc;
    var connector;
    var selfPanel = document.getElementById('selfPanel');
    var enermyPanel = document.getElementById('enermyPanel');
    var playerPanel = document.getElementById('playerPanel');
    var playerBtn = document.getElementById('player');
    var linkBtn = document.getElementById('link');
    var playerStartBtn = document.getElementById('playerStart');
    var playerFailBtn = document.getElementById('playerFail');
    var aiBtn = document.getElementById('ai');

    selfPanel.getElementsByClassName('name')[0].textContent = name;

    function start() {
        fiveChess = new FiveChess();
        drawer.drawBoard();
        gameStart();
    }

    function remoteDrop(x, y, color) {
        if (color === selfColor) {
            throw new Error('Error Color');
        }
        if (color !== fiveChess.state) {
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
        } catch (e) {
            alert(e.message);
        }
    }

    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: (x - bbox.left) * (canvas.width / bbox.width),
            y: (y - bbox.top) * (canvas.height / bbox.height)
        };
    }

    function gameStart() {
        playerFailBtn.classList.remove('hide');
        playerStartBtn.classList.add('hide');
    }

    function gameEnd() {
        playerFailBtn.classList.add('hide');
        playerStartBtn.classList.remove('hide');
    }

    function linkFail() {
        playerFailBtn.classList.add('hide');
        playerStartBtn.classList.add('hide');
        linkBtn.classList.remove('hide');
    }

    function linkSuccess() {
        playerFailBtn.classList.add('hide');
        playerStartBtn.classList.remove('hide');
        linkBtn.classList.add('hide');
    }

    function playerWin() {
        alert('玩家获胜');
        var win = selfPanel.getElementsByClassName('win')[0];
        win.textContent = +win.textContent + 1;
        gameEnd();
    }

    function enermyWin() {
        alert('对手获胜');
        var win = enermyPanel.getElementsByClassName('win')[0];
        win.textContent = +win.textContent + 1;
        gameEnd();
    }
    canvas.onclick = function(e) {
        if (!fiveChess || fiveChess.state === 'end') {
            return;
        }
        if (!isAI && fiveChess.state !== selfColor) {
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
            if (!isAI) {
                connector.send({
                    type: 'drop',
                    data: {
                        color: fiveChess.state,
                        x: x,
                        y: y
                    }
                });
            }
            result = fiveChess.drop(x, y);
            if (result) {
                playerWin();
                fiveChess = void 0;
                return;
            }
            if (isAI) {
                AI = fiveChess.AI();
                drawer.drawChess(AI.x, AI.y, fiveChess.state);
                result = fiveChess.drop(AI.x, AI.y);
                if (result) {
                    enermyWin();
                    fiveChess = void 0;
                    return;
                }
            }
        } catch (e) {
            alert(e.message);
        }
    };

    aiBtn.onclick = function() {
        isAI = true;
        enermyPanel.getElementsByClassName('name')[0].textContent = '电脑';
        enermyPanel.getElementsByClassName('win')[0].textContent = '0';
        selfPanel.getElementsByClassName('win')[0].textContent = '0';
        connector && connector.close();
        linkSuccess();
    };

    playerBtn.onclick = function() {
        isAI = false;
        if (!peertc) {
            peertc = Peertc(WEBSOCKETADDR, name)
            peertc.on('open', function(id) {
                enermyPanel.getElementsByClassName('name')[0].textContent = id;
                enermyPanel.getElementsByClassName('win')[0].textContent = '0';
                selfPanel.getElementsByClassName('win')[0].textContent = '0';
                connector = peertc.connectors[id];
                linkSuccess();
            }).on('close', function(id) {
                alert('与' + id + '的连接断开');
                fiveChess = void 0;
                linkFail();
            }).on('message', function(data, from) {
                switch (data.type) {
                    case 'new':
                        start();
                        selfColor = data.data.color
                        break;
                    case 'drop':
                        remoteDrop(data.data.x, data.data.y, data.data.color);
                        break;
                    case 'end':
                        playerWin();
                        fiveChess = void 0;
                        break;
                }

            }).on('error', function(err) {
                alert('发生错误:  ' + err.message);
            });
        }
        linkFail();
    };

    linkBtn.onclick = function() {
        var playerName = window.prompt("请输入对方名称");
        while (playerName == null || playerName == "") {
            playerName = window.prompt("请输入对方名称");
        }
        connector = peertc.connect(playerName);
    };

    playerStartBtn.onclick = function() {
        if (isAI) {
            start();
        } else {
            start();
            selfColor = 'black';
            connector.send({
                type: 'new',
                data: {
                    color: 'white'
                }
            });
        }
    };

    playerFailBtn.onclick = function() {
        enermyWin();
        fiveChess = void 0;
        if (!isAI) {
            connector.send({
                type: 'end'
            });
        }
    };

    aiBtn.click();
}());