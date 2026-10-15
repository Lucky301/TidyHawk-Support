(() => {
  'use strict';
  const script = document.currentScript;
  const root = new URL('../', script.src);
  const key = 'tidyhawk.support.language.v1';
  const current = document.documentElement.lang.startsWith('ko') ? 'ko' : 'en';
  let path = location.pathname.startsWith(root.pathname) ? location.pathname.slice(root.pathname.length) : '';
  path = path.replace(/^en\//, '') || 'index.html';
  if (!['index.html', 'support.html', 'privacy.html', '404.html'].includes(path)) path = 'index.html';
  const target = lang => {
    const url = new URL((lang === 'en' ? 'en/' : '') + path, root);
    url.searchParams.set('v', '20261015-choice');
    url.hash = location.hash;
    return url;
  };
  const read = () => { try { const value = localStorage.getItem(key); return ['ko', 'en'].includes(value) ? value : null; } catch { return null; } };
  const remember = lang => { try { localStorage.setItem(key, lang); } catch { /* Browsing still works when storage is blocked. */ } };
  const choose = lang => {
    remember(lang);
    if (lang === current) dialog.close();
    else location.assign(target(lang).href);
  };
  const dialog = document.createElement('dialog');
  dialog.className = 'language-dialog';
  dialog.setAttribute('aria-labelledby', 'language-title');
  dialog.innerHTML = '<div class="language-dialog-body"><img src="' + new URL('assets/icon.png', root).href + '" alt="" width="64" height="64"><h2 id="language-title"><span lang="ko">언어를 선택하세요</span><br><span lang="en">Choose your language</span></h2><p><span lang="ko">이 브라우저에 선택을 기억합니다.<br>상단에서 언제든 바꿀 수 있어요.</span></p><p lang="en">We will remember your choice in this browser.<br>You can change it in the header anytime.</p><div class="language-options"><button type="button" data-choice="ko" lang="ko"><strong>한국어</strong><span>Korean</span></button><button type="button" data-choice="en" lang="en"><strong>English</strong><span>영어</span></button></div></div>';
  document.body.append(dialog);
  dialog.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => choose(button.dataset.choice)));
  document.querySelectorAll('nav.language a').forEach(link => {
    const lang = link.lang === 'en' ? 'en' : 'ko';
    link.href = target(lang).href;
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      choose(lang);
    });
  });
  document.querySelectorAll('[data-language-picker]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  const saved = read();
  if (!saved) dialog.showModal();
  else if (saved !== current) location.replace(target(saved).href);
})();
