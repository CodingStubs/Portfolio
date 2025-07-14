import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Galaxy = () => {
    const gltf = useLoader(GLTFLoader, './assets/need_some_space/scene.gltf');
    const modelRef = useRef();


    return (
        <primitive
            ref={modelRef}
            object={gltf.scene}
            dispose={null}
            position={[230, -200, -150]}
            scale={100}
            rotation={[Math.PI / 8, Math.PI / 2, Math.PI / 30]}
        />
    );
};

export default Galaxy;
