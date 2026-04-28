import { appState } from './state.js';
import { updateDailyTargetUI } from './syllabus.js';

export function renderAll() {
    const grid = document.getElementById('modules-grid');
    grid.innerHTML = '';
    appState.subjectOrder.forEach(id => {
        const sub = appState.syllabus.find(s => s.id === id);
        if (!sub) return;
        const total = sub.topics.length;
        let doneCount = 0;

        const rows = sub.topics.map((t, idx) => {
            const key = `${sub.id}-${idx}`;
            const data = appState.progress[key] || {};
            if (data.done) doneCount++;

            let badge = '';
            if (data.difficulty === 'Easy') badge = '<span class="badge-easy px-1.5 rounded text-[10px] mr-2">E</span>';
            if (data.difficulty === 'Medium') badge = '<span class="badge-medium px-1.5 rounded text-[10px] mr-2">M</span>';
            if (data.difficulty === 'Hard') badge = '<span class="badge-hard px-1.5 rounded text-[10px] mr-2">H</span>';

            return `<div class="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition group">
                        <div class="flex-1 flex items-center pr-2 overflow-hidden">
                            <button onclick="window.deleteTopic('${sub.id}', ${idx})" class="text-slate-600 hover:text-neon-pink mr-2 transition"><i class="fa-solid fa-trash-can text-xs"></i></button>
                            ${badge}
                            <span class="text-sm truncate ${data.done ? 'line-through text-slate-600' : 'text-slate-200'}">${t}</span>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.openModal('${key}','${sub.title}','${t}')" class="text-slate-600 hover:text-white transition"><i class="fa-solid fa-gear"></i></button>
                            <label class="checkbox-wrapper cursor-pointer relative w-5 h-5">
                                <input type="checkbox" class="peer sr-only" onchange="window.toggleState('${key}')" ${data.done ? 'checked' : ''}>
                                <div class="w-5 h-5 border border-slate-600 rounded flex items-center justify-center text-black text-[10px] transition-all"><i class="fa-solid fa-check ${data.done ? 'block' : 'hidden'}"></i></div>
                            </label>
                        </div>
                    </div>`;
        }).join('');

        const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
        grid.innerHTML += `<div class="nexus-card rounded-2xl overflow-hidden flex flex-col" data-tilt>
                    <div class="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                        <h3 class="font-bold text-sm text-white">${sub.title}</h3>
                        <span class="text-xs font-bold text-neon-blue font-mono">${pct}%</span>
                    </div>
                    <div class="w-full bg-black/50 h-1"><div class="bg-gradient-to-r from-neon-blue to-neon-purple h-1 transition-all shadow-[0_0_5px_#00f3ff]" style="width:${pct}%"></div></div>
                    <div class="flex-1 max-h-80 overflow-y-auto">${rows}</div>
                    <div class="p-2 border-t border-white/5 flex gap-2">
                        <input id="add-${sub.id}" type="text" class="flex-1 text-xs p-2 rounded" placeholder="Add node..." onkeypress="if(event.key==='Enter') window.addTopic('${sub.id}')">
                        <button onclick="window.addTopic('${sub.id}')" class="bg-neon-blue text-black w-8 rounded font-bold hover:shadow-[0_0_10px_#00f3ff]"><i class="fa-solid fa-plus text-xs"></i></button>
                    </div>
                </div>`;
    });

    updateGamification();
    renderRevisions();
    renderMistakes();
    renderResources();
    // Re-init tilt on new elements
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
}

function updateGamification() {
    document.getElementById('user-xp').innerText = appState.userProfile.xp;
    document.getElementById('xp-progress').style.width = `${Math.min(100, (appState.userProfile.xp % 500) / 5)}%`;
    document.getElementById('today-goal').innerText = appState.userProfile.dailyTarget;
    // Calculate today done logic (simplified for visual)
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    Object.values(appState.progress).forEach(p => {
        if (p.done && p.dateCompleted && p.dateCompleted.startsWith(today)) count++;
    });
    document.getElementById('today-done').innerText = count;
    document.getElementById('daily-bar').style.width = `${Math.min(100, (count / appState.userProfile.dailyTarget) * 100)}%`;
}

function renderRevisions() {
    const list = document.getElementById('revision-list');
    list.innerHTML = '';
    const now = new Date();
    let c = 0;
    Object.keys(appState.progress).forEach(key => {
        if (appState.progress[key].done && appState.progress[key].dateCompleted) {
            const d = Math.floor((now - new Date(appState.progress[key].dateCompleted)) / (1000 * 60 * 60 * 24));
            if ([1, 3, 7, 15].includes(d)) {
                c++;
                const [s, i] = key.split('-');
                const sub = appState.syllabus.find(x => x.id === s);
                list.innerHTML += `<div class="min-w-[140px] bg-white/5 p-3 rounded-xl border border-yellow-500/50 shadow-sm"><p class="text-[10px] text-yellow-500 font-bold uppercase">T-Minus ${d} Days</p><p class="font-bold text-xs truncate text-white">${sub.topics[i]}</p></div>`;
            }
        }
    });
    if (c === 0) list.innerHTML = `<div class="text-xs text-slate-500 font-mono">No decay detected.</div>`;
}

function renderMistakes() {
    const list = document.getElementById('mistake-list');
    list.innerHTML = '';
    if (!appState.userProfile.mistakes.length) list.innerHTML = `<p class="text-slate-500 italic text-sm">System integrity 100%.</p>`;
    appState.userProfile.mistakes.forEach(m => list.innerHTML += `<div class="bg-neon-pink/10 p-4 rounded-lg border border-neon-pink/30"><h4 class="font-bold text-neon-pink text-xs uppercase mb-1">${m.topic}</h4><p class="text-slate-300 text-sm">${m.note}</p></div>`);
}

function renderResources() {
    const list = document.getElementById('resource-list');
    list.innerHTML = '';
    Object.keys(appState.progress).forEach(k => {
        if (appState.progress[k].link) {
            const [s, i] = k.split('-');
            const sub = appState.syllabus.find(x => x.id === s);
            list.innerHTML += `<div class="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center"><div class="overflow-hidden mr-2"><h4 class="font-bold text-xs truncate text-white">${sub.topics[i]}</h4></div><a href="${appState.progress[k].link}" target="_blank" class="text-neon-blue text-xs hover:underline font-mono">ACCESS</a></div>`;
        }
    });
}