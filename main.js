
let data = null
const isScrumMasterView = window.location.href.includes('scrummaster');
const isTeamMemberView = window.location.href.includes('team');

if (isScrumMasterView) {
  document.body.classList.add('scrummaster-view');
}


function initKanban () {
  const sprint = document.getElementById('sprint-select')?.value || 'sp1';

  if (isTeamMemberView) {
    populateTeamMemberSelect();
    populateOwnerOptions();

    const select = document.getElementById('team-member-select');
    if (select && !select.value) {
      select.value = 'm1'; // ברירת מחדל לאורי כהן
    }

    renderBoard(sprint);
    updateTeamMemberHeader(); // ← כאן תוודא שהתמונה והשם מוצגים

    document.getElementById('sprint-select')?.addEventListener('change', () => {
      const sprint = document.getElementById('sprint-select')?.value || 'sp1';
      renderBoard(sprint);
      updateTeamMemberHeader();
    });

    document.getElementById('team-member-select')?.addEventListener('change', () => {
      renderBoard(sprint);
      updateTeamMemberHeader(); // ← שינוי תמונה + שם בהתאם לבחירה
    });

    document.getElementById('sort-tasks')?.addEventListener('change', () => renderBoard(sprint));
  } else {
    populateJumpToMember();

    renderBoard(sprint, isScrumMasterView);
    setupDragAndDrop();
    populateOwnerOptions();
  }
}


function populateOwnerOptions () {
  const ownerSelect = document.getElementById('task-owner')
  if (!ownerSelect || !data?.kanban?.members) return
  ownerSelect.innerHTML = ''
  const backlogOption = document.createElement('option')
  backlogOption.value = 'backlog'
  backlogOption.textContent = 'בקלוג'
  ownerSelect.appendChild(backlogOption)
  Object.entries(data.kanban.members).forEach(([id, member]) => {
    const opt = document.createElement('option')
    opt.value = id
    opt.textContent = member.name
    ownerSelect.appendChild(opt)
  })
}

function generateTeamColumns () {
  const board = document.getElementById('kanban-board')
  board.innerHTML = ''
  const backlog = document.createElement('div')
  backlog.className = 'column'
  backlog.id = 'backlog'
  backlog.innerHTML = '<h2>רשימת מטלות</h2>'
  board.appendChild(backlog)
  Object.entries(data.kanban.members).forEach(([id, member]) => {
    const col = document.createElement('div')
    col.className = 'column'
    col.id = id
    col.innerHTML = `<h2>${member.name}</h2>`
    board.appendChild(col)
  })
}


// function generateStatusColumns () {
//   const board = document.getElementById('kanban-board')
//   board.innerHTML = ''
//   const statuses = ['backlog', 'new', 'todo', 'doing', 'review', 'done']
//   statuses.forEach(status => {
//     const col = document.createElement('div')
//     col.className = 'column'
//     col.id = status
//     const labels = {
//       backlog: 'רשימת מטלות',
//       new: 'חדש',
//       todo: 'לביצוע',
//       doing: 'בתהליך',
//       review: 'לבדיקה',
//       done: 'בוצע'
//     }
//     col.innerHTML = `<h2>${labels[status]}</h2>`
//     board.appendChild(col)
//   })
// }

