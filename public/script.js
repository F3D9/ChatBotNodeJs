let id_converation_right_now = null;
let botResponse = null;

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
    body: JSON.stringify({ message: rawText}),
  })
    .then(function (response){
      return response.text()
    }).then(function(data){
      createBotMessage(data);
      botResponse = data;
      return saveChat(rawText,"user");
    }).then(function(){
      return saveChat(botResponse,"bot");
    })    

}

async function saveChat(rawText,sender){
  const res = await fetch('/api/saveChat',{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({
      message: rawText,
      id_conversations:id_converation_right_now,
      username:localStorage.username,
      email:localStorage.email,
      sender:sender
    }),
  })
  
  const data = await res.json()
  id_converation_right_now = data;
  
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

async function getChatsHtml(){
  const res = await fetch(`/api/getChats?username=${localStorage.username}&email=${localStorage.email}`);

  if (res.ok) {
    const chats = await res.json();
    console.log();
    const chatList = document.querySelector('.chatList')

    chatList.innerHTML = '' 
    
    for (let i = 0; i <chats.rows.length ; i++) {
      const button = document.createElement('button')
      button.className = 'chat-item'
      button.innerHTML = `
          <svg class="chat-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v7A1.5 1.5 0 0 1 12.5 12H9l-3 2.5V12H3.5A1.5 1.5 0 0 1 2 10.5v-7Z" stroke="currentColor" stroke-width="1.2"/>
          </svg>
          <span class="chat-title">${chats.rows[i].title}</span>
      `
      chatList.appendChild(button)
    }
    
  }

}

async function showMessages(){
  const res = 
}


getJWT();
getChatsHtml();






