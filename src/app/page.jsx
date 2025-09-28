"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-[#7A5C3A]">Ayursutra</span>
          </motion.div>

          {/* Menu */}
          <div className="hidden md:flex space-x-8">
            {["Features", "Workflow", "Testimonials", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ y: -2 }}
                className="text-[#7A5C3A] hover:text-[#4C8C4A] transition-colors font-medium"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-[#7A5C3A] hover:text-[#4C8C4A] transition-colors font-medium"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-[#F4A300] to-[#2A9D8F] text-white rounded-full font-medium hover:shadow-lg transition-shadow"
            >
              Register
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-32 h-32 border-2 border-[#4C8C4A] rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-24 h-24 border-2 border-[#F4A300] rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#2A9D8F] rounded-full"
        />
      </div>

      <motion.div
        style={{ y }}
        className="relative z-10 text-center max-w-6xl mx-auto px-4"
      >
        {/* Sanskrit Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-[var(--font-noto-serif-devanagari)] text-[#7A5C3A] mb-2">
            स्वस्थस्य स्वास्थ्य रक्षणम्
          </h2>
          <p className="text-sm text-[#7A5C3A]/70 italic">
            Preserving the health of the healthy
          </p>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-[#4C8C4A] via-[#F4A300] to-[#2A9D8F] bg-clip-text text-transparent">
            Experience Personalized
          </span>
          <br />
          <span className="text-[#7A5C3A]">Ayurvedic Nutrition</span>
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#7A5C3A]/80">
            — Powered by AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-[#7A5C3A]/80 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover your unique Prakriti and receive personalized diet plans that
          harmonize with your body's natural constitution, enhanced by modern AI
          technology.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(244, 163, 0, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/Dietician/Dashboard'}
            className="px-8 py-4 bg-gradient-to-r from-[#F4A300] to-[#2A9D8F] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            For Dietitians
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(76, 140, 74, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            For Patients
          </motion.button>
        </motion.div>

        {/* Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 relative"
        >
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#4C8C4A]/20 to-[#2A9D8F]/20 rounded-full flex items-center justify-center">
            <div className="text-6xl">🧘‍♀️</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Quick Overview Section
const OverviewSection = () => {
  const features = [
    {
      title: "Personalized Diet Plans",
      description: "AI-powered recommendations based on your unique Prakriti",
      icon: "🍃",
    },
    {
      title: "Advanced Food Database",
      description: "Comprehensive Ayurvedic and modern nutrition knowledge",
      icon: "📚",
    },
    {
      title: "Dual Dashboards",
      description: "Separate interfaces for dietitians and patients",
      icon: "📊",
    },
    {
      title: "HIPAA Compliant",
      description: "Secure, privacy-focused healthcare platform",
      icon: "🔒",
    },
  ];

  return (
    <section className="py-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#7A5C3A] mb-4">
            Why Choose Ayursutra?
          </h2>
          <p className="text-lg text-[#7A5C3A]/80 max-w-2xl mx-auto">
            Combining ancient Ayurvedic wisdom with cutting-edge AI technology
            for personalized nutrition care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(76, 140, 74, 0.1)" 
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#7A5C3A] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#7A5C3A]/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Highlights Section
const FeatureHighlights = () => {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#7A5C3A] mb-8">
              Comprehensive Ayurvedic Nutrition Platform
            </h2>
            
            <div className="space-y-6">
              {[
                "Ayurvedic + modern recipes tailored to your constitution",
                "Advanced food database with 10,000+ ingredients",
                "Secure & HIPAA compliant patient data management",
                "Real-time diet feedback and progress tracking",
                "AI-powered Prakriti analysis and personalized plans",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-[#7A5C3A] text-lg">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#4C8C4A]/10 to-[#2A9D8F]/10 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="h-32 bg-gradient-to-br from-[#F4A300]/20 to-[#4C8C4A]/20 rounded-lg mb-3"></div>
                  <h4 className="font-semibold text-[#7A5C3A]">Dashboard</h4>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="h-32 bg-gradient-to-br from-[#2A9D8F]/20 to-[#F4A300]/20 rounded-lg mb-3"></div>
                  <h4 className="font-semibold text-[#7A5C3A]">Recipes</h4>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="h-32 bg-gradient-to-br from-[#4C8C4A]/20 to-[#2A9D8F]/20 rounded-lg mb-3"></div>
                  <h4 className="font-semibold text-[#7A5C3A]">Analysis</h4>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="h-32 bg-gradient-to-br from-[#F4A300]/20 to-[#4C8C4A]/20 rounded-lg mb-3"></div>
                  <h4 className="font-semibold text-[#7A5C3A]">Progress</h4>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Workflow Section
const WorkflowSection = () => {
  const steps = [
    {
      number: "01",
      title: "Onboarding",
      sanskrit: "प्रारंभ",
      description: "Complete your health profile and preferences",
      icon: "👤",
    },
    {
      number: "02",
      title: "Prakriti Analysis",
      sanskrit: "प्रकृति विश्लेषण",
      description: "AI analyzes your body constitution",
      icon: "🔍",
    },
    {
      number: "03",
      title: "Auto Diet Plan",
      sanskrit: "आहार योजना",
      description: "Personalized nutrition recommendations",
      icon: "📋",
    },
    {
      number: "04",
      title: "Real-time Tracking",
      sanskrit: "अनुवीक्षण",
      description: "Monitor progress and adjust plans",
      icon: "📊",
    },
  ];

  return (
    <section id="workflow" className="py-20 bg-gradient-to-br from-[#4C8C4A]/5 to-[#2A9D8F]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#7A5C3A] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[#7A5C3A]/80 max-w-2xl mx-auto">
            A simple 4-step process to transform your nutrition journey
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="w-16 h-16 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                
                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-[#7A5C3A] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm font-[var(--font-noto-serif-devanagari)] text-[#7A5C3A]/70 mb-3">
                  {step.sanskrit}
                </p>
                <p className="text-[#7A5C3A]/80 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Impact Section
const ImpactSection = () => {
  const impacts = [
    {
      title: "Community Health",
      description: "Improving nutrition awareness across communities",
      icon: "🌍",
      metric: "10K+",
      metricLabel: "Lives Impacted",
    },
    {
      title: "Practitioner Efficiency",
      description: "Streamlined workflows for healthcare providers",
      icon: "⚡",
      metric: "85%",
      metricLabel: "Time Saved",
    },
    {
      title: "Sustainable Eating",
      description: "Promoting eco-friendly nutrition choices",
      icon: "🌱",
      metric: "95%",
      metricLabel: "Plan Adherence",
    },
    {
      title: "Research Enablement",
      description: "Data-driven insights for nutrition research",
      icon: "🔬",
      metric: "50+",
      metricLabel: "Studies Supported",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#7A5C3A] mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-[#7A5C3A]/80 max-w-2xl mx-auto">
            Transforming healthcare through AI-powered Ayurvedic nutrition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(76, 140, 74, 0.15)"
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {impact.icon}
              </div>
              <div className="text-3xl font-bold text-[#4C8C4A] mb-2">
                {impact.metric}
              </div>
              <div className="text-sm text-[#7A5C3A]/70 mb-4">
                {impact.metricLabel}
              </div>
              <h3 className="text-xl font-semibold text-[#7A5C3A] mb-3">
                {impact.title}
              </h3>
              <p className="text-[#7A5C3A]/70 leading-relaxed">
                {impact.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Ayurvedic Practitioner",
      content: "Ayursutra has revolutionized how I approach patient care. The AI-powered Prakriti analysis is incredibly accurate.",
      avatar: "👩‍⚕️",
    },
    {
      name: "Rajesh Kumar",
      role: "Patient",
      content: "स्वस्थ्य के लिए सही आहार मिला। This platform truly understands my body's needs.",
      avatar: "👨‍💼",
    },
    {
      name: "Dr. Ananya Patel",
      role: "Nutritionist",
      content: "The integration of traditional Ayurveda with modern technology is seamless. My patients love the personalized approach.",
      avatar: "👩‍🔬",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-[#F4A300]/5 to-[#4C8C4A]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#7A5C3A] mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-[#7A5C3A]/80 max-w-2xl mx-auto">
            Hear from practitioners and patients who have transformed their nutrition journey
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <div className="text-6xl mb-6">{testimonials[currentTestimonial].avatar}</div>
            <blockquote className="text-xl text-[#7A5C3A] mb-6 leading-relaxed">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            <div>
              <h4 className="text-lg font-semibold text-[#7A5C3A]">
                {testimonials[currentTestimonial].name}
              </h4>
              <p className="text-[#7A5C3A]/70">
                {testimonials[currentTestimonial].role}
              </p>
            </div>
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-[#4C8C4A] scale-125"
                    : "bg-[#7A5C3A]/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#4C8C4A] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-[#F4A300] rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#2A9D8F] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7A5C3A] mb-6">
            Join the Future of
            <br />
            <span className="bg-gradient-to-r from-[#4C8C4A] via-[#F4A300] to-[#2A9D8F] bg-clip-text text-transparent">
              Ayurvedic Nutrition
            </span>
          </h2>
          <p className="text-lg text-[#7A5C3A]/80 mb-12 max-w-2xl mx-auto">
            Start your personalized nutrition journey today. Whether you're a
            practitioner or patient, discover the power of AI-enhanced Ayurveda.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(42, 157, 143, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#2A9D8F] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Request a Demo
            </motion.button>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(244, 163, 0, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/Dietician/Dashboard'}
              className="px-8 py-4 bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started as a Dietitian
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#7A5C3A] to-[#4C8C4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-white/80">
              <p>📧 info@ayursutra.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 San Francisco, CA</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {["Features", "Pricing", "About", "Blog"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Partnerships */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Partnerships</h3>
            <div className="space-y-2 text-white/80">
              <p>Healthcare Providers</p>
              <p>Nutrition Schools</p>
              <p>Research Institutions</p>
            </div>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {["📘", "🐦", "📷", "💼"].map((icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2 }}
                  className="text-2xl"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 Ayursutra. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
      </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Navigation />
      <HeroSection />
      <OverviewSection />
      <FeatureHighlights />
      <WorkflowSection />
      <ImpactSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
