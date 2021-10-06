let CharHandle = [
	'../imgs/Char/Player/trim_0.png',
	'../imgs/Char/Player/trim_1.png',
	'../imgs/Char/Player/trim_2.png',
];
let EneHandle = [
	'../imgs/Char/Enemy/Enemy_0.png',
];
let BGHandle = [
	'../imgs/TALK_BG.jpg',
];

let Page = 0, BackGround = 0;
const TITLE = 0, GAME = 1, TALK = 2;
let up = false, down = false, right = false, left = false, space = false;
let x = 0, y = 0, frame = 0, Life = 20;
let chara, charStyle, obsStyle;
let P_oldX, P_oldY, Around_Obs;
const MOVE_WAIT = 10;//移動キーを押したとき、隣のマスに移動するためにかかるフレーム数
const MOVE_DIST = 10;//仕様変更の際はMOVE_WAIT * MOVE_DISTが100になるように調整
const MOVE_OBS = 100;
let dmCount = 0, obsCount = 0;
let old_page = 0;
let LoadFlag = false;
let SCREEN_WIDTH, SCREEN_HEIGHT;
let obsHandle = [], dmgHandle = [], enmHandle = [];

preload();
let screen = document.createElement('div');
screen.id = 'screen';
document.body.appendChild(screen);

function main() {
	if (old_page != Page) {
		LoadFlag = false;
		Init();
	}
	old_page = Page;

	if (LoadFlag) {
		PLAY();
		Control();
	}

	addEventListener("keydown", function () {
		switch (event.keyCode) {
			case 49: Page = 1; break;
			case 50: Page = 2; break;
		}

	}, false);

	requestAnimationFrame(main);
	console.log(frame);
}
requestAnimationFrame(main);

function Background(num) {
	let bg = document.createElement('img');
	bg.src = BGHandle[num];
	bg.style.position = 'absolute';
	bg.style.width = "100vw";
	bg.style.height = "100vh";
	bg.style.top = 0 + "px";
	bg.style.left = 0 + "px";
	document.getElementById('screen').appendChild(bg);
}

function PLAY() {
	switch (Page) {
		case TITLE:	//TITLEを描画するメソッド

			break;

		case GAME:	//GAMEを描画するメソッド
			Kick_Obstacle();
			document.getElementById('LIFE').innerHTML = "LIFE " + Life;
			//Damage();
			break;

		case TALK:	//TALKパートを描画するメソッド
			RenderText();
			break;
	}
}

function Init() {
	frame = 0;
	SCREEN_WIDTH = document.documentElement.clientWidth;
	SCREEN_HEIGHT = document.documentElement.clientHeight;
	while (screen.lastChild) {
		screen.removeChild(screen.lastChild);
	}
	switch (Page) {
		case TITLE:	//TITLEを描画するメソッド

			break;

		case GAME:	//GAMEを描画するメソッド
			RenderMap();
			let c = document.createElement('img');
			c.src = CharHandle[0];
			c.id = 'chara';
			c.style.width = SCREEN_HEIGHT / 10 - SCREEN_HEIGHT / 50 + "px";
			c.style.height = SCREEN_HEIGHT / 10 - SCREEN_HEIGHT / 50 + "px";
			x = 51 * (SCREEN_HEIGHT / 100);
			y = 61 * (SCREEN_HEIGHT / 100);
			c.style.position = 'absolute';
			document.getElementById('screen').appendChild(c);
			LoadFlag = true;
			//LIFE
			let l = document.createElement('p');
			let lt = document.createTextNode('LIFE');
			l.appendChild(lt);
			screen.appendChild(l);
			l.style.fontSize = "100px";
			l.style.textAlign = "right";
			l.id = "LIFE";
			break;

		case TALK:	//TALKパートを描画するメソッド
			Background(0);
			RenderChar();
			RenderTextBox();
			LoadFlag = true;
			break;
	}

}

