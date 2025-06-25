import React from "react";
import { Link } from "react-router";
import { ShipWheelIcon } from 'lucide-react';

const features = [
  {
    title: "Chat instantané",
    desc: "Discutez en temps réel avec vos amis et collègues.",
    icon: "💬",
  },
  {
    title: "Appels vidéo",
    desc: "Passez des appels vidéo fluides et sécurisés.",
    icon: "🎥",
  },
  {
    title: "Notifications intelligentes",
    desc: "Restez informé de tout ce qui compte pour vous.",
    icon: "🔔",
  },
  {
    title: "Profils avancés",
    desc: "Personnalisez votre expérience et vos préférences.",
    icon: "👤",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md sticky top-0 z-50">
        <div className="flex-1">
          <ShipWheelIcon className='size-9 text-primary' />
          <span className="text-2xl font-bold text-primary">Streamify</span>
        </div>
        <nav className="flex gap-4">
          <a href="#features" className="btn btn-ghost">Fonctionnalités</a>
          <a href="#why" className="btn btn-ghost">Pourquoi ?</a>
          <a href="#contact" className="btn btn-ghost">Contact</a>
          <Link to="/login" className="btn btn-outline btn-primary">Connexion</Link>
          <Link to="/signup" className="btn btn-primary">S'inscrire</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 gap-8 bg-gradient-to-br from-primary/10 to-base-100" id="hero">
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-primary">Connectez-vous. Partagez. Collaborez.</h1>
          <p className="text-lg md:text-2xl mb-6 text-base-content/80">La plateforme moderne pour apprendre, appeler et créer des liens en toute simplicité.</p>
          <div className="flex gap-4">
            <Link to="/signup" className="btn btn-primary btn-lg">Commencer</Link>
            <a href="#features" className="btn btn-outline btn-primary btn-lg">Découvrir</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/landing-hero.svg" alt="Streamify Hero" className="max-w-xs md:max-w-md rounded-xl shadow-lg" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 bg-base-200">
        <h2 className="text-3xl font-bold text-center mb-10">Fonctionnalités clés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="card bg-base-100 shadow-xl p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-base-content/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 px-8 max-w-5xl mx-auto flex flex-col items-center" id="screenshots">
        <h2 className="text-3xl font-bold mb-8">Aperçu de l'interface</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <img src="/screenshot1.png" alt="Aperçu 1" className="w-100 rounded-lg shadow-md" />
          <img src="/screenshot2.png" alt="Aperçu 2" className="w-100 rounded-lg shadow-md" />
          <img src="/screenshot3.png" alt="Aperçu 3" className="w-100 rounded-lg shadow-md" />
        </div>
      </section>

      {/* Why Streamify Section */}
      <section id="why" className="py-16 px-8 bg-base-200">
        <h2 className="text-3xl font-bold text-center mb-10">Pourquoi choisir Streamify ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card bg-base-100 shadow p-6">
            <h3 className="font-bold text-lg mb-2">Sécurité & Confidentialité</h3>
            <p>Vos données sont protégées et vos conversations restent privées.</p>
          </div>
          <div className="card bg-base-100 shadow p-6">
            <h3 className="font-bold text-lg mb-2">Simplicité d'utilisation</h3>
            <p>Une interface intuitive pensée pour tous les utilisateurs.</p>
          </div>
          <div className="card bg-base-100 shadow p-6">
            <h3 className="font-bold text-lg mb-2">Communauté active</h3>
            <p>Rejoignez une communauté dynamique et bienveillante.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-8 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Nous contacter</h2>
        <p className="mb-4">Une question ? Un retour ? Contactez-nous sur nos réseaux sociaux :</p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="mailto:contact@streamify.com" className="btn btn-outline btn-sm">Email</a>
          <a href="https://twitter.com/" target="_blank" rel="noopener" className="btn btn-outline btn-sm">Twitter</a>
          <a href="https://facebook.com/" target="_blank" rel="noopener" className="btn btn-outline btn-sm">Facebook</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer p-6 bg-base-300 text-base-content flex flex-col md:flex-row justify-between items-center">
        <div>
          <span className="font-bold text-primary">Streamify</span> © {new Date().getFullYear()} - Tous droits réservés
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#features" className="link link-hover">Fonctionnalités</a>
          <a href="#why" className="link link-hover">Pourquoi ?</a>
          <a href="#contact" className="link link-hover">Contact</a>
        </div>
      </footer>
    </div>
  );
} 