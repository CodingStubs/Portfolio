import React, { useEffect, useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';
import Tech from './Tech.jsx';

const ComputerPlanet = ({ isHovered, onHover, onBlur, setShowPopup }) => {
    const gltf = useLoader(GLTFLoader, './assets/export_blender_work/computer_planet.glb');
    const modelRef = useRef();
    const [localShowPopup, setLocalShowPopup] = useState(false);

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
    const handleClick = () => {
        if (isHovered) {
            setLocalShowPopup(true);
            setShowPopup(true); // Notify parent to disable OrbitControls
        }
    };

    return (
        <>
            <primitive
                ref={modelRef}
                object={gltf.scene}
                dispose={null}
                position={[3, 0, 0]} // Adjust position
                onPointerOver={onHover}
                onPointerOut={onBlur}
                onClick={handleClick}
            />

            {localShowPopup && (
                <Html center>
                    <Tech
                        onClose={() => {
                            setLocalShowPopup(false);
                            setShowPopup(false); // Reset parent state to enable OrbitControls
                        }}
                    />
                </Html>
            )}
        </>
    );
};

export default ComputerPlanet;
