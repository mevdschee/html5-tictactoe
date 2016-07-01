function TicTacToePlayer(id) {
	this.id = id;
	this.game = new TicTacToe();
	this.draw();
}

TicTacToePlayer.prototype.draw = function() {
	gameState = this.game.serialize();
	console.log(gameState);
	z = Math.min($(this.id).width()/(3*160),$(this.id).height()/(3*160));
	offsetx = Math.max(0,($(this.id).width()-z*(3*160))/2);
	var html = '<div style="line-height: 0; padding: 0 '+offsetx+'px;">';
	for (var y=0;y<3;y++) {
		for (var x=0;x<3;x++) {
			html+= this.drawCell(gameState.board[x][y],x,y,z,gameState.won);
		}
	}
	html+= '</div>';
	$(this.id).html(html);
	$(this.id+' svg').click(this.clickCard.bind(this));
};

TicTacToePlayer.prototype.drawCell = function(cell,x,y,z,won) {
	var html = '';
	if (cell) {
		var name = 'empty';
		if (cell.player) {
			switch(cell.player) {
				case 'x': name = 'cross'; break;
				case 'o': name = 'circle'; break;
			}
			if (won && !cell.winning) {
				name += '-dim';
			}
		}
		html+='<svg role="img" viewBox="0,0,160,160" '
		html+='data-x="'+x+'" data-y="'+y+'" ';
		html+='width="'+(160*z)+'" height="'+(160*z)+'">';
		html+='<use xlink:href="#'+name+'"/></svg>';
	}
	return html;
};

TicTacToePlayer.prototype.clickCard = function(e) {
	var x = $(e.target).parents('svg').attr('data-x');
	var y = $(e.target).parents('svg').attr('data-y');
	if (this.game.move(x,y)) { 
		this.draw();
	}
	return false;
};

function TicTacToe() {
	this.board = [
		[{},{},{}],
		[{},{},{}],
		[{},{},{}]
	];
	this.players = ['x','o'];
	this.player = 'x';
	this.won = false;
}

TicTacToe.prototype.move = function(x,y) {
	var result = false;
	if (!this.won && !this.board[x][y].player) {
		this.board[x][y].player = this.player;
		this.won = this.hasWon();
		var i = this.players.indexOf(this.player);
		this.player = this.players[(i+1)%this.players.length];
		result = true;
	}
	return result;
}

TicTacToe.prototype.hasWon = function() {
	var count,i,x,y;
	for (y=0;y<3;y++) {
		count = 0;
		for (x=0;x<3;x++) {
			if (this.board[x][y].player==this.player) count++;
		}
		if (count==3) {
			for (x=0;x<3;x++) {
				this.board[x][y].winning=true;
			}
			return true;
		}
	}
	for (x=0;x<3;x++) {
		count = 0;
		for (y=0;y<3;y++) {
			if (this.board[x][y].player==this.player) count++;
		}
		if (count==3) {
			for (y=0;y<3;y++) {
				this.board[x][y].winning=true;
			}
			return true;
		}
	}
	count = 0;
	for (i=0;i<3;i++) {
		if (this.board[i][i].player==this.player) count++;
	}
	if (count==3) {
		for (i=0;i<3;i++) {
			this.board[i][i].winning=true;
		}
		return true;
	}
	count = 0;
	for (i=0;i<3;i++) {
		if (this.board[i][2-i].player==this.player) count++;
	}
	if (count==3) {
		for (i=0;i<3;i++) {
			this.board[i][2-i].winning=true;
		}
		return true;
	}
	return false;
}

TicTacToe.prototype.serialize = function() {
	return { 
		board: jQuery.extend(true, {}, this.board),
		players: jQuery.extend({}, this.players),
		player: this.player,
		won: this.won
	};
}
