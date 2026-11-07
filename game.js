(()=>{'use strict';
const $=id=>document.getElementById(id);
const canvas=$('gameCanvas');
if(!window.THREE){$('fatal').classList.remove('hidden');$('fatalText').textContent='No se ha cargado el motor Three.js local. Comprueba que vendor/three.min.js está disponible.';return;}
let renderer,scene,camera;
try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
 renderer.setSize(innerWidth,innerHeight,false);
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.08;
}catch(err){$('fatal').classList.remove('hidden');$('fatalText').textContent='No se pudo iniciar WebGL: '+err.message;return;}
scene=new THREE.Scene();
scene.background=new THREE.Color(0x070c0f);
scene.fog=new THREE.FogExp2(0x0b1418,.019);
camera=new THREE.PerspectiveCamera(76,innerWidth/innerHeight,.05,100);
camera.rotation.order='YXZ';
const clock=new THREE.Clock();
const raycaster=new THREE.Raycaster();
const colliderList=[];
const interactables=[];
const doors={};
const flickerLights=[];
const materials={};
let player={x:-11,z:25.5,yaw:0,pitch:0,height:1.68};
let state=makeState();
let enemy=null,alma=null;
let started=false,paused=false,modal='',hidden=false,flashOn=true,flashBattery=100,stamina=100;
let gameMinutes=0,clockEvent=false,toastTimer=0,subtitleTimer=0,chapterTimer=0,stepTimer=0,heartbeatTimer=0;
let keys=new Set(),moving=false,sprinting=false,crouching=false,lastTime=0,phaseInput=[];
let audioCtx=null,audioMaster=null,droneOsc=null,droneGain=null;
let volume=.45,sensitivity=.0021;
const SAVE_KEY='santa0317_web_2026';
function makeState(){return {chapter:1,key:false,fuse:false,protocol:false,power:false,ward:false,record:false,room317:false,drawing:false,photo:false,almaMet:false,archive:false,incident:false,morgue:false,securityTape:false,clockCode:false,basement:false,generator:false,directorCode:false,directorEvidence:false,paranormal:false,secretClues:0,items:[],flags:[],checkpoint:{x:-11,z:25.5,yaw:0},ending:null};}
function mat(name,color,rough=.78,metal=0,emissive=0){
 if(materials[name])return materials[name];
 const m=new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,emissive:color,emissiveIntensity:emissive});
 materials[name]=m;return m;
}
const M={
 concrete:mat('concrete',0x3b4542,.92),wall:mat('wall',0x77807a,.9),paint:mat('paint',0x53625f,.88),tile:mat('tile',0x242e2d,.48),wet:mat('wet',0x141f20,.2,.18),steel:mat('steel',0x687477,.35,.72),rust:mat('rust',0x49352d,.74,.35),wood:mat('wood',0x44352b,.82),linen:mat('linen',0xb6b7a9,.98),paper:mat('paper',0xcac3ad,.93),blue:mat('blue',0x253c43,.7),dark:mat('dark',0x090d10,.32,.45),glass:mat('glass',0x496267,.16,.4),red:mat('red',0x672a25,.55,.18),green:mat('green',0x315b49,.55,.1,.1),lamp:mat('lamp',0xbaccc2,.25,0,1.3),emergency:mat('emergency',0x8a1d19,.2,0,2.2),skin:mat('skin',0xc4a18c,.74),hair:mat('hair',0x181412,.94),ghost: new THREE.MeshStandardMaterial({color:0xc8e1d9,roughness:.42,transparent:true,opacity:.78,emissive:0x789a91,emissiveIntensity:.68}),ghostHair:mat('ghostHair',0x171a1b,.9),uniform:mat('uniform',0x263e43,.85),blood:mat('blood',0x3b0c0e,.24),screen:mat('screen',0x39796c,.27,.12,.6),yellow:mat('yellow',0xb98b39,.6,.2)
};
const hemi=new THREE.HemisphereLight(0x9caeaa,0x12181a,.44);scene.add(hemi);
const moon=new THREE.DirectionalLight(0x91a4a4,.24);moon.position.set(-10,18,8);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-28;moon.shadow.camera.right=28;moon.shadow.camera.top=55;moon.shadow.camera.bottom=-55;scene.add(moon);
const ambient=new THREE.AmbientLight(0x6e7c78,.17);scene.add(ambient);
const flashlight=new THREE.SpotLight(0xdce8d9,78,18,Math.PI/8,.38,1.35);flashlight.castShadow=false;camera.add(flashlight);flashlight.position.set(.16,-.12,-.08);flashlight.target.position.set(0,0,-8);camera.add(flashlight.target);scene.add(camera);
const torchFill=new THREE.PointLight(0xe5eee1,5,4);camera.add(torchFill);torchFill.position.set(0,-.2,0);
function addBox(name,pos,size,material,collide=false,opts={}){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(size[0],size[1],size[2]),material);
 mesh.name=name;mesh.position.set(pos[0],pos[1],pos[2]);mesh.castShadow=opts.cast!==false;mesh.receiveShadow=opts.receive!==false;scene.add(mesh);
 if(collide)colliderList.push({minX:pos[0]-size[0]/2,maxX:pos[0]+size[0]/2,minZ:pos[2]-size[2]/2,maxZ:pos[2]+size[2]/2,mesh});
 return mesh;
}
function addCylinder(name,pos,r1,r2,height,material,rot=null,collide=false){
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,height,14),material);mesh.name=name;mesh.position.set(...pos);if(rot)mesh.rotation.set(...rot);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
 if(collide)colliderList.push({minX:pos[0]-Math.max(r1,r2),maxX:pos[0]+Math.max(r1,r2),minZ:pos[2]-Math.max(r1,r2),maxZ:pos[2]+Math.max(r1,r2),mesh});
 return mesh;
}
function addSphere(name,pos,scale,material,segments=16){
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,segments,Math.max(8,Math.floor(segments*.65))),material);mesh.name=name;mesh.position.set(...pos);mesh.scale.set(...scale);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
function light(name,pos,color,intensity,distance=11){
 const l=new THREE.PointLight(color,intensity,distance,1.65);l.name=name;l.position.set(...pos);l.castShadow=false;scene.add(l);flickerLights.push({light:l,base:intensity,phase:Math.random()*9,rate:2+Math.random()*4});return l;
}
function wall(name,x,z,w,d,material=M.wall){return addBox(name,[x,1.55,z],[w,3.1,d],material,true);}
function floor(name,x,z,w,d,material=M.tile){return addBox(name,[x,-.18,z],[w,.36,d],material,false);}
function label(text,pos,rotY=0,scale=1,color='#d8dfd6'){
 const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.clearRect(0,0,512,128);g.fillStyle='rgba(5,12,15,.88)';g.fillRect(0,0,512,128);g.strokeStyle='rgba(170,190,180,.35)';g.strokeRect(5,5,502,118);g.fillStyle=color;g.font='bold 34px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,65);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.4*scale,.6*scale),m);mesh.position.set(...pos);mesh.rotation.y=rotY;scene.add(mesh);return mesh;
}
function createDoor(id,side,z,title,condition){
 const x=side*6,group=new THREE.Group();group.position.set(x,0,z);group.name=id;
 const panel=new THREE.Mesh(new THREE.BoxGeometry(.16,2.55,2.35),id==='doorBasement'?M.red:M.wood);panel.position.set(0,1.28,0);panel.castShadow=true;group.add(panel);
 const handle=new THREE.Mesh(new THREE.SphereGeometry(.065,10,8),M.steel);handle.position.set(side<0?.12:-.12,1.05,.72);group.add(handle);
 scene.add(group);
 const collider={minX:x-.2,maxX:x+.2,minZ:z-1.18,maxZ:z+1.18,mesh:group};colliderList.push(collider);
 const d={id,title,condition,group,panel,collider,opened:false,progress:0,side,z,openTarget:0};
 doors[id]=d;interactables.push({id,title,pos:new THREE.Vector3(x,1.25,z),door:d});
 return d;
}
function room(cx,cz,side,title,doorId){
 const centerX=cx;
 floor(title+'_floor',cx,cz,10,10,M.wet);
 addBox(title+'_ceiling',[cx,3.1,cz],[10,.18,10],M.concrete,false);
 const farX=cx+side*5;
 wall(title+'_outer',farX,cz,.25,10,M.wall);
 wall(title+'_front',cx,cz-5,10,.25,M.wall);
 wall(title+'_back',cx,cz+5,10,.25,M.wall);
 label(title,[cx,2.55,cz-4.82],side>0?Math.PI:0,.65);
 createDoor(doorId,side,cz,title,doorId);
 light(title+'_practical',[cx,2.6,cz],0x9ab8ad,7.5,9);
 addBox(title+'_lampHousing',[cx,2.91,cz],[1.6,.07,.38],M.steel,false);
 addBox(title+'_lampDiffuser',[cx,2.86,cz],[1.43,.035,.27],M.lamp,false);
}
function bed(x,z,turn=0){
 const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=turn;scene.add(g);
 function b(n,p,s,m){const o=new THREE.Mesh(new THREE.BoxGeometry(...s),m);o.name=n;o.position.set(...p);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 b('bedframe',[0,.46,0],[2.15,.13,.92],M.steel);
 b('mattress',[0,.65,0],[2.03,.2,.84],M.linen);
 b('pillow',[-.72,.79,0],[.42,.1,.66],M.paper);
 b('headboard',[-1.07,.91,0],[.12,.88,.98],M.wood);
 for(const sx of [-.92,.92])for(const sz of [-.36,.36]){
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.37,10),M.steel);leg.position.set(sx,.22,sz);g.add(leg);
  const wheel=new THREE.Mesh(new THREE.SphereGeometry(.085,10,8),M.dark);wheel.position.set(sx,.07,sz);wheel.scale.set(1,.55,1);g.add(wheel);
 }
 for(const z1 of [-.42,.42]){const rail=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.1,8),M.steel);rail.rotation.z=Math.PI/2;rail.position.set(.1,.93,z1);g.add(rail);}
 return g;
}
function trolley(x,z){
 addBox('medical trolley body',[x,.65,z],[.9,.85,.55],M.steel,true);
 addBox('medical trolley top',[x,1.12,z],[1.02,.08,.64],M.paper,false);
 for(let i=0;i<3;i++)addBox('trolley drawer',[x,.42+i*.21,z-.29],[.7,.11,.025],M.blue,false);
 for(const dx of [-.34,.34])for(const dz of [-.18,.18])addCylinder('trolley caster',[x+dx,.16,z+dz],.08,.08,.09,M.dark,[Math.PI/2,0,0]);
}
function ivStand(x,z){
 addCylinder('IV pole',[x,1.35,z],.025,.025,2.35,M.steel);
 addCylinder('IV base',[x,.09,z],.04,.06,.16,M.steel);
 for(const dx of [-.22,.22]){const arm=addCylinder('IV hook',[x+dx,2.55,z],.018,.018,.48,M.steel,[0,0,Math.PI/2]);}
 const bag=new THREE.Mesh(new THREE.BoxGeometry(.2,.34,.1),new THREE.MeshStandardMaterial({color:0xb5c7bb,transparent:true,opacity:.65,roughness:.18}));bag.position.set(x,2.12,z);scene.add(bag);
}
function monitor(x,z){
 addBox('patient monitor housing',[x,1.38,z],[.48,.56,.24],M.dark,false);
 addBox('monitor screen',[x,1.43,z-.13],[.39,.37,.025],M.screen,false);
 addBox('monitor foot',[x,1.05,z],[.12,.17,.12],M.steel,false);
 const canvas2=document.createElement('canvas');canvas2.width=256;canvas2.height=128;const ctx=canvas2.getContext('2d');ctx.fillStyle='#081b17';ctx.fillRect(0,0,256,128);ctx.strokeStyle='#61c39d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,75);ctx.lineTo(40,75);ctx.lineTo(56,35);ctx.lineTo(74,99);ctx.lineTo(93,64);ctx.lineTo(125,64);ctx.lineTo(140,42);ctx.lineTo(159,82);ctx.lineTo(181,72);ctx.lineTo(256,72);ctx.stroke();const tex=new THREE.CanvasTexture(canvas2);tex.colorSpace=THREE.SRGBColorSpace;
 const overlay=new THREE.Mesh(new THREE.PlaneGeometry(.36,.18),new THREE.MeshBasicMaterial({map:tex}));overlay.position.set(x,1.43,z-.146);scene.add(overlay);
}
function cabinet(x,z){
 addBox('medical cabinet',[x,1.1,z],[.85,2.2,.55],M.paint,true);
 addBox('cabinet inset',[x,1.15,z-.285],[.72,1.82,.035],M.blue,false);
 for(const y of [.55,1.15,1.75])addBox('cabinet shelf',[x,y,z-.32],[.68,.025,.04],M.steel,false);
}
function desk(x,z){
 addBox('office desk',[x,.85,z],[2.2,.16,1.05],M.wood,true);
 for(const dx of [-.9,.9])addBox('desk leg',[x+dx,.42,z],[.12,.82,.85],M.wood,false);
 addBox('CRT monitor case',[x,1.32,z-.32],[.72,.62,.25],M.dark,false);
 addBox('CRT screen',[x,1.34,z-.46],[.58,.42,.025],M.screen,false);
 addBox('keyboard',[x,1.0,z-.66],[.55,.035,.2],M.steel,false);
}
function shelf(x,z){
 addBox('archive shelf frame',[x,1.25,z],[3.5,.12,.55],M.steel,false);
 for(let y of [.5,1.05,1.6,2.15])addBox('archive shelf tier',[x,y,z],[3.5,.06,.58],M.wood,false);
 for(let row=0;row<4;row++)for(let col=0;col<6;col++)addBox('file box',[x-1.45+col*.58,.72+row*.43,z-.08],[.42,.31,.38],(row+col)%3?M.paper:M.red,false);
}
function generator(x,z){
 addBox('generator base',[x,.55,z],[2.5,1.05,1.5],M.steel,true);
 addBox('generator casing',[x,1.25,z],[2.35,.42,1.4],M.blue,false);
 addBox('generator display case',[x,1.35,z-.73],[.72,.43,.08],M.dark,false);
 addBox('generator display',[x,1.36,z-.78],[.55,.29,.02],M.screen,false);
 for(let i=0;i<5;i++)addBox('generator vent',[x-.82+i*.18,1.25,z-.765],[.07,.3,.018],M.dark,false);
 addCylinder('generator exhaust',[x+.85,1.72,z+.3],.13,.16,.62,M.steel);
}
function makePaper(pos,text,angle=0){
 const c=document.createElement('canvas');c.width=512;c.height=360;const g=c.getContext('2d');g.fillStyle='#cfc8b2';g.fillRect(0,0,512,360);g.fillStyle='#252a27';g.font='bold 29px Georgia';g.fillText('SANTA AURELIA',28,48);g.fillStyle='#555b53';g.font='20px Georgia';g.fillText('ARCHIVO · 2006',28,83);g.strokeStyle='#8f8a7b';g.beginPath();g.moveTo(28,105);g.lineTo(480,105);g.stroke();g.font='18px Georgia';const lines=text.split('|');let y=150;for(const line of lines){g.fillText(line.slice(0,43),28,y);y+=35;}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(.46,.32),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(...pos);m.rotation.x=-Math.PI/2;m.rotation.z=angle;scene.add(m);return m;
}
function makeWallPicture(pos,lines){
 const c=document.createElement('canvas');c.width=512;c.height=512;const g=c.getContext('2d');g.fillStyle='#d8d0b9';g.fillRect(0,0,512,512);g.strokeStyle='#443c32';g.lineWidth=20;g.strokeRect(14,14,484,484);g.fillStyle='#454a48';g.font='bold 25px Georgia';g.textAlign='center';g.fillText('SANTA AURELIA',256,68);g.font='21px Georgia';let y=140;for(const l of lines){g.fillText(l,256,y);y+=46;}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.8,.9),new THREE.MeshStandardMaterial({map:t,roughness:.85,side:THREE.DoubleSide}));mesh.position.set(...pos);mesh.rotation.y=-Math.PI/2;scene.add(mesh);return mesh;
}
function makeInteractable(id,title,pos){interactables.push({id,title,pos:new THREE.Vector3(pos[0],pos[1],pos[2])});}
function buildRoomProps(){
 // Reception: first visit, desk, contract, keys and circuit board.
 desk(-11,23.5);addBox('reception counter',[-13,.68,20.6],[4.4,1.35,.65],M.wood,true);addBox('reception computer',[-13,1.55,20.3],[.5,.42,.34],M.dark,false);cabinet(-15.5,26);
 makePaper([-11,1.01,23.25],'CONTRATO DE SERVICIOS|ÁLEX RIVAS|TURNO NOCTURNO 23:00–06:00',0);
 addCylinder('key ring',[-14,1.02,22.5],.11,.11,.025,M.yellow,[Math.PI/2,0,0]);addBox('ceramic fuse',[-9.3,1.02,20.5],[.28,.12,.12],M.paper,false);makePaper([-15,1.01,19.5],'PROTOCOLO DE REARME|SECUENCIA 1 - 3 - 2',-.15);
 addBox('electrical panel casing',[-6.1,1.55,22],[.16,1.35,1.3],M.steel,false);addBox('electrical panel door',[-6.0,1.55,22],[.06,1.18,1.12],M.blue,false);
 for(let i=0;i<3;i++)addCylinder('phase button',[-5.94,1.8-i*.25,21.67],.075,.075,.045,[M.red,M.yellow,M.green][i],[Math.PI/2,0,0]);
 makeInteractable('contract','Leer el contrato',[-11,1.04,23.2]);makeInteractable('key','Recoger llavero',[-14,1.05,22.5]);makeInteractable('fuse','Recoger fusible',[-9.3,1.05,20.5]);makeInteractable('protocol','Leer protocolo',[-15,1.05,19.5]);makeInteractable('panel','Examinar cuadro eléctrico',[-5.6,1.5,22]);
 // Ward: patients and notes.
 bed(11,11.1);trolley(14,8.3);ivStand(12.7,11.3);monitor(10.1,10.5);cabinet(15.3,13.2);
 makePaper([11,1.02,8.4],'REGISTRO DE ENFERMERÍA|PACIENTE: ALMA S. · 8 AÑOS',.1);makeInteractable('record','Leer registro de enfermería',[11,1.05,8.4]);
 makeInteractable('batteries','Recoger pilas de repuesto',[14.8,1.05,9.5]);addCylinder('spare batteries',[14.8,1.05,9.5],.09,.09,.2,M.steel,[Math.PI/2,0,0]);
 // Pediatrics / room 317.
 bed(11,-10.6);bed(14,-13.6);ivStand(15,-9.8);monitor(9.8,-10.8);cabinet(15.6,-7.4);
 addBox('toy chest',[10,.38,-7.4],[1.1,.75,.7],M.wood,false);addSphere('teddy head',[10,.95,-7.4],[.23,.22,.2],M.wood);addSphere('teddy body',[10,.64,-7.4],[.28,.32,.21],M.wood);
 makeWallPicture([15.7,1.7,-10],['PAPÁ','MAMÁ','ALMA','03:17']);makePaper([12,1.02,-10.1],'DIBUJO INFANTIL|MAMÁ, VEN A BUSCARME',0);makePaper([14,1.02,-13.5],'FOTOGRAFÍA FAMILIAR|RESULTADO DE ADN · 2006',.2);
 makeInteractable('drawing','Examinar dibujo infantil',[12,1.04,-10.1]);makeInteractable('photo','Examinar fotografía',[14,1.04,-13.5]);
 // Archives.
 for(const z of [-13.5,-10,-6.5])shelf(-12.8,z);
 addBox('archive table',[-10.4,.85,-8.2],[1.8,.15,.9],M.wood,true);makePaper([-10.4,1.02,-8.2],'EXPEDIENTE 14/09/2006|INFORME INTERNO · CONFIDENCIAL',0);makeInteractable('archiveDoc','Abrir expediente 14/09/2006',[-10.4,1.04,-8.2]);
 // Morgue.
 addBox('autopsy table',[11,.88,-30],[2.5,.18,1.15],M.steel,true);addBox('morgue slab',[11,1.0,-30],[2.25,.08,1.02],M.linen,false);for(const x of [9.9,12.1])addCylinder('morgue leg',[x,.42,-30],.045,.045,.8,M.steel);
 cabinet(14.8,-33);trolley(15,-27);makePaper([11,1.08,-30],'REGISTRO DE CÁMARAS|03:17 · SALA 317',0);makeInteractable('securityTape','Recoger cinta de vigilancia',[11,1.1,-30]);makePaper([14.5,1.04,-30],'RELOJ DETENIDO|03:17 · CÓDIGO DE ACCESO',0);makeInteractable('clockNote','Leer nota del reloj',[14.5,1.07,-30]);
 // Basement maintenance.
 generator(-11,-30);addBox('breaker cabinet',[-15,1.25,-33],[.8,2.5,.5],M.steel,true);for(let i=0;i<4;i++)addCylinder('cable conduit',[-15+i*.12,2.6,-31],.035,.035,4.3,M.yellow,[Math.PI/2,0,0]);
 trolley(-9.2,-34);makePaper([-11,1.85,-30],'GENERADOR DE EMERGENCIA|RESTABLECER SISTEMA',0);makeInteractable('generator','Poner en marcha el generador',[-11,1.82,-30]);
 // Director's office.
 desk(-11,-44);addBox('director filing cabinet',[-15,1.15,-46],[.9,2.3,.55],M.steel,true);addBox('corridor locker',[-4.7,1.1,0],[.75,2.2,.7],M.blue,true);makePaper([-11,1.02,-44],'DANIEL SALVATIERRA|EXPEDIENTE ORIGINAL · 2006',0);makeInteractable('directorFile','Examinar expediente original',[-11,1.05,-44]);
 makeInteractable('hideSpot','Esconderse en armario',[-4.7,1.1,0]);
}
function createAlma(){
 const g=new THREE.Group();g.name='ALMA_GHOST';
 const gown=new THREE.Mesh(new THREE.CylinderGeometry(.16,.34,.85,18,2),M.ghost);gown.position.y=.75;g.add(gown);
 const upper=addPart(g,new THREE.SphereGeometry(.23,18,14),[0,1.38,0],[1,.94,.9],M.ghost);
 const hair=addPart(g,new THREE.SphereGeometry(.245,18,14),[0,1.55,.015],[1,.9,1.04],M.ghostHair);
 for(const side of [-1,1]){
  addLimb(g,[side*.12,1.15,0],[side*.24,.68,.02],.065,M.ghost);
  addLimb(g,[side*.105,.42,0],[side*.12,.12,.025],.07,M.ghost);
  addPart(g,new THREE.SphereGeometry(.043,10,8),[side*.085,1.41,-.2],[1,1,1],M.dark);
  addPart(g,new THREE.SphereGeometry(.035,10,8),[side*.12,.07,-.01],[1,.6,1],M.skin);
 }
 addPart(g,new THREE.SphereGeometry(.045,10,8),[0,1.3,-.206],[.7,1,1],M.skin);
 const glow=new THREE.PointLight(0x9ac2b5,.7,3);glow.position.set(0,1.1,.3);g.add(glow);
 g.position.set(1,0,-15);g.visible=false;scene.add(g);return g;
}
function addPart(parent,geometry,pos,scale,material){
 const m=new THREE.Mesh(geometry,material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function addLimb(parent,a,b,r,material){
 const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),dir=vb.clone().sub(va),len=dir.length();
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r*.78,r,len,10),material);mesh.position.copy(va.clone().add(vb).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());mesh.castShadow=true;parent.add(mesh);
 addPart(parent,new THREE.SphereGeometry(r,10,8),a,[1,1,1],material);addPart(parent,new THREE.SphereGeometry(r,10,8),b,[1,1,1],material);
}
function createPorter(){
 const g=new THREE.Group();g.name='NIGHT_PORTER';
 addPart(g,new THREE.CylinderGeometry(.24,.34,.82,14),[0,1.12,0],[1,1,1],M.uniform);
 addPart(g,new THREE.SphereGeometry(.22,16,12),[0,1.78,0],[1,1.08,.92],M.skin);
 addPart(g,new THREE.SphereGeometry(.23,16,12),[0,1.93,.04],[1,.53,1],M.hair);
 for(const s of [-1,1]){
  addLimb(g,[s*.22,1.42,0],[s*.35,.83,-.02],.075,M.uniform);
  addLimb(g,[s*.12,.73,0],[s*.13,.12,0],.09,M.dark);
  addPart(g,new THREE.SphereGeometry(.038,10,8),[s*.083,1.8,-.193],[1,1,1],M.dark);
 }
 const badge=new THREE.Mesh(new THREE.BoxGeometry(.19,.24,.025),M.paper);badge.position.set(.11,1.28,-.245);g.add(badge);
 const glow=new THREE.PointLight(0x263c3c,.25,2);glow.position.set(0,1,0);g.add(glow);
 g.position.set(0,0,-36);g.visible=false;scene.add(g);return g;
}
function addLampRow(z){
 const fixture=addBox('fluorescent fixture',[0,2.92,z],[2.1,.07,.42],M.steel,false);
 const diffuser=addBox('fluorescent diffuser',[0,2.87,z],[1.9,.035,.31],M.lamp,false);
 const l=light('fluorescent '+z,[0,2.55,z],0xb4c9c0,9,14);l.userData.diffuser=diffuser;return l;
}
function buildWorld(){
 floor('main corridor',0,-8,12,88,M.wet);
 addBox('corridor ceiling',[0,3.15,-8],[12,.2,88],M.concrete,false);
 // Side walls are broken at door positions.
 const openings=[22,10,-10,-30,-44];
 for(const side of [-1,1]){
  let cursor=-52;
  for(const z of openings){
   const before=z-1.25;
   if(before>cursor)wall('corridor wall',side*6,(cursor+before)/2,.25,before-cursor,M.wall);
   cursor=z+1.25;
  }
  if(cursor<36)wall('corridor wall',side*6,(cursor+36)/2,.25,36-cursor,M.wall);
 }
 wall('corridor north cap',0,36,12,.25,M.wall);wall('corridor south cap',0,-52,12,.25,M.wall);
 room(-11,22,-1,'RECEPCIÓN','doorReception');room(11,10,1,'ENFERMERÍA','doorWard');room(11,-10,1,'PEDIATRÍA 317','door317');room(-11,-10,-1,'ARCHIVO MÉDICO','doorArchive');room(11,-30,1,'MORGUE','doorMorgue');room(-11,-30,-1,'SÓTANO TÉCNICO','doorBasement');room(-11,-44,-1,'DIRECCIÓN','doorDirector');
 for(let z of [29,17,5,-7,-19,-31,-43])addLampRow(z);
 for(const z of [24,12,0,-12,-24,-36,-48]){
  addCylinder('steam pipe left',[-5.4,2.65,z],.06,.06,11,M.steel,[Math.PI/2,0,0]);
  addCylinder('steam pipe right',[5.4,2.65,z],.045,.045,11,M.rust,[Math.PI/2,0,0]);
  if(z<0){addBox('water stain',[5.85,1.3,z],[.08,1.2,2.2],M.rust,false);}
 }
 buildRoomProps();
 for(const [z,idx] of [[14,0],[2,1],[-22,2],[-42,3]]){
  addBox('emergency light housing',[-5.77,2.55,z],[.08,.42,.85],M.dark,false);
  addBox('emergency light red',[-5.72,2.55,z],[.035,.32,.72],M.emergency,false);
  light('emergency spill '+idx,[-5.2,2.15,z],0xb52d24,1.5,5);
 }
 makeWallPicture([5.85,1.8,1],['PLANTA NORTE','ACCESO RESTRINGIDO']);
 createAlma();enemy=createPorter();
 // Doors start closed. Reception door is permanently open for the start area.
 doors.doorReception.opened=true;doors.doorReception.progress=1;doors.doorReception.openTarget=1;
 colliderList.splice(colliderList.indexOf(doors.doorReception.collider),1);
 doors.doorReception.group.position.z+=2.35;
 makeInteractable('alma','Hablar con Alma',[1,1.1,-15]);
}
function distance2(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
function isBlocked(x,z,r=.34){
 for(const c of colliderList){if(x>c.minX-r&&x<c.maxX+r&&z>c.minZ-r&&z<c.maxZ+r)return true;}
 return Math.abs(x)>18.4||z>34.5||z< -50.5;
}
function nearestInteractable(){
 const p=new THREE.Vector3(player.x,player.height,player.z);const forward=new THREE.Vector3(Math.sin(player.yaw),0,-Math.cos(player.yaw));
 let best=3.05,found=null;
 for(const o of interactables){
  if(o.id==='alma'&&!state.drawing)continue;
  if(o.id==='alma'&&(!alma||!alma.visible))continue;
  if(o.door&&o.door.opened)continue;
  const dx=o.pos.x-p.x,dz=o.pos.z-p.z,d=Math.hypot(dx,dz);
  if(d>best||d<.01)continue;
  const dot=(dx*forward.x+dz*forward.z)/d;
  if(dot<-.05)continue;
  best=d;found=o;
 }
 return found;
}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');toastTimer=3.1;}
function subtitle(msg){$('subtitle').textContent=msg;$('subtitle').classList.remove('hidden');subtitleTimer=4.8;}
function chapter(n,title,sub){
 state.chapter=n;$('chapterTitle').textContent=title;$('chapterSub').textContent=sub;$('chapterCard').classList.remove('hidden');chapterTimer=4.2;updateObjective();
 player.checkpoint={x:player.x,z:player.z,yaw:player.yaw};state.checkpoint={...player.checkpoint};
}
function updateObjective(){
 let t='';
 if(state.chapter===1)t=state.key?'Encuentra el fusible y el protocolo.':'Lee el contrato y recoge el llavero.';
 else if(state.chapter===2)t=state.record?'Ve a pediatría y busca la habitación 317.':'Restablece la corriente y lee el registro.';
 else if(state.chapter===3)t=state.drawing&&state.photo?'Investiga los archivos médicos.':'Encuentra el dibujo y la fotografía en pediatría.';
 else if(state.chapter===4)t=state.incident?'Investiga la morgue y el sótano técnico.':'Abre el archivo y lee el expediente de 2006.';
 else if(state.chapter===5)t=state.generator&&state.clockCode?'Ve al despacho del director.':'Recupera la cinta, descubre el código y activa el generador.';
 else t=state.directorEvidence?'Decide qué hacer con la verdad.':'Entra en dirección y examina el expediente original.';
 $('objective').textContent=t;
}
function addEvidence(name,desc){
 if(state.items.some(x=>x.name===name))return;
 state.items.push({name,desc});renderInventory();
}
function openPanel(id){modal=id;$(id).classList.remove('hidden');document.exitPointerLock?.();}
function closePanel(id){$(id).classList.add('hidden');modal='';}
function openDocument(title,body){$('docTitle').textContent=title;$('docBody').textContent=body;openPanel('documentPanel');}
function renderInventory(){
 const list=$('inventoryList');list.innerHTML='';
 if(!state.items.length){list.innerHTML='<p class="muted">Todavía no has encontrado pruebas.</p>';return;}
 for(const it of state.items){const el=document.createElement('article');el.className='evidence';const b=document.createElement('b');b.textContent=it.name;const p=document.createElement('p');p.textContent=it.desc;el.append(b,p);list.append(el);}
}
function saveGame(){
 try{
  const payload={version:2,state,player:{x:player.x,z:player.z,yaw:player.yaw,pitch:player.pitch},flashBattery,gameMinutes,enemy:{x:enemy.position.x,z:enemy.position.z,visible:enemy.visible}};
  localStorage.setItem(SAVE_KEY,JSON.stringify(payload));toast('Partida guardada en este navegador.');$('continueButton').disabled=false;return true;
 }catch(e){toast('No se pudo guardar: '+e.message);return false;}
}
function loadGame(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;const s=JSON.parse(raw);if(!s||s.version!==2)return false;
  state=Object.assign(makeState(),s.state||{});Object.assign(player,s.player||{});flashBattery=Number(s.flashBattery??100);gameMinutes=Number(s.gameMinutes||0);
  if(s.enemy){enemy.position.set(s.enemy.x||0,0,s.enemy.z||-36);enemy.visible=!!s.enemy.visible;}
  syncWorldState();return true;
 }catch(e){toast('La partida guardada no se puede leer.');return false;}
}
function syncWorldState(){
 openDoorInstant('doorReception');
 if(state.power)openDoorInstant('doorWard');
 if(state.ward)doors.doorWard.opened=true;
 if(state.room317)openDoorInstant('door317');
 if(state.archive)openDoorInstant('doorArchive');
 if(state.morgue)openDoorInstant('doorMorgue');
 if(state.basement)openDoorInstant('doorBasement');
 if(state.directorCode)openDoorInstant('doorDirector');
 if(alma)alma.visible=state.drawing;
 if(enemy)enemy.visible=state.incident;
 updateObjective();updateHUD();
}
function openDoorInstant(id){
 const d=doors[id];if(!d||d.opened)return;d.opened=true;d.progress=1;d.openTarget=1;d.group.position.z+=2.35;const i=colliderList.indexOf(d.collider);if(i>=0)colliderList.splice(i,1);
}
function animateDoor(d,open){
 if(open&&d.opened)return;d.openTarget=open?1:0;d.opened=open;
 if(open){const i=colliderList.indexOf(d.collider);if(i>=0)colliderList.splice(i,1);}
}
function handleDoor(id){
 const d=doors[id];if(!d)return;
 if(id==='doorDirector'){
  if(!state.generator||!state.clockCode){toast('Necesitas activar el generador y descubrir el código 0317.');return;}
  $('codeInput').value='';$('codeFeedback').textContent='Introduce el código de cuatro cifras.';openPanel('codePanel');return;
 }
 let ok=false;
 if(id==='doorWard')ok=state.power;
 if(id==='door317')ok=state.key&&state.record;
 if(id==='doorArchive')ok=state.photo&&state.drawing;
 if(id==='doorMorgue'||id==='doorBasement')ok=state.incident;
 if(!ok){const msg={doorWard:'La cerradura magnética no tiene corriente.',door317:'Necesitas el llavero y el registro de enfermería.',doorArchive:'La fotografía y el dibujo revelan el acceso al archivo.',doorMorgue:'Primero debes encontrar el expediente de 2006.',doorBasement:'La puerta está sellada hasta encontrar el expediente.'};toast(msg[id]||'La puerta está cerrada.');return;}
 animateDoor(d,true);soundDoor();
 if(id==='doorWard'){state.ward=true;chapter(2,'LA PLANTA CERRADA','EL REGISTRO DE ENFERMERÍA');subtitle('ALTAVOZ: Personal autorizado, planta norte.');}
 if(id==='door317'){state.room317=true;toast('La habitación 317 se abre.');}
 if(id==='doorArchive'){state.archive=true;toast('El archivo médico está abierto.');}
 if(id==='doorMorgue'){state.morgue=true;toast('La morgue huele a desinfectante viejo.');}
 if(id==='doorBasement'){state.basement=true;toast('La puerta del sótano se abre con un golpe seco.');}
}
function interact(o){
 if(!o)return;
 switch(o.id){
 case'contract':
  openDocument('CONTRATO DE SERVICIOS NOCTURNOS','HOSPITAL SANTA AURELIA\\n\\nContratista: Álex Rivas\\nHorario: 23:00–06:00\\nRemuneración: 50 € por hora.\\n\\nTareas: revisar incidencias, comprobar puertas y restablecer suministros.\\n\\nNota manuscrita: «Si el reloj se detiene a las 03:17, no contestes al teléfono».');
  if(!state.flags.includes('contract')){state.flags.push('contract');addEvidence('Contrato nocturno','Álex Rivas · turno 23:00–06:00 · 50 €/hora.');}break;
 case'key':
  if(state.key){toast('Ya tienes el llavero.');break;}state.key=true;addEvidence('Llavero de mantenimiento','Llaves de servicio y acceso a zonas restringidas.');toast('Has recogido el llavero.');break;
 case'fuse':
  if(!state.key){toast('Primero recoge el llavero de mantenimiento.');break;}if(state.fuse){toast('Ya has recogido el fusible.');break;}state.fuse=true;addEvidence('Fusible cerámico','Repuesto de 16 amperios para el cuadro B.');toast('Fusible recogido.');break;
 case'protocol':
  state.protocol=true;addEvidence('Protocolo de rearme','Cuadro B: activar las fases en orden 1 → 3 → 2.');openDocument('PROTOCOLO DE REARME','CUADRO B — MANTENIMIENTO\\n\\nSustituir el fusible cerámico. Activar fases en orden: 1 → 3 → 2.\\n\\nFirma: D. Salvatierra · 2006.');break;
 case'panel':
  if(!state.fuse||!state.protocol){toast('Necesitas el fusible y el protocolo.');break;}phaseInput=[];$('phaseFeedback').textContent='Introduce 1 → 3 → 2.';openPanel('puzzlePanel');break;
 case'doorWard':case'door317':case'doorArchive':case'doorMorgue':case'doorBasement':case'doorDirector':handleDoor(o.id);break;
 case'record':
  if(!state.ward){toast('La puerta de enfermería sigue cerrada.');break;}state.record=true;addEvidence('Registro de enfermería','Alma S. · ocho años · ingreso 14/09/2006.');openDocument('REGISTRO DE ENFERMERÍA · 2006','PACIENTE: ALMA S. · 8 AÑOS\\n\\nIngreso: 21:40. Tutor legal: Daniel S.\\n\\nLa menor solicita que no se avise a su padre.\\n\\nNota: «La niña repite que el doctor no es su padre».');chapter(3,'HABITACIÓN 317','LA NIÑA DEL DIBUJO');enemy.visible=true;subtitle('Una puerta golpea al fondo del pasillo.');break;
 case'drawing':
  if(!state.room317){toast('La puerta 317 sigue cerrada.');break;}state.drawing=true;if(alma)alma.visible=true;state.secretClues++;addEvidence('Dibujo infantil','Tres figuras frente a una ventana. «Mamá, ven a buscarme».');openDocument('DIBUJO INFANTIL','Una casa. Tres figuras frente a una ventana.\\n\\n«PAPÁ DICE QUE A LAS 03:17 TODO SE ACABA».\\n\\nEn el margen: «Mamá, ven a buscarme».');subtitle('ALMA, muy cerca: No le digas que estoy aquí…');break;
 case'photo':
  if(!state.drawing){toast('Examina primero el dibujo infantil.');break;}state.photo=true;state.secretClues++;addEvidence('Fotografía familiar','Daniel, Lucía y Alma. En el reverso aparece una fecha de análisis genético.');openDocument('FOTOGRAFÍA FAMILIAR','Daniel y Lucía junto a Alma.\\n\\nEn el reverso: «Prueba de ADN recibida. Daniel aún no lo sabe».');break;
 case'alma':
  if(!state.drawing){toast('La figura se desvanece.');break;}state.almaMet=true;state.secretClues++;addEvidence('Recuerdo de Alma','«El celador no quiere que encuentres la cinta. Busca las luces rojas».');subtitle('ALMA: Él cerró la puerta. La llave no estaba con él…');toast('Alma te ha dejado una pista.');break;
 case'archiveDoc':
  if(!state.archive){toast('El archivo médico está cerrado.');break;}state.incident=true;addEvidence('Expediente 14/09/2006','Daniel entró en la habitación 317 a las 03:12. La muerte se registró a las 03:17.');openDocument('EXPEDIENTE 14/09/2006','El doctor Daniel Salvatierra accedió a la habitación 317 a las 03:12. La paciente falleció a las 03:17.\\n\\nLa investigación interna fue cerrada por orden de dirección.\\n\\nNota: «No registrar la discusión sobre el resultado de ADN».');chapter(5,'LOS SÓTANOS','LA CINTA QUE FALTA');enemy.visible=true;subtitle('CELADOR: No deberías haber abierto ese archivo.');break;
 case'securityTape':
  if(!state.morgue){toast('La morgue todavía no está abierta.');break;}state.securityTape=true;addEvidence('Cinta de vigilancia','Una cámara muestra a Daniel entrando en la habitación 317.');openDocument('REGISTRO DE SEGURIDAD · 03:17','03:12 — Daniel entra en la habitación 317.\\n03:16 — La señal pierde imagen.\\n03:17 — Tres pitidos. La cámara se apaga.\\n03:19 — Un celador recoge una llave que no figura en el inventario.');break;
 case'clockNote':
  if(!state.morgue){toast('La morgue todavía no está abierta.');break;}state.clockCode=true;addEvidence('Nota del reloj','La hora detenida en el reloj: 03:17.');openDocument('RELOJ DE LA MORGUE','El reloj está detenido a las 03:17.\\n\\nEn la parte posterior alguien escribió: «La última puerta abre con la hora».\\n\\nCódigo: 0317.');toast('Has descubierto el código 0317.');break;
 case'generator':
  if(!state.basement){toast('La sala técnica está cerrada.');break;}if(state.generator){toast('El generador ya está funcionando.');break;}state.generator=true;addEvidence('Registro del generador','La energía del ala norte se restauró a las 03:17.');openDocument('GENERADOR DE EMERGENCIA','El interruptor se resiste. Al activarlo, el edificio entero vibra.\\n\\nEn el panel: 03:17.\\n\\nUna grabación automática reproduce una voz infantil: «Papá, tengo miedo».');chapter(6,'LA ÚLTIMA NOCHE','EL DESPACHO DEL DIRECTOR');subtitle('CELADOR: Ahora ya sabes lo que pasó.');enemy.visible=true;break;
 case'directorFile':
  if(!state.directorCode){toast('La puerta de dirección está cerrada.');break;}state.directorEvidence=true;addEvidence('Expediente original','La dirección ordenó cerrar la investigación y alterar el registro.');openDocument('EXPEDIENTE ORIGINAL · DANIEL SALVATIERRA','La prueba genética fue recibida el 14/09/2006.\\n\\nDaniel descubrió que no era el padre biológico de Alma.\\n\\nLa discusión en la habitación 317 fue ocultada por la dirección. El celador recibió instrucciones para retirar la cinta.\\n\\nA las 03:17, Alma dejó de responder.');break;
 case'batteries':
  flashBattery=Math.min(100,flashBattery+45);toast('Pilas recogidas. Linterna al '+Math.round(flashBattery)+'%.');break;
 case'hideSpot':
  hidden=!hidden;toast(hidden?'Te ocultas dentro del armario.':'Sales del escondite.');if(hidden)subtitle('Contén la respiración.');break;
 }
 updateObjective();updateHUD();
}
function solvePhase(n){
 phaseInput.push(n);$('phaseFeedback').textContent='FASES: '+phaseInput.join(' → ');
 if(phaseInput.length===3){
  if(phaseInput.join('')==='132'){
   state.power=true;closePanel('puzzlePanel');toast('La corriente vuelve. Algo golpea al fondo.');subtitle('ALTAVOZ: Álex…');chapter(2,'LA PLANTA CERRADA','EL REGISTRO DE ENFERMERÍA');animateDoor(doors.doorWard,true);state.ward=true;
  }else{phaseInput=[];$('phaseFeedback').textContent='Secuencia incorrecta. Vuelve a intentarlo.';soundError();}
 }
 updateObjective();
}
function enterDirectorCode(){
 const value=$('codeInput').value.trim();
 if(value==='0317'&&state.clockCode&&state.generator){
  state.directorCode=true;closePanel('codePanel');animateDoor(doors.doorDirector,true);toast('Código aceptado. La puerta de dirección se abre.');soundDoor();
 }else{$('codeFeedback').textContent='Código incorrecto. Comprueba la nota del reloj.';soundError();}
}
function completeEnding(kind){
 state.ending=kind;saveGame();closePanel('endingPanel');paused=true;
 const title=kind==='truth'?'LA VERDAD':kind==='silence'?'EL SILENCIO':'EL NUEVO TURNO';
 const text=kind==='truth'?'Has entregado las pruebas. La investigación se reabre. A las 06:00, el hospital deja de ocultar lo sucedido.':kind==='silence'?'Has guardado silencio. El hospital sigue abierto. A las 03:17, el teléfono vuelve a sonar.':'Aceptas el siguiente turno. En la hoja de servicios aparece tu nombre: Álex Rivas.';
 $('finalTitle').textContent=title;$('finalText').textContent=text;$('finalScreen').classList.remove('hidden');document.exitPointerLock?.();
 if(kind==='truth'&&state.almaMet&&state.secretClues>=3){$('secretEnding').classList.remove('hidden');$('secretEnding').textContent='Has desbloqueado el recuerdo completo de Alma.';}else $('secretEnding').classList.add('hidden');
}
function startAudio(){
 try{
  if(audioCtx){audioCtx.resume();return;}
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();audioMaster=audioCtx.createGain();audioMaster.gain.value=volume*.35;audioMaster.connect(audioCtx.destination);
  droneOsc=audioCtx.createOscillator();droneOsc.type='sawtooth';droneOsc.frequency.value=43;const f=audioCtx.createBiquadFilter();f.type='lowpass';f.frequency.value=105;droneGain=audioCtx.createGain();droneGain.gain.value=.04;droneOsc.connect(f);f.connect(droneGain);droneGain.connect(audioMaster);droneOsc.start();
  const lfo=audioCtx.createOscillator(),lg=audioCtx.createGain();lfo.frequency.value=.12;lg.gain.value=13;lfo.connect(lg);lg.connect(f.frequency);lfo.start();
 }catch(e){}
}
function soundTone(freq,duration,gain=.08,type='sine'){
 if(!audioCtx||!audioMaster)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(gain,audioCtx.currentTime+.025);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioMaster);o.start();o.stop(audioCtx.currentTime+duration+.02);
}
function soundStep(){
 if(!audioCtx||!audioMaster)return;const len=Math.floor(audioCtx.sampleRate*.12),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
 const s=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=170;g.gain.value=sprinting?.22:.11;s.connect(f);f.connect(g);g.connect(audioMaster);s.start();
}
function soundDoor(){soundTone(92,.32,.12,'triangle');setTimeout(()=>soundTone(53,.43,.08,'sawtooth'),90);}
function soundError(){soundTone(140,.18,.05,'square');}
function heartbeat(){soundTone(48,.16,.12);setTimeout(()=>soundTone(39,.2,.09),170);}
function soundWhisper(){soundTone(520,.9,.035,'sine');setTimeout(()=>soundTone(430,.7,.025,'triangle'),260);}
function lockPointer(){if(started&&!paused&&!modal&&canvas.requestPointerLock)canvas.requestPointerLock();}
function startGame(fresh){
 startAudio();if(fresh){
  state=makeState();player={x:-11,z:25.5,yaw:0,pitch:0,height:1.68};flashBattery=100;gameMinutes=0;stamina=100;flashOn=true;hidden=false;clockEvent=false;phaseInput=[];enemy.visible=false;enemy.position.set(0,0,-36);alma.visible=false;
  for(const d of Object.values(doors)){d.opened=false;d.openTarget=0;d.progress=0;d.group.position.z=d.z;const panel=d.group.children[0];panel.material=d.id==='doorBasement'?M.red:M.wood;if(!colliderList.includes(d.collider))colliderList.push(d.collider);}
  openDoorInstant('doorReception');
 }else{if(!loadGame()){toast('No existe una partida válida.');return;}}
 started=true;paused=false;modal='';$('startScreen').classList.add('hidden');$('hud').classList.remove('hidden');$('crosshair').classList.remove('hidden');$('controlHint').classList.remove('hidden');chapter(state.chapter,({1:'EL CONTRATO',2:'LA PLANTA CERRADA',3:'HABITACIÓN 317',4:'LOS ARCHIVOS',5:'EL SÓTANO',6:'LA ÚLTIMA NOCHE'})[state.chapter]||'EL TURNO','HOSPITAL SANTA AURELIA · 2026');subtitle('ÁLEX: Cincuenta euros la hora. ¿Qué podría salir mal?');updateObjective();updateHUD();lockPointer();
}
function updateHUD(){
 const mins=Math.floor((23*60+gameMinutes)%1440),hh=String(Math.floor(mins/60)).padStart(2,'0'),mm=String(mins%60).padStart(2,'0');$('clock').textContent=hh+':'+mm;
 $('batteryValue').textContent=Math.round(flashBattery)+'%';$('batteryBar').style.width=flashBattery+'%';$('staminaBar').style.width=stamina+'%';$('torchState').textContent=flashOn?'ENCENDIDA':'APAGADA';
 $('enemyState').textContent=state.chapter>=5?'PELIGRO ACTIVO':'SEÑAL DESCONOCIDA';
}
function showDeath(){
 paused=true;modal='deathPanel';$('deathPanel').classList.remove('hidden');document.exitPointerLock?.();
}
function retryCheckpoint(){
 const cp=state.checkpoint||{x:-11,z:27,yaw:0};player.x=cp.x;player.z=cp.z;player.yaw=cp.yaw||0;paused=false;modal='';$('deathPanel').classList.add('hidden');hidden=false;enemy.position.set(0,0,-36);flashBattery=Math.max(12,flashBattery);lockPointer();
}
function updateProgress(){
 if(state.chapter===2&&state.record){chapter(3,'HABITACIÓN 317','LA NIÑA DEL DIBUJO');}
 if(state.chapter===3&&state.drawing&&state.photo){chapter(4,'LOS ARCHIVOS','EL INFORME ORIGINAL');}
 if(state.chapter===4&&state.incident){chapter(5,'EL SÓTANO','LA CINTA DE VIGILANCIA');enemy.visible=true;}
 if(state.chapter===5&&state.generator&&state.clockCode){chapter(6,'LA ÚLTIMA NOCHE','EL CÓDIGO 0317');}
}
function updateDoors(dt){
 for(const d of Object.values(doors)){
  if(!d.group)continue;
  const target=d.openTarget,from=d.progress;d.progress+=Math.sign(target-from)*Math.min(Math.abs(target-from),dt*2.8);
  d.group.position.z=d.z+2.4*d.progress;
 }
}
function updatePlayer(dt){
 moving=false;sprinting=keys.has('ShiftLeft')||keys.has('ShiftRight');crouching=keys.has('ControlLeft')||keys.has('ControlRight');
 let speed=crouching?1.35:(sprinting&&stamina>0?4.65:2.65);
 let dx=0,dz=0;const f=new THREE.Vector3(Math.sin(player.yaw),0,-Math.cos(player.yaw)),r=new THREE.Vector3(Math.cos(player.yaw),0,Math.sin(player.yaw));
 if(keys.has('KeyW')||keys.has('ArrowUp')){dx+=f.x;dz+=f.z;}
 if(keys.has('KeyS')||keys.has('ArrowDown')){dx-=f.x;dz-=f.z;}
 if(keys.has('KeyA')||keys.has('ArrowLeft')){dx-=r.x;dz-=r.z;}
 if(keys.has('KeyD')||keys.has('ArrowRight')){dx+=r.x;dz+=r.z;}
 const len=Math.hypot(dx,dz);if(len>0){dx=dx/len*speed*dt;dz=dz/len*speed*dt;moving=true;}
 if(!hidden){if(!isBlocked(player.x+dx,player.z))player.x+=dx;if(!isBlocked(player.x,player.z+dz))player.z+=dz;}
 if(sprinting&&moving&&!crouching)stamina=Math.max(0,stamina-dt*22);else stamina=Math.min(100,stamina+dt*13);
 if(flashOn){flashBattery=Math.max(0,flashBattery-dt*.085);if(flashBattery<=0){flashOn=false;toast('La linterna se ha quedado sin batería.');}}
 camera.position.set(player.x,crouching?1.18:1.68,player.z);camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
 flashlight.visible=flashOn;torchFill.visible=flashOn;
 if(moving&&performance.now()-stepTimer>(sprinting?330:520)){soundStep();stepTimer=performance.now();}
}
function updateEnemy(dt){
 if(!enemy||!enemy.visible)return;
 const d=Math.hypot(enemy.position.x-player.x,enemy.position.z-player.z);
 const alert=d<14||(sprinting&&d<22);
 if(!hidden&&(alert||state.chapter>=5&&d<18)){
  const dx=player.x-enemy.position.x,dz=player.z-enemy.position.z,l=Math.hypot(dx,dz)||1;
  const speed=flashOn&&d<5?1.05:(sprinting?2.05:1.55);
  const nx=enemy.position.x+dx/l*speed*dt,nz=enemy.position.z+dz/l*speed*dt;
  if(!isBlocked(nx,enemy.position.z,.38))enemy.position.x=nx;
  if(!isBlocked(enemy.position.x,nz,.38))enemy.position.z=nz;
  enemy.rotation.y=Math.atan2(dx,dz);
  if(d<1.15&&!hidden)showDeath();
 }else{
  const t=performance.now()*.00025;const tx=Math.sin(t)*1.5, tz=-35+Math.cos(t*.8)*2;
  enemy.position.x+=(tx-enemy.position.x)*dt*.3;enemy.position.z+=(tz-enemy.position.z)*dt*.3;
 }
}
function updateAlma(dt){
 if(!alma||!alma.visible)return;
 const t=performance.now()*.001;
 alma.position.y=.08+Math.sin(t*1.25)*.12;
 alma.rotation.y=Math.atan2(player.x-alma.position.x,player.z-alma.position.z);
 if(state.almaMet){const dx=player.x-alma.position.x,dz=player.z-alma.position.z,d=Math.hypot(dx,dz);if(d>4){alma.position.x+=dx/d*dt*.28;alma.position.z+=dz/d*dt*.28;}}
}
function updateWorld(dt){
 updateDoors(dt);updatePlayer(dt);updateEnemy(dt);updateAlma(dt);
 for(const f of flickerLights){f.phase+=dt*f.rate;let amount=.94+Math.sin(f.phase)*.035;if(state.paranormal&&Math.random()<dt*.7)amount*=.15+Math.random()*.25;f.light.intensity=f.base*amount;}
 gameMinutes+=dt*.72;
 if(!clockEvent&&gameMinutes>=257){clockEvent=true;state.paranormal=true;subtitle('ALMA: Son las 03:17. No contestes al teléfono.');soundWhisper();if(alma)alma.visible=true;scene.fog.density=.03;toast('03:17 · El reloj se ha detenido.');}
 if(enemy.visible&&Math.hypot(enemy.position.x-player.x,enemy.position.z-player.z)<7&&performance.now()-heartbeatTimer>1500){heartbeat();heartbeatTimer=performance.now();}
 updateHUD();updateProgress();
}
function renderPrompt(){
 const o=started&&!paused&&!modal?nearestInteractable():null;
 if(o){$('interactionPrompt').textContent='E  ·  '+(o.title||'Interactuar');$('interactionPrompt').classList.remove('hidden');}
 else $('interactionPrompt').classList.add('hidden');
}
function updateFrame(){
 requestAnimationFrame(updateFrame);
 const dt=Math.min(clock.getDelta(),.045);
 if(started&&!paused&&!modal){updateWorld(dt);}
 renderPrompt();
 renderer.render(scene,camera);
 if(toastTimer>0&&(toastTimer-=dt)<=0)$('toast').classList.add('hidden');
 if(subtitleTimer>0&&(subtitleTimer-=dt)<=0)$('subtitle').classList.add('hidden');
 if(chapterTimer>0&&(chapterTimer-=dt)<=0)$('chapterCard').classList.add('hidden');
}
function onKeyDown(e){
 if(['Tab','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.repeat)return;
 if(e.code==='KeyE'&&started&&!modal)interact(nearestInteractable());
 if(e.code==='KeyF'&&started&&!modal){flashOn=!flashOn&&flashBattery>0;if(flashBattery<=0)toast('No queda batería.');else toast(flashOn?'Linterna encendida.':'Linterna apagada.');}
 if(e.code==='Tab'&&started){if(modal==='inventoryPanel'){closePanel('inventoryPanel');lockPointer();}else{renderInventory();openPanel('inventoryPanel');}}
 if(e.code==='Escape'&&started){if(modal){closePanel(modal);modal='';}else{paused=true;openPanel('pausePanel');}}
 if(e.code==='F5'&&started){saveGame();}
 if(e.code==='F9'&&started){if(loadGame())toast('Partida cargada.');else toast('No hay partida guardada.');}
}
function onKeyUp(e){keys.delete(e.code);}
document.addEventListener('keydown',onKeyDown);document.addEventListener('keyup',onKeyUp);
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&started&&!paused&&!modal&&!hidden){player.yaw-=e.movementX*sensitivity;player.pitch-=e.movementY*sensitivity;player.pitch=Math.max(-.72,Math.min(.72,player.pitch));}});
canvas.addEventListener('click',()=>{if(started&&!paused&&!modal)lockPointer();});
document.addEventListener('pointerlockchange',()=>{$('controlHint').classList.toggle('hidden',!!document.pointerLockElement||!started);});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);});
$('newGameButton').onclick=()=>startGame(true);
$('continueButton').onclick=()=>startGame(false);
$('resumeButton').onclick=()=>{paused=false;closePanel('pausePanel');modal='';lockPointer();};
$('saveButton').onclick=saveGame;
$('loadButton').onclick=()=>{if(loadGame()){paused=false;closePanel('pausePanel');modal='';toast('Partida cargada.');lockPointer();}else toast('No hay partida guardada.');};
$('menuButton').onclick=()=>{paused=true;modal='';document.exitPointerLock?.();$('pausePanel').classList.add('hidden');$('hud').classList.add('hidden');$('crosshair').classList.add('hidden');$('startScreen').classList.remove('hidden');started=false;};
$('retryButton').onclick=retryCheckpoint;
$('docClose').onclick=()=>{closePanel('documentPanel');if(state.directorEvidence){openPanel('endingPanel');}else lockPointer();};
$('inventoryClose').onclick=()=>{closePanel('inventoryPanel');lockPointer();};
$('puzzleCancel').onclick=()=>{closePanel('puzzlePanel');lockPointer();};
$('codeSubmit').onclick=()=>{enterDirectorCode();if(!modal)lockPointer();};
$('codeCancel').onclick=()=>{closePanel('codePanel');lockPointer();};
$('codeInput').addEventListener('keydown',e=>{if(e.key==='Enter')enterDirectorCode();});
document.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>solvePhase(Number(b.dataset.phase))));
document.querySelectorAll('[data-ending]').forEach(b=>b.addEventListener('click',()=>completeEnding(b.dataset.ending)));
$('settingsButton').onclick=()=>openPanel('settingsPanel');
$('settingsClose').onclick=()=>{closePanel('settingsPanel');lockPointer();};
$('volumeControl').oninput=e=>{volume=Number(e.target.value)/100;if(audioMaster)audioMaster.gain.value=volume*.35;};
$('sensitivityControl').oninput=e=>{sensitivity=.0008+Number(e.target.value)/100*0.0035;};
$('fullscreenButton').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();};
$('continueButton').disabled=!localStorage.getItem(SAVE_KEY);
buildWorld();camera.position.set(player.x,player.height,player.z);renderer.render(scene,camera);requestAnimationFrame(updateFrame);
})();