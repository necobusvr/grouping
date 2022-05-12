import { common } from './common.js';

/**
 * 初期値のエントリーフォームを作成
 */
(function initElement() {
  for (let i = 0; i < 12; i++) {
    const newEntryDiv = document.createElement("div");
    const newEntry = document.createElement("input");
    const killRate = document.createElement("input");
    const teamMate = document.createElement("div");

    // プレイヤー名入力の親Div作成
    newEntryDiv.setAttribute("class", "entry-player");
    common.entryInner.appendChild(newEntryDiv);

    // プレイヤー名入力 <input> 作成
    newEntry.setAttribute("type", "text");
    newEntry.setAttribute("class", "player-name");
    newEntryDiv.appendChild(newEntry);

    // placeholderを付与し直す
    for (let i = 0; i < common.playerName.length; i++) {
      common.playerName[i].setAttribute("placeholder", `player name ${i + 1}`);
    }

    // キルレート入力 <input> 作成
    killRate.setAttribute("type", "number");
    killRate.setAttribute("class", "kill-rate");
    killRate.setAttribute("step", "0.01");
    killRate.setAttribute("placeholder", "kill rate");
    newEntryDiv.appendChild(killRate);

    // チームメイト指定チェックボック作成
    teamMate.innerHTML = `
    <div class="can-toggle can-toggle--size-small">
      <input id="label_${i + 1}" class="together" type="checkbox">
      <label for="label_${i + 1}">
        <div class="can-toggle__switch" data-checked="Fix" data-unchecked="Free"></div>
      </label>
    </div>
    <span class="close"></span>`;
    newEntryDiv.appendChild(teamMate);
  }
  common.entryInner.insertAdjacentHTML("beforeend", `<div id="add-button"><img src="./image/plus-icon.png" alt="メンバー追加"><div>`);

  // メンバー入力欄の最後にあるプラスアイコン
  const plusButton = document.getElementById("add-button");
  plusButton.addEventListener("click", newPlayerFormCreate);
}());

/**
 * 新しいエントリーフォームを追加
 */
function newPlayerFormCreate() {
  const newEntryDiv = document.createElement("div");
  const newEntry = document.createElement("input");
  const killRate = document.createElement("input");
  const teamMate = document.createElement("div");

  // プレイヤー数
  const playerSum = document.getElementsByClassName("entry-player").length;
  // プレイヤー名入力の親Div作成
  if (playerSum < common.maxPlayer) {
    newEntryDiv.setAttribute("class", "entry-player");
    common.entryInner.appendChild(newEntryDiv);

    // プレイヤー名入力 <input> 作成
    newEntry.setAttribute("type", "text");
    newEntry.setAttribute("class", "player-name");
    newEntryDiv.appendChild(newEntry);

    // キルレート入力 <input> 作成
    killRate.setAttribute("type", "number");
    killRate.setAttribute("class", "kill-rate");
    killRate.setAttribute("step", "0.01");
    killRate.setAttribute("placeholder", "kill rate");
    newEntryDiv.appendChild(killRate);

    // チームメイト指定チェックボック作成
    teamMate.innerHTML = `
    <div class="can-toggle can-toggle--size-small">
      <input id="label_${playerSum + 1}" class="together" type="checkbox">
      <label for="label_${playerSum + 1}">
        <div class="can-toggle__switch" data-checked="Fix" data-unchecked="Free"></div>
      </label>
    </div>
    <span class="close"></span>`;
    newEntryDiv.appendChild(teamMate);
  }
  if (playerSum >= common.maxPlayer) {
    common.tooMuch.innerHTML = `<div class="until24">チーム分けできる人数は${common.maxPlayer}人までです。</div>`;
  }

  // 配列を初期化し最新に書き換える
  entry.createArray();
  // 子要素をすべて消す（リセット）
  common.removeAllChildren(common.entryInner);
  // エントリーリストを作る
  entry.createEntry();
  // 任意のプレイヤーを削除できるように「任意の入力欄を削除する関数」に移動
  entry.deletePlayer();
}

