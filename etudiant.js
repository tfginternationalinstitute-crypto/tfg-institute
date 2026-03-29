// TFG — Amelioration Espace Etudiant
// Ce fichier améliore automatiquement l'espace étudiant

var SUPPORTS = {
  fr:['📄 Fascicule TCF/DELF','🎵 Audio MP3','📹 Vidéo Expression Orale','📋 Fiches Grammaire','✅ 200 Exercices TCF'],
  en:['📄 IELTS Study Guide','🎵 Listening MP3','📹 Speaking Videos','📋 Grammar Sheets','✅ 200 IELTS Exercises'],
  de:['📄 Goethe Lernheft','🎵 Hören Audio','📹 Sprechen Video','📋 Grammatiktabellen','✅ 200 Übungen'],
  es:['📄 Manual DELE','🎵 Audio Comprensión','📹 Video Oral','📋 Fichas Gramática','✅ 200 Ejercicios'],
  it:['📄 Manuale CILS','🎵 Audio Comprensione','📹 Video Orale','📋 Schede Grammatica','✅ 200 Esercizi'],
  ru:['📄 Учебник ТРКИ','🎵 Аудио','📹 Видео','📋 Грамматика','✅ 200 упражнений'],
  zh:['📄 HSK 教材','🎵 听力 MP3','📹 口语视频','📋 语法表','✅ 200道练习']
};

var SESSIONS = {
  fr:'Samedi 5 Avril · 09h00-12h00',en:'Samedi 5 Avril · 14h00-17h00',
  de:'Samedi 12 Avril · 09h00-12h00',es:'Samedi 12 Avril · 14h00-17h00',
  it:'Samedi 19 Avril · 09h00-12h00',ru:'Samedi 19 Avril · 14h00-17h00',zh:'Samedi 26 Avril · 09h00-12h00'
};

function getLangKey(lang){
  if(!lang) return 'fr';
  lang = lang.toLowerCase();
  if(lang.includes('fran') || lang.includes('tcf') || lang.includes('delf')) return 'fr';
  if(lang.includes('angl') || lang.includes('engl') || lang.includes('ielts')) return 'en';
  if(lang.includes('allem') || lang.includes('deut') || lang.includes('goethe')) return 'de';
  if(lang.includes('espag') || lang.includes('espa') || lang.includes('dele')) return 'es';
  if(lang.includes('itali') || lang.includes('cils')) return 'it';
  if(lang.includes('russe') || lang.includes('trki') || lang.includes('ru')) return 'ru';
  if(lang.includes('chin') || lang.includes('hsk')) return 'zh';
  return 'fr';
}

function genEtuCode(id, prenom){
  var code = String(Math.floor(1000 + Math.random()*9000));
  var students = JSON.parse(localStorage.getItem('tfg_students')||'[]');
  var r = inscriptions.find(function(x){ return x.id===id; });
  students = students.filter(function(s){ return s.id!==id; });
  students.push({ id:id, prenom:prenom, code:code, lang:r?r.lang:'', statut:r?r.statut:'Nouveau' });
  localStorage.setItem('tfg_students', JSON.stringify(students));
  alert('Code de '+prenom+' : '+code+'\n\nEnvoi WhatsApp en cours...');
  if(r && r.tel && r.tel!=='—'){
    window.open('https://wa.me/'+r.tel.replace(/\D/g,'')+'?text='+encodeURIComponent(
      'Bonjour '+prenom+' ! 🎓\nVotre code TFG : '+code+
      '\n\n1. Allez sur https://tfg-institute.pages.dev\n2. Cliquez "Mon Espace"\n3. Entrez prénom + code\n\nBonne formation ! 💪'
    ),'_blank');
  }
}

// Améliore le dashboard étudiant au chargement
document.addEventListener('DOMContentLoaded', function(){
  // Ajouter bouton Code dans le Back Office
  var origBoRender = window.boRender;
  if(origBoRender){
    window.boRender = function(rows){
      origBoRender(rows);
      // Ajouter bouton Code à chaque ligne
      document.querySelectorAll('#bo-tbody tr').forEach(function(tr){
        var btns = tr.querySelector('td:last-child');
        if(btns && !btns.querySelector('.btn-code')){
          var id = tr.dataset.id;
          var prenom = tr.dataset.prenom;
          var btn = document.createElement('button');
          btn.className = 'bo-btn btn-code';
          btn.style.cssText = 'border-color:rgba(212,175,55,.3);color:var(--gold)';
          btn.textContent = '🎓';
          btn.title = 'Générer code étudiant';
          btn.onclick = function(){ genEtuCode(parseInt(id), prenom); };
          btns.insertBefore(btn, btns.firstChild);
        }
      });
    };
  }
});
