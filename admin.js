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

function toggleInfoEndpoint(){
  const on = document.getElementById('useInfoEndpoint').checked;
  document.getElementById('infoEndpointBox').classList.toggle('hidden', !on);
}

function buildHeaders(){
  let headers = {};
  const keyHeader = document.getElementById('dApiKeyHeader').value.trim();
  const keyValue = document.getElementById('dApiKeyValue').value.trim();
  if (keyHeader && keyValue) headers[keyHeader] = keyValue;
  try {
    const extra = JSON.parse(document.getElementById('dHeaders').value || '{}');
    headers = { ...headers, ...extra };
  } catch(e){}
  return headers;
}

async function testApi(which){
  const headers = buildHeaders();
  let endpoint, method, urlParam, resultBox;

  if (which === 'download') {
    endpoint = document.getElementById('dEndpoint').value;
    method = document.getElementById('dMethod').value;
    urlParam = document.getElementById('dUrlParam').value;
    resultBox = 'testResult';
  } else {
    endpoint = document.getElementById('iEndpoint').value;
    method = document.getElementById('iMethod').value;
    urlParam = document.getElementById('iUrlParam').value;
    resultBox = 'testResultInfo';
  }
  const testUrl = document.getElementById('dTestUrl').value;

  const res = await fetch('/api/test-api', {
    method:'POST',
    headers:{'Content-Type':'application/json','x-admin-password':pwd},
    body: JSON.stringify({endpoint, method, headers, url_param: urlParam, test_url: testUrl})
  });
  const data = await res.json();
  document.getElementById(resultBox).classList.remove('hidden');
  document.getElementById(resultBox).textContent = JSON.stringify(data, null, 2);
  if (data.success && which === 'download') {
    document.getElementById('fieldMap').classList.remove('hidden');
  }
}

// Generates the JSON entry to paste into downloaders.json on GitHub
async function saveDownloader(){
  const icon = document.getElementById('dIcon').files[0];
  const iconB64 = icon ? await fileToBase64(icon) : null;
  const headers = buildHeaders();
  const useInfo = document.getElementById('useInfoEndpoint').checked;

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

  if (useInfo) {
    entry.info_endpoint = document.getElementById('iEndpoint').value;
    entry.info_method = document.getElementById('iMethod').value;
    entry.info_url_param = document.getElementById('iUrlParam').value;
  }

  document.getElementById('generatedJson').classList.remove('hidden');
  document.getElementById('generatedJson').textContent = JSON.stringify(entry, null, 2);
  document.getElementById('saveMsg').textContent =
    'Copy this, paste it inside the "downloaders" array in downloaders.json on GitHub, then commit.';
}

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
