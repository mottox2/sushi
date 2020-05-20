import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { extend, Canvas, useFrame, useThree, useResource, useLoader } from 'react-three-fiber'
import { Vector3, DirectionalLight, Color, TextureLoader, RepeatWrapping, MathUtils, PerspectiveCamera } from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { AMFLoader } from 'three/examples/jsm/loaders/AMFLoader'

// extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: any
    }
  }
}

function Box(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<any>()

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh {...props} ref={mesh}>
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
    console.log(ref.current)
    ref.current.lookAt(new Vector3(0, 0, 0))
  }, [ref, setDefaultCamera])

  // Update it every frame
  // useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera position={[3, 3,3 ]} args={['90', window.innerWidth / window.innerHeight]} ref={ref} {...props} />
}

// const Asset = () => {
//   const uLoader = useLoader(FBXLoader, '/models/sushi.fbx')

//   console.log(uLoader)
//   return <primitive object={uLoader} />
// }
const colors = ['#E6E02A', '#E43327']

export function Background({count}: any) {
  const [control, setControl] = useState(false)
  const [ref, dLight] = useResource<any>()
  const [model, setModel] = useState<any>(null)
  console.log(dLight)
  const loader = new TextureLoader()
  const texture =loader.load('https://threejsfundamentals.org/threejs/lessons/resources/images/compressed-but-large-wood-texture.jpg')
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(4,1)
  texture.rotation = MathUtils.degToRad(90)
  // const uLoader = useLoader(FBXLoader, '/models/sushi.fbx')

  // useEffect(() => {
  //   const loader = new AMFLoader()
  //   loader.load('/models/rook.amf', (object) => setModel(object))
  // }, [])
  // const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [colors])
  const color = colors[count % 2]
  console.log(count % 2)

  return (
    <div className='container'>
      <Canvas shadowMap={true}>
        <fog args={[0x000000, 10, 100]}  />
        {/* <Suspense fallback={null}>
          <Asset/>
        </Suspense> */}
        {/* 環境高原 */}
        <ambientLight />
        {/* <directionalLight ref={ref} position={[1,1,1]} color={new Color('0xffcc77')}>
        {dLight && <directionalLightHelper args={[dLight]} />}
        </directionalLight> */}
        <pointLight castShadow position={[0, 10, 20]} />
        {/* <spotLight args={[0xffffff,4, 2000, Math.PI /5 , 0.2, 1.5]} position={[0, 10, 10]} /> */}

        {/* <gridHelper args={[300, 150, 0x888888, 0x888888]} position={[0, -0.49, 0]} /> */}
        <gridHelper args={[300, 100, 0x888888, 0x888888]} position={[0, -0.65, 0]}/>

        <mesh receiveShadow position={[0, -0.7, 0]}>
          <boxBufferGeometry attach="geometry" args={[200, 0.1, 200]} />
          <meshStandardMaterial attach="material" color={'#a0a0a0'} roughness={0.0} />
        </mesh>
        {/* <mesh receiveShadow position={[0, -0.6, 0]}>
          <boxBufferGeometry attach="geometry" args={[20, 0.1, 80]} />
          <meshStandardMaterial attach="material" color={'#555'} roughness={0.0} />
        </mesh> */}
          {/* <meshStandardMaterial attach="material" map={texture} /> */}
        {/* <mesh receiveShadow position={[-10, 0, 0]}>
          <boxBufferGeometry attach="geometry" args={[0.1, 20, 80]} />
          <meshStandardMaterial attach="material" color={'#888888'} />
        </mesh> */}
        {/* {model && <primitive object={model} position={[0,2,0]} />} */}
        <Group position={[0, 0, 0]} speed={0.03 + 0.01 * count} scale={[1 + 0.1 * count,1,1]} color={color} />
        <Camera />
      </Canvas>
    </div>
  );
}

const Group = ({speed, color, ...props}) => {
  const group = useRef<any>()
  useFrame(() => (group.current.rotation.y += speed || 0.01))
  return <group {...props} ref={group}>
      <Box position={[0, 0.7, 0]} geometry={[2, 0.4, 1]}  castShadow color={color} />
      <Box position={[0, 0, 0]} geometry={[2, 1, 1]} castShadow color="#CCCCCC" />
    </group>
}

const Group2 = (props: any) => {
  const group = useRef<any>()
  const {speed, ...otherProps} = props
  useFrame(() => (group.current.rotation.y += speed || 0.01))
  return <group {...otherProps} ref={group}>
      <Box position={[0, 0.75, 0]} geometry={[2, 0.1, 1]}  castShadow color='#E01F1F' />
      <Box position={[0, 0, 0]} geometry={[2, 1.4, 1]} castShadow color="#0E0B08" />
    </group>
}

export default Background;
