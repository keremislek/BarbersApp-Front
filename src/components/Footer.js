import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { FiGlobe } from 'react-icons/fi'

export default function Footer() {
	return (
		<footer className=" bottom-0 w-full bg-brand-color text-white text-center dark:bg-neutral-700 lg:text-center">
			<div className="p-2">
				<p className="text-xs">© 2024 Berber Randevu Uygulaması</p>
				<div className="mt-1">
					<a className="text-xs text-blue-300 hover:text-blue-400" href="/">Berber Randevu Uygulaması</a>
					<span className="mx-1 text-xs text-gray-500 dark:text-gray-400">|</span>
					<a className="text-xs text-blue-300 hover:text-blue-400" href="https://github.com/keremislek/barbersAppBackend">Github</a>
				</div>
			</div>
		</footer>


	)
}
