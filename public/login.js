const token = document.cookie.includes("jwt");
if(token) window.location.href = "/"

document.getElementById("login-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const res = await fetch("/api/login",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:e.target.children.email.children[0].value,
            password:e.target.children.password.children[0].value
        })
    })

    if(!res.ok){
        alert("Error al logearse");
        return;
    } 

    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }

});