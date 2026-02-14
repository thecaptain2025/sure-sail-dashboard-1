const runBtn = document.getElementById("runBtn");
const runId = document.getElementById("runId");

const neonToggle = document.getElementById("neonToggle");
const audioToggle = document.getElementById("audioToggle");
const oceanAudio = document.getElementById("oceanAudio");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayBody = document.getElementById("overlayBody");

const navItems = Array.from(document.querySelectorAll(".navItem")).filter(b => !b.classList.contains("logout"));
const panelBoxes = Array.from(document.querySelectorAll(".panelBox"));
const pills = Array.from(document.querySelectorAll(".pill"));

const barFoundation = document.getElementById("barFoundation");
const barDeep = document.getElementById("barDeep");
const barDeep2 = document.getElementById("barDeep2");

function setBar(el, pct){
  el.style.setProperty("--pct", pct);
  el.querySelector?.(".fill");
  el.style.setProperty("width", "100%");
  el.style.position = el.style.position || "relative";
  el.style.overflow = "hidden";
  el.style.borderRadius = el.style.borderRadius || "999px";
  el.style.setProperty("contain","paint");
  el.style.setProperty("background-clip","padding-box");
  el.style.setProperty("background-origin","padding-box");
  el.style.setProperty("background-size","100% 100%");
  el.style.setProperty("background-repeat","no-repeat");

  // drive ::after width
  el.style.setProperty("--afterWidth", pct + "%");
  el.style.setProperty("opacity","1");
  el.style.setProperty("filter","none");
  el.style.setProperty("transform","none");
  el.style.setProperty("transition","none");

  // set via CSS var by hacking an inline style for ::after isn't possible,
  // so we instead update a data attribute and read it in a tiny CSS rule:
  el.dataset.pct = pct;
}

function applyBarCssVar(){
  const style = document.getElementById("barStyle") || document.createElement("style");
  style.id = "barStyle";
  style.textContent = `
    .bar[data-pct]::after{ width: attr(data-pct percentage); }
  `;
  document.head.appendChild(style);
}
// attr(... percentage) isn't supported in most browsers for width; fallback:
function setBarFallback(el, pct){
  // create an inner fill once
  let fill = el.querySelector(".fill");
  if(!fill){
    fill = document.createElement("div");
    fill.className = "fill";
    fill.style.height = "100%";
    fill.style.width = "0%";
    fill.style.background = "linear-gradient(90deg, #f0d27a, #d7b35a)";
    fill.style.transition = "width .6s ease";
    el.appendChild(fill);
  }
  requestAnimationFrame(()=> fill.style.width = pct + "%");
}

function showOverlay(title, html){
  overlayTitle.textContent = title;
  overlayBody.innerHTML = html;
  overlay.classList.add("show");
}
overlay.addEventListener("click", (e)=>{
  if(e.target === overlay) overlay.classList.remove("show");
});

navItems.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    navItems.forEach(b=> b.classList.remove("active"));
    btn.classList.add("active");

    const view = btn.dataset.view;
    if(view === "zoneOps"){
      showOverlay("Zone Ops — Tool Descriptions", `
        <ul>
          <li><b>10 CAT Assessment</b>: 10-category foundation integrity scan.</li>
          <li><b>Global SPY Glass</b>: multi-chain/global posture summary.</li>
          <li><b>Historical Compare</b>: compares to prior MV entries.</li>
          <li><b>Micro Tide</b>: selects the current micro-context lane.</li>
          <li><b>Mindwake</b>: auto prompt hook when severity ≥ 4.</li>
          <li><b>Replay Mode</b>: outcome grading + replay harness.</li>
        </ul>
        <p><b>📘</b> Documentation view · <b>⚙</b> Execution view</p>
      `);
    } else if(view === "toll"){
      showOverlay("Toll Archive", `
        <p>Tripwire Alerts → auto-draft internal Toll Archive entries.</p>
        <p>(Stub view for preview.)</p>
      `);
    } else {
      overlay.classList.remove("show");
    }
  });
});

pills.forEach(p=>{
  p.addEventListener("click", ()=>{
    const box = p.closest(".panelBox");
    const siblings = Array.from(box.querySelectorAll(".pill"));
    siblings.forEach(s=> s.classList.remove("active"));
    p.classList.add("active");

    // header wipe to signal context change
    box.classList.add("wipe");
    setTimeout(()=> box.classList.remove("wipe"), 750);
  });
});

function ocean(){
  if(!oceanAudio) return;
  if(audioToggle.checked){
    // play softly; browsers require user interaction (button press) - runBtn counts.
    oceanAudio.currentTime = 0;
    oceanAudio.volume = 0.35;
    oceanAudio.play().catch(()=>{});
    setTimeout(()=> oceanAudio.pause(), 1800);
  }
}

function glow(el, on){
  if(!neonToggle.checked) return;
  if(on) el.classList.add("execGlow");
  else el.classList.remove("execGlow");
}

function sleep(ms){ return new Promise(r=> setTimeout(r, ms)); }

async function runSequence(){
  // update run id
  const n = String(Math.floor(Math.random()*90000)+10000);
  runId.textContent = `TH-${n}`;

  // stage progress
  setBarFallback(barFoundation, 65);
  setBarFallback(barDeep, 20);
  setBarFallback(barDeep2, 10);

  // orchestration order (panel-by-panel)
  const order = [
    document.querySelector('[data-panel="10cat"]'),
    document.querySelector('[data-panel="gss"]'),
    document.querySelector('[data-panel="progress"]'),
    document.querySelector('[data-panel="hist"]'),
    document.querySelector('[data-panel="micro"]'),
    document.querySelector('[data-panel="th2"]'),
    document.querySelector('[data-panel="mindwake"]'),
    document.querySelector('[data-panel="replay"]'),
    document.querySelector('[data-panel="deepProgress"]'),
  ].filter(Boolean);

  ocean();

  for(const panel of order){
    panel.classList.add("wipe");
    glow(panel, true);
    await sleep(320);
    glow(panel, false);
    setTimeout(()=> panel.classList.remove("wipe"), 750);
    await sleep(120);
  }

  // simulate completion
  setBarFallback(barFoundation, 85);
  setBarFallback(barDeep, 55);
  setBarFallback(barDeep2, 55);
}

runBtn.addEventListener("click", runSequence);
