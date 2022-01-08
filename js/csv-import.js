"use strict";
const fileInput = document.getElementById("file-input");
const formInputs = document.getElementsByClassName("file-input");
const csvMessage = document.getElementById("csv-message");
const utf8 = document.getElementById("utf-8");
const shiftJis = document.getElementById("shift-jis");
const fileReader = new FileReader();

// ファイル変更時のイベント
fileInput.onchange = () => {
  const file = fileInput.files[0];
  const fileSize = file.size; // ファイルサイズ
  const maxFileSize = 1024 * 100; // 制限サイズ

  if (file.type !== "text/csv" && file.type !== "application/vnd.ms-excel" && file.type !== "application/octet-stream") {
    alert("CSVファイルしかアップロードできません"); // エラーメッセージを表示
    fileInput.value = ""; // inputの中身をリセット
    return; // この時点で処理を終了する
  } else if (fileSize > maxFileSize) {
    // ファイルサイズが制限以上の場合
    alert("ファイルサイズは100KB以下にしてください"); // エラーメッセージを表示
    fileInput.value = ""; // inputの中身をリセット
    return; // この時点で処理を終了する
  } else {
    csvMessage.innerHTML = "Now Loading...";
    if (utf8.checked) {
      fileReader.readAsText(file, "UTF-8");
    } else if (shiftJis.checked) {
      fileReader.readAsText(file, "Shift_JIS");
    }

    // ファイル名を出力
    const fileName = file.name;
    const label = fileInput.nextElementSibling;
    if (!label.classList.contains("changed")) {
      const span = document.createElement("span");
      span.className = "filename";
      fileInput.parentNode.appendChild(span);
      label.classList.add("changed");
    }
    label.nextElementSibling.innerHTML = fileName;
  }
};

// ファイル読み込み時
entry.entryArray = [];
fileReader.onload = () => {
  // ファイル読み込み
  let fileResult = fileReader.result.split("\r\n");

  // 先頭行をヘッダとして格納
  let header = fileResult[0].split(",");
  // 先頭行の削除
  fileResult.shift();

  // CSVからエントリープレイヤーの配列を作る
  entry.entryArray = fileResult.map((player) => {
    let datas = player.split(",");
    let result = {};
    for (const index in datas) {
      let key = header[index];
      result[key] = datas[index];
    }
    return result;
  });
  entry.deleteAllElements();
  entry.createEntry();
  entry.deletePlayer();

  csvMessage.innerHTML = entry.entryArray.length + "人のプレイヤーを読み込みました。";
};

// ファイル読み取り失敗時
fileReader.onerror = () => {
  entry.entryArray = [];
  csvMessage.innerHTML = "ファイルの読み取りに失敗しました。";
};

// 同じファイルをアップロードできるようにする
fileInput.addEventListener("click", (e) => {
  e.target.value = "";
});
