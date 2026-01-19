async function login(formData){
    try{
        const response = await fetch('http://localhost:5678/api/users/login', {
            method : 'post',
            headers : {
                'accept': 'application/json',
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email : formData.get("email"),
                password : formData.get("password")
            })
        })
        if(response.ok)
        {
            const userData = await response.json()
            const token = userData.token
            localStorage.setItem("token",token)
            window.location.href = "./index.html";
        } else{
            document.querySelector(".login-error-message").classList.add("display-important")
        }
    }
    catch(error){
        console.log(error)
    }
}
const form = document.getElementById("login-form")
form.addEventListener("submit", (e) => { 
    e.preventDefault()
  const formData = new FormData(e.target);
    login(formData)
})
