export default function Footer() {
    return (
        <footer className="py-8 bg-neutral-100 border-t border-neutral-200">
            <div className="px-4 mx-auto max-w-4xl text-center">
                {/* Contact Links */}
                <ul className="flex items-center justify-center space-x-3 mb-6">
                    <li>
                        <a 
                            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} 
                            title="Email" 
                            className="flex items-center justify-center text-white transition-all duration-200 bg-neutral-800 rounded-full w-7 h-7 hover:bg-[#bb1919] focus:bg-[#bb1919]"
                        >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a 
                            href={process.env.NEXT_PUBLIC_GITHUB_URL} 
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub" 
                            className="flex items-center justify-center text-white transition-all duration-200 bg-neutral-800 rounded-full w-7 h-7 hover:bg-[#bb1919] focus:bg-[#bb1919]"
                        >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"></path>
                            </svg>
                        </a>
                    </li>
                </ul>

                {/* Copyright */}
                <p className="text-sm text-neutral-600">© Copyright 2025, All Rights Reserved</p>
            </div>
        </footer>
    );
}
