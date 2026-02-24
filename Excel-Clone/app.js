/******************************
 * EXCEL CLONE - GAMIFIED JS
 ******************************/

const rows = 50;
const cols = 26;

let sheets = [];
let currentSheet = 0;
let selectedCell = null;
let chartInstance = null;

/* 🎮 GAME VARIABLES */
let xp = 0;
let level = 1;
let editCount = 0;
let achievements = {
    firstFormula:false,
    firstChart:false,
    fiveSheets:false
};

const grid = document.getElementById("grid");
const addressBar = document.getElementById("address");
const formulaBar = document.getElementById("formula");
const sheetContainer = document.getElementById("sheetContainer");

/* ===============================
   STORAGE
================================ */

function autoSave(){
    localStorage.setItem("excelCloneData", JSON.stringify(sheets));
}

function loadFromStorage(){
    let data = localStorage.getItem("excelCloneData");
    if(data) sheets = JSON.parse(data);
}

/* GAME STORAGE */
function saveGameStats(){
    localStorage.setItem("excelGameStats",
        JSON.stringify({xp,level,editCount,achievements}));
}

function loadGameStats(){
    let data = localStorage.getItem("excelGameStats");
    if(data){
        let parsed = JSON.parse(data);
        xp = parsed.xp || 0;
        level = parsed.level || 1;
        editCount = parsed.editCount || 0;
        achievements = parsed.achievements || achievements;
    }
}

/* ===============================
   GAME SYSTEM
================================ */

function addXP(amount){
    xp += amount;

    if(xp >= level * 100){
        level++;
        alert("🎉 Level Up! You reached Level " + level);
    }

    updateStats();
    saveGameStats();
}

function updateStats(){
    document.getElementById("xp").innerText = xp;
    document.getElementById("level").innerText = level;
    document.getElementById("editCount").innerText = editCount;
    document.getElementById("progressFill").style.width =
        (xp % 100) + "%";
}

/* ===============================
   GRID
================================ */

function createGrid(){
    grid.innerHTML="";

    grid.appendChild(createHeader(""));

    for(let c=0;c<cols;c++){
        grid.appendChild(createHeader(String.fromCharCode(65+c)));
    }

    for(let r=0;r<rows;r++){
        grid.appendChild(createHeader(r+1));

        for(let c=0;c<cols;c++){
            let cell=document.createElement("div");
            cell.className="cell";
            cell.contentEditable=true;
            cell.dataset.row=r;
            cell.dataset.col=c;

            cell.addEventListener("click", onCellClick);
            cell.addEventListener("blur", onCellBlur);

            grid.appendChild(cell);
        }
    }
}

function createHeader(text){
    let div=document.createElement("div");
    div.className="header";
    div.innerText=text;
    return div;
}

/* ===============================
   SHEETS
================================ */

function createSheetData(){
    let data=[];
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<cols;c++){
            row.push({
                value:"",
                formula:"",
                bold:false,
                italic:false,
                underline:false
            });
        }
        data.push(row);
    }
    return data;
}

function addSheet(){
    sheets.push(createSheetData());
    renderSheetTabs();
    loadSheet(sheets.length-1);
    autoSave();

    if(sheets.length === 5 && !achievements.fiveSheets){
        achievements.fiveSheets = true;
        alert("🏆 Achievement: Created 5 Sheets!");
        saveGameStats();
    }
}

function renderSheetTabs(){
    sheetContainer.innerHTML = "";

    sheets.forEach((_, index)=>{

        let sheet = document.createElement("div");
        sheet.className = "sheet";

        if(index === currentSheet)
            sheet.classList.add("active-sheet");

        // 📌 Sheet Name
        let name = document.createElement("span");
        name.innerText = "Sheet " + (index+1);
        name.onclick = () => loadSheet(index);
        name.style.cursor = "pointer";

        // 🗑 Delete Icon
        let deleteIcon = document.createElement("span");
        deleteIcon.innerHTML = " 🗑";
        deleteIcon.style.color = "red";
        deleteIcon.style.marginLeft = "8px";
        deleteIcon.style.cursor = "pointer";

        deleteIcon.onclick = (e)=>{
            e.stopPropagation();  // Prevent sheet click
            deleteSheet(index);
        };

        sheet.appendChild(name);
        sheet.appendChild(deleteIcon);

        sheetContainer.appendChild(sheet);
    });
}

