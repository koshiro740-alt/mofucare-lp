(function () {
  'use strict';

  var SUPABASE_URL = 'https://cydsyqmyhxfpyjueujpk.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_nstO9P6OEwDeGUfImBkbXQ_hNIxFom9';

  // 見出しA/Bテスト: a=モフのごはんは、あなたのセルフケア。(HTML既定) / ?v=b で情緒コピーに切り替え
  var variant = new URLSearchParams(location.search).get('v') === 'b' ? 'b' : 'a';
  if (variant === 'b') {
    document
      .getElementById('headline')
      .replaceChildren('がんばらない日も、', document.createElement('br'), 'そばにいるよ。');
  }

  var MESSAGES = {
    sending: 'おくっています…',
    ok: 'うけとったよ。じゅんびができたら、そっとお知らせするね。',
    invalid: 'メールアドレスのかたちがすこし違うみたい。見なおしてみてね。',
    error: 'うまく届かなかったみたい。すこし時間をおいて、もういちどためしてみてね。',
  };

  function setStatus(form, kind, text) {
    var el = form.querySelector('.signup-status');
    el.textContent = text;
    el.classList.remove('ok', 'ng');
    if (kind) el.classList.add(kind);
  }

  function markDone(form) {
    form.querySelector('.signup-row').hidden = true;
    var note = form.querySelector('.signup-note');
    if (note) note.hidden = true;
    setStatus(form, 'ok', MESSAGES.ok);
  }

  function submit(form) {
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button');
    var email = input.value.trim().toLowerCase();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus(form, 'ng', MESSAGES.invalid);
      return;
    }

    button.disabled = true;
    setStatus(form, null, MESSAGES.sending);

    fetch(SUPABASE_URL + '/rest/v1/preregistrations', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email: email, variant: variant }),
    })
      .then(function (res) {
        // 409 = 登録済み。どちらも同じ完了表示にする(登録済みかどうかを外から探れないように)
        if (res.status === 201 || res.status === 409) {
          markDone(form);
          if (window.goatcounter && window.goatcounter.count) {
            window.goatcounter.count({ path: 'preregister-' + variant, event: true });
          }
          return;
        }
        throw new Error('unexpected status ' + res.status);
      })
      .catch(function () {
        button.disabled = false;
        setStatus(form, 'ng', MESSAGES.error);
      });
  }

  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit(form);
    });
  });
})();
