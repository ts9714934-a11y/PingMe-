// Get elements
const chatBody = document.getElementById("chatBody");
const input = document.getElementById("msgInput");

// Supabase setup
const SUPABASE_URL = "https://hfslxoltqichhqmjrrzi.supabase.co"; // full Supabase URL
const SUPABASE_ANON_KEY = "sb_publishable_u8X4qG7xNn34feiFu7wJxA_VdTamnO6";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get logged-in user
const userId = localStorage.getItem("pingme_user");

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

// Load messages from Supabase
async function loadMessages(chatUser){
  chatBody.innerHTML="";

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at',{ascending:true});

  if(error) return console.error(error);

  messages.forEach(m=>{
    // Only show messages between current chat user and logged-in user
    if((m.sender_id===userId && m.receiver_id===chatUser) || 
       (m.sender_id===chatUser && m.receiver_id===userId)) {

      const div = document.createElement("div");
      div.className = m.sender_id===userId?"msg you":"msg other";
      div.innerText = m.content;
      chatBody.appendChild(div);
      addSparks(div,m.sender_id===userId?"you":"other");
    }
  });

  chatBody.scrollTop = chatBody.scrollHeight;
}

// Send message to Supabase
async function sendMsg(chatUser){
  const text = input.value.trim();
  if(!text) return;

  await supabase.from('messages').insert([{
    sender_id: userId,
    receiver_id: chatUser,
    content: text
  }]);

  input.value="";
  loadMessages(chatUser);
}

// Enter key sends message
input.addEventListener("keypress", e => {
  if(e.key==="Enter"){
    const chatUser = new URLSearchParams(window.location.search).get("user");
    sendMsg(chatUser);
  }
});

// Optional: show typing dots (if you have element with id typingDots)
const typingDots = document.getElementById("typingDots");
if(typingDots){
  input.addEventListener("input", ()=>{
    typingDots.style.display = input.value.trim()!=="" ? "flex" : "none";
  });
}
