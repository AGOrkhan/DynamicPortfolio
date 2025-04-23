import Card from './Card';
import expertiseData from '../../data/expertiseData';

const Expertise = () => {

  return (

    <section id="expertise" className="page-section h-full">
        <h2 className="section-heading font-extrabold">Expertise</h2>
        <div className='flex flex-col lg:flex-row justify-center items-start gap-6 w-full'>
          {expertiseData.map((item, index) => (
            <div key={index} className="flex flex-col mx-auto lg:mx-0 items-center max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-sm">
                <Card title={item.title} description={item.description} icon={<item.icon className="w-10 h-10 text-white mr-5" />} />
            </div>
          ))}
        </div>
    </section>
  )
};

export default Expertise;