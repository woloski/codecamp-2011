
function TicTacToeController(viewModel, board, game, socket) {
    this.viewModel = viewModel;
    this.board = board;
    this.game = game;
    this.socket = socket;

    this.socket.emit('join', 'singleroom');
    this.socket.on('command', onNewCommand);
    
    var controller = this;

    this.board.onMove = function (x, y) { controller.onMove(x, y); };


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
    this.viewModel.currentColor(TTTColor.Cross);
};

TicTacToeController.prototype.onMove = function (x, y) {
    var color = this.viewModel.currentColor();

    if (!this.game.isValid(x, y, color))
        return;

    this.game.move(x, y, color);

    this.board.drawMove(x, y, color);

    this.updateGameStatus();

    var action = { Type: 1, CommandData: { 'x': x, 'y': y, 'color': color} };
    this.socket.emit('command', action);
};

TicTacToeController.prototype.updateGameStatus = function () {

    if (this.game.isTie()) {
        this.viewModel.isTie(true);
        this.viewModel.currentColor(TTTColor.Empty);
        return;
    }

    if (this.game.hasWinner()) {
        this.viewModel.winnerColor(this.game.getWinner());
        this.viewModel.currentColor(TTTColor.Empty);
        return;
    }

    this.viewModel.currentColor(this.game.nextColor(this.viewModel.currentColor()));

    function nextColor(color) {
        if (color === TTTColor.Cross)
            return TTTColor.Circle;
        if (color === TTTColor.Circle)
            return TTTColor.Cross;
    }
};