import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import CanvasLoader from '../components/CanvasLoader.jsx';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import ComputerPlanet from '../components/ComputerPlanet.jsx';
import CityPlanet from '../components/CityPlanet.jsx';
import EarthPlanet from '../components/EarthPlanet.jsx';
import Galaxy from '../components/Galaxy.jsx';
import Rocket from '../components/Rocket.jsx';
import Sun from '../components/Sun.jsx';

const PLANET_ORBITS = {
    projects: {
        radius: 3.9,
        speed: 0.28,
        phase: 0.1,
        y: -0.05,
    },
    about: {
        radius: 7,
        speed: 0.17,
        phase: 2.7,
        y: 0.18,
    },
    experience: {
        radius: 10.2,
        speed: 0.09,
        phase: 5.05,
        y: -0.12,
    },
};

const OrbitRing = ({ radius }) => (
    <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[radius, 0.012, 8, 192]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
    </mesh>
);

const OrbitingPlanet = ({ radius, speed, phase, y = 0, active = true, children }) => {
    const orbitRef = useRef();

    useFrame(({ clock }) => {
        if (orbitRef.current && active) {
            orbitRef.current.rotation.y = phase + clock.getElapsedTime() * speed;
        }
    });

    return (
        <group>
            <OrbitRing radius={radius} />
            <group ref={orbitRef}>
                <group position={[radius, y, 0]}>
                    {children}
                </group>
            </group>
        </group>
    );
};

const PlanetScene = () => {
    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [showPopup, setShowPopup] = useState(false);  // Track if the popup is showing
    const [isRocketPov, setIsRocketPov] = useState(false);
    const [rocketPhase, setRocketPhase] = useState('flying');
    const canvasRef = useRef();

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
                        <PerspectiveCamera makeDefault position={[-9, 4, 27]} zoom={0.95} />

                        <Sun />

                        <OrbitingPlanet {...PLANET_ORBITS.projects} active={!showPopup}>
                            <ComputerPlanet
                                isHovered={hoveredPlanet === 'computer'}
                                onHover={() => setHoveredPlanet('computer')}
                                onBlur={() => setHoveredPlanet(null)}
                                setShowPopup={setShowPopup}
                            />
                        </OrbitingPlanet>

                        <OrbitingPlanet {...PLANET_ORBITS.about} active={!showPopup}>
                            <EarthPlanet
                                isHovered={hoveredPlanet === 'earth'}
                                onHover={() => setHoveredPlanet('earth')}
                                onBlur={() => setHoveredPlanet(null)}
                                setShowPopup={setShowPopup}
                            />
                        </OrbitingPlanet>

                        <OrbitingPlanet {...PLANET_ORBITS.experience} active={!showPopup}>
                            <CityPlanet
                                isHovered={hoveredPlanet === 'city'}
                                onHover={() => setHoveredPlanet('city')}
                                onBlur={() => setHoveredPlanet(null)}
                                setShowPopup={setShowPopup}
                            />
                        </OrbitingPlanet>

                        <Rocket
                            isRocketPov={isRocketPov}
                            onRocketPhaseChange={setRocketPhase}
                        />

                        <Galaxy />

                        {/* OrbitControls */}
                        <OrbitControls
                            enabled={!showPopup && !isRocketPov}
                            enableZoom={!showPopup && !isRocketPov}
                            enablePan={!showPopup && !isRocketPov}
                            minDistance={12}
                            maxDistance={50}
                        />

                        {/* Lights */}
                        <directionalLight
                            intensity={2}
                            position={[5, 10, 5]}
                            castShadow
                        />

                        <ambientLight intensity={0.35} />
                    </Suspense>
                </Canvas>

                {/* Full-screen overlay to block interactions when the popup is open */}
                {showPopup && (
                    <div className="absolute inset-0 opacity-25 z-10" />
                )}

                {isRocketPov && rocketPhase === 'hidden' && (
                    <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.96)_0%,rgba(255,249,207,0.76)_28%,rgba(176,222,255,0.6)_58%,rgba(255,255,255,0.88)_100%)]" />
                )}

                {isRocketPov && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                        <div className="h-[78vmin] w-[78vmin] rounded-full border-[18px] border-black/75 shadow-[0_0_0_9999px_rgba(0,0,0,0.38),inset_0_0_45px_rgba(0,0,0,0.75)]" />
                    </div>
                )}

                <button
                    type="button"
                    className="absolute right-5 top-5 z-20 rounded-md border border-white/25 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setIsRocketPov((current) => !current)}
                >
                    {isRocketPov ? 'Exit Rocket POV' : 'Rocket POV'}
                </button>
            </div>
        </section>
    );
};

export default PlanetScene;