function generateStatusColumns () {
  const board = document.getElementById('kanban-board');
  board.innerHTML = '';

  // ❗ בתצוגת חבר צוות – לא נציג את עמודת backlog
  const statuses = isTeamMemberView
    ? ['new', 'todo', 'doing', 'review', 'done']
    : ['backlog', 'new', 'todo', 'doing', 'review', 'done'];

  const labels = {
    backlog: 'רשימת מטלות',
    new: 'חדש',
    todo: 'לביצוע',
    doing: 'בתהליך',
    review: 'לבדיקה',
    done: 'בוצע'
  };

  statuses.forEach(status => {
    const col = document.createElement('div');
    col.className = 'column';
    col.id = status;
    col.innerHTML = `<h2>${labels[status]}</h2>`;
    board.appendChild(col);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const isRelevantPage =
    window.location.href.includes('scrummaster') ||
    window.location.href.includes('teammember') ||
    window.location.href.includes('productowner');

  // ⛔ Prevent logic from running on unrelated pages (e.g., about.html)
  if (!isRelevantPage) return;

  fetch('scrum_data_20_img_he.txt')
    .then(r => r.text())
    .then(txt => {
      try {
        const parsed = JSON.parse(txt);
        data = parsed.kanban ? parsed : { kanban: parsed };
        initKanban();


        if (isScrumMasterView) {
          google.charts.load('current', { packages: ['corechart'] });
          google.charts.setOnLoadCallback(() => renderBarChart());
        }

        if (!isTeamMemberView) {
          document.getElementById('sort-tasks')?.addEventListener('change', () => {
            const sprint = document.getElementById('sprint-select')?.value || 'sp1';
            renderBoard(sprint, isScrumMasterView);
          });
        }
      } catch (e) {
        alert('שגיאה בפענוח הנתונים: ' + e.message);
      }
    })
    .catch(() => alert('שגיאה בטעינת קובץ scrum_data_20_img_he.txt'));
    populateMenuLinks();

});

function renderTask(id, columnId, statusKey) {
  const task = data.kanban.tasks[id];
  if (!task) return;

  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = `task ${getPriorityClass(task.priority)}`;
  div.id = id;
  div.draggable = true;

  const statusLabels = {
    backlog: 'בקלוג',
    new: 'חדש',
    todo: 'לביצוע',
    doing: 'בתהליך',
    review: 'לבדיקה',
    done: 'בוצע'
  };

  const statusText = statusLabels[statusKey] || statusKey;
  const ownerName = data.kanban.members?.[task.owner]?.name || task.owner;

  const displayMeta = isScrumMasterView
    ? `🏷️ ${statusText}`
    : `🧍 ${ownerName}`;

  // תוכן המשימה
  const content = document.createElement('div');
  content.className = 'task-content';
  content.innerHTML = `
    <strong>${task.title}</strong><br>
    ${displayMeta} | ⚡ ${task.priority} | 💰 ${task.value} | 📦 ${task.workload}
  `;

  // כפתורים
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => editTask(id));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.addEventListener('click', () => deleteTask(id));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  // בניית כרטיס
  div.appendChild(content);
  div.appendChild(actions);

  div.ondragstart = e => e.dataTransfer.setData('text/plain', id);

  const col = document.getElementById(columnId);
  if (col) col.appendChild(div);
}


// function renderTask(id, columnId, statusKey) {
//   const task = data.kanban.tasks[id];
//   if (!task) return;

//   const existing = document.getElementById(id);
//   if (existing) existing.remove();

//   const div = document.createElement('div');
// div.className = `task ${getPriorityClass(task.priority)}`;
//   div.id = id;
//   div.draggable = true;

//   const statusLabels = {
//     backlog: 'בקלוג',
//     new: 'חדש',
//     todo: 'לביצוע',
//     doing: 'בתהליך',
//     review: 'לבדיקה',
//     done: 'בוצע'
//   };

//   const statusText = statusLabels[statusKey] || statusKey;
//   const ownerName = data.kanban.members?.[task.owner]?.name || task.owner;

//   const displayMeta = isScrumMasterView
//     ? `🏷️ ${statusText}`
//     : `🧍 ${ownerName}`;

//   const content = document.createElement('div');
//   content.innerHTML = `
//     <strong>${task.title}</strong><br>
//     ${displayMeta} | ⚡ ${task.priority} | 💰 ${task.value} | 📦 ${task.workload}
//   `;

//   const editBtn = document.createElement('button');
//   editBtn.textContent = '✏️';
//   editBtn.addEventListener('click', () => editTask(id));

//   const deleteBtn = document.createElement('button');
//   deleteBtn.textContent = '🗑️';
//   deleteBtn.addEventListener('click', () => deleteTask(id));

//   div.appendChild(content);
//   div.appendChild(editBtn);
//   div.appendChild(deleteBtn);
//   div.ondragstart = e => e.dataTransfer.setData('text/plain', id);

