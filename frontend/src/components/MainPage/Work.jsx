import { useState } from "react";
import { ChevronDown } from "lucide-react";
import workData from "../../data/workData";

const Work = ({ userId = 0 }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!workData[userId]) {
    return null;
  }

  return (
    <section id="work" className="page-section">
      <h2 className="text-5xl lg:text-7xl text-white text-center mb-[50px] font-extrabold">Work</h2>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-[92%] md:w-3/4 lg:w-3/6 flex flex-col rounded-xl justify-center items-start 
                      px-4 md:px-10 space-y-4 md:space-y-5 pt-5 pb-5">
          {workData[userId].map((job, index) => (
            <div key={index} className="w-full">
              <div
                className="work-dropdown cursor-pointer transition-all duration-200 hover:bg-red-800 hover:scale-[1.02]
                          p-4 md:p-6 rounded-lg bg-gray-800/30"
                onClick={() => toggleSection(index)}
              >
                <div className="relative flex items-center justify-between w-full">
                  <span className="work-headings text-lg md:text-xl block truncate pr-4">
                    {job.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="work-headings text-sm md:text-base text-gray-400">
                      {job.years}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 
                        ${openIndex === index ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-[60vh] opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-gray-200 px-4 md:px-10 py-4 md:py-5 bg-[#301616] rounded-md">
                  <p className="text-sm md:text-base leading-relaxed relative">
                    {job.details}
                    <span className="absolute bottom-0 right-0 w-16 h-full bg-gradient-to-l from-[#301616] to-transparent"></span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
