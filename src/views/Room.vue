<script setup>
import { ref,reactive,onMounted } from 'vue';
import Base from './Base.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
import gsap from 'gsap'
const canvasDom=ref(null)
let base=reactive(null)
const imgsrc=ref('images/太阳.png')
const imgdom=ref(null)
const titlebg=ref(null)
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1)
const pointer = new THREE.Vector2();

const raycaster1 = new THREE.Raycaster();
raycaster.layers.set(2)
const pointer1 = new THREE.Vector2();






let door=null,book=null;
let dirlight;
onMounted(() => {
    // let gui=new GUI()
  base=new Base(canvasDom.value)
//   let obj={x:base.camera.position.x,y:base.camera.position.y,z:base.camera.position.z}
//   gui.add(obj,'x').onChange((val)=>{
//     base.camera.position.x=val
//   })
//   gui.add(obj,'y').onChange((val)=>{
//     base.camera.position.y=val
//   })
//   gui.add(obj,'z').onChange((val)=>{
//     base.camera.position.z=val
//   })
  addLight()
  loadgltf()
  update()
  window.addEventListener( 'pointermove', onPointerMove );
  window.addEventListener( 'pointerdown', onPointerDown );
  imgdom.value.addEventListener('click',()=>{
    if(!gsap.isTweening(dirlight) && !gsap.isTweening(dirlight.position)){
        imgsrc.value=='images/太阳.png'?imgsrc.value='images/月亮.png'
        :imgsrc.value='images/太阳.png'
       if(imgsrc.value=='images/月亮.png'){
        gsap.to(dirlight.position,{
            x:-5,
            y:-6,
            z:0,
            duration:3
        })
        gsap.to(dirlight,{
            intensity:0,
            duration:1
        })
       }else{
        gsap.to(dirlight.position,{
            x:-10,
            y:50,
            z:10,
            duration:1.5
        })
        gsap.to(dirlight,{
            intensity:1,
            duration:1
        })
       } 
    }
  })

gsap.from('.title',{
    duration:3.5,
    scale:0.5,
    rotation:360,
    opacity:0,
    delay:0.2,
    stagger:0.2,
    ease:'elastic'
})
})
let pinkLight={
    light:null,
    isClose:false,
},yellowLight={
    light:null,
    isClose:false,
}
let roomObj=null
function loadgltf(){
    new GLTFLoader().load('gltf/bedroom10.glb',(gltf)=>{
        console.log(gltf.scene.children[1])
        let obj1=gltf.scene.children[1]
        obj1.rotation.x=0.4
        obj1.rotation.y=-1
        addObj(obj1.children)
        roomObj=obj1
        base.scene.add(obj1)
    // const gui=new GUI()
    // let obj={x:0,y:0,z:0,rx:0,ry:0,rz:0}
    // gui.add(obj,'x',-10.0,10.0,0.1).onChange((val)=>{
    //     base.camera.position.x=val
    // })
    // gui.add(obj,'y',-10.0,10.0,0.1).onChange((val)=>{
    //     base.camera.position.y=val
    // })
    // gui.add(obj,'z',-10.0,10.0,0.1).onChange((val)=>{
    //     base.camera.position.z=val
    // })
    // gui.add(obj,'rx',-10.0,10.0,0.1).onChange((val)=>{
    //     obj1.rotation.x=val
    // })
    // gui.add(obj,'ry',-10.0,10.0,0.1).onChange((val)=>{
    //     obj1.rotation.y=val
    // })
    // gui.add(obj,'rz',-10.0,10.0,0.1).onChange((val)=>{
    //     obj1.rotation.z=val
    // })
    })
}
function addLight(){
    let light=new THREE.AmbientLight(0xffffff,0.6)
    base.scene.add(light)

    dirlight=new THREE.DirectionalLight()
    dirlight.castShadow=true;
    dirlight.shadow.mapSize.set(2024,2024)
    base.scene.add(dirlight)
}
let texture=new THREE.TextureLoader()