//   const col = document.getElementById(columnId);
//   if (col) col.appendChild(div);
// }

// function renderBoard(sprint, includeMembers = false) {
//   includeMembers ? generateTeamColumns() : generateStatusColumns();

//   const sprintData = data.kanban.sprintlog[sprint] || {};
//   const allSprintTaskIds = [];

//   const sortBy = document.getElementById('sort-tasks')?.value || '';
//   const sortDir = 'desc'; // קבוע רק מגדול לקטן

//   Object.entries(sprintData).forEach(([status, ids]) => {
//     const sortedIds = sortTaskIds(ids, sortBy, sortDir);

//     sortedIds.forEach(id => {
//       const task = data.kanban.tasks[id];
//       if (!task) return;
//       allSprintTaskIds.push(id);

//       if (includeMembers) {
//         renderTask(id, task.owner, status);
//       } else {
//         renderTask(id, status, status);
//       }
//     });
//   });


//   const backlogIds = Object.keys(data.kanban.tasks).filter(id => !allSprintTaskIds.includes(id));
// const sortedBacklog = sortTaskIds(backlogIds, sortBy, sortDir);

// sortedBacklog.forEach(id => {
//   renderTask(id, 'backlog', 'backlog');
// });


//   setupDragAndDrop();
//   renderReport?.();
// }

function renderBoard(sprint, includeMembers = false) {
  if (isTeamMemberView) {
    generateStatusColumns(); // עמודות לפי סטטוס
  } else {
    includeMembers ? generateTeamColumns() : generateStatusColumns();
  }

  const sprintData = data.kanban.sprintlog[sprint] || {};
  const allSprintTaskIds = [];

  const sortBy = document.getElementById('sort-tasks')?.value || '';
  const sortDir = 'esc';
  const memberId = document.getElementById('team-member-select')?.value;

  Object.entries(sprintData).forEach(([status, ids]) => {
    let filteredIds = ids;

    if (isTeamMemberView && Array.isArray(data.kanban.backlog)) {
  const memberId = document.getElementById('team-member-select')?.value;

  const filteredBacklog = data.kanban.backlog.filter(id => {
    const t = data.kanban.tasks[id];
    return t?.owner === memberId;
  });

  const sortedBacklog = sortTaskIds(filteredBacklog, sortBy, sortDir);

  // נניח שהמשימות עדיין לא שובצו לספרינט – שמים אותן כ"חדש"
sortedBacklog.forEach(id => {
  renderTask(id, 'new', 'new');

  // הוספה לספרינט
  data.kanban.sprintlog[sprint]['new'] ??= [];
  if (!data.kanban.sprintlog[sprint]['new'].includes(id)) {
    data.kanban.sprintlog[sprint]['new'].push(id);
  }

  // ✂️ הסרה מה-backlog
  const index = data.kanban.backlog.indexOf(id);
  if (index !== -1) {
    data.kanban.backlog.splice(index, 1);
  }
});


}

    // ✨ בתצוגת חבר צוות – מסננים לפי בעל משימה
    if (isTeamMemberView && memberId) {
      filteredIds = ids.filter(id => data.kanban.tasks[id]?.owner === memberId);
    }

    const sortedIds = sortTaskIds(filteredIds, sortBy, sortDir);

    sortedIds.forEach(id => {
      const task = data.kanban.tasks[id];
      if (!task) return;
      allSprintTaskIds.push(id);

      const columnId = isTeamMemberView ? status : (includeMembers ? task.owner : status);
      renderTask(id, columnId, status);
    });
  });

  // ✂️ לא מציגים בקלוג בתצוגת חבר צוות
  if (!isTeamMemberView) {
    const backlogIds = Object.keys(data.kanban.tasks).filter(id => !allSprintTaskIds.includes(id));
    const sortedBacklog = sortTaskIds(backlogIds, sortBy, sortDir);
    sortedBacklog.forEach(id => renderTask(id, 'backlog', 'backlog'));
  }


   if (isTeamMemberView) {
    if (memberId) renderTeamReport(memberId, sprint);
  } else {
    renderReport?.();
  }

  // 📌 זה חייב להיות אחרי יצירת העמודות והמשימות
  setupDragAndDrop(); // <— תוודא שזה נמצא כאן, לא בתוך תנאי
}


