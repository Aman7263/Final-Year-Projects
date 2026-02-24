let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;

function saveStudents() {

localStorage.setItem("students", JSON.stringify(students));

}

function addStudent() {

let name = document.getElementById("name").value;
let roll = document.getElementById("roll").value;
let course = document.getElementById("course").value;

if(name === "" || roll === "" || course === "") {

alert("Fill all fields");
return;

}

students.push({name, roll, course});

saveStudents();

displayStudents();

clearFields();

}

function displayStudents(list = students) {

let table = document.getElementById("studentList");

table.innerHTML = "";

list.forEach((student, index) => {

table.innerHTML += `
<tr>
<td>${student.name}</td>
<td>${student.roll}</td>
<td>${student.course}</td>

<td>
<button class="edit" onclick="editStudent(${index})">Edit</button>
<button class="delete" onclick="deleteStudent(${index})">Delete</button>
</td>

</tr>
`;

});

}

function deleteStudent(index) {

students.splice(index, 1);

saveStudents();

displayStudents();

}

function editStudent(index) {

let student = students[index];

document.getElementById("name").value = student.name;
document.getElementById("roll").value = student.roll;
document.getElementById("course").value = student.course;

editIndex = index;

document.getElementById("addBtn").style.display = "none";
document.getElementById("updateBtn").style.display = "inline-block";

}

function updateStudent() {

students[editIndex].name = document.getElementById("name").value;
students[editIndex].roll = document.getElementById("roll").value;
students[editIndex].course = document.getElementById("course").value;

saveStudents();

displayStudents();

clearFields();

document.getElementById("addBtn").style.display = "inline-block";
document.getElementById("updateBtn").style.display = "none";

}

function searchStudent() {

let search = document.getElementById("search").value.toLowerCase();

let filtered = students.filter(student =>
student.name.toLowerCase().includes(search) ||
student.roll.toLowerCase().includes(search) ||
student.course.toLowerCase().includes(search)
);

displayStudents(filtered);

}

function clearFields() {

document.getElementById("name").value = "";
document.getElementById("roll").value = "";
document.getElementById("course").value = "";

}

displayStudents();