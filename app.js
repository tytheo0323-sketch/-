/* === DOM === */
const panel     = document.getElementById("panel");
const startBtn  = document.getElementById("startBtn");
const resetBtn  = document.getElementById("resetBtn");
const counterEl = document.getElementById("counter");
const resultEl  = document.getElementById("result");
const nameIn    = document.getElementById("playerName");
const saveBtn   = document.getElementById("saveBtn");
const boardEl   = document.getElementById("leaderboard");
const chartSec  = document.getElementById("chartSection");
const chartCV   = document.getElementById("rtChart");

/* === 상태 === */
let attempts=0, max=5, waiting=false, startT=0;
let records=[];
let board = JSON.parse(localStorage.getItem("leaderboard"))||[];

/* === 그래프 객체 === */
let rtChart=null;

/* === 헬퍼 === */
const avg = a => Math.round(a.reduce((s,v)=>s+v,0)/a.length);
const setPanel=(cls,txt)=>{panel.className=cls; panel.textContent=txt;};
const updCounter = () => {counterEl.textContent=`도전 횟수: ${attempts} / ${max}`;};

/* === 그래프 초기화 === */
function initChart(){
  if(rtChart) return;
  chartSec.style.display="block";
  rtChart = new Chart(chartCV,{
    type:"bar",
    data:{labels:[],datasets:[{label:"반응 속도(ms)",data:[],
      backgroundColor:"#3b82f6"}]},
    options:{
      responsive:true,animation:false,
      scales:{y:{beginAtZero:true}}
    }
  });
}
/* 그래프 점 추가 */
function addPoint(val){
  initChart();
  rtChart.data.labels.push(`${attempts}회`);
  rtChart.data.datasets[0].data.push(val);
  rtChart.update();
}

/* === 라운드 === */
function startRound(){
  if(attempts>=max) return;
  setPanel("wait","WAIT...");
  waiting=false;
  setTimeout(()=>{
    setPanel("go","CLICK!");
    startT=performance.now(); waiting=true;
  }, 1000+Math.random()*2000);
}

/* === 클릭 === */
panel.addEventListener("click",()=>{
  if(!waiting) return;
  const rt=Math.round(performance.now()-startT);
  attempts++; records.push(rt); updCounter();
  addPoint(rt);
  resultEl.textContent=`✨ 반응 속도: ${rt}ms`;
  setPanel("ready","READY"); waiting=false;

  if(attempts<max) setTimeout(startRound,800);
  else{
    const mean=avg(records);
    resultEl.textContent=`🚀 평균 반응 속도: ${mean}ms`;
    nameIn.focus();
  }
});

/* === 버튼 === */
startBtn.addEventListener("click",()=>{
  attempts=0; records=[]; updCounter();
  if(rtChart){rtChart.destroy(); rtChart=null; chartSec.style.display="none";}
  resultEl.textContent=""; setPanel("ready","READY"); startRound();
});
resetBtn.addEventListener("click",()=>{
  attempts=0; records=[]; updCounter();
  if(rtChart){rtChart.destroy(); rtChart=null; chartSec.style.display="none";}
  resultEl.textContent="결과가 여기에 표시됩니다."; setPanel("ready","READY");
});

/* === 리더보드 === */
saveBtn.addEventListener("click",()=>{
  if(records.length!==max) return alert("테스트를 먼저 완료하세요!");
  const nick=nameIn.value.trim()||"플레이어";
  const score=avg(records);
  board.push({nick,score});
  board.sort((a,b)=>a.score-b.score); board=board.slice(0,5);
  localStorage.setItem("leaderboard",JSON.stringify(board));
  nameIn.value=""; renderBoard();
});
function renderBoard(){
  boardEl.innerHTML="";
  if(!board.length){boardEl.innerHTML="<li>아직 기록이 없습니다.</li>";return;}
  board.forEach((e,i)=>{
    const li=document.createElement("li");
    li.textContent=`${i+1}위 - ${e.nick}: ${e.score}ms`;
    boardEl.appendChild(li);
  });
}

/* === 초기 === */
updCounter(); setPanel("ready","READY"); renderBoard();