// function moveTask(id, newStatus) {
//   const sprint = document.getElementById('sprint-select').value;

//   // הסר את המשימה מכל העמודות הקיימות
//   Object.entries(data.kanban.sprintlog[sprint] || {}).forEach(([status, list]) => {
//     const index = list.indexOf(id);
//     if (index !== -1) list.splice(index, 1);
//   });

//   if (isScrumMasterView) {
//     // בתצוגת סקראם: העמודות הן לפי בעלים
//     data.kanban.tasks[id].owner = newStatus; // עדכון הבעלים
//     const status = getTaskStatusInSprint(id, sprint) || 'new';
//     data.kanban.sprintlog[sprint][status] ??= [];
//     data.kanban.sprintlog[sprint][status].push(id);
//   } else {
//     // בתצוגת פרודקט: העמודות הן לפי סטטוס
//     data.kanban.sprintlog[sprint][newStatus] ??= [];
//     data.kanban.sprintlog[sprint][newStatus].push(id);
//   }

//   renderBoard(sprint, isScrumMasterView, isTeamMemberView);

//   if (isScrumMasterView) renderBarChart();
// }

function moveTask(id, newColumnId) {
  const sprint = document.getElementById('sprint-select').value;

  // מחיקת המשימה מכל הסטטוסים בספרינט
  Object.values(data.kanban.sprintlog[sprint]).forEach(list => {
    const i = list.indexOf(id);
    if (i !== -1) list.splice(i, 1);
  });

  const task = data.kanban.tasks[id];
  if (!task) return;

  if (isScrumMasterView) {
    // העמודות הן שמות בעלי צוות => שינוי הבעלים
    task.owner = newColumnId;
    const currentStatus = getTaskStatusInSprint(id, sprint) || 'new';
    data.kanban.sprintlog[sprint][currentStatus] ??= [];
    data.kanban.sprintlog[sprint][currentStatus].push(id);
  }

  else if (isTeamMemberView) {
    // העמודות הן סטטוסים => שינוי סטטוס בלבד
    data.kanban.sprintlog[sprint][newColumnId] ??= [];
    data.kanban.sprintlog[sprint][newColumnId].push(id);
  }

  else {
    // פרודקט: שינוי סטטוס בלבד
    data.kanban.sprintlog[sprint][newColumnId] ??= [];
    data.kanban.sprintlog[sprint][newColumnId].push(id);
  }

  renderBoard(sprint, isScrumMasterView);
  if (isScrumMasterView) renderBarChart();
}


function renderReport () {
const tbody = document.querySelector('#report-table tbody');
if (!tbody) {
  console.warn('Missing #report-table tbody in DOM');
  return;
}
tbody.innerHTML = '';


  const statusLabels = {
    backlog: 'רשימת מטלות',
    new: 'חדש',
    todo: 'לביצוע',
    doing: 'בתהליך',
    review: 'לבדיקה',
    done: 'בוצע'
  };

  // משימות בבקלוג
  if (Array.isArray(data.kanban.backlog)) {
    data.kanban.backlog.forEach(id => {
      const t = data.kanban.tasks[id];
      if (!t) return;
      const ownerName = data.kanban.members?.[t.owner]?.name || t.owner;
      const row = document.createElement('tr');
      row.innerHTML = `<td>${t.title}</td><td>${statusLabels['backlog']}</td><td>${ownerName}</td><td>${t.priority}</td><td>${t.value}</td><td>${t.workload}</td>`;
      tbody.appendChild(row);
      if (isTeamMemberView) {
        const memberId = document.getElementById('team-member-select')?.value;
        if (memberId && t.owner !== memberId) return; // מסנן לפי חבר צוות
        console.log(`משימה בבקלוג: ${t.title} (${t.owner})`);
      }

    });
  }

  // משימות לפי ספרינטים
  Object.entries(data.kanban.sprintlog).forEach(([sprint, statusMap]) => {
    Object.entries(statusMap).forEach(([status, ids]) => {
      const statusText = statusLabels[status] || status;
      ids.forEach(id => {
        const t = data.kanban.tasks[id];
        if (!t) return;
        const ownerName = data.kanban.members?.[t.owner]?.name || t.owner;
        const row = document.createElement('tr');
row.innerHTML = `
<td class="task-title-cell">${t.title}</td>
  <td data-label="סטטוס">${statusText}</td>
  <td data-label="אחראי">${ownerName}</td>
  <td data-label="עדיפות">${t.priority}</td>
  <td data-label="ערך">${t.value}</td>
  <td data-label="עומס">${t.workload}</td>
`;

      });
    });
  });
}

