
const options = {baudRate: 115200};
var port = null;



window.addEventListener("load", function() {
    disableControls();
  });


function Connect() {
    if (port==null) {
        // Ouverture de la connexion série
        navigator.serial.requestPort().then(selectedPort => {
            port = selectedPort;
            return port.open(options);
        }).then(() => {
            console.log("Connexion série établie avec succès");
            var but = document.getElementById("connectButton");
            but.innerText = "Disconnect";
            enableControls();
            // Utilisation des méthodes de la classe SerialPort pour envoyer et recevoir des données

        }).catch(error => {
            console.log("Erreur de connexion série: " + error);
        });
    }
    else {
        port.close();
        port = null;
        var but = document.getElementById("connectButton");
        but.innerText = "Connect";
        disableControls();
    }


}


  
  
async function readModbusRegister() {
    const RXBuf = [];
    const controller = new AbortController();
    const timeout = 100;
    setTimeout(() => controller.abort(), timeout);
    const { signal } = controller;
    const writer = port.writable.getWriter();

    const TXBuf = new Uint8Array([0x01, 0x03, 0x00, 0x01, 0x00, 0x02, 0x95, 0xCB]);
    
    //Modbus Device address 
    const DevAdd = document.getElementById("DevAddress").value
    TXBuf[0] = DevAdd & 0xFF;

    //Relecture radio button: Input Register ou Holding Register ?
     if (document.getElementById("coil").checked) {
        TXBuf[1] = 0x01;
      }
      else if (document.getElementById("discrete-input").checked) {
        TXBuf[1] = 0x02;
      } 
      else if (document.getElementById("holding-register").checked) {
        TXBuf[1] = 0x03;
      } 
      else if (document.getElementById("input-register").checked) {
        TXBuf[1] = 0x04;
      } 
    
    //Register Address (sur deux octets)
    const RegAdd = document.getElementById("RegAddress").value
    TXBuf[2] = RegAdd >> 8;
    TXBuf[3] = RegAdd & 0xFF;

    //Pour l'instant un seul registre à la fois
    const NbOfReg = 1;
    TXBuf[4] = NbOfReg >> 8;
    TXBuf[5] = NbOfReg & 0xFF;

    //Calcul de la checksum
    const crc = calculateCRC(TXBuf,6);
    TXBuf[6] = crc[0];
    TXBuf[7] = crc[1];

    //Envoi de la trame sur le port série
    console.log("Write : " + TXBuf);
    writer.write(TXBuf);
    writer.releaseLock();

    while (port.readable) {
        const reader = port.readable.getReader();
        var nbcar = 0;
        try {
          while (RXBuf.length<3) {
            const { value, done } = await reader.read(signal);
            if (done) {
              // |reader| has been canceled.
              console.log("Done");
              break;
            }
            RXBuf.push(...value);
            console.log("Read : " + value + " nbcar=" + RXBuf.length);
          }
        } catch (error) {
            console.log("Erreur lecture modbus: " + error);
        } finally {
            reader.releaseLock();
            break;
        }
      }

    //Décode la trame de réponse et affiche le résultat
    if(RXBuf.length >= 4) {
        var textbox = document.getElementById("textbox");
        textbox.value = RXBuf[3]*256 + RXBuf[4];
    }

  }
  

  async function writeModbusRegister() {
    const RXBuf = [];
    const controller = new AbortController();
    const timeout = 100;
    setTimeout(() => controller.abort(), timeout);
    const { signal } = controller;
    const writer = port.writable.getWriter();

    const TXBuf = new Uint8Array([0x01, 0x03, 0x00, 0x01, 0x00, 0x02, 0x95, 0xCB]);
    
    //Modbus Device address 
    const DevAdd = document.getElementById("DevAddress").value
    TXBuf[0] = DevAdd & 0xFF;

    //Relecture radio button: Input Register ou Holding Register ?
     if (document.getElementById("coil").checked) {
        TXBuf[1] = 0x05;
      }
      else if (document.getElementById("holding-register").checked) {
        TXBuf[1] = 0x06;
      }

    //Register Address (sur deux octets)
    const RegAdd = document.getElementById("RegAddress").value
    TXBuf[2] = RegAdd >> 8;
    TXBuf[3] = RegAdd & 0xFF;

    //Valeur à écrire
    var Val = document.getElementById("textbox").value
    TXBuf[4] = parseInt(Val) >> 8;
    TXBuf[5] = parseInt(Val) & 0xFF;


    //Calcul de la checksum
    const crc = calculateCRC(TXBuf,6);
    TXBuf[6] = crc[0];
    TXBuf[7] = crc[1];

    //Envoi de la trame sur le port série
    console.log("Write : " + TXBuf);
    writer.write(TXBuf);
    writer.releaseLock();

    while (port.readable) {
        const reader = port.readable.getReader();
        var nbcar = 0;
        try {
          while (RXBuf.length<3) {
            const { value, done } = await reader.read(signal);
            if (done) {
              // |reader| has been canceled.
              console.log("Done");
              break;
            }
            RXBuf.push(...value);
            console.log("Read : " + value + " nbcar=" + RXBuf.length);
          }
        } catch (error) {
            console.log("Erreur lecture modbus: " + error);
        } finally {
            reader.releaseLock();
            break;
        }
      }

    //Décode la trame de réponse et affiche le résultat
    if(RXBuf.length >= 4) {
        var textbox = document.getElementById("textbox");
        textbox.value = RXBuf[3]*256 + RXBuf[4];
    }

  }


  function calculateCRC(message,len) {
    var crc = 0xFFFF;
    for (var i = 0; i < len; i++) {
        crc ^= message[i];
        for (var j = 0; j < 8; j++) {
            if (crc & 0x0001) {
                crc = (crc >> 1) ^ 0xA001;
            } else {
                crc = crc >> 1;
            }
        }
    }
    return [crc & 0xFF, crc >> 8];
}


function disableControls() {
    const div = document.getElementById("LesControles");
    const controls = div.getElementsByTagName("*");
    for (let i = 0; i < controls.length; i++) {
        controls[i].disabled = true;
    }
}

function enableControls() {
    const div = document.getElementById("LesControles");
    const controls = div.getElementsByTagName("*");
    for (let i = 0; i < controls.length; i++) {
        controls[i].disabled = false;
    }
}