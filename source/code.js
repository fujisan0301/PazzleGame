let charIMG = [
	'../imgs/Char/Player/trim_0.png',
	'../imgs/Char/Player/trim_1.png',
	'../imgs/Char/Player/trim_2.png',
	'../imgs/Char/Player/trim_b0.png',
	'../imgs/Char/Player/trim_b1.png',
	'../imgs/Char/Player/trim_b2.png',
];
let enemyIMG = [
	'../imgs/Char/Enemy/Enemy_0.png',
];
let bgIMG = [
	'../imgs/TALK_BG.jpg',
];
let soundFILE = [
	[//soundFILE[0]はBGMのパス配列
		'../snds/BGM/Talk_0.mp3',//トークパートで一番最初に流すBGM
		'../snds/BGM/Talk_1.mp3',//セリフ「神主様！」のところからこれに切り替える
		'../snds/BGM/Battle_0.mp3',//戦闘BGMその１
		'../snds/BGM/Battle_1.mp3',//戦闘BGMその２
		'../snds/BGM/Battle_2.mp3',//ラスボス戦
	],
	[//soundFILE[1]はSEのパス配列
		'../snds/SE/Move.mp3',			//移動した
		'../snds/SE/Kick.mp3',			//敵を殴った
		'../snds/SE/MapMove.wav',		//マップを移動
		'../snds/SE/Dash_OpenDoor.wav',	//走ってきてふすまを開ける
	]
];

const FPS = 60;


let Page = -1, old_page = 0, LoadFlag = false;
const TITLE = 0, GAME = 1, TALK = 2;
let up = false, down = false, right = false, left = false, space = false;
let x = 0, P_oldX, y = 0, P_oldY, frame = 0, Life = 20;
let animFrame = 0;
let chara, charStyle, obsStyle;
const MOVE_WAIT = FPS / 10;//移動キーを押したとき、隣のマスに移動するためにかかるフレーム数 //開発環境が165Hzのせいでズレるねん...60Hzだと2が最適(165:60 = 6:xの式より) 
let SCREEN_WIDTH, SCREEN_HEIGHT;
let obsHandle = [], dmgHandle = [], enmHandle = [];
let charHandle = [], enemyHandle = [], bgHandle = [], sndHandle = [];
let bgm;


let screen = document.createElement('div');
screen.id = 'screen';
document.body.appendChild(screen);


function preload() {
	for (let i = 0; i < charIMG.length; i++) {
		let img = document.createElement('img');
		img.src = charIMG[i];
		charHandle.push(img);
	}
	for (let i = 0; i < bgIMG.length; i++) {
		let img = document.createElement('img');
		img.src = bgIMG[i];
		bgHandle.push(img);
	}
	for (let i = 0; i < soundFILE[0].length; i++) {
		let snd = document.createElement('audio');
		snd.src = soundFILE[0][i];
		sndHandle.push(snd);
	}
	for (let i = 0; i < soundFILE[1].length; i++) {
		let snd = document.createElement('audio');
		snd.src = soundFILE[1][i];
		sndHandle.push(snd);
	}
	console.log("LOAD");
}

function deload() {
	for (let i = 0; i < charIMG.length; i++) {
		charHandle.pop();
	}
	for (let i = 0; i < bgIMG.length; i++) {
		bgHandle.pop();
	}
	for (let i = 0; i < soundFILE[0].length; i++) {
		sndHandle.pop();
	}
	for (let i = 0; i < soundFILE[1].length; i++) {
		sndHandle.pop();
	}
	console.log("DELOAD");
}


function main() {
	if (old_page != Page) {
		LoadFlag = false;
		deload();
		preload();
		Init();
	}
	old_page = Page;

	if (Page == -1) {
		Page = 0;
	}

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

	Interval(FPS);

	requestAnimationFrame(main);
}
requestAnimationFrame(main);

function Background(num) {
	let bg = document.createElement('img');
	bg.src = bgHandle[num].src;
	bg.style.position = 'absolute';
	bg.style.width = "100vw";
	bg.style.height = "100vh";
	bg.style.top = 0 + "px";
	bg.style.left = 0 + "px";
	document.getElementById('screen').appendChild(bg);
}

