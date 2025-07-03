"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router"
import {
  ShipWheelIcon,
  MessageCircle,
  Video,
  Bell,
  User,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  Globe,
  Sparkles,
  Play,
  Heart,
  Rocket,
  Monitor,
  Smartphone,
  Settings,
  Group,
} from "lucide-react"

const features = [
  {
    title: "Instant Messaging",
    desc: "Chat in real time with friends and colleagues in a secure environment.",
    icon: <MessageCircle className="w-8 h-8" />, 
    color: "text-primary",
    gradient: "from-primary/20 to-secondary/10",
  },
  {
    title: "HD Video Calls",
    desc: "Enjoy crystal-clear video calls with professional quality.",
    icon: <Video className="w-8 h-8" />, 
    color: "text-secondary",
    gradient: "from-secondary/20 to-accent/10",
  },
  {
    title: "Smart Notifications",
    desc: "Stay informed with personalized and contextual notifications.",
    icon: <Bell className="w-8 h-8" />, 
    color: "text-accent",
    gradient: "from-accent/20 to-info/10",
  },
  {
    title: "Advanced Profiles",
    desc: "Create a rich profile with your preferences and interests.",
    icon: <User className="w-8 h-8" />, 
    color: "text-info",
    gradient: "from-info/20 to-warning/10",
  },
  {
    title: "Group Learning",
    desc: "Join or create learning groups, chat, share resources, and practice together.",
    icon: <Group className="w-8 h-8" />,
    color: "text-success",
    gradient: "from-success/20 to-primary/10",
  },
  {
    title: "Public User Profiles",
    desc: "Showcase your language journey and connect with learners worldwide.",
    icon: <User className="w-8 h-8" />,
    color: "text-warning",
    gradient: "from-warning/20 to-secondary/10",
  },
  {
    title: "Member Management",
    desc: "Admins can promote, demote, or remove members for a safe and dynamic community.",
    icon: <Shield className="w-8 h-8" />,
    color: "text-error",
    gradient: "from-error/20 to-accent/10",
  },
]

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Language Student",
    avatar: "https://avatar.iran.liara.run/public/90",
    content:
      "Streamify has revolutionized my language learning. The group conversations are natural and enriching!",
    rating: 5,
  },
  {
    name: "Jean Martin",
    role: "Teacher",
    avatar: "https://avatar.iran.liara.run/public/23",
    content:
      "An outstanding platform to connect my students worldwide. Intuitive interface and complete features.",
    rating: 5,
  },
  {
    name: "Sofia Rodriguez",
    role: "Developer",
    avatar: "https://avatar.iran.liara.run/public/45",
    content: "The video call quality is impressive. Perfect for my international mentoring sessions.",
    rating: 5,
  },
  {
    name: "Ava Lee",
    role: "Group Admin",
    avatar: "https://avatar.iran.liara.run/public/12",
    content: "Managing my language group is so easy with Streamify's member management tools!",
    rating: 5,
  },
]

const stats = [
  { number: "50K+", label: "Active users", icon: <Users className="w-6 h-6" /> },
  { number: "120+", label: "Countries represented", icon: <Globe className="w-6 h-6" /> },
  { number: "1M+", label: "Messages exchanged", icon: <MessageCircle className="w-6 h-6" /> },
  { number: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> },
  { number: "2K+", label: "Active learning groups", icon: <Group className="w-6 h-6" /> },
]

