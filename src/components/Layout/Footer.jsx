import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              HospitalMS
            </h3>
            <p className="text-gray-400 text-sm">
              Providing quality healthcare services with compassion and excellence. Book appointments with top doctors online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/doctors" className="hover:text-primary-400 transition-colors">Find Doctors</Link></li>
              <li><Link to="/symptom-analyzer" className="hover:text-primary-400 transition-colors">Symptom Analyzer</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 123 Healthcare Ave, Mumbai</li>
              <li>📞 +91 12345 67890</li>
              <li>✉️ care@hospitalms.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} HospitalMS. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Made with <FaHeart className="text-red-500" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer




// src/components/Layout/Footer.jsx
// import React from 'react'
// import { Link } from 'react-router-dom'
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa'

// const Footer = () => {
//   const currentYear = new Date().getFullYear()

//   const styles = {
//     footer: {
//       backgroundColor: '#111827',
//       color: 'white',
//       marginTop: 'auto'
//     },
//     container: {
//       maxWidth: '1280px',
//       margin: '0 auto',
//       padding: '48px 24px 32px'
//     },
//     // ✅ EK ROW - 4 COLUMNS (Flexbox se)
//     row: {
//       display: 'flex',
//       flexWrap: 'wrap',
//       justifyContent: 'space-between',
//       gap: '32px',
//       marginBottom: '48px'
//     },
//     column: {
//       flex: '1',
//       minWidth: '200px'
//     },
//     logo: {
//       fontSize: '24px',
//       fontWeight: 'bold',
//       marginBottom: '16px',
//       background: 'linear-gradient(135deg, #818cf8 0%, #c7d2fe 100%)',
//       WebkitBackgroundClip: 'text',
//       backgroundClip: 'text',
//       color: 'transparent'
//     },
//     description: {
//       color: '#9ca3af',
//       fontSize: '14px',
//       lineHeight: '1.6',
//       marginBottom: '16px'
//     },
//     heading: {
//       fontSize: '18px',
//       fontWeight: '600',
//       marginBottom: '20px',
//       color: 'white'
//     },
//     linkList: {
//       listStyle: 'none',
//       padding: 0,
//       margin: 0
//     },
//     linkItem: {
//       marginBottom: '10px'
//     },
//     link: {
//       color: '#9ca3af',
//       textDecoration: 'none',
//       fontSize: '14px',
//       transition: 'color 0.3s ease'
//     },
//     contactItem: {
//       color: '#9ca3af',
//       fontSize: '14px',
//       marginBottom: '10px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     socialContainer: {
//       display: 'flex',
//       gap: '12px',
//       marginTop: '16px'
//     },
//     socialLink: {
//       width: '36px',
//       height: '36px',
//       backgroundColor: '#1f2937',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: '#9ca3af',
//       transition: 'all 0.3s ease',
//       cursor: 'pointer',
//       textDecoration: 'none'
//     },
//     divider: {
//       borderTop: '1px solid #1f2937',
//       paddingTop: '32px',
//       textAlign: 'center'
//     },
//     copyright: {
//       color: '#6b7280',
//       fontSize: '13px'
//     },
//     heartContainer: {
//       marginTop: '8px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '6px',
//       color: '#6b7280',
//       fontSize: '13px'
//     },
//     heart: {
//       color: '#ef4444',
//       animation: 'heartBeat 1.5s ease infinite',
//       display: 'inline-block'
//     }
//   }

//   // Hover handlers
//   const handleLinkHover = (e, isEnter) => {
//     e.currentTarget.style.color = isEnter ? '#818cf8' : '#9ca3af'
//   }

//   const handleSocialHover = (e, isEnter) => {
//     e.currentTarget.style.backgroundColor = isEnter ? '#4f46e5' : '#1f2937'
//     e.currentTarget.style.color = isEnter ? 'white' : '#9ca3af'
//     e.currentTarget.style.transform = isEnter ? 'translateY(-3px)' : 'translateY(0)'
//   }

//   const handleIconHover = (e, isEnter) => {
//     const wrapper = e.currentTarget
//     const icon = wrapper.querySelector('.contact-icon')
//     if (icon) {
//       icon.style.backgroundColor = isEnter ? '#4f46e5' : 'transparent'
//       icon.style.border = isEnter ? '1px solid #4f46e5' : '1px solid #374151'
//       icon.style.color = isEnter ? 'white' : '#9ca3af'
//     }
//   }

