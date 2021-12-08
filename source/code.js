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
	'../imgs/Background/TALK_BG.png',
	'../imgs/Background/stage_0.png',
	'../imgs/Background/stage_1.png',
	'../imgs/Background/stage_2.png',
	'../imgs/Background/stage_3.png',
	'../imgs/Background/stage_4.png',
];
let objIMG = [
	'../imgs/obj/stone_1trim.png',
	'../imgs/obj/key.png',
	'../imgs/obj/key_door.png',
];
let ItemIMG = [
	'../imgs/Items/suzu.png',
]
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
		'../snds/SE/Damage.mp3',		//ダメージ床に乗ったとき
		'../snds/SE/MapMove.wav',		//マップを移動
		'../snds/SE/Dash_OpenDoor.wav',	//走ってきてふすまを開ける
	]
];

let Serif = [
	['　', '明日はこの村の伝統行事「みたま祭」'],
	['　', '神社には様々な屋台が立ち並び毎年賑わっている。'],
	['　', 'その中でも巫女様の神楽は毎年多くの方々が見に来る好評イベントだ。'],
	['　', 'いまはその神楽の準備をしているところなんだけど...'],
	['神主', '「ない！ない！！」'],
	['神主', '「神楽で使う予定だった鉾鈴がない！！」'],
	['　', '鉾鈴'],
	['　', '別名鈴なりともいう。'],
	['　', '鈴には「邪なるものを祓う力」があると考えられ、'],
	['　', '澄んだ音で神の御礼を引き付け大きな御神徳を得ようとするものと言われている。'],
	['　', 'そして神楽にとって必要不可欠なものである。'],
	['　', 'そんな大切な鉾鈴が...'],
	['神主', '「どこにもない...」'],
	['村人', '「神主様！神主様あぁ！」'],
	['　', 'あたふたしていたところに祭りの準備をしていた青年が訪ねてきた'],
	['村人', '「神主様先ほど怪異が起こり、妖怪がここの鉾鈴を盗んでいったと町の子供たちが！」'],
	['神主', '「なに！それは誠か！」'],
	['村人', '「はい！森の方へ行ったそうです」'],
	['　', '神主は急いで森へ駆け出した。'],
	['　', 'ゲーム画面へ'],
	['神主', '「鉾鈴は返してもらうぞ！」'],
	['妖魔', '「ぐぁぁぁ」'],
	['　', '無事に鉾鈴を取り戻した神主は急ぎ神社に戻り、巫女様に届けることができました。'],
	['　', 'その後舞を奉納することができ、祭りは大成功を収めた。'],
	['　', 'END'],
];

let posHandle = [//ステージを背景に合わせる用の位置の配列,[x, y]
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
]
const FPS = 60;


let old_stage_num = -2, old_page = -2, LoadFlag = false;
const TITLE = 0, GAME = 1, TALK = 2;
let up = false, down = false, right = false, left = false, space = false;
let LIFE_MAX = 100;
let x = 0, P_oldX, colX = 0, y = 0, P_oldY, colY = 0, frame = 0, Life = LIFE_MAX, dmgFlag = false, keyGet = false;
let animFrame = 0;
let chara, charaCol, charStyle, obsStyle;
const MOVE_WAIT = FPS / 10;
let SCREEN_WIDTH, SCREEN_HEIGHT;
let obsHandle = [], dmgHandle = [], enmHandle = [], goalPoint = [], wallHandle = [], keyPoint = [], keyDoorPoint = [];
let charHandle = [], enemyHandle = [], bgHandle = [], itemHandle = [], objHandle = [];
let bgm;
let spriteBox, nameBox, textBox;
let serifSkipTimer = 0;
let STAGE_HANDLE = [];

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
	for (let i = 0; i < ItemIMG.length; i++) {
		let img = document.createElement('img');
		img.src = ItemIMG[i];
		itemHandle.push(img);
	}
	for (let i = 0; i < objIMG.length; i++) {
		let img = document.createElement('img');
		img.src = objIMG[i];
		objHandle.push(img);
	}
}

