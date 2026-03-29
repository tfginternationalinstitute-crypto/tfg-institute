// ═══════════════════════════════════════════════════════════════════
// PATCH TFG — MISSION 1 + MISSION 2
// Colle ce script JUSTE AVANT </body> dans ton index.html
// ET remplace l'ancien bloc <script> du bas (etuLogin/etuLogout courts)
// ═══════════════════════════════════════════════════════════════════

// ══════════════════════════════════════
// MISSION 1 — ESPACE ÉTUDIANT COMPLET
// ══════════════════════════════════════

var LANG_KEY_ETU = {
  'fr':['fr','fran','tcf','delf'],
  'en':['en','angl','engl','ielts','toefl'],
  'de':['de','allem','goethe'],
  'es':['es','espag','dele'],
  'it':['it','itali','cils'],
  'ru':['ru','russ','trki','torfl'],
  'zh':['zh','chin','hsk']
};

var SUPPORTS_ETU = {
  'fr':['📄 Fascicule TCF/DELF A1→C2','🎵 Audio MP3 Compréhension Orale','📹 Vidéos Expression Orale','📋 Fiches Grammaire & Vocabulaire','✅ 200+ Exercices Corrigés'],
  'en':['📄 IELTS / TOEFL Guide Complet','🎵 Listening MP3 HD','📹 Speaking Practice Videos','📋 Grammar & Vocabulary Sheets','✅ 200+ Exercises with Answers'],
  'de':['📄 Goethe-Zertifikat Lernheft','🎵 Hören Audio MP3','📹 Sprechen Videoübungen','📋 Grammatik & Wortschatz','✅ 200+ Übungen'],
  'es':['📄 Manual DELE Completo','🎵 Audio Comprensión','📹 Videos Expresión Oral','📋 Gramática y Vocabulario','✅ 200+ Ejercicios'],
  'it':['📄 Manuale CILS/CELI','🎵 Audio Comprensione','📹 Video Produzione Orale','📋 Grammatica e Lessico','✅ 200+ Esercizi'],
  'ru':['📄 Учебник ТОРФЛ/ТРКИ','🎵 Аудио Аудирование','📹 Видео Говорение','📋 Грамматика и Лексика','✅ 200+ Упражнений'],
  'zh':['📄 HSK 全套教材','🎵 听力MP3','📹 口语视频练习','📋 语法和词汇表','✅ 200+ 练习题']
};

var NEXT_SESS_ETU = {
  'fr':'📅 Samedi 5 Avril · 09h00–12h00 · Centre TFG Yaoundé',
  'en':'📅 Samedi 5 Avril · 14h00–17h00 · Centre TFG Yaoundé',
  'de':'📅 Samedi 12 Avril · 09h00–12h00 · Centre TFG Yaoundé',
  'es':'📅 Samedi 12 Avril · 14h00–17h00 · Centre TFG Yaoundé',
  'it':'📅 Samedi 19 Avril · 09h00–12h00 · Centre TFG Yaoundé',
  'ru':'📅 Samedi 19 Avril · 14h00–17h00 · Centre TFG Yaoundé',
  'zh':'📅 Samedi 26 Avril · 09h00–12h00 · Centre TFG Yaoundé'
};

var LEVEL_COLORS_ETU = {
  A1:'#4ade80', A2:'#86efac', B1:'#fbbf24',
  B2:'#f97316', C1:'#f43f5e', C2:'#e879f9'
};

function getLangKeyETU(l) {
  if (!l) return 'fr';
  l = l.toLowerCase();
  for (var k in LANG_KEY_ETU) {
    if (LANG_KEY_ETU[k].some(function(kw){ return l.includes(kw); })) return k;
  }
  return 'fr';
}

function getCECRL_ETU(s) {
  if (s <= 2) return 'A1';
  if (s <= 4) return 'A2';
  if (s <= 6) return 'B1';
  if (s <= 7) return 'B2';
  if (s <= 9) return 'C1';
  return 'C2';
}

// Codes de démonstration toujours valides
var DEMO_CODES = ['1234','2024','2025','2026','9999','0000'];