//GAME
function Control() {
	addEventListener("keydown", KeyDown, false);
	KeyUp();

	switch (Page) {
		case TITLE:
			break;

		case GAME:
			if (frame > 0) {
				if (frame > 7) {
					document.getElementById('chara').src = CharHandle[1];
				}
				if (3 < frame && frame < 7) {
					document.getElementById('chara').src = CharHandle[2];
				}
				if (left) x -= SCREEN_HEIGHT / 100;
				if (right) x += SCREEN_HEIGHT / 100;
				if (up) y -= SCREEN_HEIGHT / 100;
				if (down) y += SCREEN_HEIGHT / 100;
			}
			else {
				if (Damage()) {
					if (dmgFlag) if (!old_dmgFlag) Life--;
				}
				old_dmgFlag = dmgFlag;
			}
			if(frame > -2) frame--;

			document.getElementById('chara').style.left = x + 'px';
			document.getElementById('chara').style.top = y + 'px';
			break;

		case TALK:
			if (space) {
				if (Serif[Num].length != count) {
					space = false;
					count = Serif[Num].length;
				}
				else {
					document.getElementById('text').innerHTML = "";
					Num++;
					if (Num > Serif.length - 1) {
						Num = 0;
					}
					space = false;

					count = 0;
				}
			}
			break;
	}
}

function KeyDown(event) {
	let keycode = event.keyCode;
	switch (Page) {
		case TITLE:
			break;

		case GAME:
			if (frame < 0) {
				if (!up && !down && !left && !right) {
					chara = document.getElementById('chara');
					charStyle = window.getComputedStyle(chara);
					P_oldX = Number(charStyle.getPropertyValue('left').replace("px", ""));
					P_oldY = Number(charStyle.getPropertyValue('top').replace("px", ""));
					switch (keycode) {
						case 37: left = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; break;
						case 38: up = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; break;
						case 39: right = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; break;
						case 40: down = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; break;
					}
				}
			}
			break;

		case TALK:
			if (keycode == 32) {
				space = true;
			}
			break;
	}
}

function KeyUp() {
	if (frame < -1) {
		document.getElementById('chara').src = CharHandle[0];
		left = false;
		up = false;
		right = false;
		down = false;
	}
}

