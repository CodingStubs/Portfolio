import { useEffect, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const CityPlanet = ({ isHovered, onHover, onBlur, onOpen, position = [0, 0, 0] }) => {
    const gltf = useLoader(GLTFLoader, './assets/export_blender_work/city_planet.glb');
    const modelRef = useRef();

    useFrame(() => {
        if (modelRef.current) {
            if (isHovered) {
                modelRef.current.rotation.x += 0.01;
                modelRef.current.rotation.y += 0.01;
            } else {
                modelRef.current.rotation.y += 0.001;
                modelRef.current.rotation.x += 0.001;
            }
        }
    });

    const handlePointerOver = (event) => {
        event.stopPropagation();
        onHover();
    };

    const handlePointerOut = (event) => {
        event.stopPropagation();
        onBlur();
    };

    const handleClick = (event) => {
        event.stopPropagation();
        onOpen();
    };

    useEffect(() => {
        if (modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive.set(isHovered ? 'white' : 'black');
                    child.material.emissiveIntensity = isHovered ? 0.4 : 0;
                }
            });
        }
    }, [isHovered]);

    return (
        <group
            position={position}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
            onPointerDown={handleClick}
        >
            <mesh>
                <sphereGeometry args={[2.15, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <primitive
                ref={modelRef}
                object={gltf.scene}
                dispose={null}
            />
        </group>
    );
};

export default CityPlanet;
