/**
 * 笔记系统 - 共享模块
 * 用于加载、展示和阅读 Markdown 笔记
 * js/notes.js
 */

async function loadNotes() {
    const container = document.getElementById("note-list");
    if (!container) return;

    try {
        const resp = await fetch("notes.json");
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const notes = await resp.json();
        renderNoteList(notes);
    } catch (err) {
        console.error("加载笔记列表失败:", err);
        container.innerHTML =
            '<p class="empty-state">暂无笔记，往 markdown/ 文件夹中添加 .md 文件，然后运行 <code>python tools/generate_index.py</code> 即可更新</p>';
    }
}

function renderNoteList(notes) {
    const container = document.getElementById("note-list");
    if (notes.length === 0) {
        container.innerHTML =
            '<p class="empty-state">暂无笔记，往 markdown/ 文件夹中添加 .md 文件，然后运行 <code>python tools/generate_index.py</code> 即可更新</p>';
        return;
    }

    container.innerHTML = notes
        .map(
            (note, index) => `
        <article class="note-card" data-index="${index}">
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            ${
                note.description
                    ? `<p class="note-desc">${escapeHtml(note.description)}</p>`
                    : ""
            }
            <div class="note-meta">
                <span class="note-date">📅 ${note.date}</span>
            </div>
        </article>
    `
        )
        .join("");

    container.querySelectorAll(".note-card").forEach((card, index) => {
        card.addEventListener("click", () => openReader(notes[index]));
    });
}

async function openReader(note) {
    const overlay = document.getElementById("reader-overlay");
    const content = document.getElementById("reader-content");
    if (!overlay || !content) return;

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    content.innerHTML = '<div class="reader-loading">📖 加载中...</div>';

    try {
        const resp = await fetch("markdown/" + note.file);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const md = await resp.text();

        let html;
        if (typeof marked !== "undefined") {
            html = marked.parse(md, { breaks: true, gfm: true });
        } else {
            // 如果 marked 没加载，显示纯文本
            html = "<pre>" + escapeHtml(md) + "</pre>";
        }

        let title = note.title;
        const titleMatch = md.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            title = titleMatch[1].trim();
        }

        content.innerHTML = `
            <div class="reader-header">
                <h1 class="reader-title">${escapeHtml(title)}</h1>
                <span class="reader-date">📅 ${note.date}</span>
                <button class="reader-close" id="readerCloseBtn">✕</button>
            </div>
            <div class="reader-body">${html}</div>
        `;

        document.getElementById("readerCloseBtn").onclick = closeReader;
        content.scrollTop = 0;
    } catch (err) {
        console.error("加载笔记失败:", err);
        content.innerHTML =
            '<p class="reader-error">❌ 加载笔记失败，请检查 markdown 文件是否存在</p>';
    }
}

function closeReader() {
    const overlay = document.getElementById("reader-overlay");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// ESC 关闭
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeReader();
});

// 点击遮罩关闭
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("reader-overlay");
    if (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeReader();
        });
    }
});

function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

// 页面加载后自动加载笔记列表
document.addEventListener("DOMContentLoaded", loadNotes);
