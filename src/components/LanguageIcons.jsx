import { FaPython, FaJava } from 'react-icons/fa';
import { SiCplusplus, SiRust, SiNumpy, SiPandas, SiScipy } from 'react-icons/si';

const LanguageIcons = () => {
    const icons_lang = [
        { icon: <FaPython className="text-[#3776AB]" />, name: 'Python' },
        { icon: <FaJava className="text-[#F89820]" />, name: 'Java' },
        { icon: <SiCplusplus className="text-[#00599C]" />, name: 'C++' },
        { icon: <SiRust className="text-[#DEA584]" />, name: 'Rust' },
    ];

    const icons_lib = [
        { icon: <SiNumpy className="text-[#013243]" />, name: 'NumPy' },
        { icon: <SiPandas className="text-[#150458]" />, name: 'Pandas' },
        { icon: <SiScipy className="text-[#8CAAE6]" />, name: 'SciPy' },
    ];

    return (
        <div className="flex flex-col items-center gap-6 mt-6">
            <div className="flex justify-center gap-8">
                {icons_lang.map(({ icon, name }, index) => (
                    <div key={index} className="relative group">
                        <div className="text-6xl cursor-pointer">
                            {icon}
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-10">
                            {name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-8">
                {icons_lib.map(({ icon, name }, index) => (
                    <div key={index} className="relative group">
                        <div className="text-6xl cursor-pointer">
                            {icon}
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-10">
                            {name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LanguageIcons;