//   return (
//     <footer style={styles.footer}>
//       <div style={styles.container}>
//         {/* ✅ EK ROW ME 4 COLUMNS - FLEXBOX SE */}
//         <div style={styles.row}>
          
//           {/* Column 1 - Brand */}
//           <div style={styles.column}>
//             <h3 style={styles.logo}>HospitalMS</h3>
//             <p style={styles.description}>
//               Providing quality healthcare services with compassion and excellence. 
//               Book appointments with top doctors online.
//             </p>
//             <div style={styles.socialContainer}>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaFacebook size={16} />
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaTwitter size={16} />
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaInstagram size={16} />
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaLinkedin size={16} />
//               </a>
//             </div>
//           </div>

//           {/* Column 2 - Quick Links */}
//           <div style={styles.column}>
//             <h4 style={styles.heading}>Quick Links</h4>
//             <ul style={styles.linkList}>
//               <li style={styles.linkItem}>
//                 <Link 
//                   to="/doctors" 
//                   style={styles.link}
//                   onMouseEnter={(e) => handleLinkHover(e, true)}
//                   onMouseLeave={(e) => handleLinkHover(e, false)}
//                 >
//                   Find Doctors
//                 </Link>
//               </li>
//               <li style={styles.linkItem}>
//                 <Link 
//                   to="/symptom-analyzer" 
//                   style={styles.link}
//                   onMouseEnter={(e) => handleLinkHover(e, true)}
//                   onMouseLeave={(e) => handleLinkHover(e, false)}
//                 >
//                   Symptom Analyzer
//                 </Link>
//               </li>
//               <li style={styles.linkItem}>
//                 <Link 
//                   to="/about" 
//                   style={styles.link}
//                   onMouseEnter={(e) => handleLinkHover(e, true)}
//                   onMouseLeave={(e) => handleLinkHover(e, false)}
//                 >
//                   About Us
//                 </Link>
//               </li>
//               <li style={styles.linkItem}>
//                 <Link 
//                   to="/contact" 
//                   style={styles.link}
//                   onMouseEnter={(e) => handleLinkHover(e, true)}
//                   onMouseLeave={(e) => handleLinkHover(e, false)}
//                 >
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3 - Contact */}
//           <div style={styles.column}>
//             <h4 style={styles.heading}>Contact Us</h4>
//             <div 
//               style={{ cursor: 'pointer' }}
//               onMouseEnter={(e) => handleIconHover(e, true)}
//               onMouseLeave={(e) => handleIconHover(e, false)}
//             >
//               <div style={styles.contactItem}>
//                 <span className="contact-icon" style={{ width: '28px', fontSize: '16px' }}>📍</span>
//                 <span>123 Healthcare Ave, Mumbai</span>
//               </div>
//               <div style={styles.contactItem}>
//                 <span className="contact-icon" style={{ width: '28px', fontSize: '16px' }}>📞</span>
//                 <span>+91 12345 67890</span>
//               </div>
//               <div style={styles.contactItem}>
//                 <span className="contact-icon" style={{ width: '28px', fontSize: '16px' }}>✉️</span>
//                 <span>care@hospitalms.com</span>
//               </div>
//             </div>
//           </div>

//           {/* Column 4 - Follow */}
//           <div style={styles.column}>
//             <h4 style={styles.heading}>Follow Us</h4>
//             <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
//               Get latest health updates
//             </p>
//             <div style={styles.socialContainer}>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaFacebook size={16} />
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaTwitter size={16} />
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaInstagram size={16} />
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.socialLink}
//                 onMouseEnter={(e) => handleSocialHover(e, true)}
//                 onMouseLeave={(e) => handleSocialHover(e, false)}
//               >
//                 <FaLinkedin size={16} />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Divider & Copyright */}
//         <div style={styles.divider}>
//           <p style={styles.copyright}>© {currentYear} HospitalMS. All rights reserved.</p>
//           <div style={styles.heartContainer}>
//             Made with <span style={styles.heart}>❤️</span> for better healthcare
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes heartBeat {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.2); }
//         }
//         @media (max-width: 768px) {
//           .footer-row {
//             flex-direction: column;
//           }
//         }
//         .contact-icon {
//           transition: all 0.3s ease;
//           width: 28px;
//           display: inline-block;
//         }
//       `}</style>
//     </footer>
//   )
// }

// export default Footer