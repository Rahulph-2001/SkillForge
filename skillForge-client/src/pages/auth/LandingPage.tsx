
import { Footer } from '../../components/common/Footer';
import Hero from '../../components/landing/Hero';
import HowItWorks from '../../components/landing/HowItWorks';
import PopularSkills from '../../components/landing/PopularSkills';
import SafeTrusted from '../../components/landing/SafeTrusted';
import CTA from '../../components/landing/CTA';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">

            <Hero />
            <HowItWorks />
            <PopularSkills />
            <SafeTrusted />
            <CTA />
            <Footer />
        </main>
    );
}