function deload() {
	for (let i = 0; i < charIMG.length; i++) {
		charHandle.pop();
	}
	for (let i = 0; i < bgIMG.length; i++) {
		bgHandle.pop();
	}
}

function main() {
	if (page == -1) {
		page = 2;
	}
	if (stage_num == 5) {
		page = 2;
	}

	if (old_page != page || old_stage_num != stage_num) {
		console.log("Init");
		LoadFlag = false;
		deload();
		preload();
		Init();
	}

	old_page = page;
	old_stage_num = stage_num;

	if (LoadFlag) {
		PLAY();
		Control();
		Animation();
	}

	addEventListener("keydown", function () {
		switch (event.keyCode) {
			case 49: page = 1; break;
			case 50: page = 2; break;
		}

	}, false);

	Interval(FPS);


	requestAnimationFrame(main);
}
requestAnimationFrame(main);

function Background(num, width, height) {
	let bg = document.createElement('img');
	bg.src = bgHandle[num].src;
	bg.style.position = 'absolute';
	bg.style.width = width;
	bg.style.height = height;
	bg.style.top = 0 + "px";
	bg.style.left = 0 + "px";
	return bg;
}

function PLAY() {
	switch (page) {
		case TITLE:	//TITLEを描画するメソッド

			break;

		case GAME:	//GAMEを描画するメソッド
			Kick(obsHandle, 0);
			Kick(enmHandle, 1);
			Kick(wallHandle, 0);
			if (DetectNowPoint(goalPoint)) {
				stage_num++;
				Init();
			}

			document.getElementById('LIFE').innerHTML = "LIFE " + Life;
			if (Life <= 0) {
				document.getElementById("LIFE").innerHTML = "Rキーでリスタート";
			}

			//鍵扉処理
			if (DetectNowPoint(keyPoint)) {
				Layer0.removeChild(document.getElementById('Key'));
				keyGet = true;
			}
			if (DetectNowPoint(keyDoorPoint)) {
				if (!keyGet) {
					x = P_oldX;
					y = P_oldY;
					frame = 0;
				}
				else {
					Layer2.removeChild(document.getElementById('KeyDoor'))
					x = P_oldX;
					y = P_oldY;
					frame = 0;
					keyGet = false;
				}
			}
			break;

		case TALK:	//TALKパートを描画するメソッド
			RenderText();
			serifSkipTimer++;
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
	switch (page) {
		case TITLE:	//TITLEを描画するメソッド

			break;

		case GAME:	//GAMEを描画するメソッド
			posHandle[0][0] = SCREEN_HEIGHT / 4;
			posHandle[0][1] = SCREEN_HEIGHT / 5;
			posHandle[1][0] = SCREEN_HEIGHT / 6.58;
			posHandle[1][1] = SCREEN_HEIGHT / 5;
			posHandle[2][0] = SCREEN_HEIGHT / 21;
			posHandle[2][1] = SCREEN_HEIGHT / 5;
			posHandle[3][0] = SCREEN_HEIGHT / 10;
			posHandle[3][1] = SCREEN_HEIGHT / 15;
			//posHandle[4][0] = SCREEN_HEIGHT / 10;
			//posHandle[4][1] = SCREEN_HEIGHT / 7;

			if (GetStage(stage_num) != null) { STAGE_HANDLE = GetStage(stage_num); }
			else { STAGE_HANDLE = GetStage(0); stage_num = 0; }

			RenderMap();
			//LIFE
			let l = document.createElement('div');
			let lt = document.createTextNode('LIFE');
			l.appendChild(lt);
			screen.appendChild(l);
			l.style.fontSize = SCREEN_HEIGHT / 10 + "px";
			l.style.right = "0px";
			l.style.bottom = "0px";
			l.style.position = 'absolute';
			l.id = "LIFE";
			Life = GetStageInfo(stage_num);
			l.innerHTML = "LIFE " + Life;
			isLookNorth = false;

			bgm = AudioPlayer(0, 2);
			LoadFlag = true;
			break;

		case TALK:	//TALKパートを描画するメソッド
			bgm = AudioPlayer(0, 0);
			i = document.createElement("div");
			i.id = "BGLayer";
			i.appendChild(Background(0, SCREEN_WIDTH + "px", SCREEN_HEIGHT + "px"));
			screen.appendChild(i);
			spriteBox = CreateSpriteBox();
			CreateTextBox();
			count = 0;
			LoadFlag = true;
			break;
	}

}

//GAME
function Control() {
	addEventListener("keydown", KeyDown, false);
	KeyUp();

	switch (page) {
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
				if (DetectNowPoint(dmgHandle)) {
					if (!dmgFlag) {
						dmgFlag = true;
						if (Life > 0) {
							Life--;
						} //Life--;
						AudioPlayer(1, 2);
					}
				}
				else dmgFlag = false;
			}
			if (frame > -2) frame--;

			chara.style.left = x + 'px';
			chara.style.top = y + 'px';
			charaCol.style.left = x - SCREEN_HEIGHT / 166.7 + 'px';
			charaCol.style.top = y - SCREEN_HEIGHT / 166.7 + 'px';
			break;

		case TALK:
			if (space) {
				if (Serif[serif_num][1].length != count) {
					space = false;
					count = Serif[serif_num][1].length;
				}
				else {
					if (serifSkipTimer > 10) {
						document.getElementById('text').innerHTML = "";
						serif_num++;
						if (serif_num > Serif.length - 1) {
							serif_num = 0;
						}
						space = false;
						serifSkipTimer = 0;
						count = 0;
					}
				}
			}
			break;
	}
}

