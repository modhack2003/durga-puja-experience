'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function DhakiPerformance({reduced}) {
  const performers=useRef()
  const texture=useTexture('/art/dhaki-musicians.webp')
  texture.colorSpace=THREE.SRGBColorSpace
  useFrame(({clock})=>{if(performers.current)performers.current.position.y=-1.17+(reduced?0:Math.sin(clock.elapsedTime*2.5)*.006)})
  return <mesh ref={performers} position={[2.9,-1.17,1]}>
    <planeGeometry args={[4.3,4.3*2/3]}/><meshBasicMaterial map={texture} transparent alphaTest={.02} depthWrite={false} toneMapped={false} side={THREE.DoubleSide}/>
  </mesh>
}
