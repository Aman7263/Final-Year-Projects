const rows = 50;
const cols = 26;

let sheets = [];
let currentSheet = 0;
let selectedCell = null;
let chartInstance = null;

const grid = document.getElementById("grid");
const addressBar = document.getElementById("address");
const formulaBar = document.getElementById("formula");
const sheetContainer = document.getElementById("sheetContainer");

/* STORAGE */
function autoSave(){
    localStorage.setItem("excelCloneData", JSON.stringify(sheets));
}

function loadFromStorage(){
    let data = localStorage.getItem("excelCloneData");
    if(data){
        sheets = JSON.parse(data);
    }
}

/* GRID */
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

/* SHEETS */
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
}

function renderSheetTabs(){
    sheetContainer.innerHTML="";
    sheets.forEach((_, index)=>{
        let sheet=document.createElement("div");
        sheet.className="sheet";
        sheet.innerText="Sheet "+(index+1);
        if(index===currentSheet) sheet.classList.add("active-sheet");
        sheet.onclick=()=>loadSheet(index);
        sheetContainer.appendChild(sheet);
    });
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

/* CELL EVENTS */
function onCellClick(e){
    if(selectedCell) selectedCell.classList.remove("active");
    selectedCell=e.target;
    selectedCell.classList.add("active");

    let r=selectedCell.dataset.row;
    let c=selectedCell.dataset.col;

    addressBar.value=String.fromCharCode(65+Number(c))+(Number(r)+1);
    formulaBar.value=sheets[currentSheet][r][c].formula;
}

function onCellBlur(e){
    let r=e.target.dataset.row;
    let c=e.target.dataset.col;
    let input=e.target.innerText.trim();

    if(/^[0-9+\-*/ ().]+$/.test(input) && /[+\-*/]/.test(input)){
        try{
            input=eval(input);
            e.target.innerText=input;
        }catch{}
    }

    sheets[currentSheet][r][c].value=input;
    sheets[currentSheet][r][c].formula="";
    autoSave();
}

/* FORMULA */
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
            autoSave();
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

/* FORMATTING */
["bold","italic","underline"].forEach(id=>{
    document.getElementById(id).onclick=()=>{
        if(!selectedCell) return;

        let r=selectedCell.dataset.row;
        let c=selectedCell.dataset.col;
        let data=sheets[currentSheet][r][c];

        data[id]=!data[id];

        if(id==="bold") selectedCell.style.fontWeight=data[id]?"bold":"normal";
        if(id==="italic") selectedCell.style.fontStyle=data[id]?"italic":"normal";
        if(id==="underline") selectedCell.style.textDecoration=data[id]?"underline":"none";

        autoSave();
    };
});

/* SAVE JSON */
document.getElementById("saveJSON").onclick=()=>{
    const blob=new Blob([JSON.stringify(sheets,null,2)],{type:"application/json"});
    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download="excel-data.json";
    link.click();
};

/* EXPORT CSV */
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

/* SORT */
document.getElementById("sortColumn").onclick=()=>{
    if(!selectedCell) return;
    let col=selectedCell.dataset.col;
    sheets[currentSheet].sort((a,b)=>{
        return (a[col].value||"").toString().localeCompare((b[col].value||"").toString());
    });
    loadSheet(currentSheet);
    autoSave();
};

/* DARK MODE */
document.getElementById("darkMode").onclick=()=>{
    document.body.classList.toggle("dark");
};

/* CHART */
document.getElementById("insertChart").onclick=()=>{
    if(chartInstance) chartInstance.destroy();

    let labels=[];
    let data=[];

    for(let i=0;i<10;i++){
        labels.push("Row "+(i+1));
        data.push(Number(sheets[currentSheet][i][0].value)||0);
    }

    chartInstance=new Chart(document.getElementById("chartCanvas"),{
        type:"bar",
        data:{
            labels:labels,
            datasets:[{
                label:"Column A Data",
                data:data
            }]
        }
    });
};

/* INIT */
loadFromStorage();
createGrid();

if(sheets.length===0){
    sheets.push(createSheetData());
}

renderSheetTabs();
loadSheet(0);

document.getElementById("addSheet").onclick=addSheet;