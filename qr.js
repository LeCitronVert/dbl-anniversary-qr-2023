document.addEventListener("DOMContentLoaded", (event) => {
    const dblRegexPattern = new RegExp('^4,[a-zA-Z0-9]{8}');

    const formElement = document.querySelector('#dbl-qr');
    const fileField = document.querySelector('#qrcode');
    const qrField = document.querySelector('#qrcode_b64');

    const friendInput1 = document.querySelector('[name="dbl-qr-1"]');
    const friendInput2 = document.querySelector('[name="dbl-qr-2"]');
    const friendInput3 = document.querySelector('[name="dbl-qr-3"]');

    const qrDisplay1 = document.querySelector('#qr-display-1');
    const qrDisplay2 = document.querySelector('#qr-display-2');
    const qrDisplay3 = document.querySelector('#qr-display-3');

    const uglyAssBitch = [
      {input: friendInput1, display: qrDisplay1 },
      {input: friendInput2, display: qrDisplay2 },
      {input: friendInput3, display: qrDisplay3 },
    ];

    fileField.addEventListener("change", async function({target}){
     if (target.files && target.files.length) {
          try {
            const uploadedImageBase64 = await convertFileToBase64(target.files[0]);
            qrField.value = uploadedImageBase64;
          } catch(Throwable) {
            //handle error
          }
        }
    })

    function convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    }

    function decodeImageFromBase64(data, callback){
        // set callback
        qrcode.callback = callback;
        // Start decoding
        qrcode.decode(data)
    }

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      decodeImageFromBase64(qrField.value,function(decodedInformation){
          if (null === decodedInformation.match(dblRegexPattern)) {
            alert('Cant find your DBL info from image. Try cropping the image to only show the QR code.');
            return;
          }

          uglyAssBitch.forEach((friend) => {
            if (0 === friend.input.value.length) {
              return;
            }

            let newQr = decodedInformation.replace(dblRegexPattern, '4,' + friend.input.value);

            friend.display.innerHTML = '';

            let qrcode = new QRCode(friend.display, {
                text: newQr,
                width: 180, //128
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
          });
      });
    });
});
