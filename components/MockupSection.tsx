import React from 'react';

export const MockupSection: React.FC = () => {
  return (
    <section className="py-12 bg-christmas-snow overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <div className="relative max-w-[300px] md:max-w-[360px] mx-auto">
          {/* Phone Frame */}
          <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] md:w-[320px] shadow-2xl mx-auto flex flex-col overflow-hidden ring-4 ring-gray-900/10">
            {/* Screen Content */}
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
              {/* Christmas Screen UI Mockup */}
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://i.imgur.com/0lbIxMI.jpg)' }}>
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Simulated Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 text-center">
                   <h2 className="text-3xl font-poppins font-bold mb-2">Feliz Natal, Amor!</h2>
                   <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl mb-4 text-sm">
                      "Você é o meu melhor presente..."
                   </div>
                   <div className="flex gap-4 mb-8">
                     <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">D</div>
                     <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">H</div>
                     <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">M</div>
                   </div>
                   <button className="bg-christmas-gold text-red-900 font-bold py-2 px-6 rounded-full text-sm">
                     Ver nossa história
                   </button>
                </div>
                
                {/* Falling Snow Overlay inside phone */}
                 <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-80 animate-bounce"></div>
                     <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
                     <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-white rounded-full opacity-70"></div>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};