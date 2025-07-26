import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-black via-gray-900 to-black text-white py-14 shadow-inner border-t border-gray-800">
      <div className="container mx-auto px-4 text-center space-y-8">
        {/* Logo and Description */}
        <div className="space-y-4">
          <h3 className="text-4xl font-bold font-devanagari text-yellow-400 tracking-widest drop-shadow">
            प्रेरणा - नववितान
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto font-devanagari text-lg leading-relaxed">
            प्रतिदिन एक नई ऊर्जा, एक नया विचार और जीवन को दिशा देने वाली हिंदी प्रेरणा।<br />
            हमारे साथ जुड़िए और अपने दिन की शुरुआत आत्मबल और सकारात्मक सोच के साथ कीजिए।
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="hover:scale-125 transition-transform duration-300 text-yellow-400 hover:text-white">
            <Facebook size={24} />
          </a>
          <a href="#" className="hover:scale-125 transition-transform duration-300 text-yellow-400 hover:text-white">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:scale-125 transition-transform duration-300 text-yellow-400 hover:text-white">
            <Instagram size={24} />
          </a>
          <a href="#" className="hover:scale-125 transition-transform duration-300 text-yellow-400 hover:text-white">
            <Youtube size={24} />
          </a>
        </div>

        {/* Divider and Bottom Text */}
        <div className="border-t border-gray-800 pt-6 text-gray-400 font-devanagari text-sm">
          <p>
            &copy; 2024 <span className="text-white font-semibold">प्रेरणा - नववितान</span>। सर्वाधिकार सुरक्षित।<br />
            ❤️ के साथ निर्मित भारत में।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
