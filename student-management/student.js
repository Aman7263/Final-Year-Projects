let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

function saveData(){
localStorage.setItem("students", JSON.stringify(students));
}

/* ============================
   DASHBOARD COUNTER
=============================*/

function updateStats(){

let totalStudents = students.length;
let totalFees = students.filter(s => s.fee).length;
let totalTasks = students.filter(s => s.task).length;
let totalSurveys = students.filter(s => s.survey).length;

document.getElementById("totalStudents").innerText = totalStudents;
document.getElementById("totalFees").innerText = totalFees;
document.getElementById("totalTasks").innerText = totalTasks;
document.getElementById("totalSurveys").innerText = totalSurveys;
}

/* ============================
   ADD STUDENT
=============================*/

function addStudent(){

let name = document.getElementById("name").value;
let roll = document.getElementById("roll").value;
let course = document.getElementById("course").value;

if(!name || !roll || !course){
alert("Fill all fields");
return;
}

students.push({
name,
roll,
course,
fee:false,
task:false,
survey:false
});

saveData();
displayStudents();
clearFields();
}

/* ============================
   DISPLAY STUDENTS
=============================*/

function displayStudents(list = students){

let table = document.getElementById("studentList");
table.innerHTML="";

list.forEach((student,index)=>{

table.innerHTML+=`
<tr>
<td>${student.name}</td>
<td>${student.roll}</td>
<td>${student.course}</td>

<td>
<span class="icon-btn ${student.fee?'paid':'pending'}"
onclick="toggleFee(${index})">
${student.fee?'💰':'❌'}
</span>
</td>

<td>
<span class="icon-btn ${student.task?'done':'notdone'}"
onclick="toggleTask(${index})">
${student.task?'✅':'📋'}
</span>
</td>

<td>
<span class="icon-btn"
onclick="toggleSurvey(${index})">
${student.survey?'📊':'📝'}
</span>
</td>

<td>
<button onclick="editStudent(${index})">✏</button>
<button onclick="deleteStudent(${index})">🗑</button>
</td>
</tr>
`;
});

updateStats();
}

/* ============================
   TOGGLE FUNCTIONS
=============================*/

function toggleFee(i){
students[i].fee = !students[i].fee;
saveData();
displayStudents();
}

function toggleTask(i){
students[i].task = !students[i].task;
saveData();
displayStudents();
}

function toggleSurvey(i){
students[i].survey = !students[i].survey;
saveData();
displayStudents();
}

/* ============================
   DELETE
=============================*/

function deleteStudent(index){
students.splice(index,1);
saveData();
displayStudents();
}

/* ============================
   EDIT
=============================*/

function editStudent(index){

let student = students[index];

document.getElementById("name").value = student.name;
document.getElementById("roll").value = student.roll;
document.getElementById("course").value = student.course;

editIndex = index;

document.getElementById("addBtn").style.display="none";
document.getElementById("updateBtn").style.display="inline-block";
}

function updateStudent(){

students[editIndex].name = document.getElementById("name").value;
students[editIndex].roll = document.getElementById("roll").value;
students[editIndex].course = document.getElementById("course").value;

saveData();
displayStudents();
clearFields();

document.getElementById("addBtn").style.display="inline-block";
document.getElementById("updateBtn").style.display="none";
}

/* ============================
   SEARCH
=============================*/

function searchStudent(){

let search=document.getElementById("search").value.toLowerCase();

let filtered=students.filter(s=>
s.name.toLowerCase().includes(search) ||
s.roll.toLowerCase().includes(search) ||
s.course.toLowerCase().includes(search)
);

displayStudents(filtered);
}

/* ============================
   CLEAR INPUT
=============================*/

function clearFields(){
document.getElementById("name").value="";
document.getElementById("roll").value="";
document.getElementById("course").value="";
}

function resetGame(){

    if(confirm("Are you sure you want to delete ALL data?")){

        localStorage.removeItem("students");

        students = [];

        displayStudents();

        alert("All data has been reset.");
    }

}

/* INIT */
displayStudents();