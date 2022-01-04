"use strict";
let entry = {
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
      const playerName = document.getElementsByClassName("player-name");
      for (let i = 0; i < playerName.length; i++) {
        playerName[i].setAttribute("placeholder", `player name ${i + 1}`);
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
      <div class="checkbox">
        <label class="checkbox__container">
          <input class="together checkbox__toggle" type="checkbox" ${entry.entryArray[i].teamMate_check}>
          <span class="checkbox__checker"></span>
          <span class="checkbox__txt-left">Fix</span>
          <span class="checkbox__txt-right">Free</span>
          <svg class="checkbox__bg" space="preserve" style="enable-background:new 0 0 110 43.76;" version="1.1" viewbox="0 0 110 43.76">
            <path class="shape" d="M88.256,43.76c12.188,0,21.88-9.796,21.88-21.88S100.247,0,88.256,0c-15.745,0-20.67,12.281-33.257,12.281,S38.16,0,21.731,0C9.622,0-0.149,9.796-0.149,21.88s9.672,21.88,21.88,21.88c17.519,0,20.67-13.384,33.263-13.384,S72.784,43.76,88.256,43.76z"></path>
          </svg>
        </label>
      </div>
      <span class="close"></span>`;
      newEntryDiv.appendChild(teamMate);
    }
    common.entryInner.insertAdjacentHTML("beforeend", `<div id="add-button"><img src="./image/plus-icon.png" alt="メンバー追加"><div>`);

    // メンバー入力欄の最後にあるプラスアイコン
    const plusButton = document.getElementById("add-button");
    plusButton.addEventListener("click", entry.newPlayerFormCreate);
  },

  // 配列を初期化し最新に書き換える関数
  createArray: function () {
    entry.entryArray = [];
    for (let i = 0; i < common.playerName.length; i++) {
      entry.entryArray.push({
        player_name: common.playerName[i].value,
        kill_rate: Number(common.killRate[i].value),
        teamMate_check: common.teamMateCheck[i].checked,
      });

      if (common.teamMateCheck[i].checked == true) {
        entry.entryArray[i].teamMate_check = "checked";
      } else {
        entry.entryArray[i].teamMate_check = "";
      }
    }
  },

  // エントリープレイヤーを追加する関数
  addPlayer: function () {
    common.addButton.addEventListener("click", entry.newPlayerFormCreate);
  },

  newPlayerFormCreate: function newCreatePlayer() {
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

      // placeholderを付与し直す
      const playerName = document.getElementsByClassName("player-name");
      for (let i = 0; i < playerName.length; i++) {
        playerName[i].setAttribute("placeholder", `player name ${i + 1}`);
      }

      // キルレート入力 <input> 作成
      killRate.setAttribute("type", "number");
      killRate.setAttribute("class", "kill-rate");
      killRate.setAttribute("step", "0.01");
      killRate.setAttribute("placeholder", "kill rate");
      newEntryDiv.appendChild(killRate);

      // チームメイト指定チェックボック作成
      teamMate.innerHTML = `
      <div class="checkbox">
        <label class="checkbox__container">
          <input class="together checkbox__toggle" type="checkbox">
          <span class="checkbox__checker"></span>
          <span class="checkbox__txt-left">Fix</span>
          <span class="checkbox__txt-right">Free</span>
          <svg class="checkbox__bg" space="preserve" style="enable-background:new 0 0 110 43.76;" version="1.1" viewbox="0 0 110 43.76">
            <path class="shape" d="M88.256,43.76c12.188,0,21.88-9.796,21.88-21.88S100.247,0,88.256,0c-15.745,0-20.67,12.281-33.257,12.281,S38.16,0,21.731,0C9.622,0-0.149,9.796-0.149,21.88s9.672,21.88,21.88,21.88c17.519,0,20.67-13.384,33.263-13.384,S72.784,43.76,88.256,43.76z"></path>
          </svg>
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
    // [class="delete"]の数を動的に取得できるよに入力欄を増やしたら「任意の入力欄を削除する関数」を実行する
    entry.deletePlayer();
  },

  // エントリープレイヤーを削除（最後の欄）する関数
  deleteLastPlayer: function () {
    common.deleteButton.addEventListener("click", () => {
      // プレイヤー数（<input>要素の数）
      const playerSum = document.getElementsByClassName("entry-player").length;
      const playerDiv = document.getElementsByClassName("entry-player")[playerSum - 1];
      playerDiv.remove();
      common.removeAllChildren(common.tooMuch);

      // 配列を初期化し最新に書き換える
      entry.createArray();
    });
  },

  // 任意のエントリープレイヤーを削除する関数
  deletePlayer: function () {
    // 配列を初期化し最新に書き換える
    entry.createArray();

    // 子要素をすべて消す（リセット）
    entry.deleteAllElements();

    // エントリーリストを作る
    entry.createEntry();

    // 任意の要素を削除
    for (let i = 0; i < common.closeBtnClass.length; i++) {
      common.closeBtnClass[i].addEventListener("click", () => {
        // 配列を初期化し最新に書き換える
        entry.createArray();

        // クリックしたエントリーを配列から削除
        entry.entryArray.splice(i, 1);

        // 子要素をすべて消す（リセット）
        entry.deleteAllElements();

        // エントリーリストを作る
        entry.createEntry();

        // for文を終わらせるために「任意の入力欄を削除する関数」に戻る
        entry.deletePlayer();
      });
    }
  },

  // 子要素をすべて消す（リセット）関数
  deleteAllElements: function () {
    while (common.entryInner.firstChild) {
      common.entryInner.removeChild(common.entryInner.firstChild);
    }
  },
};

// プレイヤー名入力欄の追加
entry.addPlayer();

// プレイヤー名入力欄削除（最後の欄）
entry.deleteLastPlayer();

// 任意のエントリープレイヤーを削除
entry.deletePlayer();
