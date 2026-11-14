import { lazy, Suspense } from 'react'
import { HashRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './store/AppContext'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Explore from './pages/Explore'
import { Toast } from './components/ui'

// Every screen except the map (home) is loaded on demand
const page = (load, name = 'default') => lazy(() => load().then((m) => ({ default: m[name] })))
const community = () => import('./pages/Community')
const events = () => import('./pages/Events')
const details = () => import('./pages/Details')
const guides = () => import('./pages/Guides')
const connect = () => import('./pages/Connect')
const profile = () => import('./pages/Profile')
const misc = () => import('./pages/Misc')
const Community = page(community)
const CommunityPage = page(community, 'CommunityPage')
const CommunitiesList = page(community, 'CommunitiesList')
const PostPage = page(() => import('./pages/PostPage'))
const Events = page(events)
const CreateEvent = page(events, 'CreateEvent')
const EventPage = page(events, 'EventPage')
const Services = page(() => import('./pages/Services'))
const PlacePage = page(details, 'PlacePage')
const SpecialistPage = page(details, 'SpecialistPage')
const JobPage = page(details, 'JobPage')
const HousingPage = page(details, 'HousingPage')
const Guides = page(guides)
const GoalPage = page(guides, 'GoalPage')
const GuideArticle = page(guides, 'GuideArticle')
const Connect = page(connect)
const ChatPage = page(connect, 'ChatPage')
const Profile = page(profile)
const BusinessDashboard = page(profile, 'BusinessDashboard')
const Notifications = page(misc, 'Notifications')
const Search = page(misc, 'Search')

function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-accent/20 border-t-accent" />
    </div>
  )
}

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
      <Suspense fallback={<PageSpinner />}>
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
      </Suspense>
    </Layout>
  )
}

// Inside an embedded frame (e.g. a claude.ai artifact) the URL can't be used, so routing stays in memory there.
// Everywhere else (site, single HTML file) hash routing keeps the phone's Back gesture working.
const inFrame = (() => {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
})()
const Router = inFrame ? MemoryRouter : HashRouter

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Shell />
      </Router>
    </AppProvider>
  )
}