function etuLogin() {
  var prenom = (document.getElementById('etu-prenom').value || '').trim();
  var code   = (document.getElementById('etu-code').value   || '').trim();

  if (!prenom || !code) {
    alert('Veuillez entrer votre prénom et votre code d\'accès TFG.');
    return;
  }

  // 1. Chercher dans les étudiants enregistrés
  var students = [];
  try { students = JSON.parse(localStorage.getItem('tfg_students') || '[]'); } catch(e) {}
  var foundS = students.find(function(s) {
    return s.prenom && s.prenom.toLowerCase() === prenom.toLowerCase() && s.code === code;
  });

  // 2. Chercher dans les inscriptions (match souple sur le prénom)
  var inscriptions = [];
  try { inscriptions = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}
  var foundI = inscriptions.find(function(r) {
    return r.prenom && r.prenom.toLowerCase() === prenom.toLowerCase();
  });

  // 3. Code démo admin
  var isDemo = DEMO_CODES.includes(code);

  if (!foundS && !foundI && !isDemo) {
    var errEl = document.getElementById('etu-err');
    if (errEl) { errEl.style.display = 'block'; setTimeout(function(){ errEl.style.display='none'; }, 4000); }
    return;
  }

  // ── Accès accordé ──
  document.getElementById('etu-login-screen').style.display = 'none';
  document.getElementById('etu-dashboard').style.display    = 'block';
  document.getElementById('etu-nom').textContent = 'Bienvenue, ' + prenom + ' ! 👋';

  var langLabel = (foundS && foundS.lang) || (foundI && foundI.lang) || 'Français TCF/DELF';
  var lk  = getLangKeyETU(langLabel);

  // Score depuis les inscriptions
  var score = null;
  if (foundI && foundI.message && foundI.message.includes('Score:')) {
    score = parseInt(foundI.message.split('Score:')[1]) || null;
  }

  var lvl = (score !== null) ? getCECRL_ETU(score) : 'A1';
  var NV  = { A1:1, A2:2, B1:3, B2:4, C1:5, C2:6 };
  var tgt = { A1:'B2', A2:'B2', B1:'B2', B2:'C1', C1:'C2', C2:'C2' }[lvl];
  var pct = Math.min(100, Math.round(NV[lvl] / NV[tgt] * 100));

  // Langue
  var el;
  if (el = document.getElementById('etu-lang-info')) el.textContent = langLabel;
  if (el = document.getElementById('etu-lvl-curr')) el.textContent = lvl;
  if (el = document.getElementById('etu-lvl-target')) el.textContent = tgt;
  if (el = document.getElementById('etu-prog')) el.style.width = pct + '%';
  if (el = document.getElementById('etu-prog-txt'))
    el.textContent = NV[lvl] + ' niveau(x) complété(s) vers ' + tgt + ' (' + pct + '%)';

  // Résultats de tests
  if (score !== null) {
    var c = LEVEL_COLORS_ETU[lvl] || '#D4AF37';
    if (el = document.getElementById('etu-tests-list'))
      el.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px;' +
        'background:rgba(255,255,255,.05);border-radius:9px">' +
          '<div><div style="color:#fff;font-size:.8rem;font-weight:600">' + langLabel + '</div>' +
          '<div style="color:rgba(255,255,255,.4);font-size:.65rem">Test diagnostique TFG</div></div>' +
          '<div style="text-align:right"><div style="color:var(--gold);font-weight:700;font-size:1.1rem">' + score + '/10</div>' +
          '<span style="font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:20px;' +
          'background:' + c + '22;color:' + c + '">' + lvl + '</span></div>' +
        '</div>';
  } else {
    if (el = document.getElementById('etu-tests-list'))
      el.innerHTML = '<div style="color:rgba(255,255,255,.4);font-size:.76rem">Passez le test gratuit pour voir vos résultats.</div>';
  }

  // Prochaine session
  if (el = document.getElementById('etu-next-session'))
    el.innerHTML =
      '<div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);border-radius:10px;padding:10px 12px;margin-bottom:10px">' +
        '<div style="color:rgba(255,255,255,.7);font-size:.78rem;line-height:1.8">' +
          (NEXT_SESS_ETU[lk] || NEXT_SESS_ETU['fr']) + '<br>' +
          '📍 Nkolfulou, Yaoundé<br>📞 +237 674 373 396' +
        '</div>' +
      '</div>' +
      '<a href="https://wa.me/237674373396?text=' +
        encodeURIComponent('Bonjour TFG ! ' + prenom + ' confirme sa place : ' + langLabel) +
        '" target="_blank" class="cta-wa" style="font-size:.78rem">✅ Confirmer ma place</a>';

  // Badges
  var badges = [
    {i:'🎯', l:'Test passé', c:'rgba(212,175,55,.12)', b:'rgba(212,175,55,.35)'},
    {i:'📚', l:'Étudiant TFG', c:'rgba(56,189,248,.1)', b:'rgba(56,189,248,.3)'}
  ];
  if (score !== null && score >= 7) badges.push({i:'⭐', l:'Excellent', c:'rgba(139,92,246,.12)', b:'rgba(139,92,246,.35)'});
  if (score === 10) badges.push({i:'🏆', l:'Score parfait', c:'rgba(212,175,55,.2)', b:'rgba(212,175,55,.6)'});
  if (el = document.getElementById('etu-badges'))
    el.innerHTML = badges.map(function(b) {
      return '<span class="etu-badge" style="background:' + b.c + ';border:1px solid ' + b.b + ';color:#fff;margin:3px">' + b.i + ' ' + b.l + '</span>';
    }).join('');

  // Supports pédagogiques
  var sup = SUPPORTS_ETU[lk] || SUPPORTS_ETU['fr'];
  if (el = document.getElementById('etu-supports'))
    el.innerHTML = sup.map(function(s) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<span style="color:rgba(255,255,255,.72);font-size:.76rem">' + s + '</span>' +
        '<a href="https://wa.me/237674373396?text=' + encodeURIComponent('Bonjour TFG ! Je veux accéder au support : ' + s) +
        '" target="_blank" style="font-size:.63rem;color:var(--gold);border:1px solid rgba(212,175,55,.3);padding:2px 8px;border-radius:5px;text-decoration:none;white-space:nowrap;margin-left:6px">Accéder →</a>' +
      '</div>';
    }).join('');

  // Zone certificat
  if (el = document.getElementById('etu-cert-zone')) {
    if (score !== null) {
      el.innerHTML = '<button class="cta-primary" style="margin-top:6px" onclick="showPage(\'certificate\')">🎓 Voir mon certificat TFG</button>';
    } else {
      el.innerHTML = '<div style="color:rgba(255,255,255,.4);font-size:.76rem">Passez le test gratuit pour générer votre certificat.</div>' +
        '<button class="cta-primary" style="margin-top:8px" onclick="showPage(\'home\')">Passer le test →</button>';
    }
  }
}

