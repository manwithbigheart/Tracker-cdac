import { appState, currentModalKey } from './state.js';
import { saveToCloud } from './auth.js';
import { renderAll } from './ui.js';

export function toggleState(key) {
    if (!appState.progress[key]) appState.progress[key] = { done: false };
    const wasDone = appState.progress[key].done;
    appState.progress[key].done = !wasDone;
    if (!wasDone) appState.progress[key].dateCompleted = new Date().toISOString();

    let xp = 10;
    if (appState.progress[key].difficulty === 'Medium') xp = 20;
    if (appState.progress[key].difficulty === 'Hard') xp = 30;

    if (!wasDone) appState.userProfile.xp += xp;
    else appState.userProfile.xp -= xp;
    updateDailyTargetUI(wasDone ? -1 : 1);
    saveToCloud();
    if (!wasDone) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00f3ff', '#bc13fe'] });
}

export function deleteTopic(subId, idx) {
    if (!confirm("Delete node data?")) return;
    const sub = appState.syllabus.find(s => s.id === subId);
    sub.topics.splice(idx, 1);
    const newProgress = {};
    Object.keys(appState.progress).forEach(key => {
        const [sid, iStr] = key.split('-');
        const i = parseInt(iStr);
        if (sid === subId) {
            if (i < idx) newProgress[key] = appState.progress[key];
            if (i > idx) newProgress[`${sid}-${i-1}`] = appState.progress[key];
        } else {
            newProgress[key] = appState.progress[key];
        }
    });
    appState.progress = newProgress;
    saveToCloud();
    renderAll();
}

export function addTopic(subId) {
    const input = document.getElementById(`add-${subId}`);
    if (!input.value.trim()) return;
    const sub = appState.syllabus.find(s => s.id === subId);
    sub.topics.push(input.value);
    input.value = "";
    saveToCloud();
    renderAll();
}

export function openModal(key, sub, topic) {
    currentModalKey = key;
    const p = appState.progress[key] || {};
    document.getElementById('detail-modal').classList.remove('hidden');
    document.getElementById('modal-topic-title').innerText = topic;
    document.getElementById('modal-difficulty').value = p.difficulty || "Easy";
    document.getElementById('modal-time').value = p.time || "";
    document.getElementById('modal-notes').value = p.note || "";
    document.getElementById('modal-link').value = p.link || "";
    document.getElementById('modal-mistake-check').checked = false;
    document.getElementById('modal-mistake-text').classList.add('hidden');
    document.getElementById('modal-mistake-check').onchange = (e) => document.getElementById('modal-mistake-text').classList.toggle('hidden', !e.target.checked);
}

export function saveModalDetails() {
    if (!currentModalKey) return;
    if (!appState.progress[currentModalKey]) appState.progress[currentModalKey] = { done: false };
    const p = appState.progress[currentModalKey];
    p.difficulty = document.getElementById('modal-difficulty').value;
    p.time = document.getElementById('modal-time').value;
    p.note = document.getElementById('modal-notes').value;
    p.link = document.getElementById('modal-link').value;
    if (document.getElementById('modal-mistake-check').checked) {
        const txt = document.getElementById('modal-mistake-text').value;
        if (txt) appState.userProfile.mistakes.push({ topic: document.getElementById('modal-topic-title').innerText, note: txt });
    }
    saveToCloud();
    closeModal();
    renderAll();
}

export function closeModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

export function openSettings() {
    const list = document.getElementById('priority-list');
    list.innerHTML = '';
    appState.subjectOrder.forEach(id => {
        const s = appState.syllabus.find(x => x.id === id);
        if (s) list.innerHTML += `<div class="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center cursor-move text-white" data-id="${id}"><span class="font-bold text-sm">${s.title}</span><i class="fa-solid fa-bars text-slate-400"></i></div>`;
    });
    document.getElementById('settings-modal').classList.remove('hidden');
    new Sortable(list, {
        onEnd: () => {
            appState.subjectOrder = Array.from(list.children).map(c => c.dataset.id);
            saveToCloud();
            renderAll();
        }
    });
}

export function adjustTarget(n) {
    appState.userProfile.dailyTarget += n;
    if (appState.userProfile.dailyTarget < 1) appState.userProfile.dailyTarget = 1;
    saveToCloud();
    renderAll();
}

export function updateDailyTargetUI(n) {
    const el = document.getElementById('today-done');
    let v = parseInt(el.innerText) + n;
    if (v < 0) v = 0;
    el.innerText = v;
    document.getElementById('daily-bar').style.width = `${Math.min(100, (v / appState.userProfile.dailyTarget) * 100)}%`;
}

export function switchView(v) {
    ['dashboard', 'mistakes', 'resources'].forEach(id => document.getElementById(`view-${id}`).classList.add('hidden'));
    document.getElementById(`view-${v}`).classList.remove('hidden');
    if (v === 'resources') renderResources();
    if (v === 'mistakes') renderMistakes();
    if (window.innerWidth < 768) document.getElementById('sidebar').classList.add('hidden');
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

window.deleteTopic = deleteTopic;
window.addTopic = addTopic;
window.openModal = openModal;
window.saveModalDetails = saveModalDetails;
window.closeModal = closeModal;
window.openSettings = openSettings;
window.adjustTarget = adjustTarget;
window.switchView = switchView;