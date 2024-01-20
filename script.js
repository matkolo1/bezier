var controls = document.getElementById('control');
var points = 1;
var cordsX = [];
var cordsY = [];
const tin = document.getElementById('tin');
var tv = document.getElementById('tv');
var t = 0;
var out = document.getElementById('out');
var time = 0;
var svg = document.getElementById('svg');
var a = { state0: false, tier: 0 };
var Xout = 0;
var Yout = 0;


function tf() {
  t = tin.value;
  t /= 100;
  tv.innerHTML = t;
  time = t;
  if (a.state0) {
    getData();
  }
}


function addControls() {
  let div = document.createElement('div');
  div.classList.add('point');
  div.id = 'p' + String(points + 1);
  controls.appendChild(div);
  div.innerHTML = `
  <div class="point" id="p${points + 1}">
    <h3> Point ${points + 1} = &#60;
      <input type="number" id="x${points + 1}" placeholder="x">,&nbsp;
      <input type="number" id="y${points + 1}" placeholder="y">&gt;
    </h3>
  </div>
  `
  points++
}

function removeControls() {
  if (points > 1) {
    document.getElementById(`p${points}`).remove();
    points--
  }
}

function getData() {
  for (let i = 0; i <= points; i++) {
    let xin = document.getElementById(`x${i}`).value;
    let yin = document.getElementById(`y${i}`).value;
    if (xin == 0 || xin == NaN || xin == null) cordsX[i] = 0; else cordsX[i] = xin;
    if (yin == 0 || yin == NaN || yin == null) cordsY[i] = 0; else cordsY[i] = yin;

  }
  count(true, t);
  sg();
}

function count(printOut, t) {
  Xout = 0;
  Yout = 0;
  let u = (1 - t);
  let s = points;

  let x = []
  for (let i = 0; i < s; i++) x.push([]);

  x[0] = u ** (s) * cordsX[0];
  for (let i = 1; i - 1 < s - 1; i++) {
    x[i] = u ** (s - i) * t ** (i) * cordsX[i] * (bc(s, i));
  }
  x[s] = t ** (s) * cordsX[s];


  let y = []
  for (let i = 0; i < s; i++) y.push([]);

  y[0] = u ** (s) * cordsY[0];
  for (let i = 1; i - 1 < s - 1; i++) {
    y[i] = u ** (s - i) * t ** (i) * cordsY[i] * (bc(s, i));
  }
  y[s] = t ** (s) * cordsY[s];

  for (let i = 0; i <= s; i++) {
    Xout = Xout + (x[i]);
    Yout = Yout + (y[i]);
  }
  if (printOut) out.innerHTML = `x = ${Xout}<br />y = ${Yout}`;
  else return [Xout, Yout];

}


function bc(n, k) {
  // Výpočet binomického koeficientu C(n, k)
  if (k < 0 || k > n) {
    return 0;
  }
  let result = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) {
    result *= n;
    result /= i;
    n--;
  }
  return result;
}

function drawline() {
  for (let time = 0; time <= 1; time += 0.01) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.appendChild(circle);
    circle.setAttribute('cx', count(false, time)[0] * 15 + 300);
    circle.setAttribute('cy', -count(false, time)[1] * 15 + 300);
    circle.setAttribute('r', 1);
    circle.setAttribute('style', 'fill: yellow; stroke: yellow; stroke-width: 1px;');
  }
}


function sg() {
  svg.innerHTML = '';
  let multiplyer = 15
  drawline();

  for (let i = 0; i <= points; i++) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.appendChild(circle);
    circle.setAttribute('cx', cordsX[i] * multiplyer + 300);
    circle.setAttribute('cy', -cordsY[i] * multiplyer + 300);
    circle.setAttribute('r', 4);
    circle.setAttribute('style', 'fill: none; stroke: black; stroke-width: 2px;');
    circle.setAttribute('id', `point0${i}`);
    a.state0 = true;
    a.tier = 1;
    if (i > 0) {
      a[`line${a.tier}`].push([cordsX[i - 1] * multiplyer + 300, -cordsY[i - 1] * multiplyer + 300, cordsX[i] * multiplyer + 300, -cordsY[i] * multiplyer + 300]);
    } else { a[`line${a.tier}`] = []; }
  }

  lin();
}

function cnt(x1, y1, x2, y2) {
  return [((1 - time) * x1) + (time * x2), ((1 - time) * y1) + (time * y2)]
}

function circl() {
  for (let i in a[`line${a.tier}`]) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.appendChild(circle);
    circle.setAttribute('cx', cnt(a[`line${a.tier}`][i][0], a[`line${a.tier}`][i][1], a[`line${a.tier}`][i][2], a[`line${a.tier}`][i][3])[0]);
    circle.setAttribute('cy', cnt(a[`line${a.tier}`][i][0], a[`line${a.tier}`][i][1], a[`line${a.tier}`][i][2], a[`line${a.tier}`][i][3])[1]);
    circle.setAttribute('r', 4);
    if (points == a.tier) circle.setAttribute('style', 'fill: red; stroke: red; stroke-width: 2px;');
    else circle.setAttribute('style', 'fill: none; stroke: green; stroke-width: 2px;');
    circle.setAttribute('id', `point${a.tier}${i}`);
    if (i > 0) {
      a[`line${a.tier + 1}`].push([
        cnt(a[`line${a.tier}`][i - 1][0], a[`line${a.tier}`][i - 1][1], a[`line${a.tier}`][i - 1][2], a[`line${a.tier}`][i - 1][3])[0],
        cnt(a[`line${a.tier}`][i - 1][0], a[`line${a.tier}`][i - 1][1], a[`line${a.tier}`][i - 1][2], a[`line${a.tier}`][i - 1][3])[1],
        cnt(a[`line${a.tier}`][i][0], a[`line${a.tier}`][i][1], a[`line${a.tier}`][i][2], a[`line${a.tier}`][i][3])[0],
        cnt(a[`line${a.tier}`][i][0], a[`line${a.tier}`][i][1], a[`line${a.tier}`][i][2], a[`line${a.tier}`][i][3])[1],
      ])
    } else a[`line${a.tier + 1}`] = [];
  }
  a.tier++
  if (a[`line${a.tier}`].length > 0) lin();
}

function lin() {
  for (let i in a[`line${a.tier}`]) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg.appendChild(line);
    line.setAttribute('x1', a[`line${a.tier}`][i][0]);
    line.setAttribute('y1', a[`line${a.tier}`][i][1]);
    line.setAttribute('x2', a[`line${a.tier}`][i][2]);
    line.setAttribute('y2', a[`line${a.tier}`][i][3]);
    line.setAttribute('style', 'stroke: black; stroke-width: 2px;')
    line.setAttribute('id', `line${a.tier}${i}`);
  }
  circl();
}