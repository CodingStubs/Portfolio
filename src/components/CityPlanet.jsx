import React, { useEffect, useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';
import Experience from './Experience';

const CityPlanet = ({ isHovered, onHover, onBlur, setShowPopup }) => {
    const gltf = useLoader(GLTFLoader, './assets/export_blender_work/city_planet.glb');
    const modelRef = useRef();
    const [showPopup, setLocalShowPopup] = useState(false);

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

    const handleClick = () => {
        if (isHovered) {
            setLocalShowPopup(true);
            setShowPopup(true);  // Update the parent component to disable OrbitControls
        }
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
        <>
            <primitive
                ref={modelRef}
                object={gltf.scene}
                dispose={null}
                position={[-3, 0, 0]}
                onPointerOver={onHover}
                onPointerOut={onBlur}
                onClick={handleClick}
            />

            {showPopup && (
                <Html center>
                    <Experience onClose={() => {
                        setLocalShowPopup(false);
                        setShowPopup(false);  // Reset the parent component to enable OrbitControls
                    }} />
                </Html>
            )}
        </>
    );
};

export default CityPlanet;