function etuLogout() {
  document.getElementById('etu-login-screen').style.display = 'block';
  document.getElementById('etu-dashboard').style.display    = 'none';
  document.getElementById('etu-prenom').value = '';
  document.getElementById('etu-code').value   = '';
  var err = document.getElementById('etu-err');
  if (err) err.style.display = 'none';
}

// ══════════════════════════════════════
// MISSION 2 — GÉNÉRATION DE CODES ADMIN
// ══════════════════════════════════════

function genEtuCode(id, prenom) {
  // Générer code unique 4 chiffres
  var code = String(Math.floor(1000 + Math.random() * 9000));

  // Sauvegarder dans localStorage
  var students = [];
  try { students = JSON.parse(localStorage.getItem('tfg_students') || '[]'); } catch(e) {}
  students = students.filter(function(s){ return s.id !== id; });

  var inscriptions = [];
  try { inscriptions = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}
  var record = inscriptions.find(function(x){ return x.id === id; });

  var studentObj = {
    id: id,
    prenom: prenom,
    code: code,
    lang: record ? record.lang : 'Français TCF/DELF',
    tel: record ? record.tel : '',
    dateCode: new Date().toLocaleDateString('fr-FR')
  };
  students.push(studentObj);
  try { localStorage.setItem('tfg_students', JSON.stringify(students)); } catch(e) {}

  // Message WhatsApp personnalisé
  var waMsg =
    'Bonjour ' + prenom + ' ! 🎓\n\n' +
    'Votre inscription au *TFG International Institute Language* est validée ! ✅\n\n' +
    '🔑 *Votre code d\'accès personnel : ' + code + '*\n\n' +
    'Connectez-vous ici pour accéder à vos supports pédagogiques :\n' +
    '👉 https://pr7fy7.csb.app\n\n' +
    'Dans "Mon Espace", entrez :\n' +
    '• Prénom : ' + prenom + '\n' +
    '• Code : ' + code + '\n\n' +
    'Bienvenue dans la famille TFG ! 🌍\n' +
    '📞 +237 674 373 396';

  // Ouvrir WhatsApp si numéro disponible
  var tel = record && record.tel ? record.tel.replace(/\D/g, '') : '';
  if (tel && tel.length >= 9) {
    window.open('https://wa.me/' + tel + '?text=' + encodeURIComponent(waMsg), '_blank');
  }

  // Toast de confirmation dans le back-office
  showToastBO('✅ Code ' + code + ' généré pour ' + prenom + (tel ? ' · WhatsApp envoyé !' : ' · Pas de numéro WA'));
  
  // Rafraîchir le tableau
  if (typeof boFilter === 'function') boFilter();
}

