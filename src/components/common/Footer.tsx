const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8">
            <div className="container mx-auto text-center">
                &copy; {new Date().getFullYear()} Miniverse Studios. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer;