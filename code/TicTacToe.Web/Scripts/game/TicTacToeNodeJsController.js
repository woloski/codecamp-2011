﻿
function TicTacToeController(viewModel, board, game, socket)
{
    this.viewModel = viewModel;
    this.board = board;
    this.game = game;
    this.started = false;
    this.joined = false;
    this.socket = socket;

    var controller = this;

    this.board.onMove = function (x, y) { controller.onMove(x, y); };
	
	var users = ['User1', 'User2'];
    this.viewModel.players(users);
    this.viewModel.noPlayers(users.length);


    this.socket.emit('join', 'tictactoe');
    this.socket.on('command', onNewCommand);
    this.viewModel.gameId('tictactoe');
    this.joined = true;
	this.started = true;

    function onNewCommand(gameAction) {
        if (gameAction.Type != 1)
            return;
        
        var x = parseInt(gameAction.CommandData.x);
        var y = parseInt(gameAction.CommandData.y);
        var color = gameAction.CommandData.color;

        if (!controller.game.isValid(x, y, color))
            return;

        controller.game.move(x, y, color);
        controller.board.drawMove(x, y, color);
        controller.updateGameStatus();
    }
};

TicTacToeController.prototype.start = function () {
    if (this.viewModel.gameQueueId() != null) {
        this.viewModel.playerColor(TTTColor.Cross);
    }
    else {
        this.viewModel.playerColor(TTTColor.Circle);
        var controller = this;
        controller.viewModel.isOwner(true);
        controller.setGameQueueId("room");
        controller.viewModel.inviteURL(document.location.href + "?id=" + "room");
    }
};

TicTacToeController.prototype.updateGameStatus = function () {
    if (this.game.isTie()) {
        this.viewModel.isTie(true);
        this.viewModel.currentColor(TTTColor.Empty);
    }
    else if (this.game.hasWinner()) {
        this.viewModel.winnerColor(this.game.getWinner());
        this.viewModel.currentColor(TTTColor.Empty);
    }
    else
        this.viewModel.currentColor(this.game.nextColor(this.viewModel.currentColor()));
};

TicTacToeController.prototype.onMove = function (x, y) {
    if (this.viewModel.playerColor() != this.viewModel.currentColor())
        return;

    var color = this.viewModel.playerColor();

    if (!this.game.isValid(x, y, color))
        return;

    this.game.move(x, y, color);
    this.board.drawMove(x, y, color);

    this.updateGameStatus();

    var action = { Type: 1, CommandData: { x: x, y: y, color: color }};
    var gameId = this.viewModel.gameId();

    this.socket.emit('command', action);
};

TicTacToeController.prototype.setGameQueueId = function (gameQueueId) {
    this.viewModel.gameQueueId(gameQueueId);
};
