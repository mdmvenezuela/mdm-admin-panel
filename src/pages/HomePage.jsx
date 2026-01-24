import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, Lock, Settings, BarChart, Cloud, CheckCircle, MapPin, Clock, Navigation, AlertCircle, Send } from 'lucide-react';

// Configuración de la API - MODIFICA ESTA URL SEGÚN TU BACKEND
const API_URL = 'https://app.solvenca.lat/api';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiry: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer para animaciones al hacer scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    // Observar todas las secciones
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          inquiry: '',
          message: ''
        });
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 8000);

        // Scroll suave hacia el mensaje de éxito
        setTimeout(() => {
          document.getElementById('success-message')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }, 100);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Error al enviar el mensaje. Por favor intenta nuevamente.');
        setShowError(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrorMessage('Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <span className="text-xl font-bold">SMART Soluciones</span>
            </div>
            <nav className="hidden md:flex gap-8">
              <button 
                onClick={() => scrollToSection('about')} 
                className="hover:opacity-80 transition-all font-medium hover:scale-105 transform"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('product')} 
                className="hover:opacity-80 transition-all font-medium hover:scale-105 transform"
              >
                Product
              </button>
              <button 
                onClick={() => scrollToSection('use-cases')} 
                className="hover:opacity-80 transition-all font-medium hover:scale-105 transform"
              >
                Use Cases
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="hover:opacity-80 transition-all font-medium hover:scale-105 transform"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Elementos decorativos animados */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Enterprise Mobile Device Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 animate-fade-in-up animation-delay-200">
              Secure, scalable, and intelligent MDM solutions for modern businesses
            </p>
            <button 
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all animate-fade-in-up animation-delay-400 hover:scale-105"
            >
              Get Started
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">About Us</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            SMART SOLUCIONES TECNOLÓGICAS C.A. is a Venezuelan technology company specializing in enterprise software solutions and infrastructure services for business customers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed transform transition-all duration-500 hover:translate-x-2">
                We are dedicated to developing cutting-edge technology solutions that empower businesses to securely manage their mobile device fleets with confidence and efficiency.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed transform transition-all duration-500 hover:translate-x-2">
                Our flagship product, SMDM (SMART Mobile Device Management), is currently in active development and pilot phase, designed specifically for enterprise environments that require robust device management, security, and compliance capabilities.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed transform transition-all duration-500 hover:translate-x-2">
                Based in Venezuela, we serve businesses across Latin America with innovative solutions built on Android Enterprise technology, ensuring scalability, security, and seamless integration with existing enterprise infrastructure.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <StatCard number="100%" label="Enterprise Focus" delay="0" />
              <StatCard number="B2B" label="Business Model" delay="100" />
              <StatCard number="24/7" label="Support" delay="200" />
              <StatCard number="LATAM" label="Regional Coverage" delay="300" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section 
        id="product" 
        className={`py-20 bg-gray-50 transition-all duration-1000 ${
          isVisible.product ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">SMDM Platform</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            Our comprehensive Mobile Device Management solution built on Android Enterprise technology
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Lock className="w-8 h-8" />}
              title="Enterprise Security"
              description="Advanced security policies and encryption to protect corporate data on all managed devices. Full compliance with Android Enterprise security standards."
              delay="0"
            />
            <FeatureCard 
              icon={<Settings className="w-8 h-8" />}
              title="Policy Management"
              description="Centralized control over device configurations, app deployments, and security policies. Enforce compliance across your entire device fleet."
              delay="100"
            />
            <FeatureCard 
              icon={<BarChart className="w-8 h-8" />}
              title="Real-time Monitoring"
              description="Comprehensive dashboards and reporting tools to track device status, compliance, and usage across your organization."
              delay="200"
            />
            <FeatureCard 
              icon={<Navigation className="w-8 h-8" />}
              title="Lifecycle Management"
              description="Complete device lifecycle support from enrollment to retirement, including automated provisioning and decommissioning workflows."
              delay="300"
            />
            <FeatureCard 
              icon={<Cloud className="w-8 h-8" />}
              title="Cloud-Based Platform"
              description="Scalable cloud infrastructure that grows with your business. Access your management console from anywhere, anytime."
              delay="400"
            />
            <FeatureCard 
              icon={<Smartphone className="w-8 h-8" />}
              title="API Integration"
              description="Seamless integration with existing enterprise systems through our comprehensive API. Built on Android Management API standards."
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section 
        id="use-cases" 
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible['use-cases'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Use Cases</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            SMDM is designed for enterprise and business scenarios where secure device management is critical
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <UseCaseCard 
              title="🏢 Corporate Device Management"
              items={[
                "Company-owned devices for employees",
                "Full device management and control",
                "Corporate app deployment",
                "Data protection and security"
              ]}
              delay="0"
            />
            <UseCaseCard 
              title="🤝 Leasing & Service Providers"
              items={[
                "Device fleet management for leasing companies",
                "Authorized IT administrator control",
                "Service provider device management",
                "Business-to-business leasing scenarios"
              ]}
              delay="100"
            />
            <UseCaseCard 
              title="👥 Enterprise Deployment"
              items={[
                "Contractor and temporary worker devices",
                "Managed device provisioning",
                "Compliance enforcement",
                "Secure enterprise policies"
              ]}
              delay="200"
            />
            <UseCaseCard 
              title="🔐 Compliance & Security"
              items={[
                "Industry-specific compliance requirements",
                "Data protection regulations",
                "Security audit capabilities",
                "Risk management and monitoring"
              ]}
              delay="300"
            />
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-6 transform transition-all duration-500 hover:shadow-lg hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Important Note</h3>
            <p className="text-gray-700 leading-relaxed">
              SMDM is strictly for <strong>enterprise and business use cases</strong>. All devices are corporate-owned or business-owned, managed by authorized IT administrators. Our solution complies with Android Enterprise policies and does not involve consumer credit, advertising, or personal data monetization.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className={`py-20 bg-gray-50 transition-all duration-1000 ${
          isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Contact Us</h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Get in touch to learn more about SMDM or to request a pilot program
          </p>
          
          {showSuccess && (
            <div id="success-message" className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 animate-fade-in flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Message sent successfully!</p>
                <p className="text-sm">Thank you for contacting us. We will get back to you shortly.</p>
              </div>
            </div>
          )}

          {showError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6 animate-fade-in flex items-center gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error sending message</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Inquiry *</label>
              <select
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select an option</option>
                <option value="pilot">Pilot Program</option>
                <option value="demo">Request Demo</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-bold text-purple-400 mb-4">SMART Soluciones Tecnológicas C.A.</h3>
              <p className="text-gray-300 text-sm">Enterprise Mobile Device Management Solutions</p>
              <p className="text-gray-300 text-sm mt-2">Ctra H Cc Su Centro Nivel Pb, Local 04, Zulia, Venezuela</p>
            </div>
            
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Product</h3>
              <button onClick={() => scrollToSection('product')} className="block text-gray-300 hover:text-white mb-2 text-sm transition-colors">
                SMDM Platform
              </button>
              <button onClick={() => scrollToSection('use-cases')} className="block text-gray-300 hover:text-white mb-2 text-sm transition-colors">
                Use Cases
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white text-sm transition-colors">
                Request Demo
              </button>
            </div>
            
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Company</h3>
              <button onClick={() => scrollToSection('about')} className="block text-gray-300 hover:text-white mb-2 text-sm transition-colors">
                About Us
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white text-sm transition-colors">
                Contact
              </button>
            </div>
            
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Compliance</h3>
              <p className="text-gray-300 text-sm mb-2">Built on Android Enterprise</p>
              <p className="text-gray-300 text-sm mb-2">Enterprise Security Standards</p>
              <p className="text-gray-300 text-sm">B2B Solutions Only</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 SMART SOLUCIONES TECNOLÓGICAS C.A. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

// Componente de tarjeta de estadística con animación
const StatCard = ({ number, label, delay }) => (
  <div 
    className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-3xl font-bold text-purple-600 mb-2">{number}</div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

// Componente de tarjeta de característica con animación
const FeatureCard = ({ icon, title, description, delay }) => (
  <div 
    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white mb-4 transform transition-transform hover:scale-110">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Componente de tarjeta de caso de uso con animación
const UseCaseCard = ({ title, items, delay }) => (
  <div 
    className="bg-white rounded-xl border-l-4 border-purple-600 shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-gray-600 transform transition-all hover:translate-x-1">
          <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage;