function RenderMap() {
	//let height = document.documentElement.clientHeight;
	obsCount = 0;
	let eneCount = 0;
	let massCount = 0;
	dmCount = 0;
	let Layer0 = document.createElement('div');//床
	Layer0.id = "Layer0";
	let Layer1 = document.createElement('div');//敵
	Layer1.id = "Layer1";
	let Layer2 = document.createElement('div');//障害物
	Layer2.id = "Layer2";
	screen.appendChild(Layer0);
	screen.appendChild(Layer1);
	screen.appendChild(Layer2);
	//マス目生成(開発時のみ使用予定、テクスチャを変えて使用する可能性アリ)
	//for (let i = 0; i < 10; i++) {
	//	for (let j = 0; j < 10; j++) {
	//		let m = document.createElement('img');
	//		m.src = '../imgs/Mass.png';
	//		m.style.position = 'absolute';
	//		if (Math.random() < 0.1) {
	//			m.setAttribute('src', '../imgs/Damage.png');
	//			m.id = "damage" + dmgnum;
	//			dmgnum++;
	//		}
	//		else {
	//			m.id = "mass" + massCount;
	//			massCount++;
	//		}
	//		m.style.width = SCREEN_HEIGHT / 10 + "px";
	//		m.style.height = SCREEN_HEIGHT / 10 + "px";
	//		m.style.top = i * SCREEN_HEIGHT / 10 + "px";
	//		m.style.left = j * SCREEN_HEIGHT / 10 + "px";
	//		document.getElementById('screen').appendChild(m);
	//	}
	//}

	//障害物生成(デバッグ用)
	//for (let i = 0; i < 10; i++) {
	//	let o = document.createElement('img');
	//	o.src = '../imgs/Obstacle.png'
	//	o.style.position = 'absolute';
	//	o.id = "Obs" + i;
	//	o.style.width = SCREEN_HEIGHT / 11 + "px";
	//	o.style.height = SCREEN_HEIGHT / 11 + "px";
	//	o.style.top = SCREEN_HEIGHT / 250 + Math.floor(Math.random() * 10) * SCREEN_HEIGHT / 10 + "px";
	//	o.style.left = SCREEN_HEIGHT / 250 + Math.floor(Math.random() * 10) * SCREEN_HEIGHT / 10 + "px";
	//	document.getElementById('screen').appendChild(o);
	//}
	for (let i = 0; i < 10; i++) {
		for (let e = 0; e < 10; e++) {
			if (STAGE_HANDLE[i][e] != 1) {
				let m = document.createElement('img');
				m.src = '../imgs/Mass.png';
				m.style.position = 'absolute';
				m.id = "mass" + massCount;
				massCount++;
				m.style.width = SCREEN_HEIGHT / 10 + "px";
				m.style.height = SCREEN_HEIGHT / 10 + "px";
				m.style.top = i * SCREEN_HEIGHT / 10 + "px";
				m.style.left = e * SCREEN_HEIGHT / 10 + "px";
				m.style.order = "4";
				document.getElementById('Layer0').appendChild(m);
			}
			switch (STAGE_HANDLE[i][e]) {
				case 1:
					let d = document.createElement('img');
					d.style.position = 'absolute';
					d.src = '../imgs/Damage.png';
					d.id = "damage" + dmCount;
					dmgHandle.push(d);
					dmCount++;
					d.style.width = SCREEN_HEIGHT / 10 + "px";
					d.style.height = SCREEN_HEIGHT / 10 + "px";
					d.style.top = i * SCREEN_HEIGHT / 10 + "px";
					d.style.left = e * SCREEN_HEIGHT / 10 + "px";
					document.getElementById('Layer0').appendChild(d);
					break;
				case 2:
					let o = document.createElement('img');
					o.src = '../imgs/Obstacle.png';
					o.style.position = 'absolute';
					o.id = "Obs" + obsCount;
					obsHandle.push(o);
					obsCount++;
					o.style.width = SCREEN_HEIGHT / 11 + "px";
					o.style.height = SCREEN_HEIGHT / 11 + "px";
					o.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					o.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					document.getElementById('Layer2').appendChild(o);
					break;
				case 3:
					let ene = document.createElement('img');
					ene.src = EneHandle[0];
					ene.style.position = 'absolute';
					ene.id = "Enemy" + eneCount;
					enmHandle.push(ene);
					eneCount++;
					ene.style.width = SCREEN_HEIGHT / 10 + "px";
					ene.style.height = SCREEN_HEIGHT / 10 + "px";
					ene.style.top = i * SCREEN_HEIGHT / 10 + "px";
					ene.style.left = e * SCREEN_HEIGHT / 10 + "px";
					document.getElementById('Layer0').appendChild(ene);
			}
		}
	}
}

function Kick_Obstacle() {
	for (let i = 0; i < obsCount; i++) {
		let id = "Obs" + i;
		let Obs = document.getElementById(id);
		let obsStyle = window.getComputedStyle(Obs);
		let obsX = Number(obsStyle.getPropertyValue('left').replace("px", ""));
		let obsY = Number(obsStyle.getPropertyValue('top').replace("px", ""));

		if (((x > obsX && x - SCREEN_HEIGHT / 75 < obsX + SCREEN_HEIGHT / 17) ||
			(obsX > x && obsX < x + SCREEN_HEIGHT / 17)) &&
			((y > obsY && y - SCREEN_HEIGHT / 75 < obsY + SCREEN_HEIGHT / 12.3) ||//上
				(obsY > y && obsY < y + SCREEN_HEIGHT / 11.8))){//下
			let judge_dir = SertchAroundObstacle(obsX, obsY, i);

			if (up) {
				if (judge_dir[0] == 1) {
					frame = 0;
					y = P_oldY;
				}
				else {
					Obs.style.top = obsY - SCREEN_HEIGHT / 10 + "px";
					up = false;
					y = P_oldY;
				}
			}

			if (down) {
				if (judge_dir[1] == 1) {
					frame = 0;
					y = P_oldY;
				}
				else {
					Obs.style.top = obsY + SCREEN_HEIGHT / 10 + "px";
					down = false;
					y = P_oldY;
				}
			}

			if (left) {
				if (judge_dir[2] == 1) {
					frame = 0;
					x = P_oldX;
				}
				else {
					Obs.style.left = obsX - SCREEN_HEIGHT / 10 + "px";
					left = false;
					x = P_oldX;
				}
			}

			if (right) {
				if (judge_dir[3] == 1) {
					frame = 0;
					x = P_oldX;
				}
				else {
					Obs.style.left = obsX + SCREEN_HEIGHT / 10+ "px";
					right = false;
					x = P_oldX;
				}
			}
		}
	}

}

