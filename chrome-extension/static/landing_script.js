document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

const fileElement = document.getElementById("keyFile");
fileElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  if (this.files && this.files.length > 0) {
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        const keyContents = e.target.result;
        console.log("key contents", e.target.result);
        const nickname = document.getElementById('nickname').value;
        if (!nickname) {
            console.log('enter a nickname first!');
        }
        else {
            const friends = localStorage.getItem('friends');
            console.log('friends', friends)
            try {
                const friendsObj = JSON.parse(friends || '{}');
                friendsObj[nickname] = e.target.result;
                localStorage.setItem('friends', JSON.stringify(friendsObj));
                console.log('SAVED!');
            } catch(err) {
                console.log(err);
            }
        }
    };
    console.log(this.files)
  }
  
}

const personSelect = document.getElementById('personSelect');
const friends = localStorage.getItem('friends');
if (friends) {
    try {
        const friendsObj = JSON.parse(friends);
        for (const friend in friendsObj) {
            const el = document.createElement('option');
            el.text = friend;
            personSelect.add(el);
        }
    } catch (err) {
        console.log(err);
    }
}

const goBtn = document.getElementById('goBtn');
goBtn.onclick = (e) => {
    console.log('Go clicked!');
    localStorage.setItem("chattingWith", document.getElementById("personSelect").value);
    window.location.href="chat.html";

}
