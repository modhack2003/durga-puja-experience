"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { journeyFrame, sceneArt } from "./journey";

const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.9999,1.);}`;
const fragment = `
varying vec2 vUv;
uniform sampler2D uA,uB;
uniform float uAspect,uBlend,uTime,uLocal,uChapter,uNext,uPulse;
uniform vec2 uPointer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
vec3 scene(sampler2D photo,float chapter){
  vec2 fit=vec2(min(uAspect/1.5,1.),min(1.5/uAspect,1.));
  float focus=chapter>4.5?.63:abs(chapter-2.)<.1?.69:.5;
  vec2 uv=(vUv-.5)*fit+vec2(mix(.5,focus,1.-fit.x),.5);
  if(uAspect<.8){float height=uAspect/1.5;uv=vec2(vUv.x,(vUv.y-(.89-height))/height);}
  float travel=abs(chapter-uChapter)<.1?uLocal:0.;
  uv=(uv-vec2(focus,.5))*(.98-travel*.035)+vec2(focus,.5)+uPointer*.009;
  float river=chapter<.5||abs(chapter-2.)<.1||chapter>4.5?1.:0.;
  float water=(1.-smoothstep(.23,.42,uv.y))*river;
  uv.x+=sin(uv.y*145.-uTime*1.2)*.0014*water;
  float d=distance(vUv,vec2(.65,.4));
  uv+=normalize(vUv-vec2(.65,.4)+.0001)*sin(d*55.-uTime*7.)*.008*uPulse*water;
  vec3 col=texture2D(photo,clamp(uv,.001,.999)).rgb;
  float edges=smoothstep(.01,.18,uv.y)*(1.-smoothstep(.98,1.12,uv.y));
  return mix(vec3(.018,.012,.01),col,edges)*vec3(1.02,.94,.84);
}
void main(){
  float n=noise(vUv*5.)*.17+noise(vUv*13.)*.045;
  float threshold=vUv.x*.55+n;
  float reveal=smoothstep(threshold,threshold+.28,uBlend*1.1);
  reveal=mix(reveal,1.,step(.999,uBlend));
  vec3 col=mix(scene(uA,uChapter),scene(uB,uNext),reveal);
  col+=vec3(.13,.055,.018)*4.*reveal*(1.-reveal)*sin(uBlend*3.14159);
  float beam=pow(max(0.,sin(vUv.x*9.+vUv.y*2.+sin(uTime*.12)*.3)),18.);
  col+=vec3(.065,.034,.01)*beam*vUv.y;
  gl_FragColor=vec4(col,1.);
  #include <colorspace_fragment>
}`;

export default function FestivalBackdrop({ journey, reduced, ritual }) {
  const textures = useTexture(sceneArt);
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const material = useRef(),
    elapsed = useRef(0),
    pulse = useRef({ serial: 0, time: -100 });
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uA: { value: textures[0] },
      uB: { value: textures[0] },
      uAspect: { value: 1 },
      uBlend: { value: 0 },
      uTime: { value: 0 },
      uLocal: { value: 0 },
      uChapter: { value: 0 },
      uNext: { value: 0 },
      uPulse: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
    }),
    [textures],
  );
  useFrame(({ pointer }, delta) => {
    if (!reduced) elapsed.current += Math.min(delta, 0.05);
    const frame = journeyFrame(journey.current.value),
      u = material.current.uniforms;
    if (pulse.current.serial !== ritual.current.serial)
      pulse.current = { serial: ritual.current.serial, time: elapsed.current };
    u.uA.value = textures[frame.index];
    u.uB.value = textures[frame.next];
    u.uChapter.value = frame.index;
    u.uNext.value = frame.next;
    u.uAspect.value = size.width / size.height;
    u.uBlend.value = reduced ? 0 : frame.blend;
    u.uLocal.value = reduced ? 0 : frame.local;
    u.uTime.value = elapsed.current;
    u.uPulse.value = reduced
      ? 0
      : Math.max(0, 1 - (elapsed.current - pulse.current.time) / 3);
    if (reduced) u.uPointer.value.set(0, 0);
    else u.uPointer.value.lerp(pointer, 0.035);
  });
  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
