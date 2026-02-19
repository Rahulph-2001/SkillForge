import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">S</span>
                            </div>
                            <span className="font-bold text-gray-900">SkillForge</span>
                        </div>
                        <p className="text-gray-600 text-sm">Trading skills, building community</p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Explore Skills
                                </Link>
                            </li>
                            <li>
                                <Link to="/become-teacher" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Become Teacher
                                </Link>
                            </li>
                            <li>
                                <Link to="/community" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/press" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/guidelines" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
                    <p>&copy; 2026 SkillForge. All rights reserved</p>
                </div>
            </div>
        </footer>
    );
}
