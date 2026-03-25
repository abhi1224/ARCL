import React from 'react'
import { NavLink } from 'react-router-dom'
import team from '../assets/why-us/team.jpg'

function About() {
    const values = [
    {
      title: "Integrity",
      description:
        "We uphold the highest standards of honesty and strong moral principles. Our actions reflect our words, and we take full responsibility for what we deliver.",
    },
    {
      title: "Innovation",
      description:
        "We constantly explore new ideas and technologies to improve efficiency and stay ahead in lab and industrial solutions. Innovation is in our DNA.",
    },
    {
      title: "Commitment",
      description:
        "We are deeply committed to our customers and strive to deliver the best possible experience with every interaction, product, and service.",
    },
  ];
  return (
    <>
        <section className="bg-gray-100 py-16 md:px-10 px-6">
        <h1 className="md:text-5xl text-2xl font-bold  text-[#021C57] mb-6 capitalize border-style py-5">About ARCL</h1>
        <p className="text-lg text-gray-700 md:w-[80%] text-justify">
            Arcl manufacture and sale a wide range of laboratory instruments, including concrete, cement, aggregate, soil, bitumen, surveying and scientific equipment fields.
        <br />
        We use flexible management to quickly adapt to market needs, focusing on science to develop new laboratory instruments and stay connected with customers and experts. We are an <strong>ISO 9001:2025 Certified company</strong> and all our products comply with stringent International Standards such as ISO/IEC 17025:2025 Certifications.
        </p>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8 py-12 px-6">
            <img src={team} alt="Team" className="w-full md:w-1/2 rounded-lg shadow-lg object-cover" />
            <div className="w-full md:w-1/2">
                <h2 className="md:text-5xl text-2xl font-bold  text-[#021C57] mb-6 capitalize border-style py-5">Our Story</h2>
                <p className="text-gray-700 leading-7">
               Founded with a vision to revolutionize the laboratory and industrial equipment sector, our company was officially authorized on 27th July 2025. Since day one, we've been committed to delivering cutting-edge solutions, exceptional customer service, and innovative products that meet the highest industry standards. Our journey began with a small but passionate team determined to make quality and reliability accessible to labs and industries of all sizes. Today, we continue to grow with integrity, innovation, and a relentless drive to serve our clients better each day.
                </p>
            </div>
        </section>

         <section className="py-12 px-6 bg-white">
      <h2 className="md:text-5xl text-2xl font-bold w-full mx-auto text-[#021C57] mb-6 capitalize border-style py-5">Our Values</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
        {values.map((item, index) => (
           <div 
            key={index}
            className="w-full lg:w-4/5 p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
            <h3 className="text-xl font-semibold mb-3 text-[#021C57] border-l-4 px-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            </div>
        ))}
      </div>
    </section>


        <section className="px-6">
          <div className="bg-gray-100 py-12 text-center w-full md:w-[75%] md:mx-auto my-5 rounded-xl">

              <h2 className="text-3xl font-bold mb-4 text-[#021C57]">Ready to work with us?</h2>
            <p className="mb-6">Let us help you find the right equipment for your needs.</p>
            <NavLink 
                to="/contact" 
                className="button-style px-6 py-3 rounded font-semibold transition"
            >
                Contact Us
            </NavLink>
          </div>
        </section>



    </>
  )
}

export default About