// エントリープレイヤーを削除（最後の欄）する関数
function deleteLastPlayerForm() {
  // プレイヤー数（<input>要素の数）
  const playerSum = document.getElementsByClassName("entry-player").length;
  const playerDiv = document.getElementsByClassName("entry-player")[playerSum - 1];
  //子要素がなければ処理をしない
  if (playerSum === 0) { return };
  playerDiv.remove();
  common.removeAllChildren(common.tooMuch);
  // 配列を初期化し最新に書き換える
  entry.createArray();
}

export let entry = {
  // エントリーリストを作る関数
  createEntry: function () {
    for (let i = 0; i < entry.entryArray.length; i++) {
      const newEntryDiv = document.createElement("div");
      const newEntry = document.createElement("input");
      const killRate = document.createElement("input");
      const teamMate = document.createElement("div");

      // プレイヤー名入力の親Div作成
      newEntryDiv.setAttribute("class", "entry-player");
      common.entryInner.appendChild(newEntryDiv);

      // プレイヤー名入力 <input> 作成
      newEntry.setAttribute("value", `${entry.entryArray[i].player_name}`);
      newEntry.setAttribute("type", "text");
      newEntry.setAttribute("class", "player-name");
      newEntryDiv.appendChild(newEntry);

      // placeholderを付与し直す
      for (let i = 0; i < common.playerName.length; i++) {
        common.playerName[i].setAttribute("placeholder", `player name ${i + 1}`);
      }

      // キルレート入力 <input> 作成
      killRate.setAttribute("value", `${entry.entryArray[i].kill_rate}`);
      killRate.setAttribute("type", "number");
      killRate.setAttribute("class", "kill-rate");
      killRate.setAttribute("step", "0.01");
      killRate.setAttribute("placeholder", "kill rate");
      newEntryDiv.appendChild(killRate);

      // チームメイト指定チェックボック作成
      teamMate.innerHTML = `
      <div class="can-toggle can-toggle--size-small">
        <input id="label_${i + 1}" class="together" type="checkbox" ${entry.entryArray[i].teamMate_check}>
        <label for="label_${i + 1}">
          <div class="can-toggle__switch" data-checked="Fix" data-unchecked="Free"></div>
        </label>
      </div>
      <span class="close"></span>`;
      newEntryDiv.appendChild(teamMate);
    }
    common.entryInner.insertAdjacentHTML("beforeend", `<div id="add-button"><img src="./image/plus-icon.png" alt="メンバー追加"><div>`);

    // メンバー入力欄の最後にあるプラスアイコン
    const plusButton = document.getElementById("add-button");
    plusButton.addEventListener("click", newPlayerFormCreate);
  },

  // 配列を初期化し最新に書き換える関数
  createArray: function () {
    entry.entryArray = [];
    for (let i = 0; i < common.playerName.length; i++) {
      entry.entryArray.push({
        player_name: common.playerName[i].value,
        kill_rate: common.killRate[i].value,
        teamMate_check: common.teamMateCheck[i].checked,
      });

      if (common.teamMateCheck[i].checked == true) {
        entry.entryArray[i].teamMate_check = "checked";
      } else {
        entry.entryArray[i].teamMate_check = "";
      }
    }
  },

  // 任意のエントリープレイヤーを削除する関数
  deletePlayer: function () {
    for (let i = 0; i < common.closeBtnClass.length; i++) {
      common.closeBtnClass[i].addEventListener("click", () => {
        // 配列を初期化し最新に書き換える
        entry.createArray();
        // クリックしたエントリーを配列から削除
        entry.entryArray.splice(i, 1);
        // 子要素をすべて消す（リセット）
        common.removeAllChildren(common.entryInner);
        // エントリーリストを作る
        entry.createEntry();
        // for文を終わらせるために「任意の入力欄を削除する関数」に戻る
        entry.deletePlayer();
      });
    }
  },
};

// プレイヤー名入力欄の追加
common.addButton.addEventListener("click", newPlayerFormCreate);

// プレイヤー名入力欄削除（最後の欄）
common.deleteButton.addEventListener("click", deleteLastPlayerForm);

// 任意のエントリープレイヤーを削除
entry.deletePlayer();
