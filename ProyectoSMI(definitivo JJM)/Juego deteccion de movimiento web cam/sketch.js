let fin;
let inter = 3000;
let st = 1;
let en = 3;
let game = false;
let fallos = 0;
let handR;
let d;
let handL;
let video;
let poseNet;
let pose;
let skeleton;
let puntuacion = 0;
var obstacles = []; // Array para los obstaculos
var circles = []; // Array para los circulos  que puntuan


// Prepara todo para capturar video
function setup() { 
  createCanvas(640, 480); // Canvas donde se reflejara el video
  noStroke(); // Quita los bordes
  video = createCapture(VIDEO); // Comienza a capturar video y lo guarda en la variable
  video.hide();
  poseNet = ml5.poseNet(video,modelLoaded); // Inicializa la libreria ml5 y PoseNet
  poseNet.on('pose',gotPoses);

  
  
  
} 
// Checkea que PoseNet funcione
function modelLoaded() {
  console.log('poseNet ready');
}

// Captura la pose y la guarda en una variable para utilizarla
function gotPoses(poses) {
  if(poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


// Dibuja todos los elementos visuales constantemente
function draw() { 
  translate(width,0); 
  scale(-1.0,1.0); // Invierte el eje Y para crear el efecto espejo
  background(51); // Descomentar para modo negro
  //image(video,0,0) // Descomentar para modo video
  stroke(51); // Dibuja bordes
  fin = rect(1,450,700,20); // Crea la linea que delimita el final de la pantalla y la guarda
  
  // Si encuentra pose, crea los aspectos visuales para poder reconocer tu pose 
  if (pose){
    handR = pose.rightWrist;
    handL = pose.leftWrist;
    let er = pose.rightEye;
    let el = pose.leftEye;
    let nose = pose.nose;
    d = dist(er.x,er.y,el.x,el.y); // Mide la distanca entre los dos ojos para saber si te alejas o acercas
    fill(0,255,0);
    ellipse(handR.x,handR.y,(d+15));
    ellipse(handL.x,handL.y,(d+15));
    triangle((nose.x - 10),nose.y,nose.x,(nose.y + 20),(nose.x + 20),nose.y);
    ellipse(er.x,er.y,10);
    ellipse(el.x,el.y,10);




    // Crea los "huesos" del esqueleto
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x,a.position.y,b.position.x,b.position.y);
    }

  }
  
  
  // Itera sobre el array de los tantos para dibujarlos y aplicarles los metodos propios constantemente
  for (var i = 0; i < circles.length; i++) {
    if(game == true){ // Solo si el juego ha comenzado
      circles[i].move();
      circles[i].display();
      circles[i].intersects(i);
    }  
 }
  // Itera sobre el array de los obstaculos para dibujarlos y aplicarles los metodos propios constantemente
  for (var j = 0; j < obstacles.length; j++) {
    if(game == true){ // Solo si el juego ha comenzado


      obstacles[j].move();
      obstacles[j].display();
      obstacles[j].intersects(j);
    }
  }  
}


function mousePressed() {
  // Clica con el raton para crear tantos en la pantalla
  if( game == true){
  var d = random(20, 50);
  var c = color(random(255), 240, random(255));
  var s = random(0.2, 3);
  var newCircle = new DrawCircle(mouseX, mouseY, d, c, s);
  circles.push(newCircle);
  }
}

// *** Crea un Tanto *** //
// x      -> eje x 
// y      -> eje y 
// d      -> diametro
// c      -> color
// s      -> velocidad 
function DrawCircle( x, y, d, c, s ) {
  this.xPos = x;
  this.yPos = y;
  this.diameter = d;
  this.radius = d/2;
  this.color = c;
  this.speed = s;
}

// *** Crea un Obstaculo *** //
// x      -> eje x 
// y      -> eje y 
// d      -> diametro
// s      -> velocidad 
function DrawObstacle( x, y, d, s) {
  this.xPos = x;
  this.yPos = y;
  this.diameter = d;
  this.radius = d/2;
  this.speed = s;
}


