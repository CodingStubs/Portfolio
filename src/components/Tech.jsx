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

const Tech = ({ onClose }) => {
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
                >Projects
                </motion.h2>

                {/* Project - Website */}
                <motion.div variants={fadeInRight} custom={2}
                            className="mb-8 flex flex-col items-center text-center mx-2">
                    <div className="flex">
                        <div className="w-full">
                            <h1 className="text-xl font-semibold text-gray-700">Personal Website</h1>
                            <h2 className="text-sm text-gray-500 italic leading-relaxed mb-1">React, Vite, Three.js, Blender, Tailwind CSS, HTML</h2>
                            <p className="text-sm text-gray-700 leading-relaxed text-left mb-2">
                                This website was created to practice front-end development and explore interactive
                                3D web design using modern frameworks. The scene features custom-modeled planets and
                                a rocket, built in Blender and rendered with Three.js through React Three Fiber.
                                Users can interact with the planets via hover and click events, triggering animations,
                                lighting effects, and informational popups while dynamically controlling camera behavior.
                                The project explores integration of 3D assets, scene control, and user interaction in a
                                modern React-based environment.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <SectionDivider/>

                {/* Project - CFRM */}
                <motion.div variants={fadeInRight} custom={3}
                            className="mb-8 flex flex-col items-center text-center mx-2">
                    <div className="flex">
                        <div className="w-3/5 pr-4 mr-4">
                            <h1 className="text-xl font-semibold text-gray-700">Machine Learning for Bankruptcy
                                Prediction</h1>
                            <h2 className="text-sm text-gray-500 italic leading-relaxed mb-1">Python, Scikit-learn</h2>
                            <p className="text-sm text-gray-700 leading-relaxed text-left mb-2">
                                Collaborated in a group of five to compare machine learning approaches for predicting
                                whether a company would go bankrupt, using data from NYSE- and NASDAQ-listed companies
                                between 1999 and 2018. Personally responsible for data preprocessing and experimentation
                                with Random Forest models for prediction. Transformed raw data into various liquidity,
                                profitability, leverage, and efficiency ratios to improve model performance and
                                generalizability. Applied a Random Forest approach, using randomized search with
                                cross-validation to tune hyperparameters. Used macro F1 score as the evaluation metric
                                to balance precision and recall due to the dataset’s imbalanced nature (~5% positive
                                class).
                                Our final conclusion was that XGBoost was the most effective model for this
                                classification
                                task. We also compared K-Nearest Neighbors, Gradient Boosting, and a Neural Network.
                            </p>
                        </div>
                        <div className="w-2/5 flex justify-center items-center">
                            <img
                                src="public/assets/MLForFinPhoto.png"
                                alt=""
                                className="w-auto min-w-[65px] h-2/3 object-contain"
                            />
                        </div>
                    </div>
                </motion.div>

                <SectionDivider/>

                {/* Project - 333 */}
                <motion.div variants={fadeInRight} custom={4}
                            className="mb-8 flex flex-col items-center text-center mx-2">
                    <div className="flex">
                        <div className="w-2/3 pr-4 mr-4">
                            <h1 className="text-xl font-semibold text-gray-700">Multithreaded Web Server</h1>
                            <h2 className="text-sm text-gray-500 italic leading-relaxed mb-1">C++</h2>
                            <p className="text-sm text-gray-700 leading-relaxed text-left mb-2">
                                Built a query processor integrated into a multi-threaded web server handling
                                HTTP requests. Implemented doubly linked lists and chained hash tables from scratch to
                                create a file parser which stored each unique word that occurred in a file and the
                                positions at which the word occurred. The web-server then allowed users to
                                query a word or set of words, then receive a ordered list of each file those words occurred
                                in, sorted by frequency. The search engine index was written to architecture neutral index
                                files for efficient memory usage.
                            </p>
                        </div>
                        <div className="w-1/3 flex justify-center items-center border border-gray-500">
                            <img
                                src="public/assets/333ProjPhoto.png"
                                alt=""
                                className="w-auto min-w-[65px] h-full object-contain"
                            />
                        </div>
                    </div>
                </motion.div>

                <SectionDivider/>

                {/* Project - Gemeni */}
                <motion.div variants={fadeInRight} custom={5}
                            className="mb-8 flex flex-col items-center text-center mx-2">
                    <div className="flex">
                        <div className="w-full pr-4 mb-2">
                            <h1 className="text-xl font-semibold text-gray-700">Local Election Voting Guide</h1>
                            <h2 className="text-sm text-gray-500 italic leading-relaxed mb-1">Python, Gemeni API,
                                Selenium</h2>
                            <p className="text-sm text-gray-700 leading-relaxed text-left mb-2">
                                Utilized Google’s Gemini API combined with Selenium web scraping to create bullet point
                                summaries for
                                2000+ candidates in local Washington State elections. The data was taken from votewa.gov
                                where Selenium
                                was used to gather information such as candidate name, their district, and the position
                                they were running for.
                                Using links to votewa.gov pages with summaries the candidates had submitted for
                                themselves, Selenium
                                would copy their briefs and pass it into Google's Gemeni API, with instructions to
                                summarize the
                                information. These Gemeni-produced summaries were then presented along with the
                                candidate's information,
                                enabling voters to quickly become familiar with unknown local election participants.
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center border border-gray-500">
                        <img
                            src="public/assets/GemeniProjectPhoto.png"
                            alt=""
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </motion.div>

                <SectionDivider/>

                <motion.div className="mt-10 flex justify-center" variants={fadeInRight} custom={3}>
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

export default Tech;
