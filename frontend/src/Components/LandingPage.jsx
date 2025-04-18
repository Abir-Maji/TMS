import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
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
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
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
            initial="hidden"
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
            initial="hidden"
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
        
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
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={logo} alt="TaskFlow Logo" className="h-8" />
              <span className="ml-2 text-white font-semibold">TaskFlow</span>
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