function SertchAroundObstacle(C_obsX, C_obsY, C_id) {
	let judge_dir = [0, 0, 0, 0];
	for (let i = 0; i < obsCount; i++) {
		let id = "Obs" + i;
		let Obs = document.getElementById(id);
		let obsStyle = window.getComputedStyle(Obs);
		let obsX = Number(obsStyle.getPropertyValue('left').replace("px", ""));
		let obsY = Number(obsStyle.getPropertyValue('top').replace("px", ""));

		if (Math.floor((C_obsY - SCREEN_HEIGHT / 10)) == Math.floor(obsY) && Math.floor(C_obsX) == Math.floor(obsX)) judge_dir[0] = 1;//障害物の上に障害物がある場合
		if (Math.floor((C_obsY + SCREEN_HEIGHT / 10)) == Math.floor(obsY) && Math.floor(C_obsX) == Math.floor(obsX)) judge_dir[1] = 1;//障害物の下に障害物がある場合
		if (Math.floor((C_obsX - SCREEN_HEIGHT / 10)) == Math.floor(obsX) && Math.floor(C_obsY) == Math.floor(obsY)) judge_dir[2] = 1;//障害物の左に障害物がある場合
		if (Math.floor((C_obsX + SCREEN_HEIGHT / 10)) == Math.floor(obsX) && Math.floor(C_obsY) == Math.floor(obsY)) judge_dir[3] = 1;//障害物の右に障害物がある場合
	}
	return judge_dir;
}

let dmgFlag = false;
let old_dmgFlag = false;
function Damage() {
	for (let i = 0; i < dmCount; i++) {
		let id = 'damage' + i;
		let dmg = document.getElementById(id);
		let dmgStyle = window.getComputedStyle(dmg);
		let dmgX = Number(dmgStyle.getPropertyValue('left').replace("px", ""));
		let dmgY = Number(dmgStyle.getPropertyValue('top').replace("px", ""));
		if (((x > dmgX && x - SCREEN_HEIGHT / 75 < dmgX + SCREEN_HEIGHT / 17) ||
			(dmgX > x && dmgX < x + SCREEN_HEIGHT / 17)) &&
			((y > dmgY && y - SCREEN_HEIGHT / 75 < dmgY + SCREEN_HEIGHT / 12.3) ||//上
				(dmgY > y && dmgY < y + SCREEN_HEIGHT / 11.8))){//下
				dmgFlag = true;
				return true;
		}
	}
	dmgFlag = false;
	return false;
}

//TALK
function RenderChar() {
	let c = document.createElement('img');
	c.src = CharHandle[0];
	c.style.position = 'absolute';
	c.style.maxWidth = SCREEN_WIDTH / 4 + "px";
	c.style.maxHeight = SCREEN_HEIGHT / 1.5 + "px";
	c.style.width = SCREEN_WIDTH + "px";
	c.style.height = SCREEN_HEIGHT + "px";
	c.style.top = (SCREEN_HEIGHT - c.clientHeight) / 10 + "px";
	c.style.left = (SCREEN_WIDTH - SCREEN_WIDTH / 4) /2 +"px";
	document.getElementById('screen').appendChild(c);
}

