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

const token = document.cookie.includes("jwt");

if(token){
  document.getElementById("menu").innerHTML +=  ` 
    <button id="BotonSesion" class="send" >Cerrar Sesion</button>
  `
  document.getElementById("BotonSesion").addEventListener("click",()=>{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/"
  })

}else{
  document.getElementById("menu").innerHTML +=  ` 
    <a href="/login" >Login</a>
    <a href="/register">Register</a>
  `
}


