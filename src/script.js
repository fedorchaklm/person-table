let data = [];
const TABLE_DATA = "TABLE_DATA";
const ITEM_STATE = {
  EDIT: "EDIT",
  DEFAULT: "DEFAULT",
};
const TABLE_COLUMNS = [
  {
    key: "id",
    label: "ID",
    editable: false,
  },
  {
    key: "firstName",
    label: "FirstName",
    editable: true,
  },
  {
    key: "lastName",
    label: "LastName",
    editable: true,
  },
];

function getTableData() {
  const savedItems = localStorage.getItem(TABLE_DATA);

  if (savedItems) {
    return JSON.parse(savedItems);
  }

  const items = [
    {
      id: 8,
      firstName: "John",
      lastName: "Smith",
      state: ITEM_STATE.DEFAULT,
    },
    {
      id: 2,
      firstName: "Sasha",
      lastName: "Stukalo",
      state: ITEM_STATE.DEFAULT,
    },
    {
      id: 3,
      firstName: "Peter",
      lastName: "Ivanov",
      state: ITEM_STATE.DEFAULT,
    },
  ];

  saveTableDataLS(items);

  return items;
}

function printTable(data) {
  const table = document.getElementById("main-table");

  let result = `
    <tr>
       ${TABLE_COLUMNS.reduce((acc, { label }) => {
         acc += `<th>${label}</th>`;
         return acc;
       }, "")}
       <th></th>
    </tr>
  `;

  for (let i = 0; i < data.length; i++) {
    const { state } = data[i].draft || data[i];
    const rowClass = state === ITEM_STATE.EDIT ? 'edit' : '';

    result += `<tr class='${rowClass}'>`;

    TABLE_COLUMNS.forEach((column) => {
      const { key, editable } = column;

      switch (state) {
        case ITEM_STATE.EDIT: {
          result += editable ?
            `<td><input type='text' value='${data[i][key]}' data-input-key='${key}' data-save-id='${data[i].id}'/></td>` : 
            `<td><span>${data[i][key]}</span></td>`;
          break;
        }
        case ITEM_STATE.DEFAULT:
        default: {
          result += `<td><span>${data[i][key]}</span></td>`;
        }
      }
    });

    result += `
        <td>
            <input type="button" class="delete-button control-button" data-item-id='${data[i].id}'></input>
            <input type="button" class="${state === ITEM_STATE.EDIT ? 'save-button' : 'edit-button' } control-button" data-item-id='${data[i].id}'></input>
        </td>
       </tr>
    `;
  }

  table.innerHTML = result;
  addEventListeners();

  removeDraftData();
}

function start() {
  data = getTableData();
  printTable(data);
}

function deleteItem(id) {
  data = data.filter((item) => item.id !== id);
  saveTableDataLS(data);
  printTable(data);
}

function editItem(id) {
  const item = data.find((item) => item.id === id);
  item.state = ITEM_STATE.EDIT;
  saveTableDataLS(data);
  printTable(data);
}

function removeDraftData() {
  data.forEach(dataItem => {
    delete dataItem.draft;
  });
};

function addDraftData() {
  const editItems = data.filter(dataItem => dataItem.state === ITEM_STATE.EDIT);
  editItems.forEach(editItem => {
    const { id } = editItem;
    const inputs = document.querySelectorAll(`input[data-save-id="${id}"]`);

    editItem.draft = {
      ...editItem,
    };

    inputs.forEach(input => {
      const { inputKey } = input.dataset;
      editItem[inputKey] = input.value;
    });
  })
}

function saveItem(id) {
  const item = data.find(dataItem => dataItem.id === id);
  item.state = ITEM_STATE.DEFAULT;

  const inputs = document.querySelectorAll(`input[data-save-id="${id}"]`);

  inputs.forEach(input => {
    const { inputKey } = input.dataset;
    item[inputKey] = input.value;
  });

  saveTableDataLS(data);
  printTable(data);
}

function addDeleteButtonsEvents() {
  const buttons = document.querySelectorAll("input.delete-button");
  buttons.forEach((button) =>
    button.addEventListener("click", (evt) =>
      deleteItem(Number(evt.target.dataset.itemId))
    )
  );
}

function addEditButtonsEvents() {
  const buttons = document.querySelectorAll("input.edit-button");
  buttons.forEach((button) =>
    button.addEventListener("click", (evt) =>
      editItem(Number(evt.target.dataset.itemId))
    )
  );
}

function addSaveButtonsEvents() {
  const buttons = document.querySelectorAll("input.save-button");
  buttons.forEach((button) =>
    button.addEventListener("click", (evt) =>
      saveItem(Number(evt.target.dataset.itemId))
    )
  );
}

function addEventListeners() {
  addDeleteButtonsEvents();
  addEditButtonsEvents();
  addSaveButtonsEvents();
  }

function saveTableDataLS(data) {
  addDraftData();
  localStorage.setItem(TABLE_DATA, JSON.stringify(data));
}

start();
