let id_converation_right_now = null;
let botResponse = null;

let chatHistory = [];

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
  chatHistory.push({role: "user", parts: [{ text: rawText }] })
  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      message: rawText,
      history:chatHistory,
    }),
  })
    .then(function (response){
      return response.text()
    }).then(function(data){
      createBotMessage(data);

      chatHistory.push({ role: "model", parts: [{ text: data }] })

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
  if(id_converation_right_now == null) getChatsHtml();
  
  id_converation_right_now = data;
  
}

function createBotMessage(data,date = formatTime(new Date().toISOString())){
  //example <div class="msg bot">${data} <span class="time">12:00</span></div>
  const messageHTML = `
    <div class="msg bot">
        ${data}
        <span class="time">${date}</span>
    </div>`
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
    const chatList = document.querySelector('.chatList')
    const loginPrompt = document.createElement('div')
    loginPrompt.className = 'chat-item'
    loginPrompt.style.cssText = 'cursor: default; opacity: 0.75; gap: 8px;'
    loginPrompt.innerHTML = `
      <svg class="chat-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="7" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
        <path d="M6 7V5a2 2 0 1 1 4 0v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      <span class="chat-title" style="font-size: 0.78rem; white-space: normal; line-height: 1.3;">
        Iniciá sesión para ver tu historial
      </span>
    `
    chatList.append(loginPrompt)

  }
}

async function getChatsHtml(){
  const res = await fetch(`/api/getChats?username=${localStorage.username}&email=${localStorage.email}`);

  if (res.ok) {
    const chats = await res.json();
    const chatList = document.querySelector('.chatList')

    chatList.innerHTML = '' 
    
    for (let i = 0; i <chats.rowCount ; i++) {
      const button =  document.createElement('button')
      button.className = 'chat-item'
      button.onclick = () => showMessages(chats.rows[i].id_conversations);
      button.innerHTML = `
          <svg class="chat-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v7A1.5 1.5 0 0 1 12.5 12H9l-3 2.5V12H3.5A1.5 1.5 0 0 1 2 10.5v-7Z" stroke="currentColor" stroke-width="1.2"/>
          </svg>
          <span class="chat-title">${chats.rows[i].title}</span>
      `
      chatList.prepend(button)

    }

    const buttonNewChat = document.createElement('button')
    buttonNewChat.className = 'chat-item'
    buttonNewChat.onclick = () => newChat();
    buttonNewChat.innerHTML = `
      <svg class="chat-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v7A1.5 1.5 0 0 1 12.5 12H9l-3 2.5V12H3.5A1.5 1.5 0 0 1 2 10.5v-7Z" stroke="currentColor" stroke-width="1.2"/>
      </svg>
      <span class="chat-title">Chat nuevo</span>
      `
    chatList.prepend(buttonNewChat)
  }

}

async function showMessages(id){
  const res = await fetch(`/api/getMessages?id_conversations=${id}`);
  const chat = await res.json();
  id_converation_right_now = chat.rows[0].id_conversations;
  document.getElementById("messages").innerHTML = '';
  chatHistory = [];
  for(let i = 0;i<chat.rowCount;i++){
    if(chat.rows[i].writer == "user"){

      const messageHTML = `
      <div class="msg user">
        ${chat.rows[i].content}
        <span class="time">${formatTime(chat.rows[i].time_send)}</span>
      </div>`

      chatHistory.push({role: "user", parts: [{ text: chat.rows[i].content }] })

      document.getElementById("messages").insertAdjacentHTML('beforeend',messageHTML);
  
      document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;

    }else{
      createBotMessage(chat.rows[i].content,formatTime(chat.rows[i].time_send))
      chatHistory.push({ role: "model", parts: [{ text: chat.rows[i].content }] })
    }
    
  }

}

async function newChat() {
  id_converation_right_now = null;
  document.getElementById("messages").innerHTML = '';
}

function formatTime(isoDate) {
    const date = new Date(isoDate)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${day}/${month} ${hours}:${minutes}`
}

getJWT();
getChatsHtml();