// Reinicia todas las variables para volver a jugar una partida
function comenzar() {
  fallos = 0;
  var f = document.getElementById("fallos")
  f.innerHTML = 0;
  puntuacion = 0;
  var p = document.getElementById("punt")
  p.innerHTML = 0;
  game = true;
  var r = document.getElementById("res")
  r.innerHTML = "";



  // Intervalo de tiempo para lanzar bolas
  var intervalPunct = setInterval(function() {
                  
                  // Si el juego se acaba, corta el intervalo
                  if ( game == false){
                    clearInterval(intervalPunct);
                  }

                  // Crea un tanto y lo mete en su array
                  var x = random(width);
                  var y = random(height/10);
                  var d = random(10, 50);
                  var c = color(255, 0,0);
                  var s = random(st, 3);
                  var bola = new DrawCircle(x, y, d, c, s);
                  circles.push(bola);

                  // Crea un obstaculo y lo mete en su array
                  var x = random(width);
                  var y = random(height/10);
                  var d = 40;
                  var c = color(random(255), random(255), 255);
                  var s = random(0.5, 1.5);
                  var obstacle = new DrawObstacle(x, y, d, s);
                  obstacles.push(obstacle);
      
  },inter);

}

// Activa el modo Facil
function facil() {
  inter = 4000;
  var modo = document.getElementById("modo");
  modo.innerHTML = "FACIL"
}


// Activa el modo Medio
function medio() {
  inter = 3000;
  var modo = document.getElementById("modo");
  modo.innerHTML = "MEDIO"

}


// Activa el modo Dificil
function dificil() {
  inter = 2000;
  var modo = document.getElementById("modo");
  modo.innerHTML = "DIFICIL"

}

   
// Objto prototipo de Tanto //
DrawCircle.prototype = {
  constructor: DrawCircle,
  
  // *** Metodo: dibuja el elemento en el canvas *** //
  display: function() {
    fill('blue');
    ellipse(this.xPos,this.yPos, this.diameter, this.diameter);
  },
  
  // *** Metodo: mueve el elemento hacia abajo *** //
  move: function() {
    this.yPos += this.speed;
    // Si el circulo aparece fuera del canvas, lo devuelve dentro
    if (this.yPos - this.diameter/2 > height) {
      this.yPos = -this.diameter/2;
    }
  },
 
  // *** Metodo: vigila todo el rato que si hay una colision *** //
  intersects: function(index) { 
        if(pose){
        let distR = dist(handR.x,handR.y,this.xPos,this.yPos);
        let distL = dist(handL.x,handL.y,this.xPos,this.yPos);
        
            // Colision contra la linea del final
            if(this.yPos >= 440 ){
              circles.splice(index,1);
              fallos += 1;
              var fall = document.getElementById('fallos');
              fall.innerHTML = fallos.toString();
              
              // Condicional para GAME OVER
              if(fallos == 3){
                game = false;
                circles.length = 0;
                obstacles.length = 0;
                var res = document.getElementById('res');
                res.innerHTML = "GAME OVER"
                
              }
            }

            // Colision contra las manos
            if((distR < this.radius + d) || (distL < this.radius + d)) {
                circles.splice(index,1);
                st += 0.1;
                console.log(st);
                var p = 1000 - Math.trunc(this.yPos);
                puntuacion += p;
                var punt = document.getElementById('punt');
                punt.innerHTML = puntuacion.toString();
                
            }
        }
    }
  }


  // Objeto prototipo de Obstaculo //
  DrawObstacle.prototype = {
  constructor: DrawObstacle,
  display: function() {
    fill('red');
    ellipse(this.xPos,this.yPos, this.diameter, this.diameter);
  },

  move: function() {
    this.yPos += this.speed;
    if (this.yPos - this.diameter/2 > height) {
      this.yPos = -this.diameter/2;
    }
  },
    
    intersects: function(index) { 
        if(pose){
        let distR = dist(handR.x,handR.y,this.xPos,this.yPos);
        let distL = dist(handL.x,handL.y,this.xPos,this.yPos);
        
            // Colision con la linea del final
            if(this.yPos >= 440 ){
              obstacles.splice(index,1);
            }

            // Colision contra las manos
            if((distR < this.radius + d) || (distL < this.radius + d)) {
                obstacles.splice(index,1);
                fallos += 1;
              var fall = document.getElementById('fallos');
              fall.innerHTML = fallos.toString();
              
              // Condicion para GAME OVER
              if(fallos == 3){
                game = false;
                circles.length = 0;
                obstacles.length = 0;
                var res = document.getElementById('res');
                res.innerHTML = "GAME OVER"
                
              }
            }
        }
    }

}
