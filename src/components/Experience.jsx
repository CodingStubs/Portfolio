import React from 'react';
import { motion } from 'framer-motion';

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

const Experience = ({ onClose }) => {
    return (
        <section id="experience" className="w-screen h-auto flex justify-center items-center">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInRight}
                custom={0}
                className="bg-white p-5 rounded-2xl shadow-lg overflow-y-auto text-left w-2/3 max-w-screen-xl max-h-[80vh]"
            >

                <motion.h2
                    className="text-4xl font-bold mb-10 text-gray-900 text-center"
                    variants={fadeInRight}
                    custom={1}
                >Experience
                </motion.h2>

                {/* Job 1 */}
                <motion.div variants={fadeInRight} custom={2}
                            className="mb-8 flex flex-col items-center text-center">
                    <div className="flex mb-4 items-center justify-center">
                        <img src="../assets/anduril.png" alt="Anduril Logo" className="w-1/2 object-contain"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Software Engineering Intern</h3>
                    <p className="text-sm text-gray-600 mb-4">Anduril Industries - Costa Mesa, CA</p>
                    <p className="text-base text-gray-600 leading-relaxed">Summer 2025 Internship. Programming in Rust</p>
                </motion.div>

                <SectionDivider/>

                {/* Job 2 */}
                <motion.div variants={fadeInRight} custom={3}
                            className="mb-8 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-4">
                        <img src="../assets/GMO.png" alt="GMO Logo" className="w-1/5 object-contain"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Software Engineering Intern</h3>
                    <p className="text-sm text-gray-600 mb-4">Grantham, Mayo, Van Otterloo & Co - Seattle, WA</p>
                    <ul className="text-base text-gray-600 leading-relaxed list-none ml-5">
                        <ul>Scrubbed data to compare performance of portfolio holdings against sector and market
                            performance
                        </ul>
                        <ul>Processed over 53,000 entries to create informative graphs for 80+ securities</ul>
                        <ul>Reduced data processing runtime by 97% with Python automation over Excel workflow</ul>
                    </ul>
                </motion.div>

                <SectionDivider/>

                {/* Job 3 */}
                <motion.div variants={fadeInRight} custom={4}
                            className="mb-8 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-4">
                        <img src="../assets/CPA.png" alt="CPA Logo" className="w-1/3 object-contain"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Summer Analyst</h3>
                    <p className="text-sm text-gray-600 mb-4">Columbia Pacific Advisors - Seattle, WA</p>


                    <ul className="text-base text-gray-600 leading-relaxed list-none ml-5">
                        <ul>Created a Python application that sourced 4,100+ deal-flow contacts, expanding database
                            by 46%
                        </ul>
                        <ul>Pitched a single stock (SEZL). It proceeded to gain over 700% in the following 11 months</ul>
                        <ul>Analyzed distressed credit and built waterfall valuations for refinancing scenarios</ul>
                    </ul>
                </motion.div>

                <SectionDivider/>

                {/* Job 4 */}
                <motion.div variants={fadeInRight} custom={5}
                            className="mb-8 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-4">
                        <img src="../assets/uw.png" alt="UW Logo" className="w-1/2 object-contain"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Teaching Assistant</h3>
                    <p className="text-sm text-gray-600 mb-4">University of Washington - Seattle, WA</p>
                    <ul className="text-base text-gray-600 leading-relaxed list-none ml-5">
                        <ul>Led Java-based quiz sections for Intro to Programming II</ul>
                        <ul>Held weekly office hours for 50+ students and graded 25+ assignments/week</ul>
                        <ul>Maintained strong engagement with 80% attendance in early morning sections</ul>
                    </ul>
                </motion.div>

                <SectionDivider/>

                {/* Job 5 - Abbott */}
                <motion.div
                    variants={fadeInRight}
                    custom={6}
                    className="mb-8 flex flex-col items-center text-center"
                >
                    {/* Top Photo */}
                    <div className="flex items-center justify-center mb-4">
                        <img
                            src="../assets/AbbottLogoPhoto.jpg"
                            alt="Abbott Logo"
                            className="w-1/3 object-contain"
                        />
                    </div>

                    {/* Headers (each on its own line) */}
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Laborer</h3>
                        <p className="text-sm text-gray-600">Abbott Construction</p>
                    </div>

                    {/* List and Second Photo Side-by-Side */}
                    <div className="flex flex-row justify-center items-start w-full px-10 gap-12">
                        {/* Unordered List */}
                        <ul className="w-4/5 text-base text-gray-600 leading-relaxed list-none text-left">
                            <li>Excelled in digging holes as a waterline seeking specialist</li>
                            <li>Served as a liaison transporting asphalt chunks from parking lot to the collection bin
                            </li>
                            <li>Effectively wielded broom and dustpan, resulting in an 85% decrease in dust</li>
                        </ul>

                        {/* Second Photo */}
                        <div className="w-1/5 flex justify-center items-center border-4 border-gray-500">
                            <img
                                src="../assets/AbbottPhoto.png"
                                alt="Abbott Work Photo"
                                className="object-contain"
                            />
                        </div>
                    </div>
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

export default Experience;
