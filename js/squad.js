"use strict";
const memberInner = document.getElementById("member-inner");
const memberButton = document.getElementById("add");
const removeMemberButton = document.getElementById("remove");
const tooMuch = document.getElementById("error-too-much-member");

/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    // 子どもの要素があるかぎり削除
    element.removeChild(element.firstChild);
  }
}
// プレイヤー名入力欄の追加
memberButton.onclick = function () {
  const newMemberDiv = document.createElement("div");
  const newMember = document.createElement("input");
  const killRate = document.createElement("input");
  const teamMate = document.createElement("div");
  // プレイヤー数（<input>要素の数）
  const playerSum = memberInner.childElementCount;

  // プレイヤー名入力の親Div作成
  if (playerSum < 24) {
    newMemberDiv.setAttribute("class", "player");
    memberInner.appendChild(newMemberDiv);

    // プレイヤー名入力 <input> 作成
    newMember.setAttribute("type", "text");
    newMember.setAttribute("id", `player-name${playerSum + 1}`);
    newMember.setAttribute("class", "player-name");
    newMember.setAttribute("placeholder", `player name ${playerSum + 1}`);
    newMemberDiv.appendChild(newMember);

    // キルレート入力 <input> 作成
    killRate.setAttribute("type", "number");
    killRate.setAttribute("id", `kill-rate${playerSum + 1}`);
    killRate.setAttribute("class", "kill-rate");
    killRate.setAttribute("step", "0.01");
    killRate.setAttribute("placeholder", "kill rate");
    newMemberDiv.appendChild(killRate);

    // チームメイト指定チェックボック作成
    teamMate.innerHTML = `
    <div class="checkbox">
      <label class="checkbox__container">
        <input id="team-mate${playerSum + 1}" class="checkbox__toggle" type="checkbox">
        <span class="checkbox__checker"></span>
        <span class="checkbox__txt-left">Fix</span>
        <span class="checkbox__txt-right">Free</span>
        <svg class="checkbox__bg" space="preserve" style="enable-background:new 0 0 110 43.76;" version="1.1" viewbox="0 0 110 43.76">
          <path class="shape" d="M88.256,43.76c12.188,0,21.88-9.796,21.88-21.88S100.247,0,88.256,0c-15.745,0-20.67,12.281-33.257,12.281,S38.16,0,21.731,0C9.622,0-0.149,9.796-0.149,21.88s9.672,21.88,21.88,21.88c17.519,0,20.67-13.384,33.263-13.384,S72.784,43.76,88.256,43.76z"></path>
        </svg>
      </label>
    </div>`;
    newMemberDiv.appendChild(teamMate);
  }

  if (playerSum >= 24) {
    tooMuch.innerHTML = '<div class="until24">チーム分けできる人数は24人までです。</div>';
  }
};

// プレイヤー名入力欄の削除
removeMemberButton.onclick = function () {
  // プレイヤー数（<input>要素の数）
  const playerSum = memberInner.childElementCount;
  let playerDiv = document.getElementsByClassName("player")[playerSum - 1];
  playerDiv.remove();
  removeAllChildren(tooMuch);
};

/**
 * チーム決め抽選
 */
