import React, { useState } from 'react';
import { Smartphone, Shield, Lock, Settings, BarChart, Cloud, CheckCircle, MapPin, Clock, Navigation } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    }, 5000);
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
      <header className="fixed top-0 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <span className="text-xl font-bold">SMART Soluciones</span>
            </div>
            <nav className="hidden md:flex gap-8">
              <button onClick={() => scrollToSection('about')} className="hover:opacity-80 transition-opacity font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('product')} className="hover:opacity-80 transition-opacity font-medium">
                Product
              </button>
              <button onClick={() => scrollToSection('use-cases')} className="hover:opacity-80 transition-opacity font-medium">
                Use Cases
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:opacity-80 transition-opacity font-medium">
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Enterprise Mobile Device Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            Secure, scalable, and intelligent MDM solutions for modern businesses
          </p>
          <button 
            onClick={() => scrollToSection('contact')}
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">About Us</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            SMART SOLUCIONES TECNOLÓGICAS C.A. is a Venezuelan technology company specializing in enterprise software solutions and infrastructure services for business customers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                We are dedicated to developing cutting-edge technology solutions that empower businesses to securely manage their mobile device fleets with confidence and efficiency.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Our flagship product, SMDM (SMART Mobile Device Management), is currently in active development and pilot phase, designed specifically for enterprise environments that require robust device management, security, and compliance capabilities.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Based in Venezuela, we serve businesses across Latin America with innovative solutions built on Android Enterprise technology, ensuring scalability, security, and seamless integration with existing enterprise infrastructure.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <StatCard number="100%" label="Enterprise Focus" />
              <StatCard number="B2B" label="Business Model" />
              <StatCard number="24/7" label="Support" />
              <StatCard number="LATAM" label="Regional Coverage" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-20 bg-gray-50">
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
            />
            <FeatureCard 
              icon={<Settings className="w-8 h-8" />}
              title="Policy Management"
              description="Centralized control over device configurations, app deployments, and security policies. Enforce compliance across your entire device fleet."
            />
            <FeatureCard 
              icon={<BarChart className="w-8 h-8" />}
              title="Real-time Monitoring"
              description="Comprehensive dashboards and reporting tools to track device status, compliance, and usage across your organization."
            />
            <FeatureCard 
              icon={<Navigation className="w-8 h-8" />}
              title="Lifecycle Management"
              description="Complete device lifecycle support from enrollment to retirement, including automated provisioning and decommissioning workflows."
            />
            <FeatureCard 
              icon={<Cloud className="w-8 h-8" />}
              title="Cloud-Based Platform"
              description="Scalable cloud infrastructure that grows with your business. Access your management console from anywhere, anytime."
            />
            <FeatureCard 
              icon={<Smartphone className="w-8 h-8" />}
              title="API Integration"
              description="Seamless integration with existing enterprise systems through our comprehensive API. Built on Android Management API standards."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-white">
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
            />
            <UseCaseCard 
              title="🤝 Leasing & Service Providers"
              items={[
                "Device fleet management for leasing companies",
                "Authorized IT administrator control",
                "Service provider device management",
                "Business-to-business leasing scenarios"
              ]}
            />
            <UseCaseCard 
              title="👥 Enterprise Deployment"
              items={[
                "Contractor and temporary worker devices",
                "Managed device provisioning",
                "Compliance enforcement",
                "Secure enterprise policies"
              ]}
            />
            <UseCaseCard 
              title="🔐 Compliance & Security"
              items={[
                "Industry-specific compliance requirements",
                "Data protection regulations",
                "Security audit capabilities",
                "Risk management and monitoring"
              ]}
            />
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Important Note</h3>
            <p className="text-gray-700 leading-relaxed">
              SMDM is strictly for <strong>enterprise and business use cases</strong>. All devices are corporate-owned or business-owned, managed by authorized IT administrators. Our solution complies with Android Enterprise policies and does not involve consumer credit, advertising, or personal data monetization.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Contact Us</h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Get in touch to learn more about SMDM or to request a pilot program
          </p>
          
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6">
              Thank you for your message! We will get back to you shortly.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Inquiry *</label>
              <select
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select an option</option>
                <option value="pilot">Pilot Program</option>
                <option value="demo">Request Demo</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-vertical"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-4">SMART Soluciones Tecnológicas C.A.</h3>
              <p className="text-gray-300 text-sm">Enterprise Mobile Device Management Solutions</p>
              <p className="text-gray-300 text-sm mt-2">Venezuela</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-4">Product</h3>
              <button onClick={() => scrollToSection('product')} className="block text-gray-300 hover:text-white mb-2 text-sm">
                SMDM Platform
              </button>
              <button onClick={() => scrollToSection('use-cases')} className="block text-gray-300 hover:text-white mb-2 text-sm">
                Use Cases
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white text-sm">
                Request Demo
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-4">Company</h3>
              <button onClick={() => scrollToSection('about')} className="block text-gray-300 hover:text-white mb-2 text-sm">
                About Us
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white text-sm">
                Contact
              </button>
            </div>
            
            <div>
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
    </div>
  );
};

// Componente de tarjeta de estadística
const StatCard = ({ number, label }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform">
    <div className="text-3xl font-bold text-purple-600 mb-2">{number}</div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

// Componente de tarjeta de característica
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all">
    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Componente de tarjeta de caso de uso
const UseCaseCard = ({ title, items }) => (
  <div className="bg-white rounded-xl border-l-4 border-purple-600 shadow-md p-6 hover:shadow-xl transition-shadow">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-gray-600">
          <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage;
