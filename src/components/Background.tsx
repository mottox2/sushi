// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { Vector3 } from 'three';


function Box(props: any) {
  return (
    <mesh {...props}>
      <boxBufferGeometry attach="geometry" args={props.geometry || [1, 1, 1]} />
      <meshStandardMaterial attach="material" color={props.color || '#666600'} />
    </mesh>
  )
}

function SetCameraLookAt() {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(new Vector3(0, 0, 0))
  }, [camera])
  return null
}

const colors = ['#E43327', '#E6E02A']
export function Background({count, mode, setRotation}: any) {
  const color = colors[count % 2]
  return (
    <div className='container'>
      <Canvas shadowMap={true} camera={{ position: [3, 3, 3], fov: 90 }}>
        <ambientLight />
        <pointLight castShadow position={[0, 10, 20]} />
        <gridHelper args={[300, 100, 0x888888, 0x888888]} position={[0, -0.65, 0]}/>
        <mesh receiveShadow position={[0, -0.7, 0]}>
          <boxBufferGeometry attach="geometry" args={[200, 0.1, 200]} />
          <meshStandardMaterial attach="material" color={'#a0a0a0'} roughness={0.0} />
        </mesh>
        <Sushi setRotation={setRotation} mode={mode} position={[0, 0, 0]} speed={0.03 * count} scale={[1 + 0.18 * count,1,1]} color={color} />
        <SetCameraLookAt />
      </Canvas>
    </div>
  );
}

let rotation = 0

const Sushi = ({speed, color, mode, setRotation, ...props}) => {
  const group = useRef<any>(null)

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
