

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const laser_img = document.getElementById("laser");
const space_background_img = document.getElementById("background");
const tie_fighter_img = document.getElementById("tie_fighter");
const tie_fighter2_img = document.getElementById("tie_fighter2");
const x_wing_img = document.getElementById("x-wing");
const sound = document.getElementById("sound");
const explode0 = document.getElementById("explode0");
const explode1 = document.getElementById("explode1");
const explode2 = document.getElementById("explode2");
const explode3 = document.getElementById("explode3");
const explode4 = document.getElementById("explode4");
const explode5 = document.getElementById("explode5");
let score = 0;
let failes = 0;
ctx.fillStyle = "white";
ctx.font = "30px Arial";

let spaceShip = {
    x: canvas.width / 2, 
    y: 500,
    width: 38,
    height: 41,
    draw() {
        ctx.drawImage(x_wing_img, this.x, this.y, this.width, this.height);
    }
}


function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 38;
    this.height = 30;
    this.changeY = 0.5;
    this.frame = 0;
    this.explode = false;
    this.kill = false;
    this.img = tie_fighter_img;
    this.draw = function() {
        this.frame++;
        this.y += this.changeY;
        if(this.frame == 10) {
            this.frame = 0;
            if(this.img == tie_fighter_img) {
                this.img = tie_fighter2_img;
            }
            else{
                this.img = tie_fighter_img;
            }
        }
        if(this.y > canvas.height - this.height){
            failes++;
            this.kill = true;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

function Explode(x, y) {
    this.x = x;
    this.y = y;
    this.kill = false;
    this.width = 80;
    this.height = 80;
    this.frame = 0;
    this.img = explode0;
    this.draw = function(){
        if(this.frame == 0){
            this.img = explode0;
        }
        else if(this.frame == 1){
            this.img = explode1;
        }
        else if(this.frame == 2){
            this.img = explode2;
        }
        else if(this.frame == 3){
            this.img = explode3;
        }
        else if(this.frame == 4){
            this.img = explode4;
        }
        else if(this.frame == 5){
            this.img = explode5;
        }
        else{
            this.kill = true;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.frame++;
    }
}

function Laser(x, y) {
    this.x = x;
    this.y = y;
    this.width = 7;
    this.height = 43;
    this.changeY = -2;
    this.kill = false;
    this.enemyIndex = -1;
    this.draw = function() {
        this.y += this.changeY;
        if(this.y + this.height <= 0) {
            this.kill = true;
        }
        this.enemyIndex = multicollision(this, enemys);
        if(this.enemyIndex > -1) {
            this.kill = true;
            enemys[this.enemyIndex].kill = true;
            enemys[this.enemyIndex].explode = true;
            score++;
            this.enemyIndex = -1;
        }
        ctx.drawImage(laser_img, this.x, this.y, this.width, this.height);
    }
}


let lasers = [];

canvas.addEventListener("click", function() {
    let positionX = spaceShip.x + spaceShip.width / 2 - 3;
    let positionY = spaceShip.y - 43;
    let laser = new Laser(positionX, positionY);
    lasers.push(laser);
    sound.play();
    console.log(positionX);
});

let laserKill = -1;


let enemys = [];

for(let i = 0; i < 50; i++) {
    let posY = -i * 100;
    let posX = Math.round(Math.random() * (canvas.width - 38));
    let enemy = new Enemy(posX, posY);
    enemys.push(enemy);
}

let enemyKill = -1;

let explodes = [];

let explodeKill = -1;

function update() {
    laserKill = -1;
    enemyKill = -1;
    explodeKill = -1;
    ctx.drawImage(space_background_img, 0, 0, canvas.width, canvas.height);
    spaceShip.draw();
    for(let i = 0; i < enemys.length; i++) {
        enemys[i].draw();
        if(enemys[i].kill == true){
            enemyKill = i;
        }
    }
    if(enemyKill > -1){
        if(enemys[enemyKill].explode){
            let explode = new Explode(enemys[enemyKill].x - 25, enemys[enemyKill].y - 25);
            explodes.push(explode);
        }
        enemys.splice(enemyKill, 1);
    }
    for(let i = 0; i < lasers.length; i++) {
        lasers[i].draw();
        if(lasers[i].kill == true) {
            laserKill = i;
        }
    }
    if(laserKill > -1) {
        lasers.splice(laserKill, 1)
    }
    for(let i = 0; i < explodes.length; i++){
        explodes[i].draw();
        if(explodes[i].kill == true){
            explodeKill = i;
        }
    }
    if(explodeKill > -1){
        explodes.splice(explodeKill, 1);
    }
    if(multicollision(spaceShip, enemys) > -1 || failes >= 3){
        ctx.font = "50px Arial";
        ctx.fillText("Проигрыш!", 300, 300);
        return false;
    }
    if(enemys.length == 0){
        ctx.font = "50px Arial";
        ctx.fillText("Выигрыш!", 300, 300);
        return false;
    }
    ctx.fillText("Счет: " + score, 30, 30);
    ctx.fillText("Неудачи: " + failes, 560, 30);
    window.requestAnimationFrame(update);
}

update();

let posX;

canvas.addEventListener("mousemove", function(e) {
    posX = e.layerX;
    if(posX < 0){
        posX = 0;
    }
    if(posX > canvas.width - spaceShip.width){
        posX = canvas.width - spaceShip.width;
    }
    spaceShip.x = posX;
    
});

function collision(one, two){
    if(one.x + one.width > two.x && two.x + two.width > one.x && one.y + one.height > two.y && two.y + two.height > one.y){
        return true;
    }
    return false;
}

function multicollision(one, many) {
    let index = -1;
    for(let i = 0; i < many.length; i++) {
        if(collision(one, many[i])) {
            index = i;
            break;
        }
    }
    return index;
}