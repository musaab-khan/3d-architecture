import React from 'react'
import HeroSection from './components/HeroSection'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
const Home = () => {
  return (
    <div>
    <HeroSection></HeroSection>
    <Features></Features>
    <HowItWorks></HowItWorks>
    <Footer></Footer>
    </div>
  )
}

export default Home

// import React from 'react'
// import ProjectDetails from './components/ProjectDetails'

// const page = () => {
//   return (
//     <div>
//       <ProjectDetails></ProjectDetails>
//     </div>
//   )
// }

// export default page