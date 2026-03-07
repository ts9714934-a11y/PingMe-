const chatBody = document.getElementById("chatBody");
const input = document.getElementById("msgInput");
const typingDots = document.getElementById("typingDots");

// Sparks generator - 5 per message
function addSparks(msg,type){
  for(let i=0;i<5;i++){
    const s=document.createElement("div");
    s.className="spark "+type;
    s.style.left="50%";
    s.style.top="50%";
    s.style.transform=`translate(${Math.random()*30}px,${-Math.random()*30}px)`;
    msg.appendChild(s);
    setTimeout(()=>s.remove(),2000);
  }
}

// Send message
function sendMsg(){
  const msg = input.value.trim();
  if(!msg) return;

  const myMsg = document.createElement("div");
  myMsg.className="msg you";
  myMsg.innerText = msg;
  chatBody.appendChild(myMsg);
  addSparks(myMsg,"you");

  input.value="";
  chatBody.scrollTop = chatBody.scrollHeight;

  // Show typing dots
  typingDots.style.display="flex";

  setTimeout(()=>{
    typingDots.style.display="none";

    const reply = document.createElement("div");
    reply.className="msg other";
    reply.innerText="Haan, samajh gaya 🙂";
    chatBody.appendChild(reply);
    addSparks(reply,"other");

    chatBody.scrollTop = chatBody.scrollHeight;
  },1500);
}

// Enter key
input.addEventListener("keypress", e => {
  if(e.key==="Enter") sendMsg();
});

// Show typing dots while typing
input.addEventListener("input", ()=>{
  typingDots.style.display = input.value.trim()!=="" ? "flex" : "none";
});
