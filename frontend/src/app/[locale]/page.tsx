"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Shield, Zap, TrendingUp, Award, HeadphonesIcon, CreditCard } from "lucide-react";
import { useTranslations } from 'next-intl';
import CountUp from "@/components/CountUp";
import FadeIn from "@/components/FadeIn";
import ScrollProgress from "@/components/animations/ScrollProgress";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import TextReveal from "@/components/animations/TextReveal";
import MagneticButton from "@/components/animations/MagneticButton";
import FloatingElements from "@/components/animations/FloatingElements";
import CascadingCards from "@/components/animations/CascadingCards";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import ScrollReveal from "@/components/animations/ScrollReveal";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function Home() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Animated Background */}
      <AnimatedBackground />
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="mb-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight">
                  <TextReveal type="words" stagger={0.08}>
                    <span className="text-[#1C1C1C] block">{t("landing.hero_title")}</span>
                  </TextReveal>
                  <TextReveal type="words" stagger={0.08} delay={0.3}>
                    <span className="gradient-text block mt-2">{t("landing.hero_subtitle")}</span>
                  </TextReveal>
                </h1>
              </div>
              <p className="text-xl text-[#666666] mb-8 leading-relaxed">
                {t("landing.hero_description")}
              </p>
              <div className="flex gap-4 mb-12">
                <MagneticButton
                  href="/signup"
                  strength={0.4}
                  className="group px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl shadow-xl flex items-center gap-2"
                >
                  {t("landing.cta_primary")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                <MagneticButton
                  href="#features"
                  strength={0.3}
                  className="px-8 py-4 border-2 border-[#0018A8] text-[#0018A8] font-bold rounded-xl hover:bg-[#0018A8] hover:text-white transition-all"
                >
                  {t("landing.cta_secondary")}
                </MagneticButton>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0018A8] mb-1">
                    <AnimatedCounter end={50000} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-sm text-[#666666]">{t("landing.stats_users")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0018A8] mb-1">
                    <AnimatedCounter end={2} suffix="M€+" duration={2.5} />
                  </div>
                  <div className="text-sm text-[#666666]">{t("landing.stats_transactions")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0018A8] mb-1">
                    <AnimatedCounter end={99.9} decimals={1} suffix="%" duration={2.5} />
                  </div>
                  <div className="text-sm text-[#666666]">{t("landing.stats_uptime")}</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Cascading Cards with Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Floating Banking Elements */}
              <FloatingElements />

              {/* Cascading Cards Animation */}
              <CascadingCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Warum DEspendables?</h2>
              <p className="text-xl text-[#666666]">
                Alles, was Sie für Ihr finanzielles Wohlergehen brauchen
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={0.15} direction="scale">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Sofortüberweisungen",
                  description: "Geld in Sekundenschnelle an Freunde und Familie senden",
                  color: "from-yellow-400 to-orange-500",
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "KI-Analysen",
                  description: "Intelligente Einblicke in Ihre Ausgaben und Sparpotenziale",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  icon: <CreditCard className="w-8 h-8" />,
                  title: "Virtuelle Karten",
                  description: "Sichere Online-Zahlungen mit virtuellen Einwegkarten",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Belohnungen",
                  description: "Verdienen Sie Punkte bei jeder Transaktion",
                  color: "from-green-400 to-green-600",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Bank-Sicherheit",
                  description: "Verschlüsselung auf Bankniveau und 2FA-Schutz",
                  color: "from-red-400 to-red-600",
                },
                {
                  icon: <HeadphonesIcon className="w-8 h-8" />,
                  title: "24/7 Support",
                  description: "Live-Chat mit echten Banking-Experten",
                  color: "from-indigo-400 to-indigo-600",
                },
              ].map((feature, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-md"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-[#666666]">{feature.description}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-4xl font-bold mb-6">Über DEspendables</h2>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                Wir sind mehr als nur eine Bank. Seit 2020 revolutionieren wir das Banking-Erlebnis für über 50.000 Kunden in Deutschland.
              </p>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Unsere Mission ist es, Banking einfach, transparent und zugänglich für jeden zu machen. Mit modernster Technologie und einem kundenorientierten Ansatz setzen wir neue Maßstäbe.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">BaFin</div>
                  <div className="text-sm opacity-80">Reguliert</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">GDPR</div>
                  <div className="text-sm opacity-80">Konform</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">PCI-DSS</div>
                  <div className="text-sm opacity-80">Zertifiziert</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { year: "2020", text: "Gründung" },
                  { year: "2021", text: "10K Nutzer" },
                  { year: "2023", text: "€100M Volumen" },
                  { year: "2025", text: "50K+ Nutzer" },
                ].map((milestone, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-3xl font-bold mb-2">{milestone.year}</div>
                    <div className="text-sm opacity-90">{milestone.text}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Kontakt aufnehmen</h2>
            <p className="text-xl text-[#666666]">
              Haben Sie Fragen? Wir sind für Sie da!
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Nachricht senden</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <input
                    type="email"
                    placeholder="E-Mail"
                    className="w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <textarea
                    placeholder="Ihre Nachricht"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Absenden
                  </button>
                </form>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-bold mb-2">Hauptsitz</h4>
                  <p className="text-[#666666]">
                    Friedrichstraße 123<br />
                    10117 Berlin, Deutschland
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-bold mb-2">Kontakt</h4>
                  <p className="text-[#666666]">
                    E-Mail: support@despendables.de<br />
                    Telefon: +49 30 1234 5678
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-bold mb-2">Öffnungszeiten</h4>
                  <p className="text-[#666666]">
                    Mo-Fr: 9:00 - 18:00 Uhr<br />
                    Sa: 10:00 - 14:00 Uhr
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DEspendables</h3>
              <p className="text-gray-400 text-sm">
                Modernes Banking für die digitale Generation.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produkte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition">Girokonto</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Sparkonto</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Investitionen</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Kredite</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#about" className="hover:text-white transition">Über uns</Link></li>
                <li><Link href="#contact" className="hover:text-white transition">Kontakt</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/impressum" className="hover:text-white transition">Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-white transition">Datenschutz</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">AGB</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">Cookie-Richtlinie</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 DEspendables Bank AG. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
