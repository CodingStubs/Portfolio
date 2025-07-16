import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import CanvasLoader from '../components/CanvasLoader.jsx';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import ComputerPlanet from '../components/ComputerPlanet.jsx';
import CityPlanet from '../components/CityPlanet.jsx';
import EarthPlanet from '../components/EarthPlanet.jsx';
import Galaxy from '../components/Galaxy.jsx';
import Rocket from '../components/Rocket.jsx';

const PlanetScene = () => {
    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [showPopup, setShowPopup] = useState(false);  // Track if the popup is showing
    const canvasRef = useRef();

    const handleClosePopup = () => {
        setShowPopup(false);  // Close the popup and enable interactions
    };

    return (
        <section className="min-h-screen w-full flex flex-col relative">
            <div
                className="w-full min-h-screen absolute inset-0 mx-auto"
                ref={canvasRef}
            >
                <Canvas
                    className="w-full h-full"
                    raycaster={{ params: { Objects: { sort: true } }, precision: 0.0001 }}
                >
                    <Suspense fallback={<CanvasLoader />}>
                        <PerspectiveCamera makeDefault position={[-7.5, -2, 20]} zoom={1.2} />

                        {/* Planets */}
                        <ComputerPlanet
                            isHovered={hoveredPlanet === 'computer'}
                            onHover={() => setHoveredPlanet('computer')}
                            onBlur={() => setHoveredPlanet(null)}
                            setShowPopup={setShowPopup}  // Pass the setter to trigger the popup
                        />
                        <CityPlanet
                            isHovered={hoveredPlanet === 'city'}
                            onHover={() => setHoveredPlanet('city')}
                            onBlur={() => setHoveredPlanet(null)}
                            setShowPopup={setShowPopup}  // Pass the setter to trigger the popup
                        />
                        <EarthPlanet
                            isHovered={hoveredPlanet === 'earth'}
                            onHover={() => setHoveredPlanet('earth')}
                            onBlur={() => setHoveredPlanet(null)}
                            setShowPopup={setShowPopup}  // Pass the setter to trigger the popup
                        />

                        <Rocket />

                        <Galaxy />

                        {/* OrbitControls */}
                        <OrbitControls
                            enableZoom={!showPopup}
                            enablePan={!showPopup}
                            minDistance={10}
                            maxDistance={50}
                        />

                        {/* Lights */}
                        <directionalLight
                            intensity={4} // Adjust brightness
                            position={[5, 10, 5]} // Light position
                            castShadow // Enable shadows
                        />

                        <ambientLight intensity={0.6} />
                    </Suspense>
                </Canvas>

                {/* Full-screen overlay to block interactions when the popup is open */}
                {showPopup && (
                    <div className="absolute inset-0 opacity-25 z-10" />
                )}
            </div>
        </section>
    );
};

export default PlanetScene;
