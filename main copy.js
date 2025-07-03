
let data = null
const isScrumMasterView = window.location.href.includes('scrummaster')
const isTeamMemberView = window.location.href.includes('team');

function initKanban () {
  const sprint = document.getElementById('sprint-select')?.value || 'sp1';

  if (isTeamMemberView) {
    populateTeamMemberSelect();
    document.getElementById('team-member-select').addEventListener('change', () => renderBoard(sprint));
    document.getElementById('sort-tasks')?.addEventListener('change', () => renderBoard(sprint));
    renderBoard(sprint); // תצוגת חבר צוות
  } else {
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


// function renderBoard(sprint, includeMembers = false) {
//   includeMembers ? generateTeamColumns() : generateStatusColumns();

//   const sprintData = data.kanban.sprintlog[sprint] || {};
//   const allSprintTaskIds = [];

//   const sortBy = document.getElementById('sort-tasks')?.value || '';
// const sortDir = 'asc'; // כיוון מיון: מקטן לגדול

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
// const backlogIds = Object.keys(data.kanban.tasks).filter(id => !allSprintTaskIds.includes(id));
// const sortedBacklog = sortTaskIds(backlogIds, sortBy, sortDir);

// sortedBacklog.forEach(id => {
//   renderTask(id, 'backlog', 'backlog');
// });

//   setupDragAndDrop();
//   renderReport?.();
// }


function generateStatusColumns () {
  const board = document.getElementById('kanban-board')
  board.innerHTML = ''
  const statuses = ['backlog', 'new', 'todo', 'doing', 'review', 'done']
  statuses.forEach(status => {
    const col = document.createElement('div')
    col.className = 'column'
    col.id = status
    const labels = {
      backlog: 'רשימת מטלות',
      new: 'חדש',
      todo: 'לביצוע',
      doing: 'בתהליך',
      review: 'לבדיקה',
      done: 'בוצע'
    }
    col.innerHTML = `<h2>${labels[status]}</h2>`
    board.appendChild(col)
  })
}

document.addEventListener('DOMContentLoaded', () => {
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
});



function renderTask(id, columnId, statusKey) {
  const task = data.kanban.tasks[id];
  if (!task) return;

  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'task';
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

  const content = document.createElement('div');
  content.innerHTML = `
    <strong>${task.title}</strong><br>
    ${displayMeta} | ⚡ ${task.priority} | 💰 ${task.value} | 📦 ${task.workload}
  `;

  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => editTask(id));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.addEventListener('click', () => deleteTask(id));

  div.appendChild(content);
  div.appendChild(editBtn);
  div.appendChild(deleteBtn);
  div.ondragstart = e => e.dataTransfer.setData('text/plain', id);

  const col = document.getElementById(columnId);
  if (col) col.appendChild(div);
}



function renderBoard(sprint, includeMembers = false) {
  if (isTeamMemberView) {
    generateStatusColumns();
  } else {
    includeMembers ? generateTeamColumns() : generateStatusColumns();
  }

  const sprintData = data.kanban.sprintlog[sprint] || {};
  const allSprintTaskIds = [];

  const sortBy = document.getElementById('sort-tasks')?.value || '';
  const sortDir = 'desc';

  const memberId = document.getElementById('team-member-select')?.value;

  Object.entries(sprintData).forEach(([status, ids]) => {
    let filteredIds = ids;

    // 🧠 בתצוגת חבר צוות – סינון לפי owner
    if (isTeamMemberView && memberId) {
      filteredIds = ids.filter(id => data.kanban.tasks[id]?.owner === memberId);
    }

    const sortedIds = sortTaskIds(filteredIds, sortBy, sortDir);

    sortedIds.forEach(id => {
      const task = data.kanban.tasks[id];
      if (!task) return;
      allSprintTaskIds.push(id);

      const columnId = isTeamMemberView ? status
                        : includeMembers ? task.owner
                        : status;

      renderTask(id, columnId, status);
    });
  });

  if (!isTeamMemberView) {
    const backlogIds = Object.keys(data.kanban.tasks).filter(id => !allSprintTaskIds.includes(id));
    const sortedBacklog = sortTaskIds(backlogIds, sortBy, sortDir);

    sortedBacklog.forEach(id => {
      renderTask(id, 'backlog', 'backlog');
    });
  }

  setupDragAndDrop();

  if (isTeamMemberView && memberId) {
    renderTeamReport(memberId, sprint);
  } else {
    renderReport?.();
  }
}



function moveTask(id, newStatus) {
  const sprint = document.getElementById('sprint-select').value;

  // הסר את המשימה מכל העמודות הקיימות
  Object.entries(data.kanban.sprintlog[sprint] || {}).forEach(([status, list]) => {
    const index = list.indexOf(id);
    if (index !== -1) list.splice(index, 1);
  });

  if (isScrumMasterView) {
    // בתצוגת סקראם: העמודות הן לפי בעלים
    data.kanban.tasks[id].owner = newStatus; // עדכון הבעלים
    const status = getTaskStatusInSprint(id, sprint) || 'new';
    data.kanban.sprintlog[sprint][status] ??= [];
    data.kanban.sprintlog[sprint][status].push(id);
  } else {
    // בתצוגת פרודקט: העמודות הן לפי סטטוס
    data.kanban.sprintlog[sprint][newStatus] ??= [];
    data.kanban.sprintlog[sprint][newStatus].push(id);
  }

  renderBoard(sprint, isScrumMasterView);
  if (isScrumMasterView) renderBarChart();
}

function renderReport () {
  const tbody = document.querySelector('#report-table tbody');
  if (!tbody) return;
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
        row.innerHTML = `<td>${t.title}</td><td>${statusText}</td><td>${ownerName}</td><td>${t.priority}</td><td>${t.value}</td><td>${t.workload}</td>`;
        tbody.appendChild(row);
      });
    });
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