function deleteSheet(index){

    if(sheets.length === 1){
        alert("At least one sheet must exist.");
        return;
    }

    if(!confirm("Delete this sheet?")) return;

    sheets.splice(index,1);

    if(currentSheet >= sheets.length){
        currentSheet = sheets.length - 1;
    }

    renderSheetTabs();
    loadSheet(currentSheet);
    autoSave();
}

function loadSheet(index){
    currentSheet=index;
    renderSheetTabs();

    let data=sheets[index];

    document.querySelectorAll(".cell").forEach(cell=>{
        let r=cell.dataset.row;
        let c=cell.dataset.col;
        let cellData=data[r][c];

        cell.innerText=cellData.value;
        cell.style.fontWeight=cellData.bold?"bold":"normal";
        cell.style.fontStyle=cellData.italic?"italic":"normal";
        cell.style.textDecoration=cellData.underline?"underline":"none";
    });
}

/* ===============================
   CELL EVENTS
================================ */

function onCellClick(e){
    if(selectedCell) selectedCell.classList.remove("active");

    selectedCell=e.target;
    selectedCell.classList.add("active");

    let r=selectedCell.dataset.row;
    let c=selectedCell.dataset.col;

    addressBar.value=
        String.fromCharCode(65+Number(c))+(Number(r)+1);

    formulaBar.value=sheets[currentSheet][r][c].formula;
}

function onCellBlur(e){
    let r=e.target.dataset.row;
    let c=e.target.dataset.col;
    let input=e.target.innerText.trim();

    sheets[currentSheet][r][c].value=input;
    sheets[currentSheet][r][c].formula="";

    editCount++;
    addXP(5);

    autoSave();
}

/* ===============================
   FORMULA SYSTEM
================================ */

formulaBar.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && selectedCell){

        let formula=formulaBar.value;

        if(formula.startsWith("=")){

            let value=evaluateFormula(formula.substring(1));

            let r=selectedCell.dataset.row;
            let c=selectedCell.dataset.col;

            selectedCell.innerText=value;

            sheets[currentSheet][r][c].value=value;
            sheets[currentSheet][r][c].formula=formula;

            addXP(20);

            if(!achievements.firstFormula){
                achievements.firstFormula=true;
                alert("🏆 Achievement: First Formula Used!");
            }

            autoSave();
            saveGameStats();
        }
    }
});

function evaluateFormula(formula){

    if(formula.startsWith("SUM(")){
        let range=formula.substring(4,formula.length-1);
        let [start,end]=range.split(":");

        let startCol=start.charCodeAt(0)-65;
        let startRow=parseInt(start.slice(1))-1;
        let endCol=end.charCodeAt(0)-65;
        let endRow=parseInt(end.slice(1))-1;

        let sum=0;

        for(let r=startRow;r<=endRow;r++){
            for(let c=startCol;c<=endCol;c++){
                sum+=Number(sheets[currentSheet][r][c].value)||0;
            }
        }
        return sum;
    }

    let tokens=formula.split(/([+\-*/])/);

    tokens=tokens.map(token=>{
        if(/[A-Z][0-9]+/.test(token)){
            let col=token.charCodeAt(0)-65;
            let row=parseInt(token.slice(1))-1;
            return sheets[currentSheet][row][col].value||0;
        }
        return token;
    });

    return eval(tokens.join(""));
}

/* ===============================
   FORMATTING
================================ */

["bold","italic","underline"].forEach(id=>{
    document.getElementById(id).onclick=()=>{
        if(!selectedCell) return;

        let r=selectedCell.dataset.row;
        let c=selectedCell.dataset.col;
        let data=sheets[currentSheet][r][c];

        data[id]=!data[id];

        if(id==="bold")
            selectedCell.style.fontWeight=data[id]?"bold":"normal";

        if(id==="italic")
            selectedCell.style.fontStyle=data[id]?"italic":"normal";

        if(id==="underline")
            selectedCell.style.textDecoration=data[id]?"underline":"none";

        autoSave();
    };
});

