// Pippet visit and note links, for friends without the app (or whose
// messenger opened the link in a browser).
//
// The pet travels after the "#", which browsers never send to a server:
// this page reads it right here, on the phone, and nothing is stored.
(function () {
  var APP_STORE = "https://apps.apple.com/app/id6792042201";

  var TEXT = {
    en: {
      visitTitle: "{name} is coming to visit! 🐾",
      visitBody: "A little {species} from Pippet wants to stay with you for a day.",
      noteTitle: "A note from {host} 💌",
      noteBody: "{guest} stayed with {host} for a day. Strokes: {strokes} · treats: {treats}.",
      favourite: "They even found {guest}'s favourite treat! ♥",
      open: "Open in Pippet",
      get: "Get Pippet on the App Store",
      about: "Pippet is a tiny pet for your iPhone and Apple Watch.",
      after: "Just got Pippet? Come back here and tap “Open in Pippet” — {name} brings a present for you both.",
      broken: "This link looks broken. Ask your friend to send it again.",
      species: { sprout: "Sprout", bloom: "Bloom", blossom: "Blossom", sunny: "Sunny", frosty: "Frosty" }
    },
    ru: {
      visitTitle: "{name} идёт в гости! 🐾",
      visitBody: "Малыш из Pippet ({species}) хочет погостить у тебя денёк.",
      noteTitle: "Записка от {host} 💌",
      noteBody: "{guest} — целый день в гостях у {host}. Поглаживаний: {strokes} · угощений: {treats}.",
      favourite: "И даже нашли любимое угощение {guest}! ♥",
      open: "Открыть в Pippet",
      get: "Скачать Pippet в App Store",
      about: "Pippet — крошечный питомец для iPhone и Apple Watch.",
      after: "Только что установил Pippet? Вернись сюда и нажми «Открыть в Pippet» — {name} принесёт подарок вам обоим.",
      broken: "Ссылка повреждена. Попроси друга прислать её ещё раз.",
      species: { sprout: "Росток", bloom: "Цветик", blossom: "Сакура", sunny: "Солнышко", frosty: "Снежок" }
    },
    kk: {
      visitTitle: "{name} қонаққа келе жатыр! 🐾",
      visitBody: "Pippet-тегі кішкентай дос ({species}) сенде бір күн қонақ болғысы келеді.",
      noteTitle: "{host} жіберген хат 💌",
      noteBody: "{guest} бір күн {host} үйінде қонақта болды. Сипау: {strokes} · тағам: {treats}.",
      favourite: "Тіпті {guest} сүйікті тағамын тауып берді! ♥",
      open: "Pippet-те ашу",
      get: "Pippet-ті App Store-дан жүктеу",
      about: "Pippet — iPhone мен Apple Watch-қа арналған кішкентай дос.",
      after: "Pippet-ті жаңа орнаттың ба? Осында қайтып келіп, «Pippet-те ашу» түймесін бас — {name} екеуіңе де сыйлық әкеледі.",
      broken: "Сілтеме бүлінген. Досыңнан қайта жіберуін сұра.",
      species: { sprout: "Өскін", bloom: "Гүлжан", blossom: "Сакура", sunny: "Күнекей", frosty: "Аяз" }
    },
    zh: {
      visitTitle: "{name} 要来做客啦！🐾",
      visitBody: "来自 Pippet 的「{species}」想在你这儿住一天。",
      noteTitle: "来自 {host} 的便条 💌",
      noteBody: "{guest} 在 {host} 家住了一天。抚摸 {strokes} 次 · 零食 {treats} 份。",
      favourite: "还找到了 {guest} 最爱的零食！♥",
      open: "在 Pippet 中打开",
      get: "在 App Store 获取 Pippet",
      about: "Pippet 是住在 iPhone 和 Apple Watch 上的小宠物。",
      after: "刚装好 Pippet？回到这里点「在 Pippet 中打开」——{name} 会给你们俩都带来礼物。",
      broken: "链接好像坏了。请朋友再发一次。",
      species: { sprout: "小芽", bloom: "小花", blossom: "樱樱", sunny: "小阳", frosty: "小霜" }
    }
  };

  var lang = (navigator.language || "en").toLowerCase().slice(0, 2);
  var t = TEXT[lang] || TEXT.en;
  document.documentElement.lang = TEXT[lang] ? lang : "en";

  function fill(s, values) {
    return s.replace(/\{(\w+)\}/g, function (_, k) { return values[k] == null ? "" : values[k]; });
  }

  // A name fit to show: one line, at most 16 characters.
  function clean(name) {
    return String(name || "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 16);
  }

  function decode(code) {
    try {
      var b = code.replace(/-/g, "+").replace(/_/g, "/");
      while (b.length % 4) b += "=";
      var bytes = Uint8Array.from(atob(b), function (c) { return c.charCodeAt(0); });
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      return null;
    }
  }

  var kind = document.body.dataset.kind;
  var code = new URLSearchParams(location.hash.slice(1)).get("c");
  var data = code && code.length <= 2000 ? decode(code) : null;

  var title = document.getElementById("title");
  var body = document.getElementById("body");
  var open = document.getElementById("open");
  document.getElementById("get").textContent = t.get;
  document.getElementById("get").href = APP_STORE;
  document.getElementById("about").textContent = t.about;

  if (!data) {
    title.textContent = "🐾";
    body.textContent = t.broken;
    open.remove();
    return;
  }

  if (kind === "visit") {
    var name = clean(data.n);
    title.textContent = fill(t.visitTitle, { name: name });
    body.textContent = fill(t.visitBody, { species: t.species[data.s] || t.species.sprout });
    document.getElementById("after").textContent = fill(t.after, { name: name });
  } else {
    var guest = clean(data.n), host = clean(data.h);
    title.textContent = fill(t.noteTitle, { host: host });
    var text = fill(t.noteBody, { guest: guest, host: host, strokes: data.p | 0, treats: data.f | 0 });
    if (data.l) text += " " + fill(t.favourite, { guest: guest });
    body.textContent = text;
  }

  // Messengers' built-in browsers don't always hand links to apps; this does.
  open.textContent = t.open;
  open.href = "pippet://" + kind + "?c=" + encodeURIComponent(code);
})();
