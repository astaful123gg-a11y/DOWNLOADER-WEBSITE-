const ADMIN_PASSWORD = "asraful123"; // change this anytime, just edit this line

let pwd = localStorage.getItem('admin_pwd') || '';
if (pwd === ADMIN_PASSWORD) showPanel();

function login(){
  const inputPwd = document.getElementById('pwd').value;
  if (inputPwd === ADMIN_PASSWORD) {
    pwd = inputPwd;
    localStorage.setItem('admin_pwd', pwd);
    showPanel();
  } else {
    document.getElementById('loginErr').textContent = 'Wrong password';
  }
}

function showPanel(){
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('panel').classList.remove('hidden');
}

function fileToBase64(file){
  return new Promise((res,rej)=>{
    const reader = new FileReader();
    reader.onload = ()=>res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

async function testApi(){
  const endpoint = document.getElementById('dEndpoint').value;
  const method = document.getElementById('dMethod').value;
  const urlParam = document.getElementById('dUrlParam').value;
  const testUrl = document.getElementById('dTestUrl').value;
  let headers = {};
  try { headers = JSON.parse(document.getElementById('dHeaders').value || '{}'); } catch(e){}

  const res = await fetch('/api/test-api', {
    method:'POST',
    headers:{'Content-Type':'application/json','x-admin-password':pwd},
    body: JSON.stringify({endpoint, method, headers, url_param: urlParam, test_url: testUrl})
  });
  const data = await res.json();
  document.getElementById('testResult').classList.remove('hidden');
  document.getElementById('testResult').textContent = JSON.stringify(data, null, 2);
  if (data.success) document.getElementById('fieldMap').classList.remove('hidden');
}

// Instead of saving to a database, this generates the JSON entry for you to
// paste into downloaders.json on GitHub (then commit -> Vercel auto redeploys)
async function saveDownloader(){
  const icon = document.getElementById('dIcon').files[0];
  const iconB64 = icon ? await fileToBase64(icon) : null;
  let headers = {};
  try { headers = JSON.parse(document.getElementById('dHeaders').value || '{}'); } catch(e){}

  const entry = {
    name: document.getElementById('dName').value,
    icon_base64: iconB64,
    url_pattern: document.getElementById('dPattern').value,
    api_endpoint: document.getElementById('dEndpoint').value,
    api_method: document.getElementById('dMethod').value,
    api_headers: headers,
    api_url_param: document.getElementById('dUrlParam').value,
    link_field: document.getElementById('dLinkField').value,
    title_field: document.getElementById('dTitleField').value,
    thumb_field: document.getElementById('dThumbField').value,
    active: true
  };
  document.getElementById('generatedJson').classList.remove('hidden');
  document.getElementById('generatedJson').textContent = JSON.stringify(entry, null, 2);
  document.getElementById('saveMsg').textContent =
    'Copy this, paste it inside the "downloaders" array in downloaders.json on GitHub, then commit.';
}

// Same idea for the announcement banner
function sendBroadcast(){
  const entry = {
    title: document.getElementById('bTitle').value,
    message: document.getElementById('bMessage').value,
    button_text: document.getElementById('bButtonText').value,
    button_color: document.getElementById('bColor').value,
    link: document.getElementById('bLink').value,
    active: true
  };
  document.getElementById('broadcastJson').classList.remove('hidden');
  document.getElementById('broadcastJson').textContent = JSON.stringify(entry, null, 2);
  document.getElementById('broadcastMsg').textContent =
    'Copy this, replace the content of broadcast.json on GitHub, then commit.';
}