function KeyDown(event) {
	let keycode = event.keyCode;
	switch (page) {
		case TITLE:
			break;

		case GAME:
			if (frame < 0) {
				if (!up && !down && !left && !right) {
					if (0 < Life) {
						charStyle = window.getComputedStyle(chara);
						P_oldX = Number(charStyle.getPropertyValue('left').replace("px", ""));
						P_oldY = Number(charStyle.getPropertyValue('top').replace("px", ""));
						switch (keycode) {
							case 37: if (SCREEN_HEIGHT / 10 < x) { left = true; frame = MOVE_WAIT; Life--; dmgFlag = false; AudioPlayer(1, 0); } break;
							case 38: if (SCREEN_HEIGHT / 10 < y) { up = true; frame = MOVE_WAIT; Life--; dmgFlag = false; AudioPlayer(1, 0); } break;
							case 39: if (x < SCREEN_HEIGHT / 10 * (STAGE_HANDLE[0].length - 1)) { right = true; frame = MOVE_WAIT; Life--; dmgFlag = false; AudioPlayer(1, 0); } break;
							case 40: if (y < SCREEN_HEIGHT / 10 * (STAGE_HANDLE.length - 1)) { down = true; frame = MOVE_WAIT; Life--; dmgFlag = false; AudioPlayer(1, 0); } break;
						}
					}
					switch (keycode) {
						case 82:
							Life = GetStageInfo(stage_num);
							isLookNorth = false;
							RenderMap();
							break;
						case 78:
							Life = GetStageInfo(stage_num);
							isLookNorth = false;
							stage_num++;
							//Init();
							//RenderMap();
							break;
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
	while (obsHandle[0] != null) {
		obsHandle.pop();
	}
	while (dmgHandle[0] != null) {
		dmgHandle.pop();
	}
	while (enmHandle[0] != null) {
		enmHandle.pop();
	}
	if (document.getElementById('BGLayer') != null) {
		document.getElementById('BGLayer').remove();
	}

	for (let i = 0; i < 4; i++) {
		if (document.getElementById('Layer' + i) != null) {
			document.getElementById('Layer' + i).remove();
		}
	}
	let dmCount = 0, obsCount = 0, eneCount = 0, massCount = 0;
	let BGLayer = document.createElement('div');//背景レイヤー
	BGLayer.id = "BGLayer";
	let Layer0 = document.createElement('div');//床レイヤー(通常マス、ダメージ、ゴール、鍵)
	Layer0.id = "Layer0";
	let Layer1 = document.createElement('div');//オブジェクトレイヤー(敵、障害物、プレイヤー)
	Layer1.id = "Layer1";
	let Layer2 = document.createElement('div');//シンボルレイヤー(壁、鍵扉)
	Layer2.id = "Layer2";

	BGLayer.appendChild(Background(stage_num + 1, "auto", SCREEN_HEIGHT + "px"));
	screen.appendChild(BGLayer);

	Layer0.style.position = 'absolute';
	Layer1.style.position = 'absolute';
	Layer2.style.position = 'absolute';
	Layer0.style.left = posHandle[stage_num][0] + "px";
	Layer0.style.top = posHandle[stage_num][1] + "px";
	Layer1.style.left = posHandle[stage_num][0] + "px";
	Layer1.style.top = posHandle[stage_num][1] + "px";
	Layer2.style.left = posHandle[stage_num][0] + "px";
	Layer2.style.top = posHandle[stage_num][1] + "px";

	for (let i = 0; i < STAGE_HANDLE.length; i++) {
		for (let e = 0; e < STAGE_HANDLE[i].length; e++) {
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
				//Layer0.appendChild(m);
			}
			switch (STAGE_HANDLE[i][e]) {
				case 1://ダメージ床
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
				case 2://障害物
					let o = document.createElement('img');
					o.src = '../imgs/obj/stone_1trim.png';
					o.style.position = 'absolute';
					o.id = "Obs" + obsCount;
					obsHandle.push(o);
					obsCount++;
					o.style.width = SCREEN_HEIGHT / 11 + "px";
					o.style.height = SCREEN_HEIGHT / 11 + "px";
					o.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					o.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					Layer1.appendChild(o);
					break;
				case 3://敵
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
				case 4://鍵
					let Key = document.createElement('img');
					Key.src = objHandle[1].src;
					Key.style.position = 'absolute';
					Key.id = "Key";
					keyPoint.push(Key);
					Key.style.width = SCREEN_HEIGHT / 11 + "px";
					Key.style.height = SCREEN_HEIGHT / 11 + "px";
					Key.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					Key.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					Layer0.appendChild(Key);
					break;
				case 5://鍵扉
					let kDoor = document.createElement('img');
					kDoor.src = objHandle[2].src;
					kDoor.style.position = 'absolute';
					kDoor.id = "KeyDoor";
					keyDoorPoint.push(kDoor);
					kDoor.style.width = SCREEN_HEIGHT / 11 + "px";
					kDoor.style.height = SCREEN_HEIGHT / 11 + "px";
					kDoor.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					kDoor.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					Layer2.appendChild(kDoor);
					break;
				case 6://ゴール
					let goal = document.createElement('img');
					goal.src = '../imgs/Goal.png';
					goal.style.position = 'absolute';
					goal.id = "Goal";
					goalPoint.push(goal);
					goal.style.width = SCREEN_HEIGHT / 11 + "px";
					goal.style.height = SCREEN_HEIGHT / 11 + "px";
					goal.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
					goal.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
					Layer0.appendChild(goal);
					break;
				case 7://プレイヤー
					{//判定用
						let c = document.createElement('img');
						c.src = '../imgs/collider.png';
						c.id = 'charaCol';
						charaCol = c;
						c.style.width = SCREEN_HEIGHT / 11 + "px";
						c.style.height = SCREEN_HEIGHT / 11 + "px";
						colX = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
						colY = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
						c.style.position = 'absolute';
						Layer1.appendChild(c);
					}
					{//表示用
						let c = document.createElement('img');
						c.src = charHandle[0].src;
						c.id = 'chara';
						chara = c;
						c.style.width = SCREEN_HEIGHT / 10 - SCREEN_HEIGHT / 50 + "px";
						c.style.height = SCREEN_HEIGHT / 10 - SCREEN_HEIGHT / 50 + "px";
						x = (1 + e * 10) * (SCREEN_HEIGHT / 100);
						y = (1 + i * 10) * (SCREEN_HEIGHT / 100);
						c.style.position = 'absolute';
						Layer1.appendChild(c);
					}
					break;
				case 8://壁
					{//判定用
						let w = document.createElement('img');
						w.src = '../imgs/collider.png';
						w.style.position = 'absolute';
						w.id = "Wall";
						wallHandle.push(w);
						w.style.width = SCREEN_HEIGHT / 11 + "px";
						w.style.height = SCREEN_HEIGHT / 11 + "px";
						w.style.top = SCREEN_HEIGHT / 250 + i * SCREEN_HEIGHT / 10 + "px";
						w.style.left = SCREEN_HEIGHT / 250 + e * SCREEN_HEIGHT / 10 + "px";
						Layer2.appendChild(w);
					}
					{//表示用
						let w = document.createElement('img');
						w.src = '../imgs/Wall.png';
						w.style.position = 'absolute';
						w.id = "Wall";
						w.style.width = SCREEN_HEIGHT / 10 + "px";
						w.style.height = SCREEN_HEIGHT / 10 + "px";
						w.style.top = i * SCREEN_HEIGHT / 10 + "px";
						w.style.left = e * SCREEN_HEIGHT / 10 + "px";
						Layer2.appendChild(w);
					}
					break;
			}
		}
	}
	screen.appendChild(Layer0);
	screen.appendChild(Layer1);
	screen.appendChild(Layer2);
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
			let OBS_judgeDir = SertchAroundObj(objX, objY, obsHandle);
			let ENM_judgeDir = SertchAroundObj(objX, objY, enmHandle);
			let DMG_judgeDir = SertchAroundObj(objX, objY, dmgHandle);
			let WALL_judgeDir = SertchAroundObj(objX, objY, wallHandle);
			let KEY_judgeDir = SertchAroundObj(objX, objY, keyPoint);
			let KEY_DOOR_judgeDir = SertchAroundObj(objX, objY, keyDoorPoint);
			let GOAL_judgeDir = SertchAroundObj(objX, objY, goalPoint);

			if (up) {
				if (OBS_judgeDir[0] == 1 || (DMG_judgeDir[0] == 1 && num == 1) || WALL_judgeDir[0] == 1) {
					frame = 0;
					y = P_oldY;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[0] == 1 || WALL_judgeDir[0] == 1 || array == wallHandle || KEY_DOOR_judgeDir[0] == 1 || KEY_judgeDir[0] == 1 || GOAL_judgeDir[0] == 1) {
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
				if (OBS_judgeDir[1] == 1 || (DMG_judgeDir[1] == 1 && num == 1) || WALL_judgeDir[1] == 1) {
					frame = 0;
					y = P_oldY;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[1] == 1 || WALL_judgeDir[1] == 1 || array == wallHandle || KEY_DOOR_judgeDir[1] == 1 || KEY_judgeDir[1] == 1 || GOAL_judgeDir[1] == 1) {
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
				if (OBS_judgeDir[2] == 1 || (DMG_judgeDir[2] == 1 && num == 1) || WALL_judgeDir[2] == 1) {
					frame = 0;
					x = P_oldX;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[2] == 1 || WALL_judgeDir[2] == 1 || array == wallHandle || KEY_DOOR_judgeDir[2] == 1 || KEY_judgeDir[2] == 1 || GOAL_judgeDir[2] == 1) {
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
				if (OBS_judgeDir[3] == 1 || (DMG_judgeDir[3] == 1 && num == 1) || WALL_judgeDir[3] == 1) {
					frame = 0;
					x = P_oldX;
					if (num == 1) Layer1.removeChild(item);
					AudioPlayer(1, 1);
				}
				else if (ENM_judgeDir[3] == 1 || WALL_judgeDir[3] == 1 || array == wallHandle || KEY_DOOR_judgeDir[3] == 1 || KEY_judgeDir[3] == 1 || GOAL_judgeDir[3] == 1) {
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


function SertchAroundObj(C_objX, C_objY, arrayData) {
	let judge_dir = [0, 0, 0, 0];
	arrayData.forEach((item) => {
		let Style = window.getComputedStyle(item);
		let X = Number(Style.getPropertyValue('left').replace("px", ""));
		let Y = Number(Style.getPropertyValue('top').replace("px", ""));

		if (Math.floor((C_objY - SCREEN_HEIGHT / 10)) == Math.floor(Y) && Math.floor(C_objX) == Math.floor(X) || Math.floor((C_objY - SCREEN_HEIGHT / 10)) < 0) judge_dir[0] = 1;//障害物の上に障害物がある場合
		if (Math.floor((C_objY + SCREEN_HEIGHT / 10)) == Math.floor(Y) && Math.floor(C_objX) == Math.floor(X) || Math.floor((C_objY + SCREEN_HEIGHT / 10)) > SCREEN_HEIGHT / 10 * (STAGE_HANDLE.length)) judge_dir[1] = 1;//障害物の下に障害物がある場合
		if (Math.floor((C_objX - SCREEN_HEIGHT / 10)) == Math.floor(X) && Math.floor(C_objY) == Math.floor(Y) || Math.floor((C_objX - SCREEN_HEIGHT / 10)) < 0) judge_dir[2] = 1;//障害物の左に障害物がある場合
		if (Math.floor((C_objX + SCREEN_HEIGHT / 10)) == Math.floor(X) && Math.floor(C_objY) == Math.floor(Y) || Math.floor((C_objX + SCREEN_HEIGHT / 10)) > SCREEN_HEIGHT / 10 * (STAGE_HANDLE[0].length)) judge_dir[3] = 1;//障害物の右に障害物がある場合
	});
	return judge_dir;
}

function DetectNowPoint(Handle) {
	for (let i = 0; i < Handle.length; i++) {
		let style = window.getComputedStyle(Handle[i]);
		let pointX = Number(style.getPropertyValue('left').replace("px", ""));
		let pointY = Number(style.getPropertyValue('top').replace("px", ""));
		if (((x > pointX && x - SCREEN_HEIGHT / 75 < pointX + SCREEN_HEIGHT / 17) ||
			(pointX > x && pointX < x + SCREEN_HEIGHT / 17)) &&
			((y > pointY && y - SCREEN_HEIGHT / 75 < pointY + SCREEN_HEIGHT / 12.3) ||//上
				(pointY > y && pointY < y + SCREEN_HEIGHT / 11.8))) {//下
			return true;
		}
	}
	return false;
}

//TALK
function CreateSpriteBox() {
	let c = document.createElement('div');
	c.style.opacity = '0';
	c.style.background = 'none';
	c.style.backgroundSize = 'cover';
	c.style.backgroundPositionX = '50%';
	c.style.position = 'relative';
	c.style.maxWidth = SCREEN_HEIGHT / 3 + "px";
	c.style.maxHeight = SCREEN_HEIGHT / 3 + "px";
	c.style.width = SCREEN_WIDTH + "px";
	c.style.height = SCREEN_HEIGHT + "px";
	c.style.top = SCREEN_HEIGHT / 6 + "px";
	c.style.margin = 'auto';
	c.style.border = SCREEN_HEIGHT / 100 + "px solid white";
	c.style.borderRadius = "25px 25px 25px 25px / 25px 25px 25px 25px";
	screen.appendChild(c);
	return c;
}

function CreateTextBox() {
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
		let name = document.createTextNode("　");
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
		let t = document.createTextNode("");
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
	nameBox = document.getElementById('name');
	textBox = document.getElementById('text');

	if (waitcounter > SERIF_SPEED) {
		nameBox.innerHTML = Serif[serif_num][0];
		let serif = Serif[serif_num][1].substring(0, count);
		textBox.innerHTML = serif;
		waitcounter = 0;
		if (Serif[serif_num][1].length > count) count++;
	}
	waitcounter++;
}

let count = 0;
let serif_num = 0;
let SERIF_SPEED = 2;
let waitcounter = 0;

let CharaName = [
];

//最大縦横10マス、0床,1ダメ床,2障害物,3敵,4鍵,5扉,6ゴール,7プレイヤー,8進行不可能マス
function GetStage(num) {
	let stage;
	switch (num) {
		case 0:
			return stage = [
				[0, 7, 2, 0, 0],
				[2, 0, 2, 0, 0],
				[0, 8, 8, 8, 2],
				[0, 8, 0, 2, 0],
				[0, 0, 2, 0, 0],
				[0, 2, 2, 0, 6],
			];
		case 1:
			return stage = [
				[8, 0, 0, 7, 5, 6, 8],
				[8, 0, 8, 8, 8, 8, 4],
				[0, 2, 0, 2, 0, 8, 0],
				[2, 0, 8, 2, 0, 8, 0],
				[0, 2, 0, 0, 8, 8, 0],
				[0, 0, 8, 0, 2, 0, 0],
				[0, 0, 0, 0, 0, 2, 0],
			];
		case 2:
			return stage = [
				[0, 8, 0, 2, 0, 0, 3, 0, 6],
				[0, 2, 0, 0, 2, 2, 0, 8, 0],
				[0, 8, 2, 0, 2, 0, 2, 2, 2],
				[0, 8, 3, 2, 2, 2, 0, 2, 3],
				[2, 8, 0, 8, 8, 8, 8, 2, 0],
				[0, 2, 0, 0, 2, 0, 8, 8, 0],
				[0, 7, 0, 2, 0, 0, 0, 0, 0],
			];
		case 3:
			return stage = [
				[8, 8, 8, 8, 0, 0, 0, 0],
				[8, 2, 6, 8, 0, 0, 0, 0],
				[8, 5, 3, 2, 8, 0, 0, 0],
				[8, 0, 0, 2, 0, 8, 8, 8],
				[8, 0, 2, 0, 0, 2, 0, 8],
				[8, 2, 0, 8, 8, 3, 4, 8],
				[8, 0, 2, 3, 2, 8, 2, 8],
				[8, 8, 0, 0, 0, 0, 7, 8],
				[0, 0, 8, 8, 8, 8, 8, 0],
			];
		case 4:
			return stage = [
				[0, 0, 0, 0, 8, 8, 8, 8, 0, 0],
				[0, 0, 0, 0, 8, 6, 0, 8, 8, 8],
				[8, 8, 8, 8, 8, 2, 5, 3, 2, 8],
				[8, 4, 0, 2, 3, 2, 0, 2, 2, 8],
				[8, 3, 2, 0, 3, 8, 2, 3, 0, 8],
				[8, 0, 2, 3, 2, 3, 3, 0, 2, 8],
				[8, 2, 0, 0, 2, 0, 2, 2, 3, 8],
				[8, 0, 2, 0, 0, 2, 0, 0, 2, 8],
				[8, 0, 7, 8, 8, 8, 8, 8, 8, 8],
				[8, 8, 8, 0, 0, 0, 0, 0, 0, 0],
			];
		default: return null;
	}
}
function GetStageInfo(num) {
	switch (num) {
		case 0: return 15;
		case 1: return 48;
		case 2: return 20;
		case 3: return 29;
		case 4: return 39;
	}
}

let now = Date.now();

function Interval(FPS) {
	while (Date.now() - now < 1000 / FPS) {

	}
	now = Date.now();
}

let charAniNum = 1;
let isLookNorth = false;
let Flag = false;
function Animation() {
	switch (page) {
		case TITLE:
			break;

		case GAME:
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
			break;

		case TALK:
			//イベント内容を書き込む
			switch (serif_num) {
				case 6:
					spriteBox.style.background = 'url(' + itemHandle[0].src + ')';
					spriteBox.style.backgroundColor = 'black';
					spriteBox.style.backgroundSize = '40%';
					spriteBox.style.backgroundRepeat = 'no-repeat';
					spriteBox.style.backgroundPositionX = '50%';
					spriteBox.style.backgroundPositionY = '45%';
					spriteBox.style.opacity = animFrame;
					animFrame += 0.1;
					break;
				case 7:
					spriteBox.style.opacity = '1';
					break;
				case 12:
					spriteBox.style.opacity = '0';
					if (!Flag) {
						bgm.pause();
						bgm = AudioPlayer(0, 1);
						Flag = true;
					}
					break;
				case 19:
					bgm.pause();
					page = 1;
					serif_num++;
					break;
			}
			break;
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
			if (document.getElementById('BGM') == null) screen.appendChild(audio);
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