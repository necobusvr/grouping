"use strict";
let common = {
  entryInner: document.getElementById("entry-inner"),
  addButton: document.getElementById("add"),
  deleteButton: document.getElementById("delete"),
  tooMuch: document.getElementById("error-too-much-member"),
  closeBtnClass: document.getElementsByClassName("close"),

  // 対応人数
  maxPlayer: 50,

  // input 入力欄のclass
  playerName: document.getElementsByClassName("player-name"),
  killRate: document.getElementsByClassName("kill-rate"),
  teamMateCheck: document.getElementsByClassName("together"),

  /**
   * 指定した要素の子どもを全て削除する
   * @param {HTMLElement} element HTMLの要素
   */
  removeAllChildren: function (element) {
    while (element.firstChild) {
      // 子どもの要素があるかぎり削除
      element.removeChild(element.firstChild);
    }
  },
};
