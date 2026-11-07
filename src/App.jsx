import { HashRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './store/AppContext'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Explore from './pages/Explore'
import Community, { CommunityPage, CommunitiesList } from './pages/Community'
import PostPage from './pages/PostPage'
import Events, { CreateEvent, EventPage } from './pages/Events'
import Services from './pages/Services'
import { HousingPage, JobPage, PlacePage, SpecialistPage } from './pages/Details'
import Guides, { GoalPage, GuideArticle } from './pages/Guides'
import Connect, { ChatPage } from './pages/Connect'
import Profile, { BusinessDashboard } from './pages/Profile'
import { Notifications, Search } from './pages/Misc'
import { Toast } from './components/ui'

function Shell() {
  const { me } = useApp()
  if (!me)
    return (
      <>
        <Onboarding />
        <Toast />
      </>
    )
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/all" element={<CommunitiesList />} />
        <Route path="/community/c/:id" element={<CommunityPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/place/:id" element={<PlacePage />} />
        <Route path="/specialist/:id" element={<SpecialistPage />} />
        <Route path="/job/:id" element={<JobPage />} />
        <Route path="/housing/:id" element={<HousingPage />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/goal/:id" element={<GoalPage />} />
        <Route path="/guide/:id" element={<GuideArticle />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/u/:id" element={<Profile />} />
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

// The self-contained build runs inside an embedded frame, so routing stays in memory there
const Router = import.meta.env.VITE_OFFLINE ? MemoryRouter : HashRouter

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Shell />
      </Router>
    </AppProvider>
  )
}
