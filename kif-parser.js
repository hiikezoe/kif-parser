(function() {
  var thisModule = {};
  var root, previousModule;

  root = this;
  if (root != null) {
    previousModule = root.parse;
  }

  var noConflict = function() {
    root.parse = previousModule;
    return thisModule;
  };

  var parse_comment_line = function(line) {
    var contents = line.substr(1);
    return contents;
  };

  function _parseZenkakuXY(xy) {
    var kansuuji = [ '一', '二', '三', '四', '五', '六', '七', '八', '九' ];
    return { x: xy.charCodeAt(0) - 0xff10, y: kansuuji.indexOf(xy.charAt(1)) + 1 };
  }

  function _parseAsciiXY(xy) {
    return { x: parseInt(xy.charAt(1)), y: parseInt(xy.charAt(2)) };
  }

  function _isDouMove(charCode) {
    return (charCode == 0x540c);
  }

  function _isNotMove(charCode) {
    return !_isDouMove(charCode) && ((charCode < 0xff11 || charCode > 0xff19));
  }

  function _isValidName(name) {
    return (name != "moves") && (name != "errors");
  }

  var parse_match_info = function(line) {
    strings = line.split('：', 2);
    return {
      name: strings[0],
      value: strings[1]
    };
  };

  var parse_a_move = function(move) {
    var firstCharCode = move.charCodeAt(0);
    if (_isNotMove(firstCharCode)) {
      return move;
    }

    var matches = move.match(/([\uff11-\uff19]\S|\S\s)(\S)(\S*?)(\([1-9]{2}\)|$)/);
    if (!matches) {
      return move;
    }

    var moveObject = {};

    moveObject.piece = matches[2];

    if (matches[4] != "") {
      moveObject.from = _parseAsciiXY(matches[4]);
    }

    var firstChar = matches[1].charAt(0);
    if (!_isDouMove(firstCharCode)) {
      moveObject.to = _parseZenkakuXY(matches[1]);
    }

    if (matches[3] != "") {
      moveObject.aux = matches[3];
    }

    return moveObject;
  };

  var parse_a_move_line = function(line) {
    var matches = line.match(/^\s+(\d+)\s(.+?)\s+\((.*)\)$/);
    if (!matches) {
      return line;
    }

    var move = parse_a_move(matches[2]);

    return {
      index: parseInt(matches[1]),
      move: move,
      move_string: matches[2],
      expended_time: matches[3]
    };
  };

  var parse = function(kifString) {
    var lines = kifString.trim().split('\r\n');

    var kifu = {};
    var moves = [];
    var lastMove;
    for (var i = 0, l = lines.length; i < l; i++) {
      var line = lines[i];
      switch (line.charAt(0)) {
        case '\n':
          break;
        case '#':
          break;
        case '*':
          var comment = parse_comment_line(line);
          if (!lastMove) {
            lastMove = {};
            moves.push(lastMove);
          }
          if (!lastMove.comments) {
            lastMove.comments = [];
          }
          lastMove.comments.push(comment);
          break;
        case ' ':
          var move = parse_a_move_line(line);
          if (move.index != moves.length) {
            return;
          }
          if (move.move && typeof move.move !== 'string' && !move.move.to) {
            move.move.to = moves[moves.length - 1].move.to;
          }
          moves.push(move);
          lastMove = move;
          break;
        default:
          if (!lastMove) {
            var info = parse_match_info(line);
            if (_isValidName(info.name)) {
              kifu[info.name] = info.value;
            }
          } else if (i == l - 1) {
            kifu.result = line;
          } else {
            if (!kifu.errors) {
              kifu.errors = [];
            }
            kifu.errors.push("Error:" + i + " " + line);
          }
          break;
      }
    }
    kifu.moves = moves;
    return kifu;
  };

  thisModule.noConflict = noConflict;
  thisModule.parse = parse;
  thisModule.parse_a_move_line = parse_a_move_line;
  thisModule.parse_a_move = parse_a_move;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = thisModule;
  } else {
    root.KifParser = thisModule;
  }

}());
