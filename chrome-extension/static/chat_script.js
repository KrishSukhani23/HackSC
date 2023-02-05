console.log(document.getElementById("personName"));
const friendName = localStorage.getItem("chattingWith");
document.getElementById("personName").innerHTML = "Sending to " + friendName;

const sendBtn = document.getElementById("sendBtn");

sendBtn.onclick = async (e) => {
  const message = document.getElementById("message").value;
  const friends = localStorage.getItem("friends");
  const serverUrl = document.getElementById("serverUrl");
  const sitemap = (await (await fetch(serverUrl + '/sitemap.txt').res()));
  const lines = sitemap.split('\n');

  const indexMap = {};
  for(const i = 0; i < lines.length; i++) {
    indexMap[i] = lines[i];
  }
  if (friends) {
    try {
      const friendsObj = JSON.parse(friends);
      const key = friendsObj[friendName];
      const [enc_key, iv, start, end] = key.split(";");
      if (!enc_key || !iv || !start || !end) {
        console.log("invalid key!");
      } else {
        const cryptoKey = CryptoJS.enc.Hex.parse(enc_key);
        const cryptoIV = CryptoJS.enc.Hex.parse(iv);
        const encrypted = CryptoJS.AES.encrypt(message, cryptoKey, { iv: cryptoIV });

        console.log(start + encrypted.ciphertext + end);
        const toSend = start + encrypted.ciphertext + end;
        for(const i = 0; i < toSend.length; i++) {
            const reply = (await (await fetch(indexMap[parseInt(toSend[i], 16)])).res());
            console.log(reply);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};
