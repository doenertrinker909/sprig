const player = "p"
const floor = "s"
const background = "b"
const wallh = "w"
const wallv = "v"
const trash = "t"
const puddle = "n"
const trasher = "r"
let score = 0

setLegend(
  [ player, bitmap`
................
.....000000.....
....00000000....
....00070700....
....00000000....
.3..00000000....
.333330003333...
..33333333333...
...0000000000...
..000000000000..
..000000000000..
..00000000.000..
....0000000.....
....000.0000....
...000...000....
................` ],
  [ trasher, bitmap`
....CCCCCC......
..00C00000C.....
.00C0000000C....
000C0000000C....
000C0330330C....
000C0000000C....
.00C0000000C....
..00C00000C.....
...00C000C0.....
...00000000.....
...00000000.....
...00000000.....
...LL0000LL.....
....000000......
....00L00L......
....0LL0LL......`],
  [ floor, bitmap`
44D4DDDDDDDDD4D4
DDDDD444D44DDDDD
DD44DD44D4441DD4
D1DD4D1DDDDD4DD4
4D444DDDD4DDDDDD
44DD4D4DDDD14DDD
D44DDDDDD4DDDD4D
4444D4444444444D
D44DDD44DDDDDD4D
4DDD1DDDDDD14DDD
DD4444DDDDD4444D
4DDDDD4444DD444D
4444DDDDDDDDDDD4
14D4444DD44444D4
DDDDDD41DDD44414
444DDD44444DDD44`],
  [ wallh, bitmap`
44D4LLL1111LD4D4
DDDD111L11LLDDDD
DD41111LLLL11DD4
D1D111LLLL1114D4
4D4LLLL11LL114DD
4D4111L111LLL44D
DDD111L111L1144D
4D4111L111L1144D
DDD1111LLLL11D4D
4DD1111LLL111D4D
DD4LLLLL1LL1144D
4DD1LL1L11LL1DDD
44D1111L11LLL4D4
14D111LLLLL114D4
DDDD1LL111LL4414
444DLL11111LDD44`],
  [ wallv, bitmap`
4D144D4D4D44DDD4
4D44DDDDDDDD1DD4
4DDDD4DD4D44D4DD
DD111L11111L11D4
L111LL11111L111L
LL11LL11111L111L
1LL11L11LLLLL11L
11LLLLLL1111LLL1
11L111LL1111LL11
11L11LLL111LLL11
1LLLLL1LLLLL1LL1
LL1LL11111L111LL
D41L111111L111DD
D444D4DD44444DD4
41DDD444444DDDDD
4444DDDDDDDD44D4`],
  [ trash, bitmap`
................
......CC........
...CCCCC..1.....
..CC..CC..11999.
..C.C6666661..99
....99....661199
...19999999...1.
..119...999H9.1.
..1.9C9999.H..1.
..66.CC....HC11.
..6..9CC..9CH1..
..6..9.CC.9.H...
..16.99.C99.....
...11.......H...
............HH..
................`],
  [ puddle, bitmap`
44D4DDDDDDD4D4D4
DDDDD444D477DDDD
DD44777777777DD4
D1D77227777777D4
4D772772277777DD
44777777777777DD
D77777777777774D
477777772222774D
D77777777772277D
477222777777777D
DD7772777777777D
4D77777772222777
4447777777772777
14D4477777777777
DDDDDD4177D44414
444DDD44444DDD44`],
)

setSolids([ player, wallv, wallh ])

let level = 0
const levels = [
  map`
.vvv...
...w.wt
.w.w.vv
.w.....
twtvv..`,
  map`
pw..t..
.w.w.w.
.wtw.wt
.w.wtw.
...vvw.`,
  map`
p.....t
vvv.vvv
t.w.w..
v.w.wvv
.......`,
  map`
p.....w
.wvvn.n
nwt....
twn.nvv
.......`,
  map`
pw...n.
tw.n...
tw..rn.
twnn...
.t...n.`,
  map`
sssssss
sssssss
ssspsss
sssssss
sssssss`,
]

setMap(levels[level])
setBackground("s")

setPushables({
  [ player ]: []
})

addSprite(0,0, "p")

addText("Score: " + score, { 
  x: 7,
  y: 0,
  color: color`2`
})

const levelMessages = [
  "Clean the park!",
  "Who did this?",
  "The trash source...",
  "...is near!",
  "Catch him!",
  "Press i to reset"
];

function showLevelText() {
  addText(levelMessages[level], {
    x: 2,
    y: 14,
    color: color`2`
  });
}
showLevelText();

function resetGame() {
  level = 0;
  score = 0;

  setMap(levels[level]);

  const p = getFirst(player);
  if (p) {
    p.x = 0;
    p.y = 0;
  } else {
    addSprite(0, 0, player);
  }

  clearText();
  addText("Score: " + score, { x: 7, y: 0, color: color`2` });
}

onInput("s", () => {
  getFirst(player).y += 1
})
onInput("d", () => {
  getFirst(player).x += 1
})
onInput("a", () => {
  getFirst(player).x -= 1
})
onInput("w", () => {
  getFirst(player).y -= 1
})
onInput("i", () => {
  resetGame();
})

afterInput(() => {
  const p = getFirst(player);
  if (!p) return;

  let drowned = false;

  if (p.x == 6 && (p.y == 3 || p.y == 4)) {
    level += 1;
    if (level < levels.length) {
      setMap(levels[level]);
      p.x = 0; 
      p.y = 0;
    }
  }

  const spritesAtLocation = getTile(p.x, p.y);

  spritesAtLocation.forEach(s => {
    if (s.type === trash) {
      s.remove();
      score += 1;
    }

    if (s.type === puddle) {
      p.x = 0;
      p.y = 0;
      drowned = true;
    }

    if (s.type === trasher) {
      s.remove();
      score += 5;
      level += 1;
      setMap(levels[level])
    }
  });

  clearText();
  
  addText("Score: " + score, { x: 7, y: 0, color: color`2` });
  
  if(level == 5){
    addText("You did it!!!", {x:1,y:9, color: color`2`});
  }
  
  if (drowned) {
    addText("You drowned!", { x: 4, y: 7, color: color`2` });
  } else if (levelMessages[level]) {
    addText(levelMessages[level], { x: 1, y: 14, color: color`2` });
  }
});

setInterval(() => {
  if(level == 5){
    addText("You did it!!!", {x:1,y:9, color: color`2`});
  }
  
  const allTrashers = getAll(trasher);

  allTrashers.forEach(t => {
    const direction = Math.floor(Math.random() * 4);
    let dx = 0;
    let dy = 0;

    if (direction === 0) dx = 1;
    else if (direction === 1) dx = -1;
    else if (direction === 2) dy = 1;
    else if (direction === 3) dy = -1;

    const targetTile = getTile(t.x + dx, t.y + dy);
    const isSolid = targetTile.some(s => [wallv, wallh].includes(s.type));

    if (!isSolid) {
      t.x += dx;
      t.y += dy;
    }
  });
  
  const p = getFirst(player);
  const spritesAtLocation = getTile(p.x, p.y);
  
  spritesAtLocation.forEach(s => {
    if (s.type === trasher) {
      s.remove();
      score += 5;
      clearText();
      level += 1;
      setMap(levels[level])
  
      addText("Score: " + score, { x: 7, y: 0, color: color`2` });
      addText(levelMessages[level], { x: 1, y: 14, color: color`2` });
    }
  });
}, 500);