function RenderTextBox() {
	//テキスト背景
	let tb = document.createElement('div');
	tb.id = 'textbox';
	tb.style.position = 'absolute';
	let textboxHeight = SCREEN_HEIGHT / 2.8;
	tb.style.width = "100vw";
	tb.style.height = SCREEN_HEIGHT / 2.8 + "px";
	tb.style.left = 0 + "px";
	tb.style.top = SCREEN_HEIGHT / 1.555 + "px";
	tb.style.backgroundColor = 'black';
	document.getElementById('screen').appendChild(tb);
	//名前
	{
		let p = document.createElement("p");
		let name = document.createTextNode("主人公");
		p.appendChild(name);
		p.id = 'name';
		p.style.textAlign = "center";
		p.style.color = "white";
		p.style.fontSize = textboxHeight / 6.75 + "px";
		p.style.margin = 15 + "px";
		tb.appendChild(p);
	}
	//セリフ
	{
		let div = document.createElement("div");
		let t = document.createTextNode("TEST_TEXT");
		div.appendChild(t);
		div.id = 'text';
		div.style.textAlign = "center";
		div.style.color = "white";
		div.style.fontSize = textboxHeight / 13 + "px";
		div.style.marginLeft = 10 + "em";
		div.style.marginRight = 10 + "em";
		tb.appendChild(div);
	}
}

function RenderText() {
	let text = document.getElementById('text');
	if (waitcounter > SERIF_SPEED) {
		let serif = Serif[Num].substring(0, count);
		text.innerHTML = serif;
		waitcounter = 0;
		if(Serif[Num].length > count) count++;
	}
	waitcounter++;
	if (Serif[Num].length > 25) {
		text.style.marginLeft = 10 + "em";
		text.style.marginRight = 10 + "em";
	}
	else {
		text.style.marginLeft = 20 + "em";
		text.style.marginRight = 20 + "em";
	}
}

let count = 0;
let Num = 0;
let SERIF_SPEED = 2;
let waitcounter = 0;

let CharaName = [
];

let Serif = [
	'明日はこの村の伝統行事「みたま祭」',
	'神社には様々な屋台が立ち並び毎年賑わっている。',
	'その中でも巫女様の神楽は毎年多くの方々が見に来る好評イベントだ。',
	'いまはその神楽の準備をしているところなんだけど...',
	'「ない！ない！！」',
	'「神楽で使う予定だった鉾鈴がない！！」',
	'鉾鈴（画像出す）',
	'別名鈴なりともいう。',
	'鈴には「邪なるものを祓う力」があると考えられ、',
	'澄んだ音で神の御礼を引き付け大きな御神徳を得ようとするものと言われている。',
	'そして神楽にとって必要不可欠なものである。',
	'そんな大切な鉾鈴が...',
	'「どこにもない...」',
	'「神主様！神主様あぁ！」',
	'あたふたしていたところに祭りの準備をしていた青年が訪ねてきた',
	'「神主様先ほど怪異が起こり、妖怪がここの鉾鈴を盗んでいったと町の子供たちが！」',
	'「なに！それは誠か！」',
	'「はい！森の方へ行ったそうです」',
	'神主は急いで森へ駆け出した。',
	'ゲーム画面へ',
];


function preload() {
	for (let i = 0; i < CharHandle.length; i++) {
		let img = document.createElement('img');
		img.src = CharHandle[i];
	}
	for (let i = 0; i < BGHandle.length; i++) {
		let img = document.createElement('img');
		img.src = CharHandle[i];
	}
	console.log("LOAD");
}

//横10、縦10マスで配置、0が床、1がダメ床、2が障害物、3が敵
let STAGE_HANDLE = [
	[1,1,1,1,1,1,1,1,1,1],
	[1,2,0,0,0,0,0,0,2,1],
	[1,0,2,0,0,0,0,2,0,1],
	[1,0,0,2,0,3,2,0,0,1],
	[1,0,0,3,1,1,0,0,0,1],
	[1,0,0,0,1,1,3,0,0,1],
	[1,0,0,2,3,0,2,0,0,1],
	[1,0,2,0,0,0,0,2,0,1],
	[1,2,0,0,0,0,0,0,2,1],
	[1,1,1,1,1,1,1,1,1,1],
];