/*
// Check WebGL Compatibility


if (Detector.webgl) {
    init();
    animate();
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
*/
// Basic Setup
var camRadius =200;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
camera.position.set( 0 , 80,camRadius );
camera.lookAt(new THREE.Vector3(0, 0, 0));
var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.autoClear = false;
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColor( 0x81d4fa, 1);
scene.background = new THREE.Color(0x64b5f6);
document.body.appendChild( renderer.domElement );
/*
var geometry1 = new THREE.CubeGeometry(200, 200, 200);

var material1 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
});
var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
 scene.add(mesh);

*/
var light = new THREE.PointLight( 0xff0000, 10 );
light.position.set( 0,0, 0 );
scene.add( light );
var light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light2 );
// Keyboard controls
var keyboard = new THREEx.KeyboardState();
function createWall()
{
    var geometryWall = new THREE.BoxGeometry( 10, 220, 50 );
    var materialWall = new THREE.MeshBasicMaterial( {color: 0x00f0ff,opacity:0.6,transparent:true} );
    var cube1 = new THREE.Mesh( geometryWall, materialWall );
    var cube2 = new THREE.Mesh( geometryWall, materialWall );
    var cube3 = new THREE.Mesh( geometryWall, materialWall );
    var cube4 = new THREE.Mesh( geometryWall, materialWall );
    cube1.position.set(105,0,25);
    cube2.position.set(-105,0,25);
    cube3.rotation.z = Math.PI /2;
    cube3.position.set(0,105,25);
    cube4.rotation.z = Math.PI /2;
    cube4.position.set(0,-105,25);
    scene.add( cube1 );
    scene.add( cube2 );
    scene.add( cube3 );
    scene.add( cube4 );
}
//OrbitControls
//controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // remove when using animation loop
// enable animation loop when using damping or autorotation
//controls.enableDamping = true;
//controls.dampingFactor = 0.25;
//controls.enableZoom = false;
//createWall();
var size = 200;
var divisions = 20;
function createGrid(scene){
    var grid = new THREE.GridHelper( size, divisions, 0x1711b2,0x234876 );
    grid.position.set(0,0,0);
    scene.add( grid );
}
var snake = new Snake(scene,200,15);

createGrid(scene);
//var axisHelper = new THREE.AxisHelper( 500 );
//scene.add( axisHelper );
renderer.render(scene,camera);
/*
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
renderer.clearDepth(); // important! clear the depth buffer

*/
var snakeMovement = [
        [0,0,-10],[10,0,0],[0,0,10],[-10,0,0],[0,10,0],[0,-10,0]
];
var cameraDir = 0;
var cameraPos =[
    {
        x:0,z:camRadius
    },
    {
        x:camRadius,z:0
    },
    {
        x:0,z:-camRadius
    },
    {
        x:-camRadius,z:0
    }

];
var geometry1 = new THREE.BoxBufferGeometry( 200, 200, 200 );
var geometry = new THREE.EdgesGeometry( geometry1 ); // or WireframeGeometry
var material = new THREE.LineBasicMaterial( { color: 0x1a237e, linewidth: 2 } );
var edges = new THREE.LineSegments( geometry, material );
scene.add( edges );

var relativeDirection = {
    w:[0,3,2,1],
    d:[1,0,3,2],
    s:[2,1,0,3],
    a:[3,2,1,0],
    q:[4,4,4,4],
    e:[5,5,5,5]

}
console.log(snakeMovement[cameraDir][snake.direction]);
var cameraTheta = 0,incUnit=0.2;
function keyboardInput() {
 //   console.log(keyboard.keyCodes);
    var change =false;
    if(keyboard.pressed("w"))
        snake.direction = relativeDirection["w"][cameraDir];
    if(keyboard.pressed("d"))
        snake.direction = relativeDirection["d"][cameraDir];
    if(keyboard.pressed("s"))
        snake.direction = relativeDirection["s"][cameraDir];
    if(keyboard.pressed("a"))
        snake.direction = relativeDirection["a"][cameraDir];
    if(keyboard.pressed("up"))
        snake.direction = relativeDirection["q"][cameraDir];
    if(keyboard.pressed("down"))
        snake.direction = relativeDirection["e"][cameraDir];
    if(keyboard.pressed("right"))
        cameraDir = (4+cameraDir+1)%4;
    if(keyboard.pressed("left"))
        cameraDir = (4+cameraDir-1)%4;
    if(keyboard.pressed("8"))
        console.log("8");
    if(keyboard.pressed("5"))
        console.log("5");
   // console.log(snakeMovement[cameraDir][snake.direction]);
    camera.position.x = cameraPos[cameraDir]["x"];
    camera.position.z = cameraPos[cameraDir]["z"];


  //  camera.position.x = camRadius*Math.sin(cameraTheta);

   // camera.position.z = camRadius*Math.cos(cameraTheta);
    camera.lookAt(new THREE.Vector3(0, 0, 0));


}
function gameOver(){
    clearInterval(animation);
    var score = snake.length - 15;
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    var loader = new THREE.FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        var geometry = new THREE.TextGeometry('Your Score : ' + score+ '\n Refresh the page to play again :)' , {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelSegments: 5
        } );
    } );
    window.alert("Your Score is "+ score + " .\n" + "Click OK to play again :)");
    window.location.reload(true);
 //   scene.add()
}
function getEmptyBox() {

    var position ={x:10*Math.floor(Math.random()*18-9)+5,y:(10*Math.floor(Math.random()*18-9))+5,z:(10*Math.floor(Math.random()*18-9))+5};
    snake.body.forEach(function (part) {
        if(part.position === position)
            return getEmptyBox();
    });
    return position;
}
function Food(scene,id){
    this.position={x:0,y:0};
    this.id = id ;
    this.scene = scene;
    this.geometry = new THREE.SphereGeometry(5,32,32);
    this.material = new THREE.MeshLambertMaterial({color:0x0000ff});
}
Food.prototype = {
    remove: function () {
        this.scene.remove(scene.getObjectByName(this.id));
  //      console.log("it works");
    },
    add: function () {
        var temp = new THREE.Mesh(this.geometry,this.material);
        temp.name = this.id;
        this.position = getEmptyBox();
    //    this.position = {x:5,y:5,z:5};
        temp.position.set(this.position.x,this.position.y,this.position.z);
        this.scene.add(temp);
        console.log("hello",this.position);
      //  temp.position.set(100,0,0);
       // scene.add(temp);
    }
}
function isFoodCollision() {
    console.log(snake.body[0].position,food.position);
    if(snake.body[0].position.x == food.position.x && snake.body[0].position.y == food.position.y && snake.body[0].position.z == food.position.z)
    {
        console.log("whatsup");
        food.remove();
        food.add();
        return true;
    }
    else
        return false;
}
var food = new Food(scene,"food");
food.add();
var t=0;
function render(){
        if(isFoodCollision())
        snake.add();
        if(snake.isSelfCrash()) {
            console.log("selfcrash");
            gameOver();
        }
        keyboardInput();
        if(t%5 == 0)
            if(!snake.move())
            gameOver();
	    renderer.render( scene, camera );
	    t++;
}
snake.init();
var fps = 10;
var animation = setInterval( render, 1000/fps  );


