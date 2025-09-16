fetch(caller_api).then((res)=>{
if (res.status === 402) {
  window.location = "../../../index.html";
}
    return res.json();
}).then((data)=>{

      
 })