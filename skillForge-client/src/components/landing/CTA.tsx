import { Link } from 'react-router-dom';

export default function CTA() {
    return (
        <section className="bg-blue-600 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Trading Skills?</h2>
                <p className="text-blue-100 text-lg mb-8">
                    Join thousands of learners and teachers. Get 20 free credits when you sign up today.
                </p>
                <Link
                    to="/signup"
                    className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                    Create Free Account
                </Link>
            </div>
        </section>
    );
}
