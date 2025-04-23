import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import pic from '../assets/Pic.jpg';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.img 
                src={logo} 
                alt="TaskFlow Logo" 
                className="h-9"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/EmployeeLogin" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                For Employees
              </Link>
              <Link 
                to="/AdminLogin" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                For Administrators
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Particle Background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated background elements */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-100/30"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Transform Your Workflow
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The next-generation platform for seamless task management and team collaboration.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/EmployeeLogin"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all block"
                >
                  Employee Portal
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/AdminLogin"
                  className="bg-white text-gray-800 px-8 py-4 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200 block"
                >
                  Admin Console
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial=""
            animate={controls}
            variants={container}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed to boost productivity and streamline collaboration
            </motion.p>
          </motion.div>
          
          <motion.div
            ref={ref}
            initial=""
            animate={controls}
            variants={container}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Lightning Fast',
                description: 'Instant updates and real-time synchronization across all devices.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                title: 'Enterprise Security',
                description: 'Military-grade encryption and role-based access controls.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                title: 'Reliable Infrastructure',
                description: '99.9% uptime with automatic failover and backups.',
                color: 'from-green-500 to-green-600'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-6`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={container}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: 95, suffix: '%', label: 'User Satisfaction' },
              { value: 40, suffix: '%', label: 'Time Saved' },
              { value: 10000, suffix: '+', label: 'Daily Tasks' },
              { value: 24, suffix: '/7', label: 'Support' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="p-6"
              >
                <motion.p 
                  className="text-5xl font-bold mb-2"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.value}<span className="text-blue-200">{stat.suffix}</span>
                </motion.p>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={container}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of organizations transforming their workflow
            </motion.p>
          </motion.div>
          
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={container}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                quote: "TaskFlow reduced our project management overhead by 60% while improving team collaboration.",
                name: "Sarah Johnson",
                title: "CTO, TechCorp",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The intuitive interface means our team actually uses it daily without extensive training.",
                name: "Michael Chen",
                title: "Product Manager, InnovateCo",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "Implementation was seamless with our existing systems and the ROI was immediate.",
                name: "David Wilson",
                title: "Operations Director, Global Solutions",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <svg className="h-8 w-8 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA with Parallax Effect */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to revolutionize your workflow?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of teams already working smarter with TaskFlow
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/EmployeeLogin"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all inline-block"
            >
              Get Started Now
            </Link>
          </motion.div>
        </motion.div>
      </section>
{/* Contact Developer Section */}
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="grid md:grid-cols-2">
        {/* Left Side - Developer Info */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-full">
              <div className="bg-white p-1 rounded-full">
                <img 
                  src={pic} // Replace with your photo
                  alt="Abir Maji"
                  className="h-24 w-24 rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900">Abir Maji</h3>
              <p className="text-blue-600">MERN Stack Developer</p>
              <p className="text-sm text-gray-500 mt-1">Asansol, West Bengal, India</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <a href="mailto:abirmaji296@gmail.com" className="text-base text-gray-900 hover:text-blue-600 transition-colors">
                  abirmaji296@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <a href="tel:+918343034296" className="text-base text-gray-900 hover:text-blue-600 transition-colors">
                  (+91) 8343034296
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - CV Download and Social Links */}
        <div className="p-8 md:p-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Get My Full Profile</h3>
          
          <div className="mb-8">
            <a 
              href="https://drive.google.com/file/d/1fhmgi8Jrai-auYIJmjTLUqbLWJm0JFqa/view?usp=sharing" // Replace with your Google Drive CV link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV (PDF)
            </a>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">CONNECT WITH ME</h4>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com/in/abir-maji" // Replace with your LinkedIn
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
              >
                <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/abir-maji" // Replace with your GitHub
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
              >
                <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
  href="https://wa.me/918343034296" // Replace with your WhatsApp number in international format (no + or 0)
  target="_blank"
  rel="noopener noreferrer"
  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
>
  <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>
      {/* Animated Footer */}
      <motion.footer 
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="bg-gray-900 text-gray-400 py-12"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
        <ul className="space-y-2">
          <li><Link to="#" className="hover:text-white transition-colors">Features</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Pricing</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Integrations</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
        <ul className="space-y-2">
          <li><Link to="#" className="hover:text-white transition-colors">Documentation</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Guides</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          <li><Link to="#" className="hover:text-white transition-colors">About</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>
        <ul className="space-y-2">
          <li>
            <a href="mailto:abirmaji296@gmail.com" className="hover:text-white transition-colors">
              Email
            </a>
          </li>
          <li>
            <a href="tel:+918343034296" className="hover:text-white transition-colors">
              (+91) 8343034296
            </a>
          </li>
          <li>
            <span className="block mt-4 text-xs text-gray-500">
              Asansol, West Bengal, India
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <img src={logo} alt="TaskFlow Logo" className="h-8" />
        <span className="ml-2 text-white font-semibold">TaskFlow</span>
      </div>
      
      <div className="text-center mb-4 md:mb-0">
        <p className="text-sm">
          Developed by <span className="text-blue-400">Abir Maji</span> | 
          <span className="text-gray-500 ml-2">
            MERN Stack Developer at Zidio Development
          </span>
        </p>
        <div className="flex justify-center space-x-3 mt-2">
          <a href="https://github.com/abir-maji" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">GitHub</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/abir-maji" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">LinkedIn</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <p className="text-sm">
        &copy; {new Date().getFullYear()} TaskFlow, Inc. All rights reserved.
      </p>
    </div>
  </div>
</motion.footer>
    </div>
  );
};

export default LandingPage;