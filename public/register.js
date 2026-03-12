document.getElementById("register-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const res = await fetch("/api/register",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user:e.target.children.user.children[0].value,
            email:e.target.children.email.children[0].value,
            password:e.target.children.password.children[0].value
        })
    })

    if(!res.ok){
        alert("Error al registrarse");
        return;
    } 

    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }

});