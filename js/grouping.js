"use strict";

/**
 * チーム決め抽選
 */
let grouping = {
  raffleButton: document.getElementById("raffle"),
  // 抽選結果の表示場所
  groupDiv: document.getElementById("group"),

  // 入力されていないフィールドのエラーメッセージ
  errorPlayerName: document.getElementById("error-player-name"),
  errorKillRate: document.getElementById("error-kill-rate"),
  errorTeamMate: document.getElementById("error-team-mate"),
  errorRaffle: document.getElementById("error-raffle"),
  successRaffle: document.getElementById("success-raffle"),

  // 抽選をする
  raffle: function () {
    grouping.raffleButton.addEventListener("click", () => {
      //メンバーの配列を作る
      entry.createArray();

      //子要素があれば削除
      common.removeAllChildren(grouping.groupDiv);
      common.removeAllChildren(grouping.errorPlayerName);
      common.removeAllChildren(grouping.errorKillRate);
      common.removeAllChildren(grouping.errorTeamMate);
      common.removeAllChildren(grouping.errorRaffle);
      common.removeAllChildren(grouping.successRaffle);
      common.removeAllChildren(common.tooMuch);
      common.removeAllChildren(copy.copyId);

      for (let i = 0; i < entry.entryArray.length; i++) {
        if (entry.entryArray[i].player_name == false) {
          grouping.errorPlayerName.innerText = `No.${i + 1}のプレイヤー名が入力されていません。`;
          return false;
        }
        if (entry.entryArray[i].kill_rate == false) {
          grouping.errorKillRate.innerText = `No.${i + 1}のキルレートが入力されていません。`;
          return false;
        }
      }

      /**
       * 同じスクワッドにしたいときの処理
       * @returns {boolean} メンバー固定が不適切なら false
       */
      const teamMateErrorCheck = () => {
        let teamMateCount = 0;
        for (let i = 0; i < entry.entryArray.length; i++) {
          if (entry.entryArray[i]["teamMate_check"]) {
            teamMateCount++;
          }
        }
        for (let j = 2; j < common.maxPlayer / 2; j++) {
          if (SquadPlayerSum == j && teamMateCount > j) {
            return false;
          }
        }
        if (teamMateCount == 1) {
          return false;
        }
      };

      // トータルキルレート値
      const killRateSum = entry.entryArray.reduce((sum, i) => sum + i.kill_rate, 0);
      // 平均のキルレート値
      const killRateAverage = killRateSum / entry.entryArray.length;
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
          let shuffleArray = shuffle(entry.entryArray);
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
          // 抽選されたスクワッドのキルレート
          let squadKillRateSum;
          let squadKillRateSumArray = [];
          let squadKillRateAverageArray = [];
          let squadKillRateSumArrayVirtual = [];

          // ラジオボックスのチェック確認
          const squadFraction2 = document.getElementById("squad-fraction-2");
          const squadFraction4 = document.getElementById("squad-fraction-4");
          const adjustIrregular = document.getElementById("adjust-irregular");

          // プレイヤー数
          const playerSum = document.getElementsByClassName("entry-player").length;

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
              // 2つのスクワッドの合計キルレートの差を正数で返す
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
            // 抽選された各スクワッドの合計キルレートと全体の合計キルレートを比較し条件分岐
            grouping.successRaffle.innerHTML = `<h3>Success!! ${count}回目の抽選で要件を満たす組み合わせが見つかりました。</h3>
       <div class="success-result">このプライベートルームの<br>合計キルレートは <span>${killRateSum.toFixed(2)}</span><br>平均キルレートは <span>${killRateAverage.toFixed(2)}</span><br>
       最大のキルレートの差は <span>${(squadMaxKillRate.toFixed(2) - squadMinKillRate.toFixed(2)).toFixed(2)}</span> です。</div>`;

            // 分割されたスクワッドの配列をキルレート順にソート
            for (let i = 0; i < squadArray.length; i++) {
              squadArray[i].sort((first, second) => first.kill_rate - second.kill_rate);
            }

            // 余りのスクワッドが最後にならないように再度シャッフル(Groupをシャッフル)
            squadArray = shuffle(squadArray);

            // スクワッドのDivを作成しメンバーを配置
            for (let i = 0; i < squadArray.length; i++) {
              let createSquadSection = document.createElement("section");
              let createSquadDiv = document.createElement("div");
              createSquadSection.id = `squad${alphabet[i]}`;
              createSquadDiv.id = `squad-inner-${alphabet[i]}`;
              grouping.groupDiv.appendChild(createSquadSection);
              createSquadSection.appendChild(createSquadDiv);
              createSquadSection.insertAdjacentHTML("afterbegin", `<h2>Group ${alphabet[i]}</h2>`);
              for (let j = 0; j < squadArray[i].length; j++) {
                let resultHtml = `<div class="player"><div>${squadArray[i][j].player_name}</div><div>${squadArray[i][j].kill_rate}</div></div>`;
                createSquadDiv.insertAdjacentHTML("afterbegin", resultHtml);
                createSquadSection.appendChild(createSquadDiv);
              }
              createSquadDiv.insertAdjacentHTML("afterbegin", `<div class="player-header"><div>name</div><div>kill rate</div></div>`);
              createSquadDiv.insertAdjacentHTML("beforeend", `<div class="kill-rate-average">平均キルレ： ${squadKillRateAverageArray[i].toFixed(2)}</div>`);
              createSquadDiv.insertAdjacentHTML("beforeend", `<div class="kill-rate-sum">合計キルレ： ${squadKillRateSumArray[i].toFixed(2)}</div>`);
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
            copy.textData(squadArray, squadKillRateAverageArray, squadKillRateSumArray, killRateAverage, squadMaxKillRate, squadMinKillRate);
            break;
          } else if (count == limit) {
            grouping.errorRaffle.innerHTML = `${count}回抽選を行いましたが要件を満たす組み合わせが見つかりませんでした。<br>もう一度抽選を行うか調整範囲を変更して再度抽選をしてください。`;
          }
          count++;
        }
      } else {
        if (SquadPlayerSum == 2) {
          grouping.errorTeamMate.innerHTML = `チームメイトを設定できるのは${SquadPlayerSum}人までです。<br>${SquadPlayerSum}人にチェックを入れてください。`;
        } else {
          grouping.errorTeamMate.innerText = `スクワッドのプレイヤー数が${SquadPlayerSum}人となっているためチームメイトを設定できるのは2人から${SquadPlayerSum}人までです。`;
        }
      }
    });
  },
};

// 抽選をする
grouping.raffle();