function addObj(obj){
    obj.forEach(val => {
        if(val instanceof THREE.Mesh){
            val.castShadow=true;
            val.receiveShadow=true
            if(val.name.includes('pic')){
               val.material.map= texture.load('images/'+val.name+'.jpg')
            }
            if(val.name=='screen'){
let video=document.createElement('video')
video.src='videos/1.mp4'
video.loop=true;
video.muted=true;
video.play()
let videotexture=new THREE.VideoTexture(video)
videotexture.minFilter=THREE.NearestFilter
videotexture.magFilter=THREE.NearestFilter
videotexture.generateMipmaps=false;
videotexture.encoding=THREE.sRGBEncoding;
videotexture.center=new THREE.Vector2(0.5,0.5)
videotexture.rotation=Math.PI/2
val.layers.enable(2)
val.material.map=videotexture
            }
            if(val.name=='cup1'){
let c=new THREE.Color(1,0.54,0.54)
let light=new THREE.PointLight(c.getHex(),1,1)
light.matrixWorld=val.matrixWorld
pinkLight.light=light
val.layers.enable(2)
base.scene.add(light)
            }else if(val.name=='cup2'){
                let c=new THREE.Color(1,1,0)
let light=new THREE.PointLight(c.getHex(),1,1)
light.matrixWorld=val.matrixWorld
yellowLight.light=light
val.layers.enable(2)
base.scene.add(light)
            }
            if(val.name=='door'){
                val.layers.enable(1)
                door=val
            }
            if(val.name=='book'){
                val.layers.enable(1)
                book=val
            }
        }else{
            addObj(val.children)
        }
    })
}
let isClickLight=false
let isClickScreen=false
 function update() {
    requestAnimationFrame(update);
    // 通过摄像机和鼠标位置更新射线
	raycaster.setFromCamera( pointer, base.camera );

// 计算物体和射线的焦点
const intersects = raycaster.intersectObjects( base.scene.
children );
// console.log(intersects)
if(intersects.length>0){
    if(intersects[0].object.name=='door' && door ){
//gsap插件

gsap.to(door.rotation,{
    y:-0.5,
    duration:0.5
})
}else if(intersects[0].object.name=='book' && book){
    gsap.to(book.position,{
    x:1.5,
    duration:0.5
})
}
}
else{
    gsap.to(door?.rotation,{
    y:0,
    duration:0.5
})
gsap.to(book?.position,{
    x:0,
    duration:0.5
})  
}

//射线2
raycaster1.setFromCamera( pointer1, base.camera );

// 计算物体和射线的焦点
const intersects1 = raycaster1.intersectObjects( 
    base.scene.
children );
if(intersects1.length>0){
    if(intersects1[0].object.name=='cup1' && isClickLight){
pinkLight.isClose?pinkLight.isClose=false:
pinkLight.isClose=true;
isClickLight=false
if(pinkLight.isClose)
pinkLight.light.intensity=0
else
pinkLight.light.intensity=1
    }else if(intersects1[0].object.name=='cup2' && isClickLight){
yellowLight.isClose?yellowLight.isClose=false:
yellowLight.isClose=true;
isClickLight=false
if(yellowLight.isClose)
yellowLight.light.intensity=0
else
yellowLight.light.intensity=1
    }else if(intersects1[0].object.name=='screen'){
        if(!isClickScreen && 
        !gsap.isTweening(base.camera.position)){
            isClickScreen=true
            titlebg.value.style.display='none'
        gsap.to(base.camera.position,{
            x:0.8,
            y:0.8,
            z:0.7,
            duration:1,
            ease:'power2'
        })
        }
        else if(!gsap.isTweening(base.camera.position)){
        isClickScreen=false
        
        gsap.to(base.camera.position,{
            x:0,
            y:0.8,
            z:4.5,
            duration:1,
            ease:'power2',
            onComplete:()=>{
                titlebg.value.style.display='block'
            }
        })
    }
    }   
}
    base.renderer.render(base.scene, base.camera);
  }

  function onPointerMove( event ) {

// 将鼠标位置归一化为设备坐标。x 和 y 
//方向的取值范围是 (-1 to +1)

// pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
pointer.x=(event.clientX-window.innerWidth/2)/(window.innerWidth/2)
pointer.y=-(event.clientY-window.innerHeight/2)/(window.innerHeight/2)

gsap.killTweensOf(roomObj?.rotation)
gsap.to(roomObj?.rotation,{
    y:pointer.x*0.11-1,
    duration:1
})
}
  
  function onPointerDown( event ) {

// 将鼠标位置归一化为设备坐标。x 和 y 
//方向的取值范围是 (-1 to +1)
isClickLight=true
// pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
pointer1.x=(event.clientX-window.innerWidth/2)/(window.innerWidth/2)
pointer1.y=-(event.clientY-window.innerHeight/2)/(window.innerHeight/2)
  }
</script>

<template>
<div>
   <div ref="titlebg">
    <div class="titlebg">
        <img :src="imgsrc" class="title" ref="imgdom" alt="">
        <span class="title">T</span>
        <span class="title">h</span>
        <span class="title">r</span>
        <span class="title">e</span>
        <span class="title">e</span>
    </div>
    <div class="titlebg1">
        <span class="title">房</span>
        <span class="title">间</span>
    </div>
   </div>
    <canvas id="canvasDom" ref="canvasDom"></canvas>
</div>
</template>

<style scoped>
#canvasDom{
    width: 100vw;
    height: 100vh;
}
.titlebg,.titlebg1{
    position: fixed;
    z-index: 99999;
    display: inline-block;
    left: 24%;
    top: 40%;
    display: flex;
    font-size: 30px;
    color: white;
}
.titlebg1{
    left: 71%;
}
img{
    width: 40px;
    height: 40px;
}
</style>
