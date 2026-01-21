const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();
let scale = 1, x = 0, y = 0, drag = false, ox, oy;
let originalFileName = 'photo';

const DPI = 300;
const CM_TO_INCH = 0.393701;

document.getElementById('applySize').onclick = setCustom;
document.getElementById('downloadBtn').onclick = download;

function setCustom(){
    let wcm = parseFloat(document.getElementById('wcm').value);
    let hcm = parseFloat(document.getElementById('hcm').value);

    let winch = wcm * CM_TO_INCH;
    let hinch = hcm * CM_TO_INCH;

    canvas.width = Math.round(winch * DPI);
    canvas.height = Math.round(hinch * DPI);
    fit();
}

document.getElementById('upload').onchange = e =>{
    let file = e.target.files[0];
    if(!file) return;
    originalFileName = file.name.replace(/\.[^/.]+$/,'');
    let rd = new FileReader();
    rd.onload = ()=>{
        img.src = rd.result;
        img.onload = ()=>{fit()}
    };
    rd.readAsDataURL(file);
}

function fit(){
    if(!img.src) return;

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    scale = Math.max(scaleX, scaleY);

    const imgW = img.width * scale;
    const imgH = img.height * scale;

    x = (canvas.width - imgW) / 2;
    y = (canvas.height - imgH) / 2;

    draw();
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

canvas.onmousedown = e =>{
    drag = true;
    ox = e.offsetX - x;
    oy = e.offsetY - y;
}

canvas.onmouseup = ()=> drag = false;

canvas.onmousemove = e =>{
    if(!drag) return;
    x = e.offsetX - ox;
    y = e.offsetY - oy;
    draw();
}

function download(){
    if(!img.src){
        alert("Please upload a photo first!");
        return;
    }

    let w = document.getElementById('wcm').value;
    let h = document.getElementById('hcm').value;
    let a = document.createElement('a');

    a.download = `${w}x${h}_${originalFileName}.png`;
    a.href = canvas.toDataURL();
    a.click();
}



