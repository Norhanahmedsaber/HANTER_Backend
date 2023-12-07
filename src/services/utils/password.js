

function isPassword(password){
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (password.match(regex)) 
    return true; 

   else 
    return false; 
}

module.exports = {isPassword}