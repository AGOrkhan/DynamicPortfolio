import Card from './Card';
import expertiseData from '../../data/expertiseData';

const Expertise = () => {
    const userId = import.meta.env.VITE_USER_ID
    const userExpertise = expertiseData[userId]; 

    return (
        <section id="expertise" className="page-section h-full">
            <h2 className="text-5xl lg:text-7xl text-white text-center mb-[50px] font-extrabold">Expertise</h2>
            <div className='flex flex-col lg:flex-row justify-center items-start gap-6 w-full'>
                {userExpertise.map((item, index) => (
                    <div key={index} className="flex flex-col mx-auto lg:mx-0 items-center w-290px">
                        <Card title={item.title} description={item.description} icon={<item.icon className="w-10 h-10 text-white mr-5" />} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Expertise;