console.log(document.getElementById("personName"));
document.getElementById("personName").innerHTML = "Sending to "+localStorage.getItem("chattingWith");

const submitBtn = document.getElementById("submitBtn");

submitBtn.onclick = (e) => {
    const message = document.getElementById("message").value;
    
}