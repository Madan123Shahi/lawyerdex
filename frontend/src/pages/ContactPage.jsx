import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { contactSchema } from '../validators/schemas';
import { contactAPI } from '../api/apiClient';
import { Alert } from '../components/common';

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      await contactAPI.submit(data);
      setSuccess(true);
      reset();
    } catch (err) {
      setApiError(err.normalized?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-primary-800 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Get In Touch</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary-700 mb-4">We're here to help</h2>
              <p className="text-gray-600 leading-relaxed">
                Whether you have a question about finding the right lawyer, need help navigating the platform, or want to learn more about our services, our team is ready to assist you.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email Us', value: 'contact@lawyerdex.com', href: 'mailto:contact@lawyerdex.com' },
                { icon: Phone, label: 'Call Us', value: '+1 (814) 300-8055', href: 'tel:+18143008055' },
                { icon: MapPin, label: 'Location', value: 'United States', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                    {href ? (
                      <a href={href} className="text-primary-700 font-medium hover:text-primary-500 transition-colors">{value}</a>
                    ) : (
                      <p className="text-primary-700 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business hours */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Business Hours</h3>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">9:00 AM – 6:00 PM EST</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-medium">10:00 AM – 4:00 PM EST</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-gray-400">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-green-500" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <h2 className="font-display text-xl font-bold text-primary-700 mb-2">Send a Message</h2>

                  {apiError && <Alert type="error" message={apiError} />}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input {...register('name')} placeholder="John Doe" className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`} />
                      {errors.name && <p className="error-text">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input {...register('email')} type="email" placeholder="john@example.com" className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`} />
                      {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input {...register('phone')} placeholder="+1 (555) 000-0000" className={`input-field ${errors.phone ? 'border-red-400 focus:ring-red-300' : ''}`} />
                    {errors.phone && <p className="error-text">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                    <input {...register('subject')} placeholder="How can we help you?" className={`input-field ${errors.subject ? 'border-red-400 focus:ring-red-300' : ''}`} />
                    {errors.subject && <p className="error-text">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Please describe your legal situation or question in detail..."
                      className={`input-field resize-none ${errors.message ? 'border-red-400 focus:ring-red-300' : ''}`}
                    />
                    {errors.message && <p className="error-text">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