function renderReport() {
  const tbody = document.querySelector('#report-table tbody');
  if (!tbody) {
    console.warn('Missing #report-table tbody in DOM');
    return;
  }
  tbody.innerHTML = '';

  const sortBy = document.getElementById('sort-tasks')?.value || '';
  const sortDir = 'esc';

  const statusLabels = {
    backlog: 'רשימת מטלות',
    new: 'חדש',
    todo: 'לביצוע',
    doing: 'בתהליך',
    review: 'לבדיקה',
    done: 'בוצע'
  };

  const allTasks = [];

  if (Array.isArray(data.kanban.backlog)) {
    data.kanban.backlog.forEach(id => {
      const t = data.kanban.tasks[id];
      if (!t) return;
      allTasks.push({
        id,
        title: t.title,
        status: 'backlog',
        owner: t.owner,
        priority: t.priority,
        value: t.value,
        workload: t.workload
      });
    });
  }

  Object.entries(data.kanban.sprintlog).forEach(([sprint, statusMap]) => {
    Object.entries(statusMap).forEach(([status, ids]) => {
      ids.forEach(id => {
        const t = data.kanban.tasks[id];
        if (!t) return;
        allTasks.push({
          id,
          title: t.title,
          status,
          owner: t.owner,
          priority: t.priority,
          value: t.value,
          workload: t.workload
        });
      });
    });
  });

  const sortedTasks = sortTaskObjects(allTasks, sortBy, sortDir);

  sortedTasks.forEach(t => {
    const ownerName = data.kanban.members?.[t.owner]?.name || t.owner;
    const statusText = statusLabels[t.status] || t.status;
    const row = document.createElement('tr');
row.innerHTML = `
<td class="task-title-cell">${t.title}</td>
  <td data-label="סטטוס">${statusText}</td>
  <td data-label="אחראי">${ownerName}</td>
  <td data-label="עדיפות">${t.priority}</td>
  <td data-label="ערך">${t.value}</td>
  <td data-label="עומס">${t.workload}</td>
`;

    tbody.appendChild(row);
  });
}


function openModal () {
  document.getElementById('task-modal').style.display = 'flex'
  document.getElementById('task-modal').dataset.mode = 'new'
  document.getElementById('task-modal').dataset.taskId = ''
}

function closeModal () {
  document.getElementById('task-modal').style.display = 'none'
  ;[
    'task-title',
    'task-owner',
    'task-value',
    'task-priority',
    'task-workload'
  ].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.value = ''
  })
  document.getElementById('task-modal').dataset.mode = 'new'
  document.getElementById('task-modal').dataset.taskId = ''
}



