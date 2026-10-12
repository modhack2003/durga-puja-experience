'use client'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { CHAPTER_COUNT } from './chapters'

const planeVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`
const riverPhotoFragment = `
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform float uTime;
  uniform float uFade;
  void main(){
    vec2 uv=vUv;
    // The skyline, boats and people stay still; only the open water shimmers.
    float water=(1.-smoothstep(.59,.65,uv.y))*(1.-smoothstep(.68,.82,uv.x));
    uv.x+=sin(uv.y*81.-uTime*.55+sin(uv.x*19.))*water*.00075;
    uv.y+=sin(uv.x*53.+uv.y*31.+uTime*.34)*water*.00045;
    vec4 colour=texture2D(uImage,uv);
    gl_FragColor=vec4(colour.rgb,uFade);
    #include <colorspace_fragment>
  }
`

function GhatBackdrop({ reduced, journey }) {
  const {size}=useThree()
  const mobile=size.width<760
  const image = useTexture('/art/hooghly-ghat.webp')
  const backdrop = useRef()
  image.colorSpace = THREE.SRGBColorSpace
  const uniforms = useMemo(() => ({uImage:{value:image},uTime:{value:0},uFade:{value:0}}),[image])
  useFrame(({clock}) => {
    if (!backdrop.current) return
    backdrop.current.uniforms.uTime.value = reduced ? 0 : clock.elapsedTime
    const p=journey.current.value*CHAPTER_COUNT
    backdrop.current.uniforms.uFade.value=THREE.MathUtils.smoothstep(p,CHAPTER_COUNT-1.22,CHAPTER_COUNT-1)
  })
  return <mesh position={[mobile?-16:0, mobile?-7:0, -25]} renderOrder={-10}>
    <planeGeometry args={[mobile?68:55, (mobile?68:55)*2/3]}/>
    <shaderMaterial ref={backdrop} uniforms={uniforms} vertexShader={planeVertex} fragmentShader={riverPhotoFragment} transparent depthWrite={false} toneMapped={false}/>
  </mesh>
}

const waterVertex = `
  varying vec3 vWorld; varying vec3 vNormal; uniform float uTime;
  float height(vec2 p){return sin(p.x*1.17+p.y*.73+uTime*.43)*.016+sin(p.x*2.31-p.y*1.63-uTime*.37)*.009+sin(p.x*5.4+p.y*3.7+uTime*.26)*.003;}
  void main(){vec3 p=position;p.z+=height(p.xy);float dx=(height(p.xy+vec2(.02,0.))-height(p.xy-vec2(.02,0.)))/.04;float dy=(height(p.xy+vec2(0.,.02))-height(p.xy-vec2(0.,.02)))/.04;vNormal=normalize(mat3(modelMatrix)*vec3(-dx,-dy,1.));vec4 w=modelMatrix*vec4(p,1.);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}
`
const waterFragment = `
  varying vec3 vWorld; varying vec3 vNormal; uniform float uTime; uniform float uOpacity;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  void main(){
    vec3 n=normalize(vNormal);vec3 v=normalize(cameraPosition-vWorld);float fresnel=pow(1.-max(dot(n,v),0.),3.);
    float cloud=noise(vWorld.xz*.17+vec2(uTime*.013,0.));
    vec3 deep=vec3(.073,.065,.052);vec3 sky=mix(vec3(.18,.20,.21),vec3(.34,.28,.20),cloud);
    vec3 col=mix(deep,sky,.23+fresnel*.66);
    float sun=pow(max(dot(reflect(-v,n),normalize(vec3(-.3,.6,-.55))),0.),65.);
    col+=vec3(.55,.36,.16)*sun*.4;
    float distanceFade=1.-smoothstep(18.,38.,distance(cameraPosition,vWorld));
    gl_FragColor=vec4(col,uOpacity*distanceFade);
    #include <colorspace_fragment>
  }
