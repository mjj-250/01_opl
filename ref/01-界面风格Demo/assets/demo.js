(() => {
  "use strict";
  const TODAY = "2026-11-27";
  const quadrantNames = {
    "important-urgent": "重要且紧急",
    "important-not": "重要不紧急",
    "urgent-not": "紧急不重要",
    "neither": "不重要不紧急"
  };
  const quadrantAttributes = {
    "important-urgent": [true, true],
    "important-not": [true, false],
    "urgent-not": [false, true],
    "neither": [false, false]
  };
  const moduleDefaults = {
    "临时事务": { action: "", important: false },
    "日常生活": { action: "先站起来，准备开始", important: false },
    "健身": { action: "先换上运动服", important: true },
    "学习 · AI绘画": { action: "先打开学习资料", important: true },
    "开发 · 效率工具": { action: "先打开项目并找到入口", important: true },
    "游戏 · 王者荣耀": { action: "先打开最新攻略", important: false },
    "财务": { action: "先打开对应平台账单", important: false }
  };
  const tasks = [
    { id: "t1", name: "整理本周工单优先级", module: "开发 · 效率工具", startAction: "先打开工单列表", date: TODAY, time: "09:30", schedule: "今天 09:30", important: true, urgent: true, today: true, status: "doing", manualLocked: false },
    { id: "t2", name: "提交保险材料", module: "日常生活", startAction: "先找出身份证", date: TODAY, time: "11:00", schedule: "今天 11:00", important: true, urgent: true, today: true, status: "pending", manualLocked: false },
    { id: "t3", name: "完成哑铃训练 20 分钟", module: "健身", startAction: "先换上运动服", date: TODAY, time: "18:30", schedule: "今天 18:30", important: true, urgent: false, today: true, status: "pending", manualLocked: false },
    { id: "t4", name: "AI 绘画课程第 4 节", module: "学习 · AI绘画", startAction: "先打开课程页面", date: TODAY, time: "20:00", schedule: "今天 20:00", important: true, urgent: false, today: true, status: "pending", manualLocked: false },
    { id: "t5", name: "整理快速开发工具需求", module: "开发 · 效率工具", startAction: "先写下三个最烦的重复操作", date: "2026-11-28", time: "10:00", schedule: "明天 10:00", important: true, urgent: false, today: false, status: "pending", manualLocked: false },
    { id: "t6", name: "回复物业停水通知", module: "日常生活", startAction: "先打开物业消息", date: TODAY, time: "12:00", schedule: "今天 12:00", important: false, urgent: true, today: true, status: "pending", manualLocked: false },
    { id: "t7", name: "缴纳本月花呗", module: "财务", startAction: "先打开支付宝账单", date: TODAY, time: "21:00", schedule: "今天 21:00", important: false, urgent: true, today: true, status: "pending", manualLocked: true },
    { id: "t8", name: "整理王者荣耀中路攻略", module: "游戏 · 王者荣耀", startAction: "先收藏一篇最新版攻略", date: "2026-11-29", time: "15:00", schedule: "周六 15:00", important: false, urgent: false, today: false, status: "pending", manualLocked: false },
    { id: "t9", name: "清理手机相册", module: "日常生活", startAction: "", date: "", time: "", schedule: "有空时", important: false, urgent: false, today: false, status: "pending", manualLocked: false }
  ];
  let draggedId = null;
  let advancedTouched = false;
  let activeTaskId = null;
  let toastTimer = null;
  const createDialog = document.getElementById("task-dialog");
  const detailDialog = document.getElementById("detail-dialog");
  const form = document.getElementById("task-form");

  function quadrantFor(task) {
    if (task.important && task.urgent) return "important-urgent";
    if (task.important) return "important-not";
    if (task.urgent) return "urgent-not";
    return "neither";
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }
  function createTaskCard(task) {
    const card = element("article", `task-card${task.today ? " is-today" : ""}`);
    card.draggable = true;
    card.tabIndex = 0;
    card.dataset.taskId = task.id;
    card.setAttribute("aria-label", `${task.name}，${quadrantNames[quadrantFor(task)]}${task.manualLocked ? "，手动归类已锁定" : ""}`);

    const top = element("div", "task-topline");
    top.appendChild(element("span", "module-tag", task.module));
    const badges = element("div", "task-badges");
    if (task.today) badges.appendChild(element("span", "today-badge", "今天"));
    if (task.manualLocked) {
      const lock = element("button", "lock-button", "▣");
      lock.type = "button";
      lock.title = "恢复自动归类";
      lock.setAttribute("aria-label", `恢复 ${task.name} 的自动归类`);
      lock.addEventListener("click", event => {
        event.stopPropagation();
        unlockTask(task.id);
      });
      badges.appendChild(lock);
    }
    top.appendChild(badges);
    card.appendChild(top);

    const title = element("button", "task-title", task.name);
    title.type = "button";
    title.addEventListener("click", () => showDetail(task.id));
    card.appendChild(title);

    const action = element("p", `start-action${task.startAction ? "" : " is-empty"}`);
    action.appendChild(element("span", "", "↳"));
    action.appendChild(element("span", "", task.startAction || "尚未设置启动动作"));
    card.appendChild(action);

    const footer = element("div", "task-footer");
    footer.appendChild(element("span", "task-time", task.schedule));
    if (task.status === "doing") footer.appendChild(element("span", "status-pill", "进行中"));
    card.appendChild(footer);

    card.addEventListener("click", event => {
      if (event.target === card) showDetail(task.id);
    });
    card.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target === card) {
        event.preventDefault();
        showDetail(task.id);
      }
    });
    card.addEventListener("dragstart", event => {
      draggedId = task.id;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", task.id);
      requestAnimationFrame(() => card.classList.add("dragging"));
    });
    card.addEventListener("dragend", () => {
      draggedId = null;
      card.classList.remove("dragging");
      document.querySelectorAll(".drag-over").forEach(zone => zone.classList.remove("drag-over"));
    });
    return card;
  }
  function render() {
    document.querySelectorAll("[data-dropzone]").forEach(zone => {
      const quadrant = zone.dataset.dropzone;
      const matching = tasks.filter(task => quadrantFor(task) === quadrant);
      zone.replaceChildren();
      matching.forEach(task => zone.appendChild(createTaskCard(task)));
      if (!matching.length) zone.appendChild(element("div", "empty-list", "把任务拖到这里"));
      const section = zone.closest(".quadrant");
      section.querySelector(".quadrant-count").textContent = String(matching.length);
      section.setAttribute("aria-label", `${quadrantNames[quadrant]}，${matching.length} 个任务`);
    });
    document.getElementById("today-count").textContent = String(tasks.filter(task => task.today).length);
    document.getElementById("doing-count").textContent = String(tasks.filter(task => task.status === "doing").length);
    document.getElementById("locked-count").textContent = String(tasks.filter(task => task.manualLocked).length);
  }
  function moveTask(id, quadrant) {
    const task = tasks.find(item => item.id === id);
    if (!task || !quadrantAttributes[quadrant]) return;
    const [important, urgent] = quadrantAttributes[quadrant];
    task.important = important;
    task.urgent = urgent;
    task.manualLocked = true;
    render();
    showToast(`已移至“${quadrantNames[quadrant]}”，并锁定手动归类`);
  }
  function unlockTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task || !task.manualLocked) return;
    task.manualLocked = false;
    task.important = moduleDefaults[task.module] ? moduleDefaults[task.module].important : task.important;
    task.urgent = task.date === TODAY;
    render();
    if (detailDialog.open) showDetail(id);
    showToast("已解除锁定，后续可按时间与任务属性自动归类");
  }
  function showDetail(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;
    activeTaskId = id;
    const content = document.getElementById("detail-content");
    content.replaceChildren();
    content.appendChild(element("h3", "detail-title", task.name));
    content.appendChild(element("p", "detail-meta", `${task.module} · ${task.schedule}`));
    const action = element("div", "detail-action-box");
    action.appendChild(element("small", "", "启动动作"));
    action.appendChild(element("strong", "", task.startAction || "尚未设置，可在完整原型中补充"));
    content.appendChild(action);
    const label = element("label", "field");
    label.appendChild(element("span", "", "所在象限"));
    const select = element("select");
    Object.entries(quadrantNames).forEach(([value, name]) => {
      const option = element("option", "", name);
      option.value = value;
      option.selected = quadrantFor(task) === value;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      moveTask(id, select.value);
      showDetail(id);
    });
    label.appendChild(select);
    content.appendChild(label);
    content.appendChild(element("p", "detail-lock-note", task.manualLocked ? "当前为手动归类，时间变化不会覆盖此位置。" : "当前跟随任务属性自动归类；更改象限后会锁定。"));
    const unlock = document.getElementById("unlock-task");
    unlock.disabled = !task.manualLocked;
    if (!detailDialog.open) detailDialog.showModal();
  }

  document.querySelectorAll("[data-dropzone]").forEach(zone => {
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", event => {
      if (!zone.contains(event.relatedTarget)) zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", event => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      moveTask(event.dataTransfer.getData("text/plain") || draggedId, zone.dataset.dropzone);
    });
  });
  document.getElementById("open-create").addEventListener("click", () => {
    form.reset();
    document.getElementById("task-date").value = TODAY;
    document.querySelector(".advanced-fields").open = false;
    advancedTouched = false;
    createDialog.showModal();
    setTimeout(() => document.getElementById("task-name").focus(), 0);
  });
  document.getElementById("task-module").addEventListener("change", event => {
    const defaults = moduleDefaults[event.target.value];
    document.getElementById("task-action").value = defaults.action;
    document.getElementById("task-important").value = String(defaults.important);
  });
  document.querySelectorAll(".advanced-fields select").forEach(select => {
    select.addEventListener("change", () => { advancedTouched = true; });
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    const module = String(data.get("module"));
    const date = String(data.get("date") || "");
    const time = String(data.get("time") || "");
    const advanced = advancedTouched;
    const defaults = moduleDefaults[module];
    const important = advanced ? data.get("important") === "true" : defaults.important;
    const urgent = advanced ? data.get("urgent") === "true" : date === TODAY;
    tasks.push({
      id: `task-${Date.now()}`,
      name,
      module,
      startAction: String(data.get("startAction") || "").trim(),
      date,
      time,
      schedule: date === TODAY ? `今天 ${time || "未定时间"}` : date ? `${date} ${time}`.trim() : "待定",
      important,
      urgent,
      today: date === TODAY,
      status: "pending",
      manualLocked: advanced
    });
    createDialog.close();
    render();
    showToast(`已加入“${quadrantNames[quadrantFor(tasks[tasks.length - 1])]}”${advanced ? "，并锁定手动归类" : ""}`);
  });
  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
  });
  [createDialog, detailDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  });
  document.getElementById("unlock-task").addEventListener("click", () => unlockTask(activeTaskId));
  document.querySelectorAll("[data-preview]").forEach(button => {
    button.addEventListener("click", () => showToast(`${button.dataset.preview}将在完整原型中开放，本 Demo 用于比较风格与四象限交互`));
  });
  render();
  window.__OPL_DEMO__ = { tasks, quadrantFor, moveTask, unlockTask, render };
})();