const appScreenshots = [
  {
    title: "Home Page",
    description: "Discover your community and connect easily",
    image: "/home.png",
    features: ["Advanced search", "Smart filters", "Real-time stats"],
  },
  {
    title: "User Profile",
    description: "Personalize your experience and manage your preferences",
    image: "/profile.png",
    features: ["Complete profile", "Advanced preferences", "Social networks"],
  },
  {
    title: "Group Chat",
    description: "Collaborate and learn together in real time",
    image: "/group-chat.png",
    features: ["Group messaging", "File sharing", "Practice sessions"],
  },
  {
    title: "Settings",
    description: "Control every aspect of your account",
    image: "/settings.png",
    features: ["Advanced security", "Notifications", "Custom themes"],
  },
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const screenshotTimer = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % appScreenshots.length)
    }, 4000)
    return () => clearInterval(screenshotTimer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: entry.isIntersecting,
            }))
          })
        },
        { threshold: 0.1 },
    )

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
      <div className="min-h-screen flex flex-col bg-base-100">
        {/* Header */}
        <header className="navbar bg-base-100/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-base-300">
          <div className="navbar-start">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-2xl w-12">
                  <ShipWheelIcon className="w-6 h-6" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Streamify
            </span>
            </div>
          </div>

          <div className="navbar-center hidden lg:flex">
            <nav className="menu menu-horizontal px-1 gap-2">
              <a href="#features" className="btn btn-ghost btn-sm">
                Features
              </a>
              <a href="#why" className="btn btn-ghost btn-sm">
                Why Streamify?
              </a>
              <a href="#screenshots" className="btn btn-ghost btn-sm">
                App Screenshots
              </a>
              <a href="#testimonials" className="btn btn-ghost btn-sm">
                Testimonials
              </a>
              <a href="#contact" className="btn btn-ghost btn-sm">
                Contact
              </a>
            </nav>
          </div>

          <div className="navbar-end gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm gap-2">
              <Rocket className="w-4 h-4" />
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section
            className="hero min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden"
            id="hero"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="hero-content text-center relative z-10 max-w-6xl mx-auto px-4">
            <div className="max-w-4xl">
              <div className="badge badge-primary badge-lg gap-2 mb-6 animate-bounce">
                <Sparkles className="w-4 h-4" />
                Next-generation communication
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Connect.
                <br />
                <span className="text-4xl md:text-6xl">Share. Collaborate.</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                The modern platform to learn, communicate, and build authentic connections with people from all over the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link to="/signup" className="btn btn-primary btn-lg gap-3 group shadow-2xl">
                  <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <button className="btn btn-outline btn-lg gap-3 group">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  See Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="card-body items-center text-center py-6">
                        <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-primary">{stat.number}</div>
                        <div className="text-sm text-base-content/70">{stat.label}</div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 bg-base-200 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge badge-secondary badge-lg gap-2 mb-4">
                <Star className="w-4 h-4" />
                Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Everything you need
              </h2>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                Powerful and intuitive tools for an exceptional communication experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className={`card bg-gradient-to-br ${feature.gradient} border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105 ${
                          isVisible.features ? "animate-in slide-in-from-bottom duration-700" : ""
                      }`}
                      style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="card-body items-center text-center p-8">
                      <div className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="card-title text-lg mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-base-content/70 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="py-24 px-4 bg-base-100" id="screenshots">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge badge-accent badge-lg gap-2 mb-4">
                <Monitor className="w-4 h-4" />
                App Screenshots
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover our application</h2>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                A modern and intuitive interface designed for an outstanding user experience
              </p>
            </div>

            {/* Screenshot Carousel */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              {/* Screenshot Display */}
              <div className="flex-1 relative">
                <div className="mockup-browser border bg-base-300 shadow-2xl">
                  <div className="mockup-browser-toolbar">
                    <div className="input">https://streamify.app</div>
                  </div>
                  <div className="bg-base-200 flex justify-center px-4 py-16">
                    <div className="relative w-full max-w-4xl">
                      <img
                          src={appScreenshots[currentScreenshot].image || "/placeholder.svg"}
                          alt={appScreenshots[currentScreenshot].title}
                          className="w-full h-auto rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshot Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-4">{appScreenshots[currentScreenshot].title}</h3>
                  <p className="text-lg text-base-content/70 mb-6">{appScreenshots[currentScreenshot].description}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Key features:</h4>
                  {appScreenshots[currentScreenshot].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-base-content/80">{feature}</span>
                      </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex gap-2 pt-4">
                  {appScreenshots.map((_, index) => (
                      <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentScreenshot ? "bg-primary scale-125" : "bg-base-300 hover:bg-base-400"
                          }`}
                          onClick={() => setCurrentScreenshot(index)}
                      />
                  ))}
                </div>
              </div>
            </div>

            {/* App Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Smartphone className="w-8 h-8" />,
                  title: "Mobile App",
                  desc: "Available on iOS and Android with all features",
                },
                {
                  icon: <Monitor className="w-8 h-8" />,
                  title: "Web Version",
                  desc: "Access your account from any browser",
                },
                {
                  icon: <Settings className="w-8 h-8" />,
                  title: "Customization",
                  desc: "Adapt the interface to your preferences and needs",
                },
              ].map((item, index) => (
                  <div
                      key={index}
                      className="card bg-base-200 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="card-body items-center text-center p-6">
                      <div className="text-primary mb-4">{item.icon}</div>
                      <h3 className="card-title text-lg mb-2">{item.title}</h3>
                      <p className="text-base-content/70">{item.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-4 bg-gradient-to-br from-secondary/10 to-accent/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="badge badge-info badge-lg gap-2 mb-4">
              <Heart className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What our users say</h2>
            <p className="text-xl text-base-content/70 mb-12">
              Join thousands of satisfied users around the world
            </p>

            <div className="card bg-base-100 shadow-2xl border border-base-300 max-w-2xl mx-auto">
              <div className="card-body p-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning fill-current" />
                  ))}
                </div>

                <blockquote className="text-lg italic mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                          src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                          alt={testimonials[currentTestimonial].name}
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-base-content/70">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                  <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? "bg-primary scale-125" : "bg-base-300 hover:bg-base-400"
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                  />
              ))}
            </div>
          </div>
        </section>

        {/* Why Streamify Section */}
        <section id="why" className="py-24 px-4 bg-base-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="badge badge-warning badge-lg gap-2 mb-4">
                <Shield className="w-4 h-4" />
                Why Streamify?
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Why choose Streamify?</h2>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                A platform designed with your needs at the heart of our priorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Security & Privacy",
                  desc: "End-to-end encryption and maximum protection of your personal data.",
                  color: "text-success",
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Ease of Use",
                  desc: "Intuitive and modern interface designed for all user levels.",
                  color: "text-warning",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Active Community",
                  desc: "Join a dynamic and welcoming global community.",
                  color: "text-info",
                },
              ].map((item, index) => (
                  <div
                      key={index}
                      className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="card-body items-center text-center p-8">
                      <div className={`${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                      <h3 className="card-title text-lg mb-3">{item.title}</h3>
                      <p className="text-base-content/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to get started?
            </h2>
            <p className="text-xl text-base-content/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who already trust Streamify for their communications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg gap-3 shadow-2xl group">
                <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Create a Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                I already have an account
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-4 bg-base-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
            <p className="text-lg text-base-content/70 mb-8">
              Questions or feedback? Our team is here to help
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Email", value: "contact@streamify.com", href: "mailto:contact@streamify.com" },
                { label: "Twitter", value: "@StreamifyApp", href: "https://twitter.com/" },
                { label: "Support", value: "Help Center", href: "#" },
              ].map((contact, index) => (
                  <a
                      key={index}
                      href={contact.href}
                      className="card bg-base-200 hover:bg-base-300 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="card-body items-center text-center py-6">
                      <div className="font-semibold">{contact.label}</div>
                      <div className="text-sm text-base-content/70">{contact.value}</div>
                    </div>
                  </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer footer-center p-10 bg-base-300 text-base-content">
          <div className="grid grid-flow-col gap-4">
            <a href="#features" className="link link-hover">
              Features
            </a>
            <a href="#why" className="link link-hover">
              Why Streamify?
            </a>
            <a href="#screenshots" className="link link-hover">
              App Screenshots
            </a>
            <a href="#testimonials" className="link link-hover">
              Testimonials
            </a>
            <a href="#contact" className="link link-hover">
              Contact
            </a>
          </div>
          <div className="grid grid-flow-col gap-4">
            <a href="#" className="link link-hover">
              Privacy Policy
            </a>
            <a href="#" className="link link-hover">
              Terms of Use
            </a>
            <a href="#" className="link link-hover">
              Support
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-2xl w-8">
                <ShipWheelIcon className="w-4 h-4" />
              </div>
            </div>
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Streamify
          </span>
            <span>© {new Date().getFullYear()} - All rights reserved</span>
          </div>
        </footer>
      </div>
  )
}
