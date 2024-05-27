/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [  "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
          'brand-color':'#4c3398',
          'primary-brand-color':'#5d3ebc',
          'secondary-brand-color':'#7849f7',
          'brand-yellow':'#ffd300'
      },
        keyframes:{
          blink: {
            '0%, 100% ':{opacity:'1' },
            '50%':{opacity:'0'},
          }
        },
        animation:{
          blink: 'blink 1s infinite'
        },
      backgroundImage: theme => ({
        'mobile-app': 'url(https://getir.com/_next/static/images/doodle-d659f9f1fd505c811c2331fe3ffddd5f.png)'
      })
      
    },
  },
  variants:{
    extend:{
      color:['before']
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

