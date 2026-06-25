const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const extractBtn = document.getElementById("extractBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentImage = null;

imageInput.addEventListener("change", () => {

const file = imageInput.files[0];

if(!file) return;

currentImage = file;

preview.innerHTML = "";

const img = document.createElement("img");

img.src = URL.createObjectURL(file);

preview.appendChild(img);

result.value = "";

});

extractBtn.addEventListener("click", async ()=>{

if(!currentImage){

alert("يرجى اختيار صورة أولاً");

return;

}

loading.style.display = "block";

loading.innerHTML = "⏳ جاري استخراج النص...";

result.value = "";

try{

const { data } = await Tesseract.recognize(

currentImage,

"ara+eng",

{

logger: m => {

if(m.status==="recognizing text"){

loading.innerHTML =

"⏳ " +

Math.floor(m.progress*100)

*

"%";

}

}

}

);

result.value = data.text.trim();

loading.innerHTML = "✅ تم استخراج النص بنجاح";

setTimeout(()=>{

loading.style.display="none";

},1500);

}catch(e){

loading.style.display="none";

alert("حدث خطأ أثناء استخراج النص.");

}

});

copyBtn.addEventListener("click",()=>{

if(result.value===""){

alert("لا يوجد نص لنسخه.");

return;

}

navigator.clipboard.writeText(result.value);

copyBtn.innerHTML="✅ تم النسخ";

setTimeout(()=>{

copyBtn.innerHTML="نسخ النص";

},2000);

});

downloadBtn.addEventListener("click",()=>{

if(result.value===""){

alert("لا يوجد نص لتنزيله.");

return;

}

const blob = new Blob(

[result.value],

{type:"text/plain;charset=utf-8"}

);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = "webbag-text.txt";

a.click();

URL.revokeObjectURL(url);

});

