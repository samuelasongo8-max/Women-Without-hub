import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import OurTeam from './pages/OurTeam.jsx'
import Programs from './pages/Programs.jsx'
import ProgramDetail from './pages/ProgramDetail.jsx'
import Impact from './pages/Impact.jsx'
import News from './pages/News.jsx'
import Blogs from './pages/Blogs.jsx'
import Report from './pages/Report.jsx'
import Post from './pages/Post.jsx'
import Updates from './pages/Updates.jsx'
import UpdateDetail from './pages/UpdateDetail.jsx'
import OurStory from './pages/OurStory.jsx'
import GetInvolved from './pages/GetInvolved.jsx'
import InvolvementDetail from './pages/InvolvementDetail.jsx'
import Resources from './pages/Resources.jsx'
import Safeguarding from './pages/Safeguarding.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about/" element={<About />} />
        <Route path="/about/our-team/" element={<OurTeam />} />
        <Route path="/programs/" element={<Programs />} />
        <Route path="/programs/:slug/" element={<ProgramDetail />} />
        <Route path="/impact/" element={<Impact />} />
        <Route path="/impact/news/" element={<News />} />
        <Route path="/impact/blogs/" element={<Blogs />} />
        <Route path="/impact/report/" element={<Report />} />
        <Route path="/impact/post/" element={<Post />} />
        <Route path="/about/our-story/" element={<OurStory />} />
        <Route path="/updates/" element={<Updates />} />
        <Route path="/updates/:slug/" element={<UpdateDetail />} />
        <Route
          path="/impact/our-story/"
          element={<Navigate to="/about/our-story/" replace />}
        />
        <Route path="/stories/*" element={<Navigate to="/updates/" replace />} />
        <Route path="/get-involved/" element={<GetInvolved />} />
        <Route path="/get-involved/:slug/" element={<InvolvementDetail />} />
        <Route path="/resources/" element={<Resources />} />
        <Route path="/safeguarding/" element={<Safeguarding />} />
        <Route path="/contact/" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
