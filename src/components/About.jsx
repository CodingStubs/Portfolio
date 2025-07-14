import React from 'react';
import { motion } from 'framer-motion';
import { FaPython, FaJava } from 'react-icons/fa';
import LanguageIcons from '../components/LanguageIcons.jsx';



const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: (i = 1) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: 'easeOut'
        }
    })
};

const SectionDivider = () => (
    <div className="border-t border-gray-300 my-10"></div>
);

const AboutMe = ({ onClose }) => {
    return (
        <section id="about" className="w-screen h-auto flex justify-center items-center">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInRight}
                custom={0}
                className="bg-white p-10 rounded-2xl shadow-lg text-left overflow-auto w-2/3 max-w-screen-xl max-h-[80vh]"
            >
                <motion.h2
                    className="text-4xl font-bold mb-10 text-gray-900 text-center"
                    variants={fadeInRight}
                    custom={1}
                >
                    About Me
                </motion.h2>

                <div className="flex flex-col md:flex-row md:items-start md:gap-10">
                    <motion.img
                        src="/assets/portfolio_pfp.jpeg"
                        alt="Profile"
                        className="w-40 h-40 rounded-full border-4 border-gray-500 object-cover mb-6 md:mb-0 self-center shadow-md"
                        variants={fadeInRight}
                        custom={2}
                    />
                    <motion.div
                        variants={fadeInRight}
                        custom={3}
                        className="flex-1"
                    >
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Personal Bio</h3>
                        <p className="text-base text-gray-600 leading-relaxed">

                            Third year computer science student with a strong interest in embedded systems and machine
                            learning.
                            Work experience in both Rust and Python, also skilled in Java and C++ through academic work and personal projects.
                            Eager to apply theoretical knowledge to real-world tech challenges.
                            <br/> <br/>

                            When I'm not behind a desk, I enjoy throwing the football, reading novels, playing poker, or improving
                            my geography knowledge (
                            <a
                                className="text-base text-blue-400 leading-relaxed"
                                href="https://www.jetpunk.com/quizzes/how-many-countries-can-you-name"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                PR of 5:39
                            </a>
                            ).
                        </p>
                    </motion.div>
                </div>

                <SectionDivider/>

                <motion.div variants={fadeInRight} custom={4}>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Education</h3>
                    <div className="mb-4">
                        <img
                            src="https://sustainability.uw.edu/blog/files/20220808_August%20Campus_0006.jpg"
                            alt="University Campus"
                            className="w-full rounded-lg border-4 border-gray-500 shadow-sm mb-4"
                        />
                    </div>
                    <p className="text-lg text-gray-500 italic leading-relaxed mb-4">
                        B.S. in Computer Science, University of Washington (Graduating June 2026)
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                        My coursework focuses on systems programming and machine learning. Recent coursework includes
                        Computer Vision, Machine Learning for Finance, Machine Learning (Regular), and Systems
                        Programming in C/C++. I have also taken courses in Statistics, Calculus, Linear Algebra,
                        Accounting, and Economics.
                        <br/> <br/>
                        Outside of the classroom, I am learning Rust. While developing this website, I
                        learned to use Three.js, React, Tailwind CSS, and Blender.
                    </p>
                </motion.div>

                <SectionDivider/>

                <motion.div variants={fadeInRight} custom={5}>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Languages and Libraries</h3>
                    <LanguageIcons />
                </motion.div>

                <SectionDivider/>

                <motion.div className="mt-10 flex justify-center" variants={fadeInRight} custom={6}>
                    <button
                        className="px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AboutMe;
