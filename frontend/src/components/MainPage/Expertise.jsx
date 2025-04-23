import Card from './Card';
import expertiseData from '../../data/expertiseData';

const Expertise = () => {

  return (

    <section id="expertise" className="page-section h-full">
        <h2 className="section-heading font-extrabold">Expertise</h2>
        <div className='flex flex-col pl-32 lg:flex-row justify-center items-start gap-6'>
          {expertiseData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
                <Card title={item.title} description={item.description} icon={<item.icon className="w-10 h-10 text-white mr-5" />} />
            </div>
          ))}
        </div>
    </section>
  )
};

export default Expertise;