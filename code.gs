function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Project Stellar');
}

function setStellarUsername(obj) {
  var userProps = PropertiesService.getUserProperties();
  if (obj && obj.sessionId && obj.username) {
    userProps.setProperty('stellar_username_' + obj.sessionId, obj.username);
    return true;
  }
  return false;
}

function getStellarUsername(sessionId) {
  if (!sessionId) return "";
  var userProps = PropertiesService.getUserProperties();
  return userProps.getProperty('stellar_username_' + sessionId) || "";
}

function sendStellarChat(obj) {
  if (!obj || !obj.sessionId || !obj.text) return false;
  var userProps = PropertiesService.getUserProperties();
  var username = userProps.getProperty('stellar_username_' + obj.sessionId) || "";
  if (!username) return false;

  var scriptProps = PropertiesService.getScriptProperties();
  var messages = [];
  try {
    messages = JSON.parse(scriptProps.getProperty('stellar_messages') || "[]");
  } catch(e) {}
  messages.push({user: username, text: obj.text, time: (new Date()).toISOString()});
  while (messages.length > 50) messages.shift();
  scriptProps.setProperty('stellar_messages', JSON.stringify(messages));
  return true;
}

function getStellarChat() {
  var scriptProps = PropertiesService.getScriptProperties();
  var messages = [];
  try {
    messages = JSON.parse(scriptProps.getProperty('stellar_messages') || "[]");
  } catch(e) {}
  return {messages: messages};
}