const raffleButton = document.getElementById("raffle");
raffleButton.onclick = function () {
  //メンバーの配列を作る
  let member = [];
  const playerSum = memberInner.childElementCount;
  for (let i = 0; i < playerSum; i++) {
    let playerName = document.getElementById(`player-name${i + 1}`);
    let killRate = document.getElementById(`kill-rate${i + 1}`);
    let teamMateCheck = document.getElementById(`team-mate${i + 1}`);
    member.push({
      player_name: playerName.value,
      kill_rate: Number(killRate.value),
      teamMate_check: teamMateCheck.checked,
    });
  }

  const errorPlayerName = document.getElementById("error-player-name");
  const errorKillRate = document.getElementById("error-kill-rate");
  const errorTeamMate = document.getElementById("error-team-mate");
  const errorRaffle = document.getElementById("error-raffle");
  const successRaffle = document.getElementById("success-raffle");

  //子要素があれば削除
  removeAllChildren(errorPlayerName);
  removeAllChildren(errorKillRate);
  removeAllChildren(errorTeamMate);
  removeAllChildren(errorRaffle);
  removeAllChildren(successRaffle);
  removeAllChildren(tooMuch);

  /**
   * 同じスクワッドにしたいときの処理
   * @returns {boolean} メンバー固定が不適切なら false
   */
  const teamMateErrorCheck = () => {
    let teamMateCount = 0;
    for (let i = 0; i < member.length; i++) {
      if (member[i]["teamMate_check"]) {
        teamMateCount++;
      }
    }
    for (let j = 2; j < 12; j++) {
      if (SquadPlayerSum == j && teamMateCount > j) {
        return false;
      }
    }
    if (teamMateCount == 1) {
      return false;
    }
  };

  // 抽選結果の表示場所
  const groupDiv = document.getElementById("group");
  removeAllChildren(groupDiv);

  // 入力されていないフィールドのエラーメッセージ
  for (let i = 0; i < member.length; i++) {
    if (member[i].player_name == false) {
      errorPlayerName.innerText = `${i + 1}番目のプレイヤー名が入力されていません。`;
      return false;
    }
    if (member[i].kill_rate == false) {
      errorKillRate.innerText = `${i + 1}番目のキルレートが入力されていません。`;
      return false;
    }
  }

  // トータルキルレート値
  const killRateSum = member.reduce((sum, i) => sum + i.kill_rate, 0);
  // 平均のキルレート値
  const killRateAverage = killRateSum / member.length;
  // 抽選する条件
  const SquadPlayerSum = Number(document.getElementById("squad-player").value);
  const adjust = Number(document.getElementById("adjust").value);

  /**
   * 配列をシャッフルする関
   * @returns {array}
   */
  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  /**
   * 組み合わせ抽選の処理
   */
  let count = 1;
  let limit = 2000;
  if (teamMateErrorCheck() !== false) {
    while (count <= limit) {
      //シャッフルした配列
      let shuffleArray = shuffle(member);

      /**
       * 配列の中身を移動する関数
       */
      function array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
            arr.Push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      }

      for (let i = 0; i < shuffleArray.length; i++) {
        let teamMateChecked = shuffleArray[i]["teamMate_check"];
        if (teamMateChecked) {
          // カップルのチェックボックスが true なら シャッフルした配列の先頭に移動する
          array_move(shuffleArray, i, 0);
        }
      }

      /**
       * while for文でチーム分けするために配列を分割
       */
      let squadArray = [];
      let k = 0;
      let m = 0;
      // 抽選されたスクワッドの平均キルレート
      let squadKillRateSum;
      let squadKillRateSumArray = [];
      let squadKillRateAverageArray = [];
      let squadKillRateSumArrayVirtual = [];

      // ラジオボックスのチェック確認
      const squadFraction2 = document.getElementById("squad-fraction-2");
      const squadFraction4 = document.getElementById("squad-fraction-4");
      const adjustIrregular = document.getElementById("adjust-irregular");

      // 最後のスクワッドを作る処理
      if (playerSum % SquadPlayerSum == 1) {
        while (k < playerSum) {
          // 余りが1人で2人組スクワッドを2つ作る場合
          if (k == playerSum - 4 && squadFraction2.checked) {
            // シャッフルされたメンバーの配列をスクワッド毎に分割
            squadArray.push(shuffleArray.slice(k, playerSum - 2));
            squadArray.push(shuffleArray.slice(k + 2, playerSum));
            squadKillRateSum = squadArray[m].reduce((sum, j) => sum + j.kill_rate, 0);
            // キルレートの合計を配列に追加
            squadKillRateSumArray.push(squadKillRateSum);
            // 平均キルレートを配列に追加
            squadKillRateAverageArray.push(squadKillRateSum / squadArray[m].length);
            // 調整した仮想キルレートを配列に追加
            squadKillRateSumArrayVirtual.push(squadKillRateSum * adjustIrregular.value);
            squadKillRateSum = squadArray[m + 1].reduce((sum, j) => sum + j.kill_rate, 0);
            // キルレートの合計を配列に追加
            squadKillRateSumArray.push(squadKillRateSum);
            // 平均キルレートを配列に追加
            squadKillRateAverageArray.push(squadKillRateSum / squadArray[m + 1].length);
            k = k + SquadPlayerSum;
            // 調整した仮想キルレートを配列に追加
            squadKillRateSumArrayVirtual.push(squadKillRateSum * adjustIrregular.value);
          }
          // 余りが1人で4人組スクワッドを1つ作る場合
          else if (k == playerSum - 4 && squadFraction4.checked) {
            // シャッフルされたメンバーの配列をスクワッド毎に分割
            squadArray.push(shuffleArray.slice(k, playerSum));
            squadKillRateSum = squadArray[m].reduce((sum, j) => sum + j.kill_rate, 0);
            // キルレートの合計を配列に追加
            squadKillRateSumArray.push(squadKillRateSum);
            // 平均キルレートを配列に追加
            squadKillRateAverageArray.push(squadKillRateSum / squadArray[m].length);
            k = k + SquadPlayerSum + 1;
            // 調整した仮想キルレートを配列に追加
            squadKillRateSumArrayVirtual.push(squadKillRateSum * adjustIrregular.value);
          }
          // 通常の処理
          else {
            // シャッフルされたメンバーの配列をスクワッド毎に分割
            squadArray.push(shuffleArray.slice(k, k + SquadPlayerSum));
            squadKillRateSum = squadArray[m].reduce((sum, j) => sum + j.kill_rate, 0);
            // キルレートの合計を配列に追加
            squadKillRateSumArray.push(squadKillRateSum);
            // 平均キルレートを配列に追加
            squadKillRateAverageArray.push(squadKillRateSum / squadArray[m].length);
            // 調整用仮想キルレートを配列に追加（調整なし）
            squadKillRateSumArrayVirtual.push(squadKillRateSum);
          }
          (k = k + SquadPlayerSum), m++;
        }
      }
      // 通常の処理
      else {
        for (let i = 0; i < playerSum; i = i + SquadPlayerSum, m++) {
          // シャッフルされたメンバーの配列をスクワッド毎に分割
          squadArray.push(shuffleArray.slice(i, i + SquadPlayerSum));
          squadKillRateSum = squadArray[m].reduce((sum, j) => sum + j.kill_rate, 0);
          // キルレートの合計を配列に追加
          squadKillRateSumArray.push(squadKillRateSum);
          // 平均キルレートを配列に追加
          squadKillRateAverageArray.push(squadKillRateSum / squadArray[m].length);
          // 調整用仮想キルレートを配列に追加（調整なし）
          squadKillRateSumArrayVirtual.push(squadKillRateSum);
        }
      }

      /**
       * 組み合わせを作る関数
       * @returns {Array}
       */
      const subtraction = (nums, k) => {
        let array = [];
        if (nums.length < k) {
          return [];
        }
        if (k === 1) {
          for (let i = 0; i < nums.length; i++) {
            array[i] = [nums[i]];
          }
        } else {
          for (let i = 0; i < nums.length - k + 1; i++) {
            let row = subtraction(nums.slice(i + 1), k - 1);
            for (let j = 0; j < row.length; j++) {
              array.push([nums[i]].concat(row[j]));
            }
          }
        }
        return array;
      };

      /**
       * すべてのスクワッドの合計キルレートの差分を判定
       * @returns {boolean} すべてのスクワッドの合計キルレートの差分が調整範囲(adjust)以内なら true
       */
      const compare = () => {
        let diffArray = subtraction(squadKillRateSumArrayVirtual, 2);
        let diffResultArray = [];
        // すべてのスクワッドのキルレートの差分を配列にする
        for (let i = 0; i < diffArray.length; i++) {
          // 2つのスクワッドの平均キルレートの差を正数で返す
          let diff = Math.abs(diffArray[i][0] - diffArray[i][1]);
          diffResultArray.push(diff);
        }
        const isBelowThreshold = (currentValue) => currentValue < adjust;
        return diffResultArray.every(isBelowThreshold);
      };

      /**
       * スクワッドの最大最小キルレートを変数にする
       */
      const aryMax = function (first, second) {
        return Math.max(first, second);
      };
      const aryMin = function (first, second) {
        return Math.min(first, second);
      };
      const squadMaxKillRate = squadKillRateSumArray.reduce(aryMax);
      const squadMinKillRate = squadKillRateSumArray.reduce(aryMin);
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      if (compare()) {
        // 抽選された各スクワッドの平均キルレートと全体の平均キルレートを比較し条件分岐
        successRaffle.innerHTML = `<h3>Success!! ${count}回目の抽選で要件を満たす組み合わせが見つかりました。</h3>
      <div class="success-result">このプライベートルームの<br>合計キルレートは <span>${killRateSum.toFixed(2)}</span><br>平均キルレートは <span>${killRateAverage.toFixed(2)}</span><br>
      最大のキルレートの差は <span>${(squadMaxKillRate.toFixed(2) - squadMinKillRate.toFixed(2)).toFixed(2)}</span> です。</div>`;

        // 分割されたスクワッドの配列をキルレート順にソート
        for (let i = 0; i < squadArray.length; i++) {
          squadArray[i].sort((first, second) => first.kill_rate - second.kill_rate);
        }

        // スクワッドのDivを作成しメンバーを配置
        for (let i = 0; i < squadArray.length; i++) {
          let createSquadSection = document.createElement("section");
          let createSquadDiv = document.createElement("div");
          createSquadSection.id = `squad${alphabet[i]}`;
          createSquadDiv.id = `squad-inner-${alphabet[i]}`;
          groupDiv.appendChild(createSquadSection);
          createSquadSection.appendChild(createSquadDiv);
          createSquadSection.insertAdjacentHTML("afterbegin", `<h2>Group ${alphabet[i]}</h2>`);
          for (let j = 0; j < squadArray[i].length; j++) {
            let resultHtml = `<div class="player"><div>${squadArray[i][j].player_name}</div><div>${squadArray[i][j].kill_rate}</div></div>`;
            createSquadDiv.insertAdjacentHTML("afterbegin", resultHtml);
            createSquadSection.appendChild(createSquadDiv);
          }
          createSquadDiv.insertAdjacentHTML("afterbegin", `<div class="player-header"><div>name</div><div>kill rate</div></div>`);
          createSquadDiv.insertAdjacentHTML("beforeend", `<div class="kill-rate-average">平均キルレ：${squadKillRateAverageArray[i].toFixed(2)}</div>`);
          createSquadDiv.insertAdjacentHTML("beforeend", `<div class="kill-rate-sum">合計キルレ：${squadKillRateSumArray[i].toFixed(2)}</div>`);
        }

        // 配列の順序[i]を取得
        const squadMaxKillRatePosition = squadKillRateSumArray.indexOf(squadMaxKillRate);
        const squadMinKillRatePosition = squadKillRateSumArray.indexOf(squadMinKillRate);

        // 最強スクワッドにclassを追加
        const strongSquad = document.querySelectorAll("#group > section");
        strongSquad[squadMaxKillRatePosition].classList.add("strong-squad");

        // 最弱スクワッドにclassを追加
        const weakSquad = document.querySelectorAll("#group > section");
        weakSquad[squadMinKillRatePosition].classList.add("weak-squad");
        break;
      } else if (count == limit) {
        errorRaffle.innerHTML = `${count}回抽選を行いましたが要件を満たす組み合わせが見つかりませんでした。<br>もう一度抽選を行うか調整範囲を変更して再度抽選をしてください。`;
      }
      count++;
    }
  } else {
    if (SquadPlayerSum == 2) {
      errorTeamMate.innerHTML = `チームメイトを設定できるのは${SquadPlayerSum}人までです。<br>${SquadPlayerSum}人にチェックを入れてください。`;
    } else {
      errorTeamMate.innerText = `スクワッドのプレイヤー数が${SquadPlayerSum}人となっているためチームメイトを設定できるのは2人から${SquadPlayerSum}人までです。`;
    }
  }
};
