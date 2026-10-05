import { useEffect, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ComputerPlanet = ({ isHovered, onHover, onBlur, onOpen, position = [0, 0, 0] }) => {
    const gltf = useLoader(GLTFLoader, './assets/export_blender_work/computer_planet.glb');
    const modelRef = useRef();

    // Rotation animation
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

    // Handle emissive color on hover
    useEffect(() => {
        if (modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive.set(isHovered ? 'red' : 'black');
                    child.material.emissiveIntensity = isHovered ? 0.8 : 0;
                }
            });
        }
    }, [isHovered]);

    // Handle popup display
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

    return (
        <group
            position={position}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
            onPointerDown={handleClick}
        >
            <mesh>
                <sphereGeometry args={[2, 16, 16]} />
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

export default ComputerPlanet;
