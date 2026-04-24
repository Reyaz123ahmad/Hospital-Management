import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaStethoscope, FaUserMd, FaHeartbeat, FaCalendarCheck, FaStar, FaShieldAlt, FaAmbulance, FaClock, FaHospitalUser } from 'react-icons/fa'

const Home = () => {
  const features = [
    { icon: <FaStethoscope className="text-4xl" />, title: "Expert Doctors", desc: "500+ experienced doctors across 30+ specializations", color: "from-blue-500 to-blue-600" },
    { icon: <FaCalendarCheck className="text-4xl" />, title: "Easy Booking", desc: "Book appointments online in just a few clicks", color: "from-green-500 to-green-600" },
    { icon: <FaHeartbeat className="text-4xl" />, title: "24/7 Emergency", desc: "Round-the-clock emergency services available", color: "from-red-500 to-red-600" },
    { icon: <FaShieldAlt className="text-4xl" />, title: "Safe & Secure", desc: "Your health data is protected with us", color: "from-purple-500 to-purple-600" },
  ]

  const stats = [
    { number: "500+", label: "Expert Doctors", icon: <FaUserMd /> },
    { number: "50k+", label: "Happy Patients", icon: <FaHeartbeat /> },
    { number: "30+", label: "Specializations", icon: <FaStethoscope /> },
    { number: "24/7", label: "Emergency Care", icon: <FaAmbulance /> },
  ]

  const testimonials = [
    { name: "Rahul Sharma", role: "Patient", comment: "Excellent service! The doctors are very professional and caring.", rating: 5, image: "R" },
    { name: "Priya Mehta", role: "Patient", comment: "Very easy to book appointments. The symptom analyzer is a great feature!", rating: 5, image: "P" },
    { name: "Amit Kumar", role: "Patient", comment: "Best healthcare platform. Highly recommended!", rating: 5, image: "A" },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-white/5 to-transparent rotate-45"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm mb-6 backdrop-blur-sm"
              >
                🏥 India's Most Trusted Healthcare Platform
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your Health, <br />
                <span className="text-yellow-300">Our Priority</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg">
                Experience world-class healthcare with our team of expert doctors and modern facilities
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/symptom-analyzer">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <FaStethoscope /> Analyze Symptoms
                  </motion.button>
                </Link>
                <Link to="/doctors">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all flex items-center gap-2"
                  >
                    <FaUserMd /> Find a Doctor
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <FaHospitalUser className="text-primary-600 text-3xl" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">24/7 Emergency Support</p>
                      <p className="text-white/80 text-sm">Call us anytime</p>
                      <p className="text-yellow-300 font-bold text-xl">+91 12345 67890</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">30min</p>
                      <p className="text-sm text-white/80">Avg Response</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-sm text-white/80">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl text-primary-500 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide comprehensive healthcare services with patient-centric approach</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-primary-500`}
              >
                <div className={`text-primary-500 mb-4 flex justify-center bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptom Analyzer CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaStethoscope className="text-5xl mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Not sure which doctor to consult?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Use our AI-powered Symptom Analyzer to get instant doctor recommendations
            </p>
            <Link to="/symptom-analyzer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Try Symptom Analyzer →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Patients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real stories from real patients</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 text-center shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-gray-600">Book your appointment today and experience the best healthcare</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Register Now
                </motion.button>
              </Link>
              <Link to="/doctors">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-primary-500 text-primary-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-primary-500 hover:text-white transition-all"
                >
                  Find a Doctor
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home