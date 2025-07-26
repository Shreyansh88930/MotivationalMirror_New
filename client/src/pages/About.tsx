import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authorImg from '../assets/author.png';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* Author Info Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Author Image */}
          <div className="flex justify-center">
            <img
              src={authorImg}
              alt="लेखक"
              className="rounded-xl shadow-lg w-72 h-auto object-cover border border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Author Details */}
          <div className="md:col-span-2 space-y-4 text-gray-800 dark:text-gray-300 font-devanagari text-md leading-relaxed">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">लेखक परिचय</h2>
            <p><strong>जन्म:</strong> 16 जुलाई, 1950, गांव-बसेठ, जिला-अलवर (राजस्थान)</p>
            <p><strong>शिक्षा:</strong> एम.ए., एल.एल.बी., पीएच.डी.</p>
            <p><strong>सृजन:</strong> हिन्दी भाषा की विविध विधाओं में निरंतर सृजनरत।</p>

            <p><strong>प्रकाशित कृतियां:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>विमर्श: ‘पेट से ऊपर’, ‘सेवानिवृति पश्चात्’, ‘जीवन का अर्थशास्त्र’, ‘पास-पास’</li>
              <li>कविता संग्रह: ‘प्यारे प्रभु मिलन’, ‘जीवन सार’, ‘सुख सार’, ‘लक्ष्मी सार’, ‘आवाज अंतरमन की’, ‘रात का उजियारा’, ‘मजदूर के पंजे’, ‘स्वर्णिम दिन’, ‘टपकते आँसू’, ‘प्यारे कुण्डलियां सतसई’, ‘प्यारे प्रेम हजारा’, ‘डॉ. अम्बेडकरः मानव सौहार्द’, ‘पिछड़ा कौन’, ‘जिओे अपने लिए भी’, ‘प्यारे गीत शतक’, ‘सुख ही सुख’, ‘डायमंड पथ’</li>
              <li>नाटक: ‘कऊंओं के बीच’, ‘निर्विरोध सरपंच’, ‘गंगा जमना’</li>
              <li>कहानी संग्रह: ‘उत्कर्ष की ओर’</li>
              <li>उपन्यास: ‘कब तक?’, ‘क्यों नहीं’, ‘चौकटी’, ‘नई दुनिया’, ‘नया समाज’</li>
            </ul>

            <p><strong>संपादन:</strong> ‘नव वितान’ पाक्षिक हिन्दी अखबार</p>
            <p><strong>शोध:</strong> कुलपति एवं प्रख्यात प्रध्यापक डॉ. एम.एल. छीपा जी के मार्गदर्शन में</p>
            <p><strong>विशेष:</strong> साहित्य प्रेमी, लेखक, कवि, नाटककार, कहानीकार एवं सामाजिक कार्यकर्ता के रूप में पहचान। ‘जकासा’ सदस्य, ‘लेखनी’ सदस्य।</p>
            <p><strong>सम्प्रति:</strong> राजस्थान लेखा सेवा के ‘वित्तीय सलाहकार’ पद से सेवानिवृत</p>
            <p><strong>आवास:</strong> 13 भगवतीनगर-द्वितीय, करतारपुरा, जयपुर-302006</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
