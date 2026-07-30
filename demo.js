/* LPのお試し操作。どれも見た目だけで、サーバーには何も送らない。
   - ケアのチップ: 押すとチェックが入り、3つ揃うとモフの絵が変わる
   - きせかえ / おへや: 押した絵に差し替える
   - 気分: 3択のうち1つを選ぶ
   日記の入力欄はブラウザの標準機能だけで動くので、ここでは何もしない。 */
(function () {
  'use strict';

  /* ---- あさ: ケアのチップ ---- */
  var chips = document.querySelectorAll('#care-chips button');
  var scene = document.getElementById('care-scene');
  var hint = document.getElementById('care-hint');

  if (chips.length && scene && hint) {
    var SCENE_CALM = { src: 'assets/scene_water.jpg', alt: 'お水をのむモフ' };
    var SCENE_HAPPY = { src: 'assets/scene_sparkle.jpg', alt: 'きらきらとよろこぶモフ' };
    var HINT_START = 'ためしに、タップしてみてください。';
    var HINT_DONE = 'ぜんぶできました。モフがよろこんでいます。';

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var next = chip.getAttribute('aria-pressed') !== 'true';
        chip.setAttribute('aria-pressed', String(next));

        var done = 0;
        chips.forEach(function (c) {
          if (c.getAttribute('aria-pressed') === 'true') done += 1;
        });

        var all = done === chips.length;
        var want = all ? SCENE_HAPPY : SCENE_CALM;
        if (!scene.src.endsWith(want.src)) {
          scene.src = want.src;
          scene.alt = want.alt;
        }
        hint.textContent = all ? HINT_DONE : HINT_START;
      });
    });
  }

  /* ---- よる: 気分えらび(1つだけ選べる) ---- */
  var moods = document.querySelectorAll('.mood button');
  moods.forEach(function (button) {
    button.addEventListener('click', function () {
      moods.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });
    });
  });

  /* ---- すきな日: きせかえとおへや ---- */
  function wirePicker(pickerId, targetId, useAlt) {
    var picker = document.getElementById(pickerId);
    var target = document.getElementById(targetId);
    if (!picker || !target) return;

    picker.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        picker.querySelectorAll('button').forEach(function (other) {
          other.setAttribute('aria-pressed', String(other === button));
        });
        target.src = button.dataset.src;
        if (useAlt) target.alt = button.dataset.label;
      });
    });
  }

  wirePicker('dress-picker', 'dress-img', true);
  wirePicker('room-picker', 'room-img', true);
})();