/* ===============================
   EXPORT FEATURES
================================ */

document.getElementById("saveJSON").onclick=()=>{
    const blob=new Blob(
        [JSON.stringify(sheets,null,2)],
        {type:"application/json"}
    );

    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download="excel-data.json";
    link.click();
};

document.getElementById("exportCSV").onclick=()=>{
    let sheet=sheets[currentSheet];
    let csv="";

    sheet.forEach(row=>{
        csv+=row.map(cell=>`"${cell.value}"`).join(",")+"\n";
    });

    const blob=new Blob([csv],{type:"text/csv"});
    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download="sheet.csv";
    link.click();
};

/* ===============================
   SORT
================================ */

let sortAscending = true; // toggle state

document.getElementById("sortColumn").onclick = () => {

    if (!selectedCell) {
        alert("Please select a cell in the column you want to sort.");
        return;
    }

    let col = parseInt(selectedCell.dataset.col);
    let sheet = sheets[currentSheet];

    // Separate empty rows to keep them at bottom
    let filledRows = [];
    let emptyRows = [];

    sheet.forEach(row => {
        if (row[col].value === "" || row[col].value == null) {
            emptyRows.push(row);
        } else {
            filledRows.push(row);
        }
    });

    // Detect numeric column
    let isNumeric = filledRows.every(row => !isNaN(row[col].value));

    filledRows.sort((a, b) => {

        let valA = a[col].value;
        let valB = b[col].value;

        if (isNumeric) {
            return sortAscending
                ? Number(valA) - Number(valB)
                : Number(valB) - Number(valA);
        } else {
            return sortAscending
                ? valA.toString().localeCompare(valB.toString())
                : valB.toString().localeCompare(valA.toString());
        }
    });

    // Combine sorted + empty rows
    sheets[currentSheet] = [...filledRows, ...emptyRows];

    // Toggle A-Z / Z-A
    sortAscending = !sortAscending;

    loadSheet(currentSheet);
    autoSave();
};

/* ===============================
   DARK MODE
================================ */

document.getElementById("darkMode").onclick=()=>{
    document.body.classList.toggle("dark");
};

/* ===============================
   CHART
================================ */

document.getElementById("insertChart").onclick=()=>{

    if(chartInstance) chartInstance.destroy();

    let labels=[];
    let data=[];

    for(let i=0;i<10;i++){
        labels.push("Row "+(i+1));
        data.push(Number(sheets[currentSheet][i][0].value)||0);
    }

    chartInstance=new Chart(
        document.getElementById("chartCanvas"),{
        type:"bar",
        data:{
            labels:labels,
            datasets:[{
                label:"Column A Data",
                data:data
            }]
        }
    });

    addXP(30);

    if(!achievements.firstChart){
        achievements.firstChart=true;
        alert("🏆 Achievement: First Chart Created!");
    }

    saveGameStats();
};

/* ===============================
   RESET GAME
================================ */

function resetGame(){

    if(!confirm("⚠ Are you sure?\nThis will delete ALL sheets, XP, levels and data.")){
        return;
    }

    /* 🔥 Clear Storage */
    localStorage.removeItem("excelCloneData");
    localStorage.removeItem("excelGameStats");

    /* 🔥 Reset Variables */
    sheets = [];
    currentSheet = 0;
    xp = 0;
    level = 1;
    editCount = 0;
    achievements = {
        firstFormula:false,
        firstChart:false,
        fiveSheets:false
    };

    /* 🔥 Destroy Chart if exists */
    if(chartInstance){
        chartInstance.destroy();
        chartInstance = null;
    }

    /* 🔥 Create Fresh Sheet */
    sheets.push(createSheetData());

    /* 🔥 Re-render Everything */
    renderSheetTabs();
    loadSheet(0);
    updateStats();
    autoSave();
    saveGameStats();

    alert("✅ Game Reset Successfully!");
}

/* ===============================
   INIT
================================ */

loadFromStorage();
loadGameStats();
createGrid();

if(sheets.length===0){
    sheets.push(createSheetData());
}

renderSheetTabs();
loadSheet(0);
updateStats();

document.getElementById("addSheet").onclick=addSheet;