// Toast notification back-office
function showToastBO(msg) {
  var existing = document.getElementById('bo-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'bo-toast';
  toast.style.cssText =
    'position:fixed;top:80px;right:16px;z-index:99999;' +
    'background:linear-gradient(135deg,#0a5c36,#1D9E75);' +
    'color:#fff;font-family:"DM Sans",sans-serif;font-size:.82rem;font-weight:600;' +
    'padding:12px 18px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.4);' +
    'animation:fadeup .35s ease;max-width:320px;line-height:1.4';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.style.opacity='0';toast.style.transform='translateY(-10px)';toast.style.transition='all .3s';
    setTimeout(function(){ toast.remove(); }, 350);
  }, 4000);
}

// ── Surcharger boRender pour ajouter le bouton 🎓 ──
// Cette fonction remplace le rendu du tableau admin
var _origBoFilter = typeof boFilter !== 'undefined' ? boFilter : null;

function boRender(rows) {
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}

  var el;
  if (el = document.getElementById('bo-total'))     el.textContent = ins.length;
  if (el = document.getElementById('bo-new'))       el.textContent = ins.filter(function(r){ return r.statut === 'Nouveau'; }).length;
  if (el = document.getElementById('bo-pending'))   el.textContent = ins.filter(function(r){ return r.statut === 'En attente'; }).length;
  if (el = document.getElementById('bo-confirmed')) el.textContent = ins.filter(function(r){ return r.statut === 'Confirmé'; }).length;
  if (el = document.getElementById('bo-count'))     el.textContent = rows.length + ' inscrit(s) affiché(s)';

  var tb = document.getElementById('bo-tbody');
  if (!tb) return;

  if (!rows.length) {
    tb.innerHTML = '<tr><td colspan="6"><div class="bo-empty">Aucune inscription pour le moment</div></td></tr>';
    return;
  }

  // Charger les codes déjà générés
  var students = [];
  try { students = JSON.parse(localStorage.getItem('tfg_students') || '[]'); } catch(e) {}

  tb.innerHTML = rows.map(function(r) {
    var pillClass = r.statut === 'Confirmé' ? 'confirmed' :
                   r.statut === 'En attente' ? 'pending' :
                   r.statut === 'Annulé' ? 'cancelled' :
                   r.statut === 'Test en cours' ? 'test-prog' :
                   r.statut === 'Test terminé' ? 'test-done' : 'new';

    var existingStudent = students.find(function(s){ return s.id === r.id; });
    var codeDisplay = existingStudent
      ? '<span style="font-family:monospace;color:#D4AF37;font-weight:700;font-size:.8rem">' + existingStudent.code + '</span>'
      : '<span style="color:rgba(255,255,255,.25);font-size:.68rem">—</span>';

    var tel = (r.tel || '').replace(/\D/g, '');

    return '<tr>' +
      '<td><span class="bo-av">' + (r.prenom[0] + r.nom[0]).toUpperCase() + '</span>' +
        r.prenom + ' ' + r.nom +
        '<br><span style="font-size:.6rem;color:rgba(255,255,255,.3)">' + r.date + '</span></td>' +
      '<td style="font-size:.7rem">' + r.lang + '</td>' +
      '<td style="font-size:.7rem">' + r.tel + '</td>' +
      '<td style="font-size:.68rem">' +
        '<div style="margin-bottom:3px">' + (r.message && r.message !== '—' ? r.message.substring(0, 40) + (r.message.length > 40 ? '…' : '') : r.ville) + '</div>' +
        '<div>Code: ' + codeDisplay + '</div>' +
      '</td>' +
      '<td><span class="bo-pill ' + pillClass + '">' + r.statut + '</span></td>' +
      '<td style="display:flex;gap:4px;flex-wrap:wrap">' +
        // Bouton WhatsApp
        (tel ? '<button class="bo-btn wa" onclick="window.open(\'https://wa.me/' + tel + '?text=' + encodeURIComponent('Bonjour ' + r.prenom + ' ' + r.nom + ' ! TFG vous contacte.') + '\',\'_blank\')">WA</button>' : '') +
        // Bouton Statut
        '<button class="bo-btn" onclick="boChangeStatut(' + r.id + ')">Statut</button>' +
        // 🎓 Bouton Générer Code
        '<button class="bo-btn" onclick="genEtuCode(' + r.id + ',\'' + r.prenom.replace(/'/g, "\\'") + '\')" ' +
          'style="border-color:rgba(212,175,55,.4);color:#D4AF37;font-size:.8rem" ' +
          'title="Générer code accès étudiant">🎓</button>' +
        // Bouton Supprimer
        '<button class="bo-btn del" onclick="boDelete(' + r.id + ')">✕</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

// Réinitialiser boFilter pour utiliser le nouveau boRender
function boFilter() {
  var s  = (document.getElementById('bo-search') || {value:''}).value.toLowerCase();
  var st = (document.getElementById('bo-filter-status') || {value:''}).value;
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}
  var filtered = ins.filter(function(r) {
    var name = (r.prenom + ' ' + r.nom).toLowerCase();
    return (!s || name.includes(s)) && (!st || r.statut === st);
  });
  boRender(filtered);
  if (typeof buildBoCharts === 'function') buildBoCharts();
}

function boChangeStatut(id) {
  var statuts = ['Nouveau','En attente','Confirmé','Annulé','Test en cours','Test terminé'];
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}
  var r = ins.find(function(x){ return x.id === id; });
  if (r) { r.statut = statuts[(statuts.indexOf(r.statut) + 1) % statuts.length]; }
  try { localStorage.setItem('tfg_inscriptions', JSON.stringify(ins)); } catch(e) {}
  boFilter();
}

function boDelete(id) {
  if (!confirm('Supprimer cette inscription ?')) return;
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}
  ins = ins.filter(function(r){ return r.id !== id; });
  try { localStorage.setItem('tfg_inscriptions', JSON.stringify(ins)); } catch(e) {}
  boFilter();
}

