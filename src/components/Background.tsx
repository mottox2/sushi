import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, useResource } from 'react-three-fiber'
import { Vector3, PerspectiveCamera } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: any
    }
  }
}

function Box(props: any) {
  return (
    <mesh {...props}>
      <boxBufferGeometry attach="geometry" args={props.geometry || [1, 1, 1]} />
      <meshStandardMaterial attach="material" color={props.color || '#666600'} />
    </mesh>
  )
}

function Camera(props: any) {
  const ref = useRef<PerspectiveCamera>()
  const { setDefaultCamera } = useThree()
  // Make the camera known to the system
  useEffect(() => {
    if (!ref.current) return
    setDefaultCamera(ref.current)
    ref.current.lookAt(new Vector3(0, 0, 0))
  }, [ref, setDefaultCamera])

  // Update it every frame
  // useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera position={[3, 3,3 ]} args={['90', window.innerWidth / window.innerHeight]} ref={ref} {...props} />
}

const colors = ['#E43327', '#E6E02A']
export function Background({count, mode, setRotation}: any) {
  const color = colors[count % 2]
  return (
    <div className='container'>
      <Canvas shadowMap={true}>
        <ambientLight />
        <pointLight castShadow position={[0, 10, 20]} />
        <gridHelper args={[300, 100, 0x888888, 0x888888]} position={[0, -0.65, 0]}/>
        <mesh receiveShadow position={[0, -0.7, 0]}>
          <boxBufferGeometry attach="geometry" args={[200, 0.1, 200]} />
          <meshStandardMaterial attach="material" color={'#a0a0a0'} roughness={0.0} />
        </mesh>
        <Sushi setRotation={setRotation} mode={mode} position={[0, 0, 0]} speed={0.03 * count} scale={[1 + 0.18 * count,1,1]} color={color} />
        <Camera />
      </Canvas>
    </div>
  );
}

let rotation = 0

const Sushi = ({speed, color, mode, setRotation, ...props}) => {
  const group = useRef<any>()

  useEffect(() => {
    if (mode === 'result') setRotation(rotation / 3.14 / 2)
    rotation = 0
  }, [mode])

  useFrame(() => {
    group.current.rotation.y += speed || 0.01
    if (mode === 'game') rotation += speed || 0.01
  })

  return <group {...props} ref={group}>
      <Box position={[0, 0.7, 0]} geometry={[2, 0.4, 1]} castShadow color={color} />
      <Box position={[0, 0, 0]} geometry={[2, 1, 1]} castShadow color="#CCCCCC" />
    </group>
}

export default Background;
