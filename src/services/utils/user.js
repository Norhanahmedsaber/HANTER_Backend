

function isPassword(password){
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  
  if (password.match(regex)) 
    return true; 
  
   else 
    return false; 
  }
  
function isEmail(emailAdress){
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (emailAdress.match(regex)) 
    return true; 

   else 
    return false; 
}
function generateErrorMessage(statusCode, message) {
  return {
    statusCode,
    message
  }
}
module.exports = {
  isPassword,
  isEmail,
  generateErrorMessage
}