function PLAY() {
	console.log(isPlaying(bgm));
	switch (Page) {
		case TITLE:	//TITLEを描画するメソッド

			break;

		case GAME:	//GAMEを描画するメソッド
			Kick(obsHandle, 0);
			Kick(enmHandle, 1);
			Animation();
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
			while (obsHandle[0] != null) {
				obsHandle.pop();
			}
			while (dmgHandle[0] != null) {
				dmgHandle.pop();
			}
			while (enmHandle[0] != null) {
				enmHandle.pop();
			}
			RenderMap();
			let c = document.createElement('img');
			for (let i = 0; i < charHandle.length; i++) {
				c.src = charHandle[i].src;
			}
			c.id = 'chara';
			chara = c;
			c.style.width = SCREEN_HEIGHT / 10 - SCREEN_HEIGHT / 50 + "px";
			c.style.height = SCREEN_HEIGHT / 10 - SCREEN_HEIGHT / 50 + "px";
			x = 51 * (SCREEN_HEIGHT / 100);
			y = 61 * (SCREEN_HEIGHT / 100);
			c.style.position = 'absolute';
			screen.appendChild(c);
			LoadFlag = true;
			//LIFE
			let l = document.createElement('p');
			let lt = document.createTextNode('LIFE');
			l.appendChild(lt);
			screen.appendChild(l);
			l.style.fontSize = "100px";
			l.style.textAlign = "right";
			l.id = "LIFE";
			bgm = AudioPlayer(0, 2);
			break;

		case TALK:	//TALKパートを描画するメソッド
			bgm = AudioPlayer(0, 0);
			Background(0);
			RenderChar();
			RenderTextBox();
			count = 0;
			serif_num = 0;
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
				if (left) x -= SCREEN_HEIGHT / (MOVE_WAIT * 10);
				if (right) x += SCREEN_HEIGHT / (MOVE_WAIT * 10);
				if (up) y -= SCREEN_HEIGHT / (MOVE_WAIT * 10);
				if (down) y += SCREEN_HEIGHT / (MOVE_WAIT * 10);
			}
			else {
				if (Damage()) {
					if (dmgFlag) if (!old_dmgFlag) Life--;
				}
				old_dmgFlag = dmgFlag;
			}
			if(frame > -2) frame--;

			chara.style.left = x + 'px';
			chara.style.top = y + 'px';
			break;

		case TALK:
			if (space) {
				if (Serif[serif_num].length != count) {
					space = false;
					count = Serif[serif_num].length;
				}
				else {
					document.getElementById('text').innerHTML = "";
					serif_num++;
					if (serif_num > Serif.length - 1) {
						serif_num = 0;
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
					charStyle = window.getComputedStyle(chara);
					P_oldX = Number(charStyle.getPropertyValue('left').replace("px", ""));
					P_oldY = Number(charStyle.getPropertyValue('top').replace("px", ""));
					switch (keycode) {
						case 37: left = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; AudioPlayer(1, 0); break;
						case 38: up = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; AudioPlayer(1, 0);break;
						case 39: right = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; AudioPlayer(1, 0); break;
						case 40: down = true; frame = MOVE_WAIT; Life--; old_dmgFlag = false; AudioPlayer(1, 0);break;
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
		left = false;
		up = false;
		right = false;
		down = false;
	}
}

function RenderMap() {
	//let height = document.documentElement.clientHeight;
	let dmCount = 0, obsCount = 0, eneCount = 0;
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

	for (let i = 0; i < 10; i++) {
		for (let e = 0; e < 10; e++) {
			if (STAGE_HANDLE[i][e] != -1) {
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
				Layer0.appendChild(m);
			}
			switch (STAGE_HANDLE[i][e]) {
				case 1:
					let d = document.createElement('img');
					d.style.position = 'absolute';
					d.src = '../imgs/Damage.png';
					d.id = "damage" + dmCount;
					dmgHandle.push(d);
					dmCount++;
					d.style.width = SCREEN_HEIGHT / 11 + "px";
					d.style.height = SCREEN_HEIGHT / 11 + "px";
					d.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					d.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					Layer0.appendChild(d);
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
					Layer2.appendChild(o);
					break;
				case 3:
					let ene = document.createElement('img');
					ene.src = enemyIMG[0];
					ene.style.position = 'absolute';
					ene.id = "Enemy" + eneCount;
					enmHandle.push(ene);
					eneCount++;
					ene.style.width = SCREEN_HEIGHT / 11 + "px";
					ene.style.height = SCREEN_HEIGHT / 11 + "px";
					ene.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					ene.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					Layer1.appendChild(ene);
					break;
			}
		}
	}
}

function Kick(array, num) {
	array.forEach((item) => {
		let obj = window.getComputedStyle(item);
		let objX = Number(obj.getPropertyValue('left').replace("px", ""));
		let objY = Number(obj.getPropertyValue('top').replace("px", ""));

		if (((x > objX && x - SCREEN_HEIGHT / 75 < objX + SCREEN_HEIGHT / 17) ||
			(objX > x && objX < x + SCREEN_HEIGHT / 17)) &&
			((y > objY && y - SCREEN_HEIGHT / 75 < objY + SCREEN_HEIGHT / 12.3) ||//上
				(objY > y && objY < y + SCREEN_HEIGHT / 11.8))) {//下
			let OBS_judgeDir = SertchAroundObj(objX, objY, item, obsHandle);
			let ENM_judgeDir = SertchAroundObj(objX, objY, item, enmHandle);
			let DMG_judgeDir = SertchAroundObj(objX, objY, item, dmgHandle);

			if (up) {
				if (OBS_judgeDir[0] == 1 || (DMG_judgeDir[0] == 1 && num == 1)) {
					frame = 0;
					y = P_oldY;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[0] == 1) {
					frame = 0;
					y = P_oldY;
					AudioPlayer(1, 1);
				}
				else {
					item.style.top = objY - SCREEN_HEIGHT / 10 + "px";
					up = false;
					y = P_oldY;
					AudioPlayer(1, 1);
				}
			}

			if (down) {
				if (OBS_judgeDir[1] == 1 || (DMG_judgeDir[1] == 1 && num == 1)) {
					frame = 0;
					y = P_oldY;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[1] == 1) {
					frame = 0;
					y = P_oldY;
					AudioPlayer(1, 1);
				}
				else {
					item.style.top = objY + SCREEN_HEIGHT / 10 + "px";
					down = false;
					y = P_oldY;
					AudioPlayer(1, 1);
				}
			}

			if (left) {
				if (OBS_judgeDir[2] == 1 || (DMG_judgeDir[2] == 1 && num == 1)) {
					frame = 0;
					x = P_oldX;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[2] == 1) {
					frame = 0;
					x = P_oldX;
					AudioPlayer(1, 1);
				}
				else {
					item.style.left = objX - SCREEN_HEIGHT / 10 + "px";
					left = false;
					x = P_oldX;
					AudioPlayer(1, 1);
				}
			}

			if (right) {
				if (OBS_judgeDir[3] == 1 || (DMG_judgeDir[3] == 1 && num == 1)) {
					frame = 0;
					x = P_oldX;
					if(num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[3] == 1) {
					frame = 0;
					x = P_oldX;
					AudioPlayer(1, 1);
				}
				else {
					item.style.left = objX + SCREEN_HEIGHT / 10 + "px";
					right = false;
					x = P_oldX;
					AudioPlayer(1, 1);
				}
			}
		}
	});
}


function SertchAroundObj(C_objX, C_objY, C_id, arrayData) {
	let judge_dir = [0, 0, 0, 0];
	//let Style =
	arrayData.forEach((item) => {
		let Style = window.getComputedStyle(item);
		let X = Number(Style.getPropertyValue('left').replace("px", ""));
		let Y = Number(Style.getPropertyValue('top').replace("px", ""));

		if (Math.floor((C_objY - SCREEN_HEIGHT / 10)) == Math.floor(Y) && Math.floor(C_objX) == Math.floor(X)) judge_dir[0] = 1;//障害物の上に障害物がある場合
		if (Math.floor((C_objY + SCREEN_HEIGHT / 10)) == Math.floor(Y) && Math.floor(C_objX) == Math.floor(X)) judge_dir[1] = 1;//障害物の下に障害物がある場合
		if (Math.floor((C_objX - SCREEN_HEIGHT / 10)) == Math.floor(X) && Math.floor(C_objY) == Math.floor(Y)) judge_dir[2] = 1;//障害物の左に障害物がある場合
		if (Math.floor((C_objX + SCREEN_HEIGHT / 10)) == Math.floor(X) && Math.floor(C_objY) == Math.floor(Y)) judge_dir[3] = 1;//障害物の右に障害物がある場合
	});
	return judge_dir;
}

let dmgFlag = false;
let old_dmgFlag = false;
function Damage() {
	for (let i = 0; i < dmgHandle.length; i++) {
		let dmgStyle = window.getComputedStyle(dmgHandle[i]);
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
	c.src = charHandle[0].src;
	c.style.position = 'absolute';
	c.style.maxWidth = SCREEN_WIDTH / 4 + "px";
	c.style.maxHeight = SCREEN_HEIGHT / 1.5 + "px";
	c.style.width = SCREEN_WIDTH + "px";
	c.style.height = SCREEN_HEIGHT + "px";
	c.style.top = (SCREEN_HEIGHT - c.clientHeight) / 10 + "px";
	c.style.left = (SCREEN_WIDTH - SCREEN_WIDTH / 4) /2 +"px";
	screen.appendChild(c);
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
	screen.appendChild(tb);
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
		let serif = Serif[serif_num].substring(0, count);
		text.innerHTML = serif;
		waitcounter = 0;
		if(Serif[serif_num].length > count) count++;
	}
	waitcounter++;
	if (Serif[serif_num].length > 25) {
		text.style.marginLeft = 10 + "em";
		text.style.marginRight = 10 + "em";
	}
	else {
		text.style.marginLeft = 20 + "em";
		text.style.marginRight = 20 + "em";
	}
}

let count = 0;
let serif_num = 0;
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

let now = Date.now();

function Interval(FPS) {
	while (Date.now() - now < 1000 / FPS) {

	}
	now = Date.now();
}

let charAniNum = 1;
let isLookNorth = false;
function Animation() {
	animFrame--;
	if (!up && !left && !right && !down) {
		if (animFrame < 0) {
			animFrame = FPS
			switch (isLookNorth) {
				case true: chara.src = charHandle[charAniNum + 3].src;
					break;
				case false: chara.src = charHandle[charAniNum].src;
					break;
			}

			switch (charAniNum) {
				case 0: charAniNum = 1; break;
				case 1: charAniNum = 2; break;
				case 2: charAniNum = 1; break;
			}
		}
	}
	if (up || left || right || down) {
		switch (animFrame) {
			case 0:
				animFrame = FPS
				switch (isLookNorth) {
					case true: chara.src = charHandle[charAniNum + 3].src;
						break;
					case false: chara.src = charHandle[charAniNum].src;
						break;
				}
				break;
			case 30:
				switch (isLookNorth) {
					case true: chara.src = charHandle[charAniNum + 3].src;
						break;
					case false: chara.src = charHandle[charAniNum].src;
						break;
				}
				break;
		}
		charAniNum++;
		if (charAniNum > 2) {
			charAniNum = 0;
		}
	}
	if (up) {
		chara.src = charHandle[3].src;
		isLookNorth = true;
	}
	if (down) {
		chara.src = charHandle[0].src;
		isLookNorth = false;
	}
}

function AudioPlayer(type, num) {
	let audio = new Audio();
	audio.src = soundFILE[type][num];
	switch (type) {
		case 0:
			audio.loop = true;
			audio.volume = 0.60;
			audio.id = "BGM";
			audio.play();
			screen.appendChild(audio);
			return audio;
		case 1:
			audio.play();
			break;

	}
}

function isPlaying(bgm) {
	let i = new Audio;
	i = bgm;
	return !i.paused;
}
