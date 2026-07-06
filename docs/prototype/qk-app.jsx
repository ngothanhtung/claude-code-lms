/* ═══════════════ EnglishQuiz — App router ═══════════════ */
const {useState:useStateApp} = React;

function App(){
  const [route,setRoute]=useStateApp('welcome');
  const [ud,setUd]=useStateApp({});
  const [session,setSession]=useStateApp({grade:3,cls:'3A',partner:{name:'Mai Anh',initials:'MA',color:'#f59e0b'}});
  const [rd,setRd]=useStateApp(null);
  const [activeQuiz,setActiveQuiz]=useStateApp(null);
  const [dashView,setDashView]=useStateApp('home');

  function go(r,data={}){
    if(r==='result')setRd(data);
    if(data.quiz)setActiveQuiz(data.quiz);
    // dashboard sub-views are addressed via the dashboard route too
    if(r==='home'||r==='assignments'||r==='group'||r==='results'){
      setDashView(r); setRoute('dashboard'); window.scrollTo(0,0); return;
    }
    if(r==='dashboard'&&data.view) setDashView(data.view);
    setRoute(r);
    window.scrollTo(0,0);
  }

  let screen;
  switch(route){
    case 'welcome': screen=<WelcomeScreen go={go}/>; break;
    case 'login': screen=<LoginScreen go={go} setUD={setUd}/>; break;
    case 'grade':
    case 'onboarding': screen=<OnboardingScreen go={go} ud={ud} setSession={setSession}/>; break;
    case 'quiz': screen=<QuizScreen go={go} session={session} quiz={activeQuiz}/>; break;
    case 'result': screen=<ResultScreen go={go} rd={rd} session={session}/>; break;
    case 'dashboard':
    default: screen=<Dashboard go={go} session={session} ud={ud} initialView={dashView} key={dashView}/>;
  }
  return screen;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
