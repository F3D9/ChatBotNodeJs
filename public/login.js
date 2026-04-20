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
        document.getElementById('auth-error').classList.add('visible')
        return;
    }else{
        document.getElementById('auth-error').classList.remove('visible')
        const resJson = await res.json();
        localStorage.setItem('username',resJson.username)
        localStorage.setItem('email',resJson.email)
        if(resJson.redirect){
            window.location.href = resJson.redirect;
        }
    }
});