`

export function NaturalWater({reduced,opacity=1}) {
  const water=useRef()
  const uniforms=useMemo(()=>({uTime:{value:0},uOpacity:{value:opacity}}),[opacity])
  useFrame(({clock})=>{if(water.current)water.current.uniforms.uTime.value=reduced?0:clock.elapsedTime})
  return <mesh position={[0,-2.5,-12]} rotation={[-Math.PI/2,0,0]} renderOrder={0}>
    <planeGeometry args={[65,70,85,85]}/><shaderMaterial ref={water} uniforms={uniforms} vertexShader={waterVertex} fragmentShader={waterFragment} transparent depthWrite={false} toneMapped={false}/>
  </mesh>
}

const skinColours=['#875f45','#a17655','#76513b','#9f7454']
const shirtColours=['#d4cbbb','#d6bf94','#843e3c','#acafa9','#d8d1bc','#455c68']
const waterline = [new THREE.Plane(new THREE.Vector3(0,1,0),2.48)]

export function SmallPerson({position,scale=.44,index=0,pose='watch',reduced=false,wading=false}) {
  const arm=useRef()
  const otherArm=useRef()
  const skin=skinColours[index%skinColours.length]
  const shirt=shirtColours[index%shirtColours.length]
  const clip=wading?waterline:null
  useFrame(({clock})=>{
    if(!arm.current)return
    const beat=reduced?0:Math.sin(clock.elapsedTime*(pose==='drum'?5.8:.65)+index)*.11
    arm.current.rotation.z=pose==='carry'?-1.55:pose==='wave'?-2.6:pose==='drum'?-1.05+beat:-.16+beat*.25
    if(otherArm.current)otherArm.current.rotation.z=pose==='carry'?1.55:pose==='drum'?1.05-beat:.16-beat*.25
  })
  return <group position={position} scale={scale} rotation={[0,index%3*.25,0]}>
    <mesh position={[0,1.59,0]} scale={[.88,1.06,.88]}><sphereGeometry args={[.125,12,10]}/><meshStandardMaterial color={skin} roughness={.95} clippingPlanes={clip}/></mesh>
    <mesh position={[0,1.68,-.01]} scale={[1,.5,1]}><sphereGeometry args={[.127,12,8]}/><meshStandardMaterial color="#241c19" roughness={1} clippingPlanes={clip}/></mesh>
    <mesh position={[0,1.13,0]}><capsuleGeometry args={[.19,.43,4,10]}/><meshStandardMaterial color={shirt} roughness={1} clippingPlanes={clip}/></mesh>
    {index%4===0?<mesh position={[0,.48,0]}><cylinderGeometry args={[.17,.25,.8,12]}/><meshStandardMaterial color="#c6bcb0" roughness={1} clippingPlanes={clip}/></mesh>:[-1,1].map(side=><mesh key={side} position={[side*.11,.43,0]}><capsuleGeometry args={[.065,.58,3,8]}/><meshStandardMaterial color={index%2?'#474a45':'#c6bdac'} roughness={1} clippingPlanes={clip}/></mesh>)}
    {[-1,1].map(side=><group key={side} ref={side===-1?arm:otherArm} position={[side*.19,1.32,0]}>
      <mesh position={[0,-.22,0]}><capsuleGeometry args={[.052,.35,3,8]}/><meshStandardMaterial color={shirt} roughness={1} clippingPlanes={clip}/></mesh>
      <mesh position={[0,-.46,.015]}><sphereGeometry args={[.057,8,8]}/><meshStandardMaterial color={skin} roughness={1} clippingPlanes={clip}/></mesh>
      {pose==='drum'&&<mesh position={[0,-.5,.2]} rotation={[Math.PI/3,0,0]}><cylinderGeometry args={[.01,.012,.65,5]}/><meshStandardMaterial color="#ad8456"/></mesh>}
    </group>)}
    {index%4===0&&<mesh position={[.06,1.13,.165]} rotation={[0,0,.24]}><boxGeometry args={[.1,.57,.025]}/><meshStandardMaterial color="#8d323b" roughness={1} clippingPlanes={clip}/></mesh>}
  </group>
}

function Ferry({position,reduced,index}) {
  const boat=useRef()
  const hull=useMemo(()=>{
    const s=new THREE.Shape();s.moveTo(-1.2,0);s.quadraticCurveTo(-.5,-.5,1.2,0);s.quadraticCurveTo(.5,.5,-1.2,0);return s
  },[])
  useFrame(({clock})=>{if(boat.current&&!reduced){boat.current.position.y=position[1]+Math.sin(clock.elapsedTime*.6+index)*.015;boat.current.rotation.z=Math.sin(clock.elapsedTime*.5+index)*.008}})
  return <group ref={boat} position={position} rotation={[0,.4,0]}>
    <mesh rotation={[-Math.PI/2,0,0]}><extrudeGeometry args={[hull,{depth:.16,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:2,steps:1}]}/><meshStandardMaterial color="#30261d" roughness={.75}/></mesh>
    <mesh position={[0,.55,0]}><boxGeometry args={[1.2,.045,.8]}/><meshStandardMaterial color="#776c4f" roughness={1}/></mesh>
    {[-.45,.45].map(x=><mesh key={x} position={[x,.28,0]}><cylinderGeometry args={[.014,.014,.55,6]}/><meshStandardMaterial color="#6d5534"/></mesh>)}
    <SmallPerson position={[-.55,.16,0]} scale={.3} index={index} reduced={reduced}/>
  </group>
}

export function ImmersionScene({children,reduced,journey}) {
  return <group>
    <GhatBackdrop reduced={reduced} journey={journey}/>
    <NaturalWater reduced={reduced} opacity={.12}/>
    <group position={[2.8,0,-3]}>
      {children}
      <mesh position={[0,-2.02,0]}><boxGeometry args={[3.8,.09,.64]}/><meshStandardMaterial color="#645039" roughness={.8}/></mesh>
      {[-.32,.32].map(z=><mesh key={z} position={[0,-2.05,z]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.036,.036,4.8,10]}/><meshStandardMaterial color="#a5884b" roughness={.9}/></mesh>)}
      {[-1,1].map(side=>Array.from({length:5},(_,i)=><SmallPerson key={`${side}-${i}`} position={[-2.2+i*1.1,-2.72,side>0?.95:-.6]} scale={.58} index={i+(side>0?5:0)} pose="carry" reduced={reduced} wading/>))}
    </group>
    <Ferry position={[-3.2,-2.4,-11]} reduced={reduced} index={3}/>
    <Ferry position={[5.5,-2.4,-16]} reduced={reduced} index={2}/>
  </group>
}

export function DhakiPerformance({reduced}) {
  const performers=useRef()
  const texture=useTexture('/art/dhaki-musicians.webp')
  texture.colorSpace=THREE.SRGBColorSpace
  useFrame(({clock})=>{if(performers.current)performers.current.position.y=-1.17+(reduced?0:Math.sin(clock.elapsedTime*2.5)*.006)})
  return <mesh ref={performers} position={[2.9,-1.17,1]}>
    <planeGeometry args={[4.3,4.3*2/3]}/><meshBasicMaterial map={texture} transparent alphaTest={.02} depthWrite={false} toneMapped={false} side={THREE.DoubleSide}/>
  </mesh>
}

export function DhakDrummer({position,reduced,index=0}) {
  return <group position={position} scale={.55}>
    <SmallPerson position={[0,0,0]} scale={1} index={index} pose="drum" reduced={reduced}/>
    <mesh position={[0,.9,.22]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.31,.29,.68,20]}/><meshStandardMaterial color="#743b29" roughness={.8}/></mesh>
    {[-1,1].map(side=><mesh key={side} position={[side*.35,.9,.22]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.32,.32,.02,20]}/><meshStandardMaterial color="#c3ab7b" roughness={.9}/></mesh>)}
    <mesh position={[-.1,1.2,.22]} rotation={[0,0,.25]}><boxGeometry args={[.04,.8,.025]}/><meshStandardMaterial color="#ae4141" roughness={1}/></mesh>
    {Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return <mesh key={i} position={[0,.9+Math.cos(a)*.3,.22+Math.sin(a)*.3]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.008,.008,.67,5]}/><meshStandardMaterial color="#d7c39c"/></mesh>})}
  </group>
}

export function FestivalDecor() {
  const flowers=useRef()
  const points=useMemo(()=>Array.from({length:150},(_,i)=>{
    const row=Math.floor(i/30),t=(i%30)/29
    return new THREE.Vector3(-3.3+t*12,3.5-Math.sin(t*Math.PI)*(.45+row*.13),-3.5-row*.85)
  }),[])
  const alpona=useMemo(()=>{
    const positions=Array.from({length:241},(_,i)=>{
      const a=i/240*Math.PI*2,r=2.8+Math.cos(a*12)*.22
      return new THREE.Vector3(Math.cos(a)*r,-2.565,Math.sin(a)*r)
    })
    return new THREE.BufferGeometry().setFromPoints(positions)
  },[])
  useLayoutEffect(()=>{
    if(!flowers.current)return
    const transform=new THREE.Matrix4()
    points.forEach((position,i)=>{transform.makeTranslation(position.x,position.y,position.z);flowers.current.setMatrixAt(i,transform)})
    flowers.current.instanceMatrix.needsUpdate=true
    flowers.current.computeBoundingSphere()
  },[points])
  return <group>
    <instancedMesh ref={flowers} args={[undefined,undefined,points.length]}><sphereGeometry args={[.052,8,6]}/><meshStandardMaterial color="#d09332" roughness={1}/></instancedMesh>
    <mesh position={[2.7,3.8,-5]}><boxGeometry args={[13,.2,5]}/><meshStandardMaterial color="#662c30" roughness={1}/></mesh>
    <group position={[2.9,0,1]}>
      <line geometry={alpona}><lineBasicMaterial color="#d6cdb7" transparent opacity={.5}/></line>
      {[1.65,2.15,2.45,3.25].map(r=><mesh key={r} position={[0,-2.57,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[r,.01,4,80]}/><meshBasicMaterial color="#cabfa6" transparent opacity={.4}/></mesh>)}
      {Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return <mesh key={i} position={[Math.cos(a)*2,-2.565,Math.sin(a)*2]} rotation={[-Math.PI/2,0,a]} scale={[1,.55,1]}><torusGeometry args={[.28,.009,4,24]}/><meshBasicMaterial color="#c8bfa8" transparent opacity={.45}/></mesh>})}
    </group>
  </group>
}
