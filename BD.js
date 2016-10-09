var arr = wpTextbox1.innerHTML.match(/[（(](\d+年)(\d+月)?(\d+日)?[—-](\d+年)?(\d+月)?(\d+日)?[）)]/);
wpTextbox1.innerHTML = wpTextbox1.innerHTML.replace(/[（(](\d+年)(\d+月)?(\d+日)?[—-](\d+年)?(\d+月)?(\d+日)?[）)]/, "{{BD|"+(arr[1]===undefined?"":arr[1])+"|"+(arr[2]===undefined?"":arr[2])+(arr[3]===undefined?"":arr[3])+"|"+(arr[4]===undefined?"":arr[4])+"|"+(arr[5]===undefined?"":arr[5])+(arr[6]===undefined?"":arr[6])+"}}").replace(/\[\[Category:\d+年出生\]\]\n/, "").replace(/\[\[Category:\d+年逝世\]\]\n/, "");
wpSummary.value = "+BD";
wpMinoredit.checked = true;
if(confirm("Save?")) wpSave.click();
