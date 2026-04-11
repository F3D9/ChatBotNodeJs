function createMessage(){
  const input = document.getElementById("inputClient");
  const rawText = input.value;
  input.value = ""

  const messageHTML = `<div class="msg user">${rawText}</div>`
  document.getElementById("messages").insertAdjacentHTML('beforeend',messageHTML);
  
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;

  generateBotMessage(rawText);
}

async function generateBotMessage(rawText) {
  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: rawText }),
  })
    .then(function (response){
      return response.text()
    }).then(function(data){
      createBotMessage(data)
    })   
}

function createBotMessage(data){
  //example <div class="msg bot">${data} <span class="time">12:00</span></div>
  const messageHTML = `<div class="msg bot">${data}</div>`
  document.getElementById("messages").insertAdjacentHTML('beforeend',messageHTML);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

async function getJWT(){
  const token = await fetch("/api/auth/check",{
    credentials:'include'
  });

  const data = await token.json()

  if(data.loggedIn){
    document.getElementById("menu").innerHTML +=  ` 
      <a id="BotonSesion" class="send" >Cerrar Sesion</a>
    `
    document.getElementById("BotonSesion").addEventListener("click",async (e)=>{
      e.preventDefault();
      const res = await fetch("/logout",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        }
      })

      if(!res.ok){
          alert("Error al cerrra sesion");
          return;
      } 

      const resJson = await res.json();
      if(resJson.redirect){
          window.location.href = resJson.redirect;
      }
    })

  }else{
    document.getElementById("menu").innerHTML +=  ` 
      <a href="/login" >Login</a>
      <a href="/register">Register</a>
    `
  }
}

getJWT();