function saveTask () {
  const title = document.getElementById('task-title').value.trim()
  const owner = document.getElementById('task-owner').value
  const value = Number(document.getElementById('task-value').value)
  const priority = document.getElementById('task-priority').value
  const workload = Number(document.getElementById('task-workload').value)
  const sprint = document.getElementById('sprint-select').value
  const modal = document.getElementById('task-modal')
  const mode = modal.dataset.mode
  const statusId = document.getElementById('statusId')?.value || 'new'
  const taskId = modal.dataset.taskId

  if (!title || !owner || isNaN(workload) || workload <= 0) {
    alert('אנא מלא/י את כל השדות כנדרש')
    return
  }

  const taskData = { title, owner, value, priority, workload }
  if (!data.kanban) data.kanban = {}
  if (!data.kanban.tasks) data.kanban.tasks = {}
  if (!data.kanban.sprintlog) data.kanban.sprintlog = {}
  if (!data.kanban.sprintlog[sprint]) data.kanban.sprintlog[sprint] = {}

  // אם עורכים משימה קיימת
  if (mode === 'edit' && taskId && data.kanban.tasks[taskId]) {
    data.kanban.tasks[taskId] = taskData

    // הסר את המשימה מכל עמודות הספרינט
    Object.values(data.kanban.sprintlog[sprint]).forEach(list => {
      const i = list.indexOf(taskId)
      if (i !== -1) list.splice(i, 1)
    })

    const statusKey = isScrumMasterView ? statusId : statusId
    data.kanban.sprintlog[sprint][statusKey] ??= []
    data.kanban.sprintlog[sprint][statusKey].push(taskId)
  }

  // אם זו משימה חדשה
  else {
    const newId = 't' + Date.now()
    data.kanban.tasks[newId] = taskData
    const statusKey = isScrumMasterView ? statusId : statusId
    data.kanban.sprintlog[sprint][statusKey] ??= []
    data.kanban.sprintlog[sprint][statusKey].push(newId)
  }

  closeModal()
  localStorage.setItem('kanbanData', JSON.stringify(data))
  renderBoard(sprint, isScrumMasterView)
  if (isScrumMasterView) renderBarChart()
}


function editTask (id) {
  const t = data.kanban.tasks[id]
  if (!t) return
  ;['title', 'owner', 'value', 'priority', 'workload'].forEach(field => {
    document.getElementById(`task-${field}`).value = t[field]
  })
  const modal = document.getElementById('task-modal')
  modal.dataset.mode = 'edit'
  modal.dataset.taskId = id
  modal.style.display = 'flex'
}

function deleteTask (id) {
  delete data.kanban.tasks[id]
  const removeFrom = list => {
    const i = list.indexOf(id)
    if (i !== -1) list.splice(i, 1)
  }
  if (Array.isArray(data.kanban.backlog)) removeFrom(data.kanban.backlog)
  Object.values(data.kanban.sprintlog).forEach(sprint => {
    Object.values(sprint).forEach(removeFrom)
  })
  localStorage.setItem('kanbanData', JSON.stringify(data))
  const sprint = document.getElementById('sprint-select').value
  renderBoard(sprint, isScrumMasterView)
  if (isScrumMasterView) renderBarChart()
}

function setupDragAndDrop () {
  document.querySelectorAll('.column').forEach(col => {
    col.ondragover = e => e.preventDefault()
    col.ondrop = e => {
      e.preventDefault()
      const id = e.dataTransfer.getData('text/plain')
      const status = col.id
      moveTask(id, status)
    }
  })
}


function getTaskStatusInSprint(id, sprint) {
  const sprintMap = data.kanban.sprintlog[sprint] || {};
  for (const [status, ids] of Object.entries(sprintMap)) {
    if (ids.includes(id)) return status;
  }
  return null;
}

function renderBarChart () {
  if (!data?.kanban?.tasks || !data?.kanban?.members) return;

  const sprint = document.getElementById('sprint-select').value;
  const taskCounts = {};

  Object.keys(data.kanban.members).forEach(id => {
    taskCounts[id] = 0;
  });

  Object.entries(data.kanban.sprintlog[sprint] || {}).forEach(([status, ids]) => {
    ids.forEach(id => {
      const t = data.kanban.tasks[id];
      if (!t || !t.owner) return;
      taskCounts[t.owner] += Number(t.workload || 0);
    });
  });

  const chartData = [['חבר צוות', 'עומס עבודה', { role: 'style' }]];
  Object.entries(taskCounts).forEach(([ownerId, totalWorkload]) => {
    const name = data.kanban.members?.[ownerId]?.name || ownerId;

    // 🎨 צבע דינמי לפי עומס
    const color = totalWorkload > 10
      ? '#e53935'   // עומס גבוה - אדום
      : totalWorkload > 5
        ? '#fbc02d' // עומס בינוני - צהוב
        : '#43a047'; // עומס נמוך - ירוק

    chartData.push([name, totalWorkload, color]);
  });

  const dataTable = google.visualization.arrayToDataTable(chartData);

  const options = {
    title: 'עומס עבודה לפי חבר צוות',
    titleTextStyle: {
      fontSize: 20,
      bold: true,
      color: '#333'
    },
    legend: 'none',
    hAxis: {
      title: 'עומס כולל',
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 14, bold: true }
    },
    vAxis: {
      title: '',
      textStyle: { fontSize: 14 }
    },
    chartArea: { width: '75%', height: '80%' },
    bar: { groupWidth: '60%' },
    animation: {
      duration: 600,
      easing: 'out',
      startup: true
    }
  };

  const chart = new google.visualization.BarChart(
    document.getElementById('bar-chart')
  );
  chart.draw(dataTable, options);
}


