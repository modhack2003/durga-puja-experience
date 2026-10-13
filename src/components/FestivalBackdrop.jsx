'use client'
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { CHAPTER_COUNT } from './chapters'

const vertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.9999,1.);}`
const fragment = `
varying vec2 vUv;
uniform sampler2D uA; uniform sampler2D uB;
uniform float uAspect; uniform float uBlend; uniform float uTime;
uniform float uChapter; uniform float uNext; uniform float uTravel;
vec3 scene(sampler2D photo,float chapter){
  float portraitFade=1.;
  vec2 fit=vec2(min(uAspect/1.5,1.),min(1.5/uAspect,1.));
  // On phones preserve the complete farewell tableau in the upper half.
  vec2 uv=(vUv-.5)*fit;
  float focus=chapter>4.5?.60:abs(chapter-2.)<.1?.65:.5;
  uv+=vec2(mix(.5,focus,1.-fit.x),.5);
  if(chapter>4.5||abs(chapter-2.)<.1){
    uv.y+=(1.-fit.y)*.5;
    if(uAspect<.9){
      float height=uAspect/1.5/.8;
      uv=vec2((vUv.x-.5)*.8+.59,(vUv.y-(.88-height))/height);
      // Fade to the reading area without stretching faces or repeating the river.
      portraitFade=smoothstep(-.15,.08,uv.y)*(1.-smoothstep(.98,1.18,uv.y));
      uv.y=clamp(uv.y,.015,.99);
    }
  }
  uv=(uv-vec2(focus,chapter>4.5?1.:.5))*(1.-uTravel*.018)+vec2(focus,chapter>4.5?1.:.5);
  float river=chapter<.5||abs(chapter-2.)<.1||chapter>4.5?1.:0.;
  float water=(1.-smoothstep(.22,.36,uv.y))*(1.-smoothstep(.25,.36,uv.x))*river;
  uv.x+=sin(uv.y*120.+uTime*.6)*.00055*water;
  vec3 col=texture2D(photo,uv).rgb;
  vec3 tint=chapter<.5?vec3(.73,.79,.91):chapter<1.5?vec3(.83,.73,.66):chapter<2.5?vec3(1.,.97,.9):chapter<3.5?vec3(.95,.78,.61):chapter<4.5?vec3(1.,.72,.52):vec3(1.);
  return mix(vec3(.012,.012,.016),col*tint,portraitFade);
}
void main(){
  float reveal=smoothstep(vUv.x*.24,vUv.x*.24+.76,uBlend);
  vec3 col=mix(scene(uA,uChapter),scene(uB,uNext),reveal);
  // Slowly drifting incense-light shafts, kept away from the farewell faces.
  float indoor=step(.5,uChapter)*(1.-step(4.5,uChapter))*(1.-step(1.5,uChapter)* (1.-step(2.5,uChapter)));
  float beam=pow(max(0.,sin(vUv.x*13.+vUv.y*3.+sin(uTime*.12)*.2)),22.);
  col+=vec3(.09,.055,.022)*beam*pow(vUv.y,2.)*indoor;
  gl_FragColor=vec4(col,1.);
  #include <colorspace_fragment>
}`

export default function FestivalBackdrop({ journey, reduced }) {
  const textures=useTexture(['/art/bengal-dawn.webp','/art/thakur-dalan.webp','/art/saptami-ghat.webp','/art/ashtami-anjali.webp','/art/navami-pandal.webp','/art/bhasan-farewell.webp'])
  textures.forEach(texture=>{texture.colorSpace=THREE.SRGBColorSpace})
  const material=useRef()
  const {size}=useThree()
  const uniforms=useMemo(()=>({uA:{value:textures[0]},uB:{value:textures[0]},uAspect:{value:1},uBlend:{value:0},uTime:{value:0},uChapter:{value:0},uNext:{value:0},uTravel:{value:0}}),[textures])
  useFrame(({clock})=>{
    const p=Math.min(journey.current.value,.9999)*CHAPTER_COUNT
    const chapter=Math.floor(p),next=Math.min(chapter+1,5),local=p-chapter
    const u=material.current.uniforms
    u.uA.value=textures[chapter];u.uB.value=textures[next]
    u.uChapter.value=chapter;u.uNext.value=next;u.uAspect.value=size.width/size.height
    u.uBlend.value=reduced?0:THREE.MathUtils.smoothstep(local,.62,1)
    u.uTravel.value=reduced?0:local;u.uTime.value=reduced?0:clock.elapsedTime
  })
  return <mesh frustumCulled={false} renderOrder={-1000}>
    <planeGeometry args={[2,2]}/>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} depthTest={false} depthWrite={false} toneMapped={false}/>
  </mesh>
}
