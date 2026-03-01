import { Link } from 'react-router-dom';
import { ROUTES } from "@/constants/routes";

export default function Footer() {
    return (
        <footer className="bg-secondary/30 border-t border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xs">S</span>
                            </div>
                            <span className="font-bold text-foreground">SkillForge</span>
                        </div>
                        <p className="text-muted-foreground text-sm">Trading skills, building community</p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to={ROUTES.HOW_IT_WORKS} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.EXPLORE} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Explore Skills
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.BECOME_TEACHER} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Become Teacher
                                </Link>
                            </li>
                            <li>
                                <Link to="/community" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to={ROUTES.ABOUT} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.BLOG} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.CAREERS} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.PRESS} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to={ROUTES.TERMS} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.PRIVACY} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.GUIDELINES} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
                    <p>&copy; 2026 SkillForge. All rights reserved</p>
                </div>
            </div>
        </footer>
    );
}
