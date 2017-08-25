window.onload=function(){
//Making a console log.
console.log('Loaded!');

//Making an alert in Javascript
//alert("Oh Main.js Alert!");






//Changing the document loading
var el=document.getElementById('bigtext');
el.innerHTML="Hello, Main.js changed the text to this while loading";
counter=0;
var b=document.getElementById('butc');
b.onclick=function(){
  ++counter;
  var el2=document.getElementById('bigtext');
  el2.innerHTML="Hello, You clicked the button and so the text is this plus the number of times"+
  "You have clicked this button, i.e"+String(counter);


}
var marginleft=0;
var img=document.getElementById('img');
function moveRight(){
  marginleft+=0.5;
  img.style.marginLeft=marginleft+'px';
}
img.onclick=function(){
  var interval=setInterval(moveRight,50);
}









//Chapter 16 API
var c=0;
var button1=document.getElementById('button1');
button1.onclick=function()
{
  var request=new XMLHttpRequest();
  request.onreadystatechange=function()
  {
      if (request.readyState=== XMLHttpRequest.DONE)
      {
        if(request.status===200){
            var c=request.responseText;
            c=c+1;
            var spanitem=document.getElementById('spanitem');
            spanitem.innerHTML=c.toString();
                               }
      }

  }

request.open('GET','http://endecipher.imad.hasura-app.io/counter',true);
request.send(null);
}//button onlcick









//JSON
var namebutton=document.getElementById('namebutton');
namebutton.onclick=function(){
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if (request.readyState===XMLHttpRequest.DONE){
   if(request.status===200){
      var list='';
      var names=request.responseText;
      names=JSON.parse(names);
      var ul=document.getElementById('namelist');
      for(var i=0; i<names.length; i++){
        list+='<li>' + names[i] +'</li>';
      }
     ul.innerHTML=list;
   }
}
}//onreadystatechange ends
var name=document.getElementById('name').value;
request.open('GET','http://endecipher.imad.hasura-app.io/submit?name='+name,true);
request.send(null);

}//namebutton onclick ends









var uisubmit=document.getElementById('uisubmit');
uisubmit.onclick=function(){
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if (request.readyState===XMLHttpRequest.DONE){
   if(request.status===200){
     alert("User Logged In Successfully!");
      }else if(request.status===403){
     alert("Forbidden! User Credentials Invalid");
      }else if(request.status===500){
     alert("Server Unknown error!");
      }
     else{
         alert("Unknown error");
     }
     
     
     
   }

}//onreadystatechange ends
var username=document.getElementById('uiusername').value;
var password=document.getElementById('uipassword').value;
console.log("Username: "+username);
console.log("Password: "+password);

request.open('POST','http://endecipher.imad.hasura-app.io/login',true);
request.setRequestHeader('Content-Type', 'application/json');
request.send(JSON.stringify({'username':username, 'password':password}));

}












}//window onload
