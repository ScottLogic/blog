//Simple initialisation test function..
function testBlakeHash(){
    var input = document.getElementById("blake512Input").value;
    var salt = document.getElementById("blake512Salt").value;
    if(salt !== null && salt.length > 0 && salt.length !== 16){
        alert("If you specify a salt, it must be exactly 16 characters long.");   
        return;
     }
     if(salt.length === 0){
         salt = null;   
     }
     var blakeStr = blake512(input, salt);
     var blakeHex = blake512(input, salt, true);
     alert("String Hash is:\n" + blakeStr + "\n\n" +
           "Hex Hash is:\n" + blakeHex); 
 }