function sortTaskIds(ids, by, dir = 'asc') {
  if (!by) return ids;

  const priorityOrder = {
    'נמוך': 1,
    'בינוני': 2,
    'גבוהה': 3
  };

  return [...ids].sort((a, b) => {
    const ta = data.kanban.tasks[a];
    const tb = data.kanban.tasks[b];
    if (!ta || !tb) return 0;

    if (by === 'priority') {
      const pa = priorityOrder[ta.priority] || 99;
      const pb = priorityOrder[tb.priority] || 99;
      return dir === 'desc' ? pa - pb : pb - pa;
    }

    if (by === 'workload') {
      const wa = Number(ta.workload) || 0;
      const wb = Number(tb.workload) || 0;
      return dir === 'desc' ? wa - wb : wb - wa;
    }

    return 0;
  });
}

function populateTeamMemberSelect() {
  const select = document.getElementById('team-member-select');
  if (!select) return;

  select.innerHTML = '';
  Object.entries(data.kanban.members).forEach(([id, member]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = member.name;
    select.appendChild(opt);
  });
}


function renderTeamReport(memberId, sprint) {
  const tbody = document.querySelector('#report-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const statusLabels = {
    new: 'חדש', todo: 'לביצוע', doing: 'בתהליך',
    review: 'לבדיקה', done: 'בוצע'
  };

  Object.entries(data.kanban.sprintlog[sprint] || {}).forEach(([status, ids]) => {
    ids.forEach(id => {
      const t = data.kanban.tasks[id];
      if (!t || t.owner !== memberId) return;

const row = document.createElement('tr');
const priorityClass = getPriorityClass(t.priority); // מחזיר 'high'/'medium'/'low'

row.innerHTML = `
  <td><span class="priority-dot ${priorityClass}"></span> ${t.title}</td>
  <td>${statusLabels[status] || status}</td>
  <td>${t.priority}</td>
  <td>${t.value}</td>
  <td>${t.workload}</td>
`;

      tbody.appendChild(row);
    });
  });
}
document.querySelectorAll('.column').forEach(col => {
  console.log('Registering drop zone for column:', col.id); // בדיקה
});

// function toggleMenu() {
//   const menu = document.getElementById('nav-links');
//   menu.classList.toggle('open');
// }


document.getElementById('jump-to-status')?.addEventListener('change', e => {
  const col = document.getElementById(e.target.value);
  if (col) col.scrollIntoView({ behavior: 'smooth', inline: 'start' });
});

function updateTeamMemberHeader() {
  const memberId = document.getElementById('team-member-select')?.value;
  const member = data?.kanban?.members?.[memberId];

  if (!member) return;

  document.getElementById('member-name').textContent = member.name;
  document.getElementById('member-image').src = member.image;
}
function getPriorityClass(priority) {
  switch (priority) {
    case 'גבוה':
    case 'גבוהה':
      return 'high';
    case 'בינוני':
    case 'בינונית':
      return 'medium';
    case 'נמוך':
    case 'נמוכה':
      return 'low';
    default:
      return '';
  }
}

