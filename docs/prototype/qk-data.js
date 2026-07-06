/* EnglishQuiz — question bank & helpers */
window.QUIZZES = [
  {id:1,title:'Unit 3 — My School',emoji:'🏫',qs:25,time:30,status:'new',due:'Còn 2 ngày',color:'#e0e7ff'},
  {id:2,title:'Unit 2 — My Body',  emoji:'💪',qs:10,time:15,status:'done',score:8,total:10,color:'#d1fae5'},
  {id:3,title:'Unit 1 — Hello!',   emoji:'👋',qs:6, time:8, status:'done',score:6,total:6, color:'#fef3c7'},
];

window.QS = [
  /* 1 – image → text */
  {type:'image-choice',em:'🏫',image:'🏫',question:'Đây là gì?',
    opts:['A hospital 🏥','A school 🏫','A market 🛒','A park 🌳'],ok:1},
  /* 2 – audio → text */
  {type:'audio-choice',em:'🔊',audioWord:'pencil',question:'Bạn vừa nghe từ nào?',
    opts:['ruler','pencil','eraser','crayon'],ok:1},
  /* 3 – word → image */
  {type:'word-image',em:'🎒',word:'BACKPACK',question:'Chọn hình ảnh phù hợp:',
    opts:['👜','🎒','🧳','💼'],optLabels:['handbag','backpack','suitcase','briefcase'],ok:1},
  /* 4 – fill blank */
  {type:'fill-blank',em:'✏️',sentence:'I ___ a student.',
    opts:['am','is','are','be'],ok:0},
  /* 5 – true / false */
  {type:'true-false',em:'📚',statement:'"Book" trong tiếng Anh có nghĩa là "quyển sách".',ok:0},
  /* 6 – image → text */
  {type:'image-choice',em:'📏',image:'📏',question:'Đây là dụng cụ học tập nào?',
    opts:['A pencil ✏️','A pen 🖊️','A ruler 📏','An eraser'],ok:2},
  /* 7 – pronunciation */
  {type:'pronunciation',em:'🎤',word:'teacher',phonetic:'/ˈtiːtʃər/',hint:'Người dạy học — thầy / cô giáo'},
  /* 8 – audio → text */
  {type:'audio-choice',em:'🔊',audioWord:'classroom',question:'Bạn vừa nghe từ nào?',
    opts:['bedroom','bathroom','classroom','living room'],ok:2},
  /* 9 – word order */
  {type:'word-order',em:'🔀',question:'Sắp xếp thành câu hoàn chỉnh:',
    words:['go','I','school','to'],answer:'I go to school'},
  /* 10 – fill blank */
  {type:'fill-blank',em:'🏫',sentence:'There ___ 30 students in my class.',
    opts:['am','is','are','be'],ok:2},
  /* 11 – image → text */
  {type:'image-choice',em:'✏️',image:'✏️',question:'Đây là gì?',
    opts:['A pen 🖊️','A pencil ✏️','A marker 🖍️','A crayon 🎨'],ok:1},
  /* 12 – word → image */
  {type:'word-image',em:'📚',word:'BOOK',question:'Chọn hình ảnh phù hợp:',
    opts:['📓','📚','📰','📄'],optLabels:['notebook','book','newspaper','paper'],ok:1},
  /* 13 – true / false */
  {type:'true-false',em:'🏫',statement:'"Principal" là người đứng đầu trường học (hiệu trưởng).',ok:0},
  /* 14 – spelling */
  {type:'spelling',em:'🔡',word:'school',question:'Nghe và viết đúng chính tả:'},
  /* 15 – audio → text */
  {type:'audio-choice',em:'🔊',audioWord:'eraser',question:'Bạn vừa nghe từ nào?',
    opts:['eraser','pencil','sharpener','ruler'],ok:0},
  /* 16 – fill blank */
  {type:'fill-blank',em:'👩‍🏫',sentence:'My teacher ___ very kind.',
    opts:['am','is','are','be'],ok:1},
  /* 17 – matching */
  {type:'matching',em:'🔗',question:'Nối từ tiếng Anh với nghĩa tiếng Việt:',
    pairs:[{word:'school',match:'trường học'},{word:'teacher',match:'giáo viên'},
           {word:'student',match:'học sinh'},{word:'book',match:'quyển sách'}]},
  /* 18 – video → text */
  {type:'video-choice',em:'🎬',videoEmoji:'👦🎒',videoTitle:'Cậu bé đi học',
    audioDesc:'A boy is going to school with a backpack',
    question:'Cậu bé trong video đang làm gì?',
    opts:['Going to the park 🌳','Going to school 🏫','Playing football ⚽','Swimming 🏊'],ok:1},
  /* 19 – pronunciation */
  {type:'pronunciation',em:'🎤',word:'school',phonetic:'/skuːl/',hint:'Nơi các bạn học sinh học tập mỗi ngày'},
  /* 20 – word order */
  {type:'word-order',em:'🔀',question:'Sắp xếp thành câu hoàn chỉnh:',
    words:['name','My','is','Anna'],answer:'My name is Anna'},
  /* 21 – image → text */
  {type:'image-choice',em:'🖥️',image:'🖥️',question:'Thiết bị này trong lớp học tên là gì?',
    opts:['Television 📺','Computer 🖥️','Radio 📻','Telephone 📞'],ok:1},
  /* 22 – audio → text */
  {type:'audio-choice',em:'🔊',audioWord:'library',question:'Bạn vừa nghe từ nào?',
    opts:['canteen','playground','library','office'],ok:2},
  /* 23 – true / false */
  {type:'true-false',em:'📅',statement:'"Monday" là ngày đầu tiên trong tuần.',ok:0},
  /* 24 – fill blank */
  {type:'fill-blank',em:'🚶‍♀️',sentence:'She ___ to school every day.',
    opts:['go','goes','going','gone'],ok:1},
  /* 25 – pronunciation */
  {type:'pronunciation',em:'🎤',word:'student',phonetic:'/ˈstjuːdənt/',hint:'Người đang học tập — học sinh'},
];

/* ── answer helpers ── */
window.isAnswered = function(q, ans) {
  if (ans === undefined || ans === null) return false;
  switch (q.type) {
    case 'word-order':   return Array.isArray(ans) && ans.length === (q.words||[]).length;
    case 'matching':     return ans && typeof ans.total === 'number';
    case 'pronunciation':return typeof ans === 'number';
    case 'spelling':     return typeof ans === 'string' && ans.length > 0;
    default:             return typeof ans === 'number';
  }
};

window.isCorrect = function(q, ans) {
  if (!window.isAnswered(q, ans)) return false;
  switch (q.type) {
    case 'word-order':   return ans.map(i => q.words[i]).join(' ') === q.answer;
    case 'matching':     return ans.score === ans.total;
    case 'pronunciation':return ans >= 60;
    case 'spelling':     return ans.toLowerCase() === q.word.toLowerCase();
    default:             return ans === q.ok;
  }
};

window.typeIcon = function(t) {
  return ({
    'image-choice':'🖼','word-image':'🔤','audio-choice':'🔊','video-choice':'🎬',
    'pronunciation':'🎤','fill-blank':'✏️','word-order':'🔀',
    'matching':'🔗','true-false':'✓✗','spelling':'🔡'
  })[t] || '❓';
};

window.L          = ['A','B','C','D'];
window.CF_COLORS  = ['#4338ca','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#0ea5e9'];
window.fmt        = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