document.addEventListener('DOMContentLoaded', () => {
  fetch('scrum_data_20_img_he.txt')
    .then(response => response.text())
    .then(txt => {
      try {
        const parsed = JSON.parse(txt)
        data = parsed.kanban ? parsed : { kanban: parsed }
        initKanban()
        if (isScrumMasterView) {
          google.charts.load('current', { packages: ['corechart'] })
          google.charts.setOnLoadCallback(() => {
            renderBarChart()
          })
        }
document.getElementById('sort-tasks')?.addEventListener('change', () => {
  const sprint = document.getElementById('sprint-select')?.value || 'sp1';
  renderBoard(sprint, isScrumMasterView);
});

      } catch (e) {
        alert('שגיאה בפענוח קובץ הנתונים: ' + e.message)
      }
    })
    .catch(() => alert('שגיאה בטעינת קובץ scrum_data_20_img_he.txt'))
})


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

  // אתחול כל בעלי הצוות עם 0 עומס כדי לוודא שיופיעו גם אם אין להם משימות
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

  const chartData = [['חבר צוות', 'עומס עבודה']];
  Object.entries(taskCounts).forEach(([ownerId, totalWorkload]) => {
    const name = data.kanban.members?.[ownerId]?.name || ownerId;
    chartData.push([name, totalWorkload]);
  });

  const dataTable = google.visualization.arrayToDataTable(chartData);
  const options = {
    title: 'עומס עבודה לפי חבר צוות',
    legend: { position: 'none' },
    hAxis: {
      title: 'עומס',
      minValue: 0
    },
    vAxis: {
      title: 'חבר צוות'
    },
    chartArea: { width: '70%' }
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
      row.innerHTML = `
        <td>${t.title}</td>
        <td>${statusLabels[status] || status}</td>
        <td>${t.priority}</td>
        <td>${t.value}</td>
        <td>${t.workload}</td>
      `;
      tbody.appendChild(row);
    });
  });
}