function populateJumpToMember() {
  const select = document.getElementById('jump-to-member');
  if (!select || !data?.kanban?.members) return;

  select.innerHTML = '<option value="">דלג לחבר צוות </option>';

  Object.entries(data.kanban.members).forEach(([id, member]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = member.name;
    select.appendChild(opt);
  });

  select.addEventListener('change', e => {
    const colId = e.target.value;
    const col = document.getElementById(colId);
    if (col) {
      col.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}
    function toggleMenu() {
      const menu = document.getElementById("menu-options");
      menu.classList.toggle("menu-shown");
      menu.classList.toggle("menu-hidden");
    }

    function populateMenuLinks() {
  const menu = document.getElementById('menu-options');
  if (!menu) return;

  const pages = [
    { href: 'about.html', label: 'עלינו' },
    { href: 'productownercombined.html', label: 'בעל מוצר' },
    { href: 'scrummastercombined.html', label: 'סקרם מאסטר' },
    { href: 'teammembercombined.html', label: 'חבר צוות' },
  ];

  const current = window.location.pathname.split('/').pop();

  const otherPages = pages.filter(p => p.href !== current);

  menu.innerHTML = ''; // clear current links
  otherPages.forEach(({ href, label }) => {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.textContent = label;
    menu.appendChild(link);
  });
}


const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const kanban = document.getElementById('kanban-board');

// גלילה בלחיצה
scrollLeftBtn?.addEventListener('click', () => {
  kanban?.scrollBy({ left: -300, behavior: 'smooth' });
});

scrollRightBtn?.addEventListener('click', () => {
  kanban?.scrollBy({ left: 300, behavior: 'smooth' });
});

// הצגת הכפתורים רק כשהקאנבאן נראה
function toggleScrollButtonsVisibility() {
  const rect = kanban?.getBoundingClientRect();
  const inView = rect && rect.bottom > 100 && rect.top < window.innerHeight - 100;

  const display = inView ? 'flex' : 'none';
  scrollLeftBtn.style.display = display;
  scrollRightBtn.style.display = display;
}

window.addEventListener('scroll', toggleScrollButtonsVisibility);
window.addEventListener('resize', toggleScrollButtonsVisibility);
document.addEventListener('DOMContentLoaded', toggleScrollButtonsVisibility);

// function sortTaskObjects(tasks, by, dir = 'asc') {
//   if (!by) return tasks;

//   const priorityOrder = {
//     'נמוך': 1,
//     'בינוני': 2,
//     'בינונית': 2,
//     'גבוה': 3,
//     'גבוהה': 3
//   };

//   return [...tasks].sort((a, b) => {
//     if (by === 'priority') {
//       const pa = priorityOrder[a.priority] || 99;
//       const pb = priorityOrder[b.priority] || 99;
//       return dir === 'esc' ? pb - pa : pa - pb;
//     }

//     if (by === 'workload') {
//       return dir === 'esc' ? b.workload - a.workload : a.workload - b.workload;
//     }

//     if (by === 'value') {
//       return dir === 'esc' ? b.value - a.value : a.value - b.value;
//     }

//     return 0;
//   });
// }

function sortTaskObjects(tasks, by, dir = 'asc') {
  if (!by) return tasks;

  const priorityOrder = {
    'נמוך': 1,
    'בינוני': 2,
    'בינונית': 2,
    'גבוה': 3,
    'גבוהה': 3
  };

  return [...tasks].sort((a, b) => {
    const ta = a;
    const tb = b;

    const pa = priorityOrder[ta.priority] || 99;
    const pb = priorityOrder[tb.priority] || 99;

    const wa = Number(ta.workload) || 0;
    const wb = Number(tb.workload) || 0;

    if (by === 'priority') {
      // קודם לפי עדיפות, ואז עומס
      if (pa !== pb) return dir === 'desc' ? pb - pa : pa - pb;
      return dir === 'esc' ? wb - wa : wa - wb;
    }

    if (by === 'workload') {
      // קודם לפי עומס, ואז לפי עדיפות
      if (wa !== wb) return dir === 'desc' ? wb - wa : wa - wb;
      return dir === 'esc' ? pb - pa : pa - pb;
    }

    // if (by === 'value') {
    //   return dir === 'desc' ? tb.value - ta.value : ta.value - tb.value;
    // }

    return 0;
  });
}
