"use strict";
let copy = {
  copyId: document.getElementById("copy"),
  textData: function (squadArray, squadNewKRSumAry, killRateAverage, squadMaxKillRate, squadMinKillRate) {
    // 分割されたスクワッドの配列をキルレート順にソート
    for (let i = 0; i < squadArray.length; i++) {
      squadArray[i].sort((first, second) => second.kill_rate - first.kill_rate);
    }
    const copyheader = document.createElement("h3");
    copyheader.innerHTML = "コピー用テキストデータ";
    copy.copyId.appendChild(copyheader);
    const doCopy = document.createElement("div");
    doCopy.setAttribute("id", "do-copy");
    doCopy.insertAdjacentHTML("beforeend", '<button id="click-copy">Copy する</button>');
    copy.copyId.appendChild(doCopy);
    const copyTextData = document.createElement("div");
    copyTextData.setAttribute("id", "copy-txt");
    copyTextData.insertAdjacentHTML(
      "beforeend",
      `この大会の平均キルレート: ${killRateAverage.toFixed(2)}<br>\n最大のキルレートの差: ${(squadMaxKillRate.toFixed(2) - squadMinKillRate.toFixed(2)).toFixed(
        2
      )}<br><br>\n\n--------------------<br><br>\n\n`
    );
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let i = 0; i < squadArray.length; i++) {
      copyTextData.insertAdjacentHTML("beforeend", `Group ${alphabet[i]}<br>\n`);
      for (let j = 0; j < squadArray[i].length; j++) {
        let resultText = `${squadArray[i][j].player_name}: ${squadArray[i][j].kill_rate}<br>\n`;
        copyTextData.insertAdjacentHTML("beforeend", resultText);
        copy.copyId.appendChild(copyTextData);
      }
      copyTextData.insertAdjacentHTML("beforeend", `平均キルレ: ${(squadNewKRSumAry[i] / squadArray[i].length).toFixed(2)}<br>\n`);
      copyTextData.insertAdjacentHTML("beforeend", `合計キルレ: ${squadNewKRSumAry[i].toFixed(2)}<br><br>\n\n--------------------<br><br>\n\n`);
    }

    // コピーができたかどうかの確認メッセージを出力する場所を作る
    const copyResult = document.createElement("div");
    copyResult.setAttribute("id", "copy-result");
    doCopy.appendChild(copyResult);

    // クリップボードにコピーする
    let copyTarget = document.getElementById("click-copy");
    copyTarget.addEventListener(
      "click",
      function () {
        const copyArea = document.getElementById("copy-txt");
        copyTarget = copyArea.textContent;
        const txt = document.createElement("textarea");
        txt.value = copyTarget;

        navigator.clipboard.writeText(copyTarget).then(
          () => {
            copyResult.innerHTML = '<div class="success-copy">コピーしました</div>';
          },
          () => {
            copyResult.innerHTML = '<div class="false-copy">コピーに失敗しました</div>';
          }
        );
        if (!navigator.clipboard) {
          alert("このブラウザはコピーに対応していません");
        }

        const copyResultArea = document.getElementById("copy-result");
        common.removeAllChildren(copyResultArea);
      },
      false
    );
  },
};
