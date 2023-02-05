const checkBtn = document.getElementById("checkBtn");
checkBtn.onclick = async (e) => {
  console.log("Check clicked!");
  const friends = localStorage.getItem("friends");
  const serverUrl = document.getElementById("serverUrl").value;
  const sitemap = await (await fetch(serverUrl + "/sitemap.txt")).text();
  const lines = sitemap.split("\n");

  // shuffle
  lines.sort(() => Math.random() - 0.5);

  const lines2 = lines.slice(0, lines / 2);

  const merged = [];
  let i = 0,
    j = 0;
  while (i < lines.length && j < lines2.length) {
    merged.push(lines[i]);
    merged.push(lines2[j]);
    i++;
    j++;
  }

  while (i < lines.length) {
    merged.push(lines[i]);
    i++;
  }

  while (j < lines2.length) {
    merged.push(lines2[i]);
    j++;
  }

  const blobs = [];

  const messagesConcat = "";
  for (let i = 0; i < merged.length; i++) {
    const blob = await (await fetch(merged[i])).blob();
    if (blob) {
      console.log(blob);
      if (blob.type === "image/png") {
        const img = document.createElement("img");

        const reader = new FileReader();
        reader.onload = function () {
          const dataUrl = reader.result;
          console.log(dataUrl);
          img.src = dataUrl;

          const shadowCanvas = document.createElement("canvas");
          const shadowCtx = shadowCanvas.getContext("2d");

          setTimeout(() => {
            shadowCanvas.style.display = "none";
            shadowCanvas.width = img.width;
            shadowCanvas.height = img.height;

            shadowCtx.drawImage(img, 0, 0);
            const imageData = shadowCtx.getImageData(
              0,
              0,
              shadowCanvas.width,
              shadowCanvas.height
            ).data;
            console.log(imageData);

            let binData = "";

            for (let i = 0; i < imageData.length; i += 4) {
              const b = imageData[i];
              const g = imageData[i + 1];
              const r = imageData[i + 2];

              binData += r & 1;
              binData += g & 1;
              binData += b & 1;
            }

            let out = "";
            for (let i = 0; i < binData.length; i += 8) {
              let bin = "";
              for (let j = 0; j < 8; j++) {
                bin += binData[i + j];
              }
              out += String.fromCharCode(parseInt(bin, 2));
              if (out.substring(out.length - 5) == "=====") {
                out = out.substring(0, out.length - 5);
                break;
              }
            }

            console.log(out);

            const friendsObj = JSON.parse(friends);

            const messages = {};
            for (const friend in friendsObj) {
                const fullkey = friendsObj[friend];
                const [enc_key, iv, start, end] = fullkey.split(';');
                console.log(start, end);


                const regex = new RegExp(start+'(.+)'+end, 'g');
                console.log(regex)
                const matches = out.matchAll(regex);
                console.log(matches);

                for (const match of matches) {
                    console.log(match);
                    const ciphertext = match[1];
                    console.log(ciphertext);


                    const cryptoKey = CryptoJS.enc.Hex.parse(enc_key);
                    const cryptoIV = CryptoJS.enc.Hex.parse(iv);
                    const message = CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(ciphertext), salt: ''}, cryptoKey, { iv: cryptoIV }).
                        toString(CryptoJS.enc.Utf8);

                    console.log(message);

                    if (!messages[friend]) {
                        messages[friend] = [message];
                    } else {
                        message[friend].push(message);
                    }
                }

                let htmlDat = ''
                for(const friend in messages) {
                    htmlDat += `<h6>Messages from ${friend} in the past 24 hours</h6>`
                    htmlDat += `<div style="padding:5px;">`
                    for (const message of messages[friend]) {
                        htmlDat += message + '<br/>'
                    }
                    htmlDat += `</div>`
                    htmlDat += '<hr/>'
                }

                document.getElementById("messages").innerHTML = htmlDat;


            }
          }, 1000);
        };
        reader.readAsDataURL(blob);
      }
    }
  }
};
