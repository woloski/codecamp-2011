
TTTColor = { Empty: 0, Cross: 1, Circle: 2 };


function TicTacToeViewModel() {
    this.playerColor = ko.observable(TTTColor.Empty);
    this.winnerColor = ko.observable(TTTColor.Empty);
    this.currentColor = ko.observable(TTTColor.Empty);
    this.isTie = ko.observable(false);
    this.controller = null;

    this.startGame = function () {
        var canvas = document.getElementById("board");
        var board = new TicTacToeBoard(canvas);
        var game = new TicTacToeGame();

        var socket = io.connect('http://localhost:8080');

        this.controller = new TicTacToeController(this, board, game, socket);

        this.controller.start();
    };
}