function boExportCSV() {
  var ins = [];
  try { ins = JSON.parse(localStorage.getItem('tfg_inscriptions') || '[]'); } catch(e) {}
  var students = [];
  try { students = JSON.parse(localStorage.getItem('tfg_students') || '[]'); } catch(e) {}

  var h = 'Prénom,Nom,Téléphone,Email,Langue,Ville,Message,Statut,Code Accès,Date';
  var rows = ins.map(function(r) {
    var s = students.find(function(x){ return x.id === r.id; });
    return [r.prenom,r.nom,r.tel,r.email,r.lang,r.ville,(r.message||'—'),r.statut,(s?s.code:'—'),r.date].join(',');
  });
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(h + '\n' + rows.join('\n'));
  a.download = 'inscriptions_tfg_' + new Date().toLocaleDateString('fr-FR').replace(/\//g,'-') + '.csv';
  a.click();
}

// ══════════════════════════════════════
// AUTO-INIT (lancé quand la page charge)
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // Pré-remplir le formulaire étudiant si données URL
  var params = new URLSearchParams(window.location.search);
  if (params.get('page') === 'etudiant') {
    if (typeof showPage === 'function') showPage('etudiant');
  }
});

console.log('%c✅ PATCH TFG chargé — Mission 1 & 2 actives', 'color:#D4AF37;font-weight:bold;font-size:14px');
