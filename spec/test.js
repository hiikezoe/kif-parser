var parser = require('../kif-parser.js');
var sys = require('sys');
var fs = require('fs');

describe('parse_a_move', function() {
  it('銀', function() {
    expect({
      piece: '銀',
      from: { x: 6, y: 9 },
      to: { x: 7, y: 8 },
    }).toEqual(parser.parse_a_move('７八銀(69)'));
  });
  it('成', function() {
    expect({
      piece: '銀',
      from: { x: 6, y: 9 },
      to: { x: 7, y: 8 },
      aux: '成',
    }).toEqual(parser.parse_a_move('７八銀成(69)'));
  });
  it('不成', function() {
    expect({
      piece: '銀',
      from: { x: 6, y: 9 },
      to: { x: 7, y: 8 },
      aux: '不成',
    }).toEqual(parser.parse_a_move('７八銀不成(69)'));
  });
  it('打', function() {
    expect({
      piece: '銀',
      to: { x: 7, y: 8 },
      aux: '打',
    }).toEqual(parser.parse_a_move('７八銀打'));
  });
  it('同', function() {
    expect({
      piece: '銀',
      from: { x: 6, y: 9 },
    }).toEqual(parser.parse_a_move('同　銀(69)'));
  });
  it('投了', function() {
    expect('投了').toEqual(parser.parse_a_move('投了'));
  });
});

describe('parse_a_move_line', function() {
  it('normal', function() {
    expect({
      index: 3,
      move: {
        piece: '銀',
        from: { x: 6, y: 9 },
        to: { x: 7, y: 8 },
      },
      expended_time: " 0:00/00:00:00",
    }).toEqual(parser.parse_a_move_line('   3 ７八銀(69)   ( 0:00/00:00:00)'));
  });
  it('成', function() {
    expect({
      index: 151,
      move: {
        piece: '飛',
        to: { x: 4, y: 2 },
        from: { x: 1, y: 2 },
        aux: '成',
      },
      expended_time: " 0:00/00:00:00",
    }).toEqual(parser.parse_a_move_line(' 151 ４二飛成(12) ( 0:00/00:00:00)'));
  });
  it('打', function() {
    expect({
      index: 149,
      move: {
        piece: '飛',
        to: { x: 1, y: 2 },
        aux: '打',
      },
      expended_time: " 0:00/00:00:00",
    }).toEqual(parser.parse_a_move_line(' 149 １二飛打     ( 0:00/00:00:00)'));
  });
  it('同', function() {
    expect({
      index: 11,
      move: {
        piece: '銀',
        from: { x: 6, y: 9 },
      },
      expended_time: " 0:00/00:00:00",
    }).toEqual(parser.parse_a_move_line('  11 同　銀(69)   ( 0:00/00:00:00)'));
  });
  it('投了', function() {
    expect({
      index: 109,
      move: '投了',
      expended_time: " 0:00/00:00:00",
    }).toEqual(parser.parse_a_move_line(' 109 投了         ( 0:00/00:00:00)